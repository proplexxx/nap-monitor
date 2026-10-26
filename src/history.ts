// Cry episodes from the logbook: on/off pairs of the cry sensors, newest first.

import type { Episode, Hass } from "./types";

export async function fetchEpisodes(hass: Hass, ids: string[], hours: number): Promise<Episode[]> {
  if (!ids.length) return [];
  const start = new Date(Date.now() - hours * 36e5).toISOString();
  const events: any[] = await hass.callWS({ type: "logbook/get_events", start_time: start, entity_ids: ids });
  const open: Record<string, number> = {};
  const items: Episode[] = [];
  for (const ev of events) {
    const when = Number(ev.when) * 1e3;
    if (ev.state === "on") {
      open[ev.entity_id] = when;
    } else if (ev.state === "off" && open[ev.entity_id]) {
      items.push({ start: open[ev.entity_id], end: when, entityId: ev.entity_id });
      delete open[ev.entity_id];
    }
  }
  for (const id of Object.keys(open)) items.push({ start: open[id], end: null, entityId: id });
  // A sensor that is on now but whose "on" edge is older than the window has no
  // logbook entry in range; add it so the timeline shows the ongoing episode.
  for (const id of ids) {
    const st = hass.states[id];
    if (st && st.state === "on" && !items.some((it) => it.entityId === id && it.end === null)) {
      items.push({ start: new Date(st.last_changed).getTime(), end: null, entityId: id });
    }
  }
  return items.sort((a, b) => b.start - a.start);
}
