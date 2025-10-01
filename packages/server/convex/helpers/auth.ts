import {
  customAction,
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import {
  type ActionCtx,
  action,
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
