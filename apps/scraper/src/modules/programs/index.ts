/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: bypass for now */
import type {
  ZCreatePrerequisite,
  ZUpsertProgram,
} from "@dev-team-fall-25/server/convex/http";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as z from "zod/mini";
import type { JobError } from "../../lib/queue";

export async function discoverPrograms(url: string): Promise<string[]> {
  return [];
}

export async function scrapeProgram(
  url: string,
  db: DrizzleD1Database,
  env: CloudflareBindings,
): Promise<
  | {
      ok: true;
      data: {
        program: z.infer<typeof ZUpsertProgram>;
        requirements: z.infer<typeof ZCreatePrerequisite>;
      };
    }
  | {
      ok: false;
      error: JobError;
    }
> {
  // TODO: impelment this function
  throw new Error("Not implemented");
}
