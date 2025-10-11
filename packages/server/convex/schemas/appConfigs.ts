import { v } from "convex/values";
import * as z from "zod/mini";

const AppConfigKey = z.enum([
  "school_term",
  "school_year",
  "is_scraping_majors",
  "is_scraping_courses",
]);

const appConfigs = {
  key: v.string(),
  value: v.string(),
};

export { appConfigs };
