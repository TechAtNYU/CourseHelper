/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: disable for now as they haven't been implemented yet */
import { Hono } from "hono";
import { eq, desc } from "drizzle-orm";
import createDB from "./drizzle";
import { jobs, errorLogs } from "./drizzle/schema";
import { ConvexApi } from "./lib/convex";

const app = new Hono<{ Bindings: CloudflareBindings }>();

const scrapingResults = new Map<
  number,
  {
    jobId: number;
    url: string;
    title: string;
    contentLength: number;
    linkCount: number;
    links: string[];
    htmlPreview: string;
    timestamp: Date;
  }
>();

app.get("/test", (c) => {
  return c.text("Test route works!");
});

app.get("/", async (c) => {
  const db = await createDB(c.env);

  const allJobs = await db
    .select()
    .from(jobs)
    .orderBy(desc(jobs.createdAt))
    .limit(20);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Scraper Dashboard</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
          }
          h1 { color: #333; }
          .controls {
            margin: 20px 0;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          button {
            background: #0066cc;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
          button:hover { background: #0052a3; }
          .jobs-container { display: grid; gap: 20px; }
          .job-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .job-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }
          .status {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }
          .status.pending { background: #ffd700; color: #333; }
          .status.processing { background: #4169e1; color: white; }
          .status.completed { background: #32cd32; color: white; }
          .status.failed { background: #dc143c; color: white; }
          .job-info {
            font-size: 14px;
            color: #666;
            margin: 5px 0;
          }
          .result-section {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
          }
          .result-section h3 {
            margin: 10px 0;
            color: #444;
            font-size: 16px;
          }
          .links-list {
            max-height: 200px;
            overflow-y: auto;
            background: #f8f8f8;
            padding: 10px;
            border-radius: 4px;
            font-size: 12px;
          }
          .html-preview {
            background: #f8f8f8;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            max-height: 200px;
            overflow: auto;
            white-space: pre-wrap;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <h1>Web Scraper Dashboard</h1>
        
        <div class="controls">
          <button onclick="triggerScrape()">Start New Scraping Job</button>
          <button onclick="location.reload()" style="margin-left: 10px; background: #666;">🔄 Refresh</button>
        </div>

        <h2>Recent Jobs (${allJobs.length})</h2>
        <div class="jobs-container">
          ${allJobs
            .map((job) => {
              const result = scrapingResults.get(job.id);
              return `
              <div class="job-card">
                <div class="job-header">
                  <div>
                    <strong>Job #${job.id}</strong>
                    <div class="job-info">${job.url}</div>
                  </div>
                  <span class="status ${job.status}">${job.status.toUpperCase()}</span>
                </div>
                
                <div class="job-info"><strong>Type:</strong> ${job.jobType}</div>
                <div class="job-info"><strong>Created:</strong> ${new Date(job.createdAt).toLocaleString()}</div>
                ${job.startedAt ? `<div class="job-info"><strong>Started:</strong> ${new Date(job.startedAt).toLocaleString()}</div>` : ""}
                ${job.completedAt ? `<div class="job-info"><strong>Completed:</strong> ${new Date(job.completedAt).toLocaleString()}</div>` : ""}

                ${
                  result
                    ? `
                  <div class="result-section">
                    <h3>📊 Scraping Results</h3>
                    <div class="job-info"><strong>Page Title:</strong> ${result.title}</div>
                    <div class="job-info"><strong>Content Length:</strong> ${result.contentLength.toLocaleString()} characters</div>
                    <div class="job-info"><strong>Links Found:</strong> ${result.linkCount}</div>
                    
                    ${
                      result.links.length > 0
                        ? `
                      <h3>First 10 Links:</h3>
                      <div class="links-list">
                        ${result.links
                          .slice(0, 10)
                          .map((link, i) => `<div>${i + 1}. ${link}</div>`)
                          .join("")}
                      </div>
                    `
                        : ""
                    }
                    
                    <h3>HTML Preview (first 500 chars):</h3>
                    <div class="html-preview">${result.htmlPreview}</div>
                  </div>
                `
                    : ""
                }
              </div>
            `;
            })
            .join("")}
        </div>

        <script>
          async function triggerScrape() {
            try {
              const response = await fetch('/test-scrape');
              const data = await response.json();
              if (data.success) {
                alert('Scraping job queued');
              } else {
                alert('Error: ' + data.error);
              }
            } catch (error) {
              alert('Error: ' + error.message);
            }
          }

          // Auto-refresh every 5 seconds if there are processing jobs
          const hasProcessingJobs = ${allJobs.some((j) => j.status === "processing" || j.status === "pending")};
          if (hasProcessingJobs) {
            setTimeout(() => location.reload(), 5000);
          }
        </script>
      </body>
    </html>
  `;

  return c.html(html);
  // TODO: use hono to render a dashboard to monitor the scraping status
});

app.get("/test-scrape", async (c) => {
  const db = await createDB(c.env);

  console.log("Manual scrape triggered");
  const discoveryUrl = "https://bulletins.nyu.edu/";

  try {
    const [createdJob] = await db
      .insert(jobs)
      .values({
        url: discoveryUrl,
        status: "pending",
        jobType: "discovery",
      })
      .returning();

    await c.env.SCRAPING_QUEUE.send({
      id: createdJob.id,
      url: createdJob.url,
      jobType: createdJob.jobType,
    });

    return c.json({
      success: true,
      message: "Scraping job queued!",
      jobId: createdJob.id,
    });
  } catch (error) {
    console.error("Error:", error);
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

export default {
  async fetch(
    request: Request,
    env: CloudflareBindings,
    ctx: ExecutionContext
  ) {
    return app.fetch(request, env, ctx);
  },

  async scheduled(event: ScheduledEvent, env: CloudflareBindings) {
    const db = await createDB(env);
    const api = new ConvexApi({
      baseUrl: env.CONVEX_SITE_URL,
      apiKey: env.CONVEX_API_KEY,
    });

    console.log("Scheduled job started");
    const discoveryUrl = "https://bulletins.nyu.edu/";

    try {
      const [createdJob] = await db
        .insert(jobs)
        .values({
          url: discoveryUrl,
          status: "pending",
          jobType: "discovery",
        })
        .returning();

      console.log(`Created discovery job with ID: ${createdJob.id}`);

      await env.SCRAPING_QUEUE.send({
        id: createdJob.id,
        url: createdJob.url,
        jobType: createdJob.jobType,
      });

      console.log("Sent job to queue");
    } catch (error) {
      console.error("Error in scheduled job:", error);
      throw error;
    }
    // TODO: set up jobs for scraping a list of urls need to be scraped and add them to queue as "discovery"
  },

  async queue(
    batch: MessageBatch<{ id: number; url: string; jobType: string }>,
    env: CloudflareBindings
  ) {
    const db = await createDB(env);
    const api = new ConvexApi({
      baseUrl: env.CONVEX_SITE_URL,
      apiKey: env.CONVEX_API_KEY,
    });

    console.log(`Processing batch of ${batch.messages.length} messages`);

    for (const message of batch.messages) {
      try {
        const { id, url, jobType } = message.body;
        console.log(`Processing job ${id}: ${jobType} - ${url}`);

        await db
          .update(jobs)
          .set({
            status: "processing",
            startedAt: new Date(),
          })
          .where(eq(jobs.id, id));

        console.log(`Fetching URL: ${url}`);
        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; NYU-Scraper/1.0)",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : "No title found";

        const linkMatches = html.match(/<a\s+[^>]*href=["']([^"']+)["']/gi);
        const linkCount = linkMatches ? linkMatches.length : 0;

        const links: string[] = [];
        if (linkMatches) {
          for (const link of linkMatches) {
            const hrefMatch = link.match(/href=["']([^"']+)["']/i);
            if (hrefMatch) {
              links.push(hrefMatch[1]);
            }
          }
        }

        scrapingResults.set(id, {
          jobId: id,
          url,
          title,
          contentLength: html.length,
          linkCount,
          links,
          htmlPreview: html.substring(0, 500),
          timestamp: new Date(),
        });

        console.log(`Scraped: ${title} - ${linkCount} links found`);

        await db
          .update(jobs)
          .set({
            status: "completed",
            completedAt: new Date(),
          })
          .where(eq(jobs.id, id));

        console.log(`Job ${id} completed successfully`);

        message.ack();
        // TODO: set up jobs for scrping given url and save structured data to convex database
      } catch (error) {
        console.error(`Error processing message:`, error);

        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        const stackTrace = error instanceof Error ? error.stack : undefined;

        await db.insert(errorLogs).values({
          jobId: message.body.id,
          errorType: "network",
          errorMessage,
          stackTrace,
          retryCount: message.attempts,
          timestamp: new Date(),
        });

        if (message.attempts >= 3) {
          await db
            .update(jobs)
            .set({ status: "failed" })
            .where(eq(jobs.id, message.body.id));

          console.log(
            `Job ${message.body.id} failed after ${message.attempts} attempts`
          );
          message.ack();
        } else {
          console.log(
            `Retrying job ${message.body.id} (attempt ${message.attempts + 1})`
          );
          message.retry();
        }
      }
    }
  },
};
