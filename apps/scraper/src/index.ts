import type {
  ZUpsertPrerequisites,
  ZUpsertRequirements,
} from "@dev-team-fall-25/server/convex/http";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import * as z from "zod/mini";
import getDB from "./drizzle";
import { errorLogs, jobs } from "./drizzle/schema";
import { ConvexApi } from "./lib/convex";
import { JobError, type JobMessage } from "./lib/queue";
import { discoverCourses, scrapeCourse } from "./modules/courses";
import { discoverPrograms, scrapeProgram } from "./modules/programs";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", async (c) => {
  // const db = await getDB(c.env);
  // TODO: use hono to render a dashboard to monitor the scraping status
  return c.json({ status: "ok" });
});

const ZCacheData = z.object({
  isMajorsEnabled: z.transform((val) => val === "true"),
  isCoursesEnabled: z.transform((val) => val === "true"),
});

export default {
  fetch: app.fetch,

  async scheduled(_event: ScheduledEvent, env: CloudflareBindings) {
    const db = getDB(env);
    const convex = new ConvexApi({
      baseUrl: env.CONVEX_SITE_URL,
      apiKey: env.CONVEX_API_KEY,
    });

    const cache = caches.default;
    const cacheKey = `${env.CONVEX_SITE_URL}/app-configs`;

    let isMajorsEnabled = false;
    let isCoursesEnabled = false;

    // Check to see if app configs are cached
    const cached = await cache.match(cacheKey);
    if (cached) {
      const { data, success } = ZCacheData.safeParse(await cached.json());

      if (!success) {
        throw new JobError("Failed to parse cache data", "validation");
      }

      isMajorsEnabled = data.isMajorsEnabled;
      isCoursesEnabled = data.isCoursesEnabled;
    } else {
      const [isScrapingMajors, isScrapingCourses] = await Promise.all([
        convex.getAppConfig({ key: "is_scraping_majors" }),
        convex.getAppConfig({ key: "is_scraping_courses" }),
      ]);

      isMajorsEnabled = isScrapingMajors === "true";
      isCoursesEnabled = isScrapingCourses === "true";

      await cache.put(
        cacheKey,
        new Response(
          JSON.stringify({
            isScrapingMajors,
            isScrapingCourses,
          }),
          {
            headers: { "Cache-Control": "max-age=3600" },
          },
        ),
      );
    }

    const jobsToCreate: Array<{
      url: string;
      jobType: "discover-programs" | "discover-courses";
    }> = [];
    const flagsToDisable: string[] = [];

    // add major discovery job to the queue
    if (isMajorsEnabled) {
      const programsUrl = new URL(
        "/programs",
        env.SCRAPING_BASE_URL,
      ).toString();
      jobsToCreate.push({ url: programsUrl, jobType: "discover-programs" });
      flagsToDisable.push("is_scraping_majors");
    }

    // add course discovery job to the queue
    if (isCoursesEnabled) {
      const coursesUrl = new URL("/courses", env.SCRAPING_BASE_URL).toString();
      jobsToCreate.push({ url: coursesUrl, jobType: "discover-courses" });
      flagsToDisable.push("is_scraping_courses");
    }

    if (jobsToCreate.length === 0) {
      console.log("No scraping jobs enabled, skipping");
      return;
    }

    const createdJobs = await db.insert(jobs).values(jobsToCreate).returning();

    await Promise.all([
      ...createdJobs.map((job) => env.SCRAPING_QUEUE.send({ jobId: job.id })),
      ...flagsToDisable.map((flag) =>
        convex.setAppConfig({ key: flag, value: "false" }),
      ),
      cache.delete(cacheKey),
    ]);

    console.log(
      `Created ${createdJobs.length} jobs [${createdJobs.map((j) => j.jobType).join(", ")}], disabled flags: ${flagsToDisable.join(", ")}`,
    );
  },

  async queue(
    batch: MessageBatch<JobMessage>,
    env: CloudflareBindings,
    ctx: ExecutionContext,
  ) {
    const db = getDB(env);
    const convex = new ConvexApi({
      baseUrl: env.CONVEX_SITE_URL,
      apiKey: env.CONVEX_API_KEY,
    });

    for (const message of batch.messages) {
      const { jobId } = message.body;

      const job = await db.select().from(jobs).where(eq(jobs.id, jobId)).get();

      if (!job) {
        message.ack();
        continue;
      }

      ctx.waitUntil(
        (async () => {
          try {
            await db
              .update(jobs)
              .set({ status: "processing", startedAt: new Date() })
              .where(eq(jobs.id, jobId));

            switch (job.jobType) {
              case "discover-programs": {
                const programUrls = await discoverPrograms(job.url);
                const newJobs = await db
                  .insert(jobs)
                  .values(
                    programUrls.map((url) => ({
                      url,
                      jobType: "program" as const,
                    })),
                  )
                  .returning();

                await env.SCRAPING_QUEUE.sendBatch(
                  newJobs.map((j) => ({ body: { jobId: j.id } })),
                );
                break;
              }
              case "discover-courses": {
                const courseUrls = await discoverCourses(job.url);
                const newJobs = await db
                  .insert(jobs)
                  .values(
                    courseUrls.map((url) => ({
                      url,
                      jobType: "course" as const,
                    })),
                  )
                  .returning();

                await env.SCRAPING_QUEUE.sendBatch(
                  newJobs.map((j) => ({ body: { jobId: j.id } })),
                );
                break;
              }
              case "program": {
                const res = await scrapeProgram(job.url, db, env);

                const programId = await convex.upsertProgramWithRequirements({
                  ...res.program,
                  requirements: res.requirements,
                });

                if (!programId) {
                  throw new JobError(
                    "Failed to upsert program: no ID returned",
                    "validation",
                  );
                }
                break;
              }
              case "course": {
                const res = await scrapeCourse(job.url, db, env);

                const courseId = await convex.upsertCourseWithPrerequisites({
                  ...res.course,
                  prerequisites: res.prerequisites,
                });

                if (!courseId) {
                  throw new JobError(
                    "Failed to upsert course: no ID returned",
                    "validation",
                  );
                }
                break;
              }
            }

            await db
              .update(jobs)
              .set({ status: "completed", completedAt: new Date() })
              .where(eq(jobs.id, jobId));

            message.ack();
          } catch (error) {
            const jobError =
              error instanceof JobError
                ? error
                : new JobError(
                    error instanceof Error ? error.message : "Unknown error",
                  );

            await db.insert(errorLogs).values({
              jobId: jobId,
              errorType: jobError.type,
              errorMessage: jobError.message,
              stackTrace: jobError.stack || null,
              timestamp: new Date(),
            });

            await db
              .update(jobs)
              .set({ status: "failed" })
              .where(eq(jobs.id, jobId));

            message.retry();
          }
        })(),
      );
    }
  },
};
