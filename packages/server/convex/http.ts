import { httpRouter } from "convex/server";
import * as z from "zod/mini";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { apiAction } from "./helpers/auth";

const http = httpRouter();

http.route({
  path: "/api/courses/upsert",
  method: "POST",
  handler: apiAction(
    async (ctx, body) => {
      const result = await ctx.runMutation(
        internal.courses.upsertCourseInternal,
        body,
      );

      return new Response(JSON.stringify({ success: true, id: result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
    z.object({
      code: z.string(),
      level: z.string(),
      title: z.string(),
      credits: z.int(),
      description: z.string(),
      courseUrl: z.string(),
    }),
  ),
});

http.route({
  path: "/api/courses/delete",
  method: "POST",
  handler: apiAction(
    async (ctx, body) => {
      await ctx.runMutation(internal.courses.deleteCourseInternal, {
        id: body.id as Id<"courses">,
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
    z.object({
      id: z.string(),
    }),
  ),
});

http.route({
  path: "/api/programs/upsert",
  method: "POST",
  handler: apiAction(
    async (ctx, body) => {
      const result = await ctx.runMutation(
        internal.programs.upsertProgramInternal,
        body,
      );

      return new Response(JSON.stringify({ success: true, id: result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
    z.object({
      name: z.string(),
      level: z.enum(["undergraduate", "graduate"]),
      programUrl: z.string(),
    }),
  ),
});

http.route({
  path: "/api/programs/delete",
  method: "POST",
  handler: apiAction(
    async (ctx, body) => {
      await ctx.runMutation(internal.programs.deleteProgramInternal, {
        id: body.id as Id<"programs">,
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
    z.object({
      id: z.string(),
    }),
  ),
});

http.route({
  path: "/api/requirements/create",
  method: "POST",
  handler: apiAction(
    async (ctx, body) => {
      const payload = {
        programId: body.programId as Id<"programs">,
        isMajor: body.isMajor,
        type: body.type,
        courses: body.courses,
        ...(body.type === "options" && body.creditsRequired !== undefined
          ? { creditsRequired: body.creditsRequired }
          : {}),
      };

      const result = await ctx.runMutation(
        internal.requirements.createRequirementInternal,
        payload,
      );

      return new Response(JSON.stringify({ success: true, id: result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
    z.discriminatedUnion("type", [
      z.object({
        programId: z.string(),
        isMajor: z.boolean(),
        type: z.literal("required"),
        courses: z.array(z.string()), // course code
      }),
      z.object({
        programId: z.string(),
        isMajor: z.boolean(),
        type: z.literal("alternative"),
        courses: z.array(z.string()), // course code
      }),
      z.object({
        programId: z.string(),
        isMajor: z.boolean(),
        type: z.literal("options"),
        courses: z.array(z.string()), // course code
        creditsRequired: z.number(),
      }),
    ]),
  ),
});

http.route({
  path: "/api/requirements/delete",
  method: "POST",
  handler: apiAction(
    async (ctx, body) => {
      await ctx.runMutation(
        internal.requirements.deleteRequirementsByProgramInternal,
        {
          programId: body.programId as Id<"programs">,
        },
      );

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
    z.object({
      programId: z.string(),
    }),
  ),
});

http.route({
  path: "/api/prerequisites/create",
  method: "POST",
  handler: apiAction(
    async (ctx, body) => {
      const payload = {
        courseId: body.courseId as Id<"courses">,
        type: body.type,
        courses: body.courses,
        ...(body.type === "options" && body.creditsRequired !== undefined
          ? { creditsRequired: Number(body.creditsRequired) }
          : {}),
      };

      const result = await ctx.runMutation(
        internal.prerequisites.createPrerequisiteInternal,
        payload,
      );

      return new Response(JSON.stringify({ success: true, id: result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
    z.discriminatedUnion("type", [
      z.object({
        courseId: z.string(),
        type: z.literal("required"),
        courses: z.array(z.string()),
      }),
      z.object({
        courseId: z.string(),
        type: z.literal("alternative"),
        courses: z.array(z.string()),
      }),
      z.object({
        courseId: z.string(),
        type: z.literal("options"),
        courses: z.array(z.string()),
        creditsRequired: z.number(),
      }),
    ]),
  ),
});

http.route({
  path: "/api/prerequisites/delete",
  method: "POST",
  handler: apiAction(
    async (ctx, body) => {
      await ctx.runMutation(
        internal.prerequisites.deletePrerequisitesByCourseInternal,
        {
          courseId: body.courseId as Id<"courses">,
        },
      );

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
    z.object({
      courseId: z.string(),
    }),
  ),
});

export default http;
