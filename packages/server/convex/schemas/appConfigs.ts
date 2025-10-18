import { v } from "convex/values";
import * as z from "zod/mini";

const appConfigOptions = [
  "current_term",
  "current_year",
  "next_term",
  "next_year",
  "is_scraping_majors",
  "is_scraping_courses",
] as const;

const AppConfigKey = z.string() as z.ZodMiniType<
  (typeof appConfigOptions)[number] | (string & {})
>;

const appConfigs = {
  key: v.string(),
  value: v.string(),
};

export { appConfigs, appConfigOptions, AppConfigKey };
