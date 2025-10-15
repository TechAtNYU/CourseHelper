"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import type { ReactNode } from "react";

export function AuthenticatedContent({ children }: { children: ReactNode }) {
  return (
    <>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <div className="flex h-screen items-center justify-center">
          <div className="text-muted-foreground">Authenticating...</div>
        </div>
      </Unauthenticated>
    </>
  );
}
