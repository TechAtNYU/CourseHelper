"use client";

import { useNextTerm, useNextYear } from "@/components/AppConfigProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTermTitle } from "@/utils/format-term";
import { AppHeader } from "../../components/app-header";

export default function ScheduleHeader() {
  const term = useNextTerm();
  const year = useNextYear();

  const title = formatTermTitle(term, year);

  return (
    <AppHeader
      title="Register"
      center={
        title ? (
          <div className="text-sm font-medium">{title}</div>
        ) : (
          <Skeleton className="h-5 w-24" />
        )
      }
    />
  );
}
