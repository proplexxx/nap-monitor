// Config normalisation and entity resolution. Everything that guesses entity ids
// from a location key lives here so the phase-1 integration can replace it.

import type { CardConfig, ChildConfig, Hass, HassEntity, LocationConfig, Status } from "./types";

const DEFAULTS: Omit<CardConfig, "children"> = {
  layout: "grid",
  night_mode: "auto",
  night_start: "19:30",
  night_end: "07:00",
  events_hours: 24,
  timeline_hours: 12,
  stream_suffix: "_fluent",
  hd_suffix: "_clear",
  native_player: false,
  tv_scripts: [],
  follow_cry: true,
  exclusive_audio: true,
  show_timeline: true,
  show_sensors: true,
  fit: "cover",
};

export function normalizeConfig(raw: any): CardConfig {
  if (!raw || typeof raw !== "object") throw new Error("Nap Monitor: configuration is missing");
  const children: ChildConfig[] = (Array.isArray(raw.children) ? raw.children : []).map((ch: any, i: number) => {
    if (!ch || !ch.name) throw new Error(`Nap Monitor: child ${i + 1} needs a name`);
    const locs = Array.isArray(ch.locations) ? ch.locations : ch.cameras;
    if (!Array.isArray(locs) || !locs.length) throw new Error(`Nap Monitor: ${ch.name} needs at least one camera`);
    const cameras: LocationConfig[] = locs.map((c: any, j: number) => {
      if (!c || !c.key) throw new Error(`Nap Monitor: ${ch.name} camera ${j + 1} needs a key`);
      return { ...c, sensors: Array.isArray(c.sensors) ? c.sensors : [] };
    });
    return { name: String(ch.name), color: ch.color, cameras };
  });
  if (!children.length) throw new Error("Nap Monitor: add a children list, each with a name and cameras");
  const cfg: CardConfig = { ...DEFAULTS, ...raw, children };
  if (!["grid", "focus", "fill"].includes(cfg.layout)) cfg.layout = "grid";
  if (!["auto", "on", "off"].includes(cfg.night_mode)) cfg.night_mode = "auto";
  cfg.events_hours = Number(cfg.events_hours) || 24;
  cfg.timeline_hours = Number(cfg.timeline_hours) || 12;
  cfg.tv_scripts = Array.isArray(cfg.tv_scripts) ? cfg.tv_scripts : [];
  if (cfg.fit !== "contain") cfg.fit = "cover";
  return cfg;
}

/** Entity ids for one location, guessed from its key unless overridden. */
export interface LocationEntities {
  camera: string;
  cameraHd: string;
  cry: string;
  motion: string;
  privacy: string;
  ptz: {
    up: string;
    down: string;
    left: string;
    right: string;
    stop: string;
    preset: string;
    guardSet: string;
    guardGo: string;
    calibrate: string;
    autoTrack: string;
  };
}

export function locationEntities(cfg: CardConfig, loc: LocationConfig): LocationEntities {
  const k = loc.key;
  return {
    camera: loc.camera || `camera.${k}${cfg.stream_suffix}`,
    cameraHd: loc.camera_hd || `camera.${k}${cfg.hd_suffix}`,
    cry: loc.cry || `binary_sensor.${k}_baby_crying`,
    motion: loc.motion || `binary_sensor.${k}_motion`,
    privacy: loc.privacy || `switch.${k}_privacy_mode`,
    ptz: {
      up: `button.${k}_ptz_up`,
      down: `button.${k}_ptz_down`,
      left: `button.${k}_ptz_left`,
      right: `button.${k}_ptz_right`,
      stop: `button.${k}_ptz_stop`,
      preset: `select.${k}_ptz_preset`,
      guardSet: `button.${k}_guard_set_current_position`,
      guardGo: `button.${k}_guard_go_to`,
      calibrate: `button.${k}_ptz_calibrate`,
      autoTrack: `switch.${k}_auto_tracking`,
    },
  };
}

export interface SettingRow {
  section: string;
  id: string;
  label: string;
  hint?: string;
}

