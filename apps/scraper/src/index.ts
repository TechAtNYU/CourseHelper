/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: disable for now as they haven't been implemented yet */
import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", async (c) => {
  // const db = await createDB(c.env);
  // TODO: use hono to render a dashboard to monitor the scraping status
});

export default {
  fetch: app.fetch,

  async scheduled(event: ScheduledEvent, env: CloudflareBindings) {
    // const db = await createDB(env);
    // TODO: set up jobs for scraping a list of urls need to be scraped and add them to queue as "discovery"
  },

  async queue(batch: MessageBatch<Error>, env: CloudflareBindings) {
    // const db = await createDB(env);
    // TODO: set up jobs for scrping given url and save structured data to convex database
  },
};
