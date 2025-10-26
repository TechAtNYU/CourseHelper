/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: bypass for now */
import type {
  ZUpsertProgram,
  ZUpsertRequirements,
} from "@dev-team-fall-25/server/convex/http";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as z from "zod/mini";

type RequirementItem = z.infer<typeof ZUpsertRequirements>[number];

export type ProgramRequirement =
  | Omit<Extract<RequirementItem, { type: "required" }>, "programId">
  | Omit<Extract<RequirementItem, { type: "alternative" }>, "programId">
  | Omit<Extract<RequirementItem, { type: "options" }>, "programId">;

export async function discoverPrograms(url: string): Promise<string[]> {
  url = "https://bulletins.nyu.edu/";
  const res = await fetch(url);
  console.log("Status:", res.status);
  const html = await res.text();
  console.log(html.slice(0, 500));
  return [];
}

export async function scrapeProgram(
  url: string,
  db: DrizzleD1Database,
  env: CloudflareBindings
): Promise<{
  program: z.infer<typeof ZUpsertProgram>;
  requirements: ProgramRequirement[];
}> {
  const base = "https://bulletins.nyu.edu/";
  let target: URL;

  // Defaults so we ALWAYS return something
  let program: z.infer<typeof ZUpsertProgram> = {
    name: "Unknown Program",
    level: "undergraduate", // fallback
    programUrl: url,
  };
  let requirements: ProgramRequirement[] = [];

  try {
    // Build a safe absolute URL
    try {
      target = new URL(url, base);
    } catch {
      target = new URL(url); // if already absolute
    }

    console.log("Fetching:", target.toString());
    const res = await fetch(target.toString());
    console.log("Status:", res.status);

    const html = await res.text();

    // Print RAW HTML content
    console.log("Raw content from website:\n", html);

    // Very light title extraction for a nicer name
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title =
      (titleMatch?.[1] ?? "").trim() ||
      decodeURIComponent(
        target.pathname.split("/").filter(Boolean).pop() ?? ""
      ) ||
      "Unknown Program";

    // Build the program object to match ZUpsertProgram
    program = {
      name: title,
      level: "undergraduate", // TODO: derive if you can
      programUrl: target.toString(),
    };

    // Keep requirements empty for now
    requirements = [];
  } catch (err) {
    console.error("Error scraping program:", err);
    // program + requirements already hold safe defaults
  }

  // Single, unconditional return so TS knows all paths return
  return { program, requirements };
}
