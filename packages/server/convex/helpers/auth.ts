import {
  customAction,
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import type * as z from "zod/mini";
import {
  type ActionCtx,
  action,
  httpAction,
  type MutationCtx,
  mutation,
  type QueryCtx,
  query,
} from "../_generated/server";

export async function auth({
  ctx,
}: {
  ctx: QueryCtx | MutationCtx | ActionCtx;
}) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw new Error("Not authenticated");
  }
  return identity;
}

export function authApiKey(apiKey: string | null) {
  const expectedKey = process.env.CONVEX_API_KEY;

  if (!apiKey || !expectedKey || apiKey !== expectedKey) {
    throw new Error("Invalid or missing API key");
  }
}

export const protectedQuery = customQuery(
  query,
  customCtx(async (ctx: QueryCtx) => {
    const user = await auth({ ctx });
    return { ...ctx, user };
  }),
);

export const protectedMutation = customMutation(
  mutation,
  customCtx(async (ctx: MutationCtx) => {
    const user = await auth({ ctx });
    return { ...ctx, user };
  }),
);

export const protectedAction = customAction(
  action,
  customCtx(async (ctx: ActionCtx) => {
    const user = await auth({ ctx });
    return { ...ctx, user };
  }),
);

export function apiAction<T = unknown>(
  handler: (ctx: ActionCtx, body: T) => Promise<Response>,
  schema?: z.ZodMiniType<T>,
) {
  return httpAction(async (ctx, request) => {
    try {
      const apiKey = request.headers.get("x-api-key");
      authApiKey(apiKey);

      const body = await request.json();

      if (schema) {
        const result = schema.safeParse(body);
        if (!result.success) {
          return new Response(
            JSON.stringify({
              error: "Invalid request body",
              issues: result.error.issues,
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }

      return await handler(ctx, body as T);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      return new Response(JSON.stringify({ error: message }), {
        status:
          error instanceof Error && error.message.includes("API key")
            ? 401
            : 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  });
}