/** Adjustable camera settings, grouped. Rows whose entity is absent are dropped by the caller. */
export function settingRows(key: string): SettingRow[] {
  const k = key;
  return [
    { section: "Listening", id: `number.${k}_baby_cry_sensitivity`, label: "Cry sensitivity", hint: "Higher catches softer cries, and more false alarms" },
    { section: "Listening", id: `number.${k}_volume`, label: "Camera speaker volume" },
    { section: "Listening", id: `switch.${k}_record_audio`, label: "Record audio" },
    { section: "Night", id: `select.${k}_day_night_mode`, label: "Night vision" },
    { section: "Night", id: `switch.${k}_infrared_lights_in_night_mode`, label: "Infrared lights at night" },
    { section: "Night", id: `light.${k}_status_led`, label: "Status light on camera" },
    { section: "Detection", id: `number.${k}_motion_sensitivity`, label: "Motion sensitivity" },
    { section: "Detection", id: `number.${k}_ai_person_sensitivity`, label: "Person sensitivity" },
    { section: "Detection", id: `switch.${k}_auto_tracking`, label: "Follow movement", hint: "Camera turns to keep motion in view" },
    { section: "Detection", id: `switch.${k}_guard_return`, label: "Return to home position" },
    { section: "Detection", id: `number.${k}_guard_return_time`, label: "Return after (seconds)" },
    { section: "Recording and alerts", id: `switch.${k}_record`, label: "Record to memory card" },
    { section: "Recording and alerts", id: `switch.${k}_push_notifications`, label: "Reolink app notifications" },
    { section: "Recording and alerts", id: `switch.${k}_siren_on_event`, label: "Siren on detection", hint: "Keep this off in a nursery" },
    { section: "Privacy", id: `switch.${k}_privacy_mode`, label: "Privacy mode", hint: "Stops the video and turns the lens away" },
  ];
}

export function locationLabel(loc: LocationConfig): string {
  return loc.label || loc.key.replace(/_/g, " ");
}

const ms = (iso: string) => new Date(iso).getTime();

/** Derive what the tile should say about a location right now. */
export function locationStatus(hass: Hass | undefined, cfg: CardConfig, loc: LocationConfig, hd: boolean): Status {
  const e = locationEntities(cfg, loc);
  const cameraId = hd && hass?.states[e.cameraHd] ? e.cameraHd : e.camera;
  const st = (id: string): HassEntity | undefined => hass?.states[id];
  const cam = st(cameraId);
  if (!cam) return { kind: "missing", since: null, cameraId };
  const privacy = st(e.privacy);
  if (privacy && privacy.state === "on") return { kind: "privacy", since: ms(privacy.last_changed), cameraId };
  if (cam.state === "unavailable") return { kind: "offline", since: ms(cam.last_changed), cameraId };
  const cry = st(e.cry);
  if (cry && cry.state === "on") return { kind: "crying", since: ms(cry.last_changed), cameraId };
  const motion = st(e.motion);
  const quietSince = cry ? ms(cry.last_changed) : null;
  if (motion && motion.state === "on") return { kind: "stirring", since: quietSince, cameraId };
  if (cry) return { kind: "quiet", since: quietSince, cameraId };
  return { kind: "live", since: null, cameraId };
}

export function isCrying(hass: Hass | undefined, cfg: CardConfig, loc: LocationConfig): boolean {
  const cry = hass?.states[locationEntities(cfg, loc).cry];
  return !!cry && cry.state === "on";
}

/** Short human text for a sensor state, e.g. "71°F" or "Fan on". */
export function sensorText(hass: Hass, id: string): string | null {
  const st = hass.states[id];
  if (!st || st.state === "unavailable" || st.state === "unknown") return null;
  const name = String(st.attributes.friendly_name || id).split(" ").slice(-1)[0];
  const unit = st.attributes.unit_of_measurement;
  if (unit) {
    const n = Number(st.state);
    const v = Number.isFinite(n) ? (Math.abs(n) >= 10 ? Math.round(n) : Math.round(n * 10) / 10) : st.state;
    return `${v}${unit.length <= 2 ? unit : " " + unit}`;
  }
  const domain = id.split(".")[0];
  if (["switch", "fan", "light", "media_player", "binary_sensor", "input_boolean"].includes(domain)) {
    const on = ["on", "playing"].includes(st.state);
    return `${name} ${on ? "on" : "off"}`;
  }
  return hass.formatEntityState ? hass.formatEntityState(st) : st.state;
}
