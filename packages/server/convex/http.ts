import { httpRouter } from "convex/server";
import * as z from "zod/mini";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { apiAction } from "./helpers/auth";

export const ZUpsertCourse = z.object({
  program: z.string(),
  code: z.string(),
  level: z.coerce.number(),
  title: z.string(),
  credits: z.int(),
  description: z.string(),
  courseUrl: z.string(),
});

export const ZDeleteCourse = z.object({
  id: z.pipe(
    z.string(),
    z.transform((val) => val as Id<"courses">),
  ),
});

export const ZUpsertProgram = z.object({
  name: z.string(),
  level: z.enum(["undergraduate", "graduate"]),
  programUrl: z.string(),
});

export const ZDeleteProgram = z.object({
  id: z.pipe(
    z.string(),
    z.transform((val) => val as Id<"programs">),
  ),
});

export const ZCreateRequirement = z.discriminatedUnion("type", [
  z.object({
    programId: z.pipe(
      z.string(),
      z.transform((val) => val as Id<"programs">),
    ),
    isMajor: z.boolean(),
    type: z.literal("required"),
    courses: z.array(z.string()),
  }),
  z.object({
    programId: z.pipe(
      z.string(),
      z.transform((val) => val as Id<"programs">),
    ),
    isMajor: z.boolean(),
    type: z.literal("alternative"),
    courses: z.array(z.string()),
  }),
  z.object({
    programId: z.pipe(
      z.string(),
      z.transform((val) => val as Id<"programs">),
    ),
    isMajor: z.boolean(),
    type: z.literal("options"),
    courses: z.array(z.string()),
    courseLevels: z.array(
      z.object({
        program: z.string(),
        level: z.coerce.number(),
      }),
    ),
    creditsRequired: z.number(),
  }),
]);

export const ZDeleteRequirements = z.object({
  programId: z.pipe(
    z.string(),
    z.transform((val) => val as Id<"programs">),
  ),
});

export const ZCreatePrerequisite = z.discriminatedUnion("type", [
  z.object({
    courseId: z.pipe(
      z.string(),
      z.transform((val) => val as Id<"courses">),
    ),
    type: z.literal("required"),
    courses: z.array(z.string()),
  }),
  z.object({
    courseId: z.pipe(
      z.string(),
      z.transform((val) => val as Id<"courses">),
    ),
    type: z.literal("alternative"),
    courses: z.array(z.string()),
  }),
  z.object({
    courseId: z.pipe(
      z.string(),
      z.transform((val) => val as Id<"courses">),
    ),
    type: z.literal("options"),
    courses: z.array(z.string()),
    creditsRequired: z.number(),
  }),
]);

export const ZDeletePrerequisites = z.object({
  courseId: z.pipe(
    z.string(),
    z.transform((val) => val as Id<"courses">),
  ),
});

export const ZUpsertCourseOffering = z.object({
  courseCode: z.string(),
  title: z.string(),
  section: z.string(),
  year: z.number(),
  term: z.enum(["spring", "summer", "fall", "j-term"]),
  instructor: z.string(),
  location: z.string(),
  days: z.array(
    z.enum([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ]),
  ),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(["open", "closed", "waitlist"]),
  waitlistNum: z.number(),
});

export const ZDeleteCourseOffering = z.object({
  id: z.pipe(
    z.string(),
    z.transform((val) => val as Id<"courseOfferings">),
  ),
});

const http = httpRouter();

http.route({
  path: "/api/courses/upsert",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    const result = await ctx.runMutation(
      internal.courses.upsertCourseInternal,
      body,
    );

    return new Response(JSON.stringify({ success: true, id: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZUpsertCourse),
});

http.route({
  path: "/api/courses/delete",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    await ctx.runMutation(internal.courses.deleteCourseInternal, body);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZDeleteCourse),
});

http.route({
  path: "/api/programs/upsert",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    const result = await ctx.runMutation(
      internal.programs.upsertProgramInternal,
      body,
    );

    return new Response(JSON.stringify({ success: true, id: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZUpsertProgram),
});

http.route({
  path: "/api/programs/delete",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    await ctx.runMutation(internal.programs.deleteProgramInternal, body);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZDeleteProgram),
});

http.route({
  path: "/api/requirements/create",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    const result = await ctx.runMutation(
      internal.requirements.createRequirementInternal,
      {
        requirement: body,
      },
    );

    return new Response(JSON.stringify({ success: true, id: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZCreateRequirement),
});

http.route({
  path: "/api/requirements/delete",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    await ctx.runMutation(
      internal.requirements.deleteRequirementsByProgramInternal,
      body,
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZDeleteRequirements),
});

http.route({
  path: "/api/prerequisites/create",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    const result = await ctx.runMutation(
      internal.prerequisites.createPrerequisiteInternal,
      {
        prereq: body,
      },
    );

    return new Response(JSON.stringify({ success: true, id: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZCreatePrerequisite),
});

http.route({
  path: "/api/prerequisites/delete",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    await ctx.runMutation(
      internal.prerequisites.deletePrerequisitesByCourseInternal,
      body,
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZDeletePrerequisites),
});

http.route({
  path: "/api/courseOfferings/upsert",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    const result = await ctx.runMutation(
      internal.courseOfferings.upsertCourseOfferingInternal,
      body,
    );

    return new Response(JSON.stringify({ success: true, id: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZUpsertCourseOffering),
});

http.route({
  path: "/api/courseOfferings/delete",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    await ctx.runMutation(
      internal.courseOfferings.deleteCourseOfferingInternal,
      body,
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZDeleteCourseOffering),
});

export default http;
