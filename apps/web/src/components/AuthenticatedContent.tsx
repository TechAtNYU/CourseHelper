"use client";

import { Authenticated, AuthLoading } from "convex/react";
import type { ReactNode } from "react";

export function AuthenticatedContent({
  children,
  skeleton = <p>loading...</p>,
}: {
  children: ReactNode;
  skeleton?: ReactNode;
}) {
  return (
    <>
      <Authenticated>{children}</Authenticated>
      <AuthLoading>{skeleton}</AuthLoading>
    </>
  );
}
