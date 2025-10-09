import { eq } from "drizzle-orm";
import { Hono } from "hono";
import createDB from "./drizzle";
import { jobs } from "./drizzle/schema";
import { type JobMessage } from "./lib/queue";
import { discoverCourses, scrapeCourse } from "./modules/courses";
import { discoverPrograms, scrapeProgram } from "./modules/programs";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", async (c) => {
  // const db = await createDB(c.env);
  // TODO: use hono to render a dashboard to monitor the scraping status
  return c.json({ status: "ok" });
});

export default {
  fetch: app.fetch,

  async scheduled(_event: ScheduledEvent, env: CloudflareBindings) {
    const db = createDB(env);

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
    const db = createDB(env);

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
                break;
              }
              case "course": {
                const res = await scrapeCourse(job.url, db, env);
                break;
              }
            }

            await db
              .update(jobs)
              .set({ status: "completed", completedAt: new Date() })
              .where(eq(jobs.id, jobId));

            message.ack();
          } catch (_error) {
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
