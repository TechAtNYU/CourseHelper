import { useAtomValue } from "jotai";
import {
  appConfigAtom,
  currentTermAtom,
  currentYearAtom,
  nextTermAtom,
  nextYearAtom,
} from "@/modules/app-configs/app-config";

export function useAppConfig() {
  return useAtomValue(appConfigAtom);
}

export function useCurrentTerm() {
  return useAtomValue(currentTermAtom);
}

export function useCurrentYear() {
  return useAtomValue(currentYearAtom);
}

export function useNextTerm() {
  return useAtomValue(nextTermAtom);
}

export function useNextYear() {
  return useAtomValue(nextYearAtom);
}
