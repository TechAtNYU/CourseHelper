import { httpRouter } from "convex/server";
import * as z from "zod/mini";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { apiAction } from "./helpers/auth";
import { AppConfigKey } from "./schemas/appConfigs";

export const ZUpsertCourse = z.object({
  program: z.string(),
  code: z.string(),
  level: z.coerce.number(),
  title: z.string(),
  credits: z.int(),
  description: z.string(),
  courseUrl: z.string(),
});

export const ZUpsertProgram = z.object({
  name: z.string(),
  level: z.enum(["undergraduate", "graduate"]),
  programUrl: z.string(),
});

export const ZUpsertRequirements = z.array(
  z.discriminatedUnion("type", [
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
  ]),
);

export const ZUpsertPrerequisites = z.array(
  z.discriminatedUnion("type", [
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
  ]),
);

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

export const ZGetAppConfig = z.object({ key: AppConfigKey });
export const ZSetAppConfig = z.object({ key: AppConfigKey, value: z.string() });

const http = httpRouter();

http.route({
  path: "/api/courses/upsert",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    const data = await ctx.runMutation(
      internal.courses.upsertCourseInternal,
      body,
    );

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZUpsertCourse),
});

http.route({
  path: "/api/programs/upsert",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    const data = await ctx.runMutation(
      internal.programs.upsertProgramInternal,
      body,
    );

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZUpsertProgram),
});

http.route({
  path: "/api/requirements/upsert",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    const programIds = new Set(body.map((p) => p.programId));

    if (programIds.size > 1) {
      throw new Error("requirements must have same program id");
    }

    for (const programId of programIds) {
      await ctx.runMutation(
        internal.requirements.deleteRequirementsByProgramInternal,
        {
          programId,
        },
      );
    }

    const data = await ctx.runMutation(
      internal.requirements.createRequirementsInternal,
      {
        requirements: body,
      },
    );

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZUpsertRequirements),
});

http.route({
  path: "/api/prerequisites/upsert",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    const courseIds = new Set(body.map((p) => p.courseId));

    if (courseIds.size > 1) {
      throw new Error("prerequisites must have same course id");
    }

    for (const courseId of courseIds) {
      await ctx.runMutation(
        internal.prerequisites.deletePrerequisitesByCourseInternal,
        {
          courseId,
        },
      );
    }

    const data = await ctx.runMutation(
      internal.prerequisites.createPrerequisitesInternal,
      {
        prerequisites: body,
      },
    );

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZUpsertPrerequisites),
});

http.route({
  path: "/api/courseOfferings/upsert",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    const data = await ctx.runMutation(
      internal.courseOfferings.upsertCourseOfferingInternal,
      body,
    );

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZUpsertCourseOffering),
});

http.route({
  path: "/api/appConfigs/get",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    const data = await ctx.runQuery(
      internal.appConfigs.getAppConfigInternal,
      body,
    );

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZGetAppConfig),
});

http.route({
  path: "/api/appConfigs/set",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    const data = await ctx.runMutation(
      internal.appConfigs.setAppConfigInternal,
      body,
    );

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZSetAppConfig),
});

export default http;
