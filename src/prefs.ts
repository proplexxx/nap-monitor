// Per-browser preferences. Household-level state (active location, night, privacy)
// moves into integration entities in phase 1; what stays here is device taste.

import type { Layout } from "./types";

export interface ChildPref {
  loc: string;
  muted: boolean;
  hd: boolean;
}

export interface Prefs {
  layout?: Layout;
  /** null/undefined = follow the card's night_mode setting. */
  night?: boolean | null;
  focus?: string;
  /** "all" or a child name. */
  filter?: string;
  children: Record<string, ChildPref>;
}

const KEY = "nap-monitor-card:prefs:v2";

export function loadPrefs(): Prefs {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) || "{}");
    return { ...p, children: p.children || {} };
  } catch (e) {
    return { children: {} };
  }
}

export function savePrefs(p: Prefs): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch (e) {
    /* storage blocked: prefs simply don't persist */
  }
}
