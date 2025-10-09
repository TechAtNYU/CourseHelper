/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: bypass for now */
import type {
  ZCreateRequirements,
  ZUpsertProgram,
} from "@dev-team-fall-25/server/convex/http";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as z from "zod/mini";

type RequirementItem = z.infer<typeof ZCreateRequirements>[number];

export type ProgramRequirement =
  | Omit<Extract<RequirementItem, { type: "required" }>, "programId">
  | Omit<Extract<RequirementItem, { type: "alternative" }>, "programId">
  | Omit<Extract<RequirementItem, { type: "options" }>, "programId">;

export async function discoverPrograms(url: string): Promise<string[]> {
  return [];
}

export async function scrapeProgram(
  url: string,
  db: DrizzleD1Database,
  env: CloudflareBindings,
): Promise<{
  program: z.infer<typeof ZUpsertProgram>;
  requirements: ProgramRequirement[];
}> {
  throw new Error("Not implemented");
}
