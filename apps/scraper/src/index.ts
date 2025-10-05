import { Hono } from "hono";

type Bindings = {
  SCRAPING_BASE_URL?: string;
};

const clean = (s: string) => s.replace(/\s+/g, " ").replace(/\u00A0/g, " ").trim();
const toNumber = (s: string | null) => {
  if (!s) return null;
  const m = s.match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
};

// titles to ignore (descriptive/non-course lines)
const DESCRIPTIVE_RE = /\b(select (one|two)|choose|introductory courses?|electives?|course list)\b/i;

async function parseCurriculumTable(html: string) {
  type Row = { code: string | null; title: string | null; credits: number | null };

  let inCurriculum = false;
  let inTable = false;

  // Per-row buffers
  let trClass = "";
  let codeBuf = "";
  let titleBuf = "";
  let creditsBuf = "";

  const rows: Row[] = [];

  const resetRow = () => {
    trClass = "";
    codeBuf = "";
    titleBuf = "";
    creditsBuf = "";
  };

  const commitRow = () => {
    // Skip headers/area headers/subheaders quickly
    if (/\b(areaheader|areasubheader|listsum|plangridsum|plangridtotal)\b/i.test(trClass)) return;

    const code = clean(codeBuf) || null;
    const title = clean(titleBuf) || null;
    const credits = toNumber(clean(creditsBuf));

    // Ignore clearly descriptive lines (“Select one of the following”, “Introductory Courses”, etc.)
    if (!code && title && DESCRIPTIVE_RE.test(title)) return;

    // Keep if at least two of the three fields are present
    const have = [!!code, !!title, credits !== null].filter(Boolean).length;
    if (have >= 2) {
      rows.push({ code, title, credits });
    }
  };

  const rewriter = new HTMLRewriter()
    // Scope to the Curriculum tab content
    .on("#curriculumtextcontainer", {
      element(e) {
        inCurriculum = true;
        e.onEndTag(() => {
          inCurriculum = false;
          inTable = false;
        });
      },
    })
    // Only the course list table inside Curriculum
    .on("#curriculumtextcontainer table.sc_courselist", {
      element(e) {
        if (!inCurriculum) return;
        inTable = true;
        e.onEndTag(() => {
          inTable = false;
        });
      },
    })
    // Track each row
    .on("#curriculumtextcontainer table.sc_courselist tbody tr", {
      element(e) {
        if (!inTable) return;
        resetRow();
        trClass = e.getAttribute("class") || "";
        e.onEndTag(() => {
          if (!inTable) return;
          commitRow();
        });
      },
    })
    // codecol -> course number
    .on("#curriculumtextcontainer table.sc_courselist tbody tr td.codecol", {
      text(t) {
        if (!inTable) return;
        codeBuf += t.text;
      },
    })
    // hourscol -> credits
    .on("#curriculumtextcontainer table.sc_courselist tbody tr td.hourscol", {
      text(t) {
        if (!inTable) return;
        creditsBuf += t.text;
      },
    })
    // any other cell (including span.courselistcomment) -> title/description
    // any other cell (not codecol or hourscol) -> title/description
    .on("#curriculumtextcontainer table.sc_courselist tbody tr td:not(.codecol):not(.hourscol)", {
      text(t) {
        if (!inTable) return;
        titleBuf += t.text;
      },
    })
  await rewriter.transform(new Response(html)).text();
  return rows;
}

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", c => c.text("ok"));

// GET /scrape?url=...
app.get("/scrape", async c => {
  const url = c.req.query("url") || c.env.SCRAPING_BASE_URL;
  if (!url) return c.json({ error: "No URL provided" }, 400);

  const res = await fetch(url, {
    headers: {
      "user-agent": "CF-Worker Scraper/1.0 (+https://developers.cloudflare.com/workers/)",
    },
    cf: { cacheEverything: false },
  });
  const html = await res.text();

  // Program title = <h1 class="page-title">...</h1>
  const h1 = html.match(/<h1[^>]*class=["'][^"']*page-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i);
  const programTitle = h1 ? clean(h1[1].replace(/<[^>]+>/g, "")) : null;

  const items = await parseCurriculumTable(html);

  return c.json({
    url,
    status: res.status,
    programTitle,
    items, // flattened list of kept rows: { code|null, title|null, credits|null }
  });
});

export default { fetch: app.fetch };
