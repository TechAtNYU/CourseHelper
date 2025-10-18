import { auth } from "@clerk/nextjs/server";

export async function getAuthToken() {
  const { getToken, redirectToSignIn } = await auth();
  const token = await getToken({ template: "convex" });

  if (!token) {
    redirectToSignIn();
    throw new Error("Not authenticated");
  }

  return token;
}
