"use client";

import { Authenticated, AuthLoading } from "convex/react";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthenticatedContent({
  children,
  skeleton = <Skeleton className="h-screen w-full" />,
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
