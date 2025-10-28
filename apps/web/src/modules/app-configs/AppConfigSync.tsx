"use client";

import { api } from "@albert-plus/server/convex/_generated/api";
import { useQuery } from "convex/react";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { appConfigsAtom } from "@/modules/app-configs/app-config";

export function AppConfigSync() {
  const configs = useQuery(api.appConfigs.getAllAppConfigs);
  const setConfigs = useSetAtom(appConfigsAtom);

  useEffect(() => {
    if (configs) {
      setConfigs(configs);
    }
  }, [configs, setConfigs]);

  return null;
}
