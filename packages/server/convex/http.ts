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

export const ZUpsertCourseWithPrerequisites = z.object({
  program: z.string(),
  code: z.string(),
  level: z.coerce.number(),
  title: z.string(),
  credits: z.int(),
  description: z.string(),
  courseUrl: z.string(),
  prerequisites: z.array(
    z.discriminatedUnion("type", [
      z.object({
        type: z.literal("required"),
        courses: z.array(z.string()),
      }),
      z.object({
        type: z.literal("alternative"),
        courses: z.array(z.string()),
      }),
      z.object({
        type: z.literal("options"),
        courses: z.array(z.string()),
        creditsRequired: z.number(),
      }),
    ]),
  ),
});

export const ZUpsertProgram = z.object({
  name: z.string(),
  level: z.enum(["undergraduate", "graduate"]),
  programUrl: z.string(),
});

export const ZUpsertProgramWithRequirements = z.object({
  name: z.string(),
  level: z.enum(["undergraduate", "graduate"]),
  programUrl: z.string(),
  requirements: z.array(
    z.discriminatedUnion("type", [
      z.object({
        isMajor: z.boolean(),
        type: z.literal("required"),
        courses: z.array(z.string()),
      }),
      z.object({
        isMajor: z.boolean(),
        type: z.literal("alternative"),
        courses: z.array(z.string()),
      }),
      z.object({
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
  ),
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
  classNumber: z.number(),
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
  status: z.enum(["open", "closed", "waitlist", "enrolled"]),
  waitlistNum: z.optional(z.number()),
  isCorequisite: z.boolean(),
  corequisiteOf: z.optional(z.number()),
});

export const ZGetAppConfig = z.object({ key: AppConfigKey });
export const ZSetAppConfig = z.object({ key: AppConfigKey, value: z.string() });

const http = httpRouter();

http.route({
  path: "/api/courses/upsert",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    const { prerequisites, ...courseData } = body;

    const courseId = await ctx.runMutation(
      internal.courses.upsertCourseInternal,
      courseData,
    );

    if (prerequisites && prerequisites.length > 0) {
      await ctx.runMutation(
        internal.prerequisites.deletePrerequisitesByCourseInternal,
        { courseId },
      );

      await ctx.runMutation(
        internal.prerequisites.createPrerequisitesInternal,
        {
          prerequisites: prerequisites.map((prereq) => ({
            ...prereq,
            courseId,
          })),
        },
      );
    }

    return new Response(JSON.stringify({ data: courseId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZUpsertCourseWithPrerequisites),
});

http.route({
  path: "/api/programs/upsert",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    const { requirements, ...programData } = body;

    const programId = await ctx.runMutation(
      internal.programs.upsertProgramInternal,
      programData,
    );

    if (requirements && requirements.length > 0) {
      await ctx.runMutation(
        internal.requirements.deleteRequirementsByProgramInternal,
        { programId },
      );

      await ctx.runMutation(internal.requirements.createRequirementsInternal, {
        requirements: requirements.map((req) => ({
          ...req,
          programId,
        })),
      });
    }

    return new Response(JSON.stringify({ data: programId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, ZUpsertProgramWithRequirements),
});

http.route({
  path: "/api/courseOfferings/upsert",
  method: "POST",
  handler: apiAction(async (ctx, body) => {
    const data = await ctx.runMutation(
      internal.courseOfferings.upsertCourseOfferingsInternal,
      { courseOfferings: body },
    );

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, z.array(ZUpsertCourseOffering)),
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
