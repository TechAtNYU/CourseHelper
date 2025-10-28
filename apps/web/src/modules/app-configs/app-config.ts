import { AppConfigKey } from "@albert-plus/server/convex/schemas/appConfigs";
import { atom } from "jotai";
import z from "zod";

export type TTerm = "spring" | "summer" | "fall" | "j-term";

export type AppConfig = {
  current_term: TTerm;
  current_year: number;
  next_term: TTerm;
  next_year: number;
};

export const appConfigsAtom = atom<
  { key: z.infer<typeof AppConfigKey>; value: string }[] | null
>(null);

export const currentTermAtom = atom((get) => {
  const configs = get(appConfigsAtom);
  return configs?.find((c) => c.key === "current_term")?.value ?? null;
});

export const currentYearAtom = atom((get) => {
  const configs = get(appConfigsAtom);
  return Number(configs?.find((c) => c.key === "current_year")?.value) ?? null;
});

export const nextTermAtom = atom((get) => {
  const configs = get(appConfigsAtom);
  return configs?.find((c) => c.key === "next_term")?.value ?? null;
});

export const nextYearAtom = atom((get) => {
  const configs = get(appConfigsAtom);
  return Number(configs?.find((c) => c.key === "next_year")?.value) ?? null;
});

export const appConfigAtom = atom((get) => ({
  current_term: get(currentTermAtom),
  current_year: get(currentYearAtom),
  next_term: get(nextTermAtom),
  next_year: get(nextYearAtom),
}));
