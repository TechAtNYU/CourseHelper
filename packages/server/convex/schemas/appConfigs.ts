import { v } from "convex/values";
import * as z from "zod/mini";

const appConfig = [
  "school_term",
  "school_year",
  "is_scraping_majors",
  "is_scraping_courses",
] as const;

const AppConfigKey = z.string() as z.ZodMiniType<
  (typeof appConfig)[number] | (string & {})
>;

const appConfigs = {
  key: v.string(),
  value: v.string(),
};

export { appConfigs, AppConfigKey };
