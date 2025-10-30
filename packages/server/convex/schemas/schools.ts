import { v } from "convex/values";

export const schools = {
  name: v.string(), // College of Arts and Science
  shortName: v.string(), // CAS
  level: v.union(v.literal("undergraduate"), v.literal("graduate")),
};
