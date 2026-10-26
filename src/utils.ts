/** "under a minute", "12 min", "2h 05m" style durations from milliseconds. */
export function fmtDur(ms: number): string {
  const m = Math.floor(ms / 6e4);
  if (m < 1) return "under a minute";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}h ${String(r).padStart(2, "0")}m` : `${h}h`;
}

/** Short form for tight spaces: "<1m", "12m", "2h05". */
export function fmtDurShort(ms: number): string {
  const m = Math.floor(ms / 6e4);
  if (m < 1) return "<1m";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}h${String(r).padStart(2, "0")}` : `${h}h`;
}

/** Local clock time without seconds. */
export function fmtTime(ms: number): string {
  return new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/** "Today", "Yesterday" or a short weekday/date label. */
export function fmtDay(ms: number, now = Date.now()): string {
  const d = new Date(ms);
  const n = new Date(now);
  if (d.toDateString() === n.toDateString()) return "Today";
  const y = new Date(n);
  y.setDate(n.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

/** Parse "HH:MM" into minutes since midnight; NaN when malformed. */
export function parseClock(s: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || "").trim());
  if (!m) return NaN;
  return Number(m[1]) * 60 + Number(m[2]);
}

/** Whether `now` falls inside a possibly-overnight window given as minutes since midnight. */
export function inWindow(nowMin: number, startMin: number, endMin: number): boolean {
  if (Number.isNaN(startMin) || Number.isNaN(endMin)) return false;
  if (startMin === endMin) return false;
  if (startMin < endMin) return nowMin >= startMin && nowMin < endMin;
  return nowMin >= startMin || nowMin < endMin;
}
