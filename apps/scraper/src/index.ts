import {
  ZUpsertPrerequisites,
  ZUpsertRequirements,
} from "@dev-team-fall-25/server/convex/http";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import getDB from "./drizzle";
import { errorLogs, jobs } from "./drizzle/schema";
import { ConvexApi } from "./lib/convex";
import { JobError, type JobMessage } from "./lib/queue";
import { discoverCourses, scrapeCourse } from "./modules/courses";
import { discoverPrograms, scrapeProgram } from "./modules/programs";
import z from "zod";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", async (c) => {
  // const db = await getDB(c.env);
  // TODO: use hono to render a dashboard to monitor the scraping status
  return c.json({ status: "ok" });
});

export default {
  fetch: app.fetch,

  async scheduled(_event: ScheduledEvent, env: CloudflareBindings) {
    // NOTE: the worker will not execute anything for now until the flag for toggle scrapers are set up
    return;
    // biome-ignore lint/correctness/noUnreachable: WIP
    const db = getDB(env);

    // FIXME: need to handle when programsUr or coursesUrl is empty array
    const programsUrl = new URL("/programs", env.SCRAPING_BASE_URL).toString();
    const coursesUrl = new URL("/courses", env.SCRAPING_BASE_URL).toString();

    const [[programsJob], [coursesJob]] = await Promise.all([
      db
        .insert(jobs)
        .values({
          url: programsUrl,
          jobType: "discover-programs",
        })
        .returning(),
      db
        .insert(jobs)
        .values({
          url: coursesUrl,
          jobType: "discover-courses",
        })
        .returning(),
    ]);

    await Promise.all([
      env.SCRAPING_QUEUE.send({ jobId: programsJob.id }),
      env.SCRAPING_QUEUE.send({ jobId: coursesJob.id }),
    ]);
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

                const programId = await convex.upsertProgram(res.program);

                if (!programId) {
                  throw new JobError(
                    "Failed to upsert program: no ID returned",
                    "validation",
                  );
                }

                // it is safe to assert the type here because the data will be validated before sending the request
                const newRequirements = res.requirements.map((req) => ({
                  ...req,
                  programId: programId,
                })) as z.infer<typeof ZUpsertRequirements>;

                if (res.requirements.length > 0) {
                  await convex.upsertRequirements(newRequirements);
                }
                break;
              }
              case "course": {
                const res = await scrapeCourse(job.url, db, env);

                const courseId = await convex.upsertCourse(res.course);

                if (!courseId) {
                  throw new JobError(
                    "Failed to upsert course: no ID returned",
                    "validation",
                  );
                }

                // it is safe to assert the type here because the data will be validated before sending the request
                const newPrerequisites = res.prerequisites.map((prereq) => ({
                  ...prereq,
                  courseId: courseId,
                })) as z.infer<typeof ZUpsertPrerequisites>;

                if (res.prerequisites.length > 0) {
                  await convex.upsertPrerequisites(newPrerequisites);
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
