// Card configuration and shared types for the Nap Monitor card.

export type Layout = "grid" | "focus" | "fill";
export type NightMode = "auto" | "on" | "off";

/** One sleep location of a child: a camera plus the signals around it. */
export interface LocationConfig {
  key: string;
  label?: string;
  camera?: string;
  camera_hd?: string;
  cry?: string;
  motion?: string;
  privacy?: string;
  /** Optional room readouts shown under the status (temperature, humidity, sound machine…). */
  sensors?: string[];
}

export interface ChildConfig {
  name: string;
  color?: string;
  /** `cameras` is the historical key; `locations` is accepted as an alias. */
  cameras: LocationConfig[];
}

export interface TvScript {
  name: string;
  script: string;
}

export interface CardConfig {
  type?: string;
  title?: string;
  children: ChildConfig[];
  layout: Layout;
  night_mode: NightMode;
  night_start: string;
  night_end: string;
  events_hours: number;
  timeline_hours: number;
  stream_suffix: string;
  hd_suffix: string;
  native_player: boolean;
  tv_scripts: TvScript[];
  /** Switch a child's tile to whichever of their locations is crying. */
  follow_cry: boolean;
  /** Unmuting one tile mutes the others. */
  exclusive_audio: boolean;
  show_timeline: boolean;
  show_sensors: boolean;
  /** How a stretched video (Focus main, Fill) sits in its box. */
  fit: "cover" | "contain";
}

export interface HassEntity {
  entity_id: string;
  state: string;
  last_changed: string;
  attributes: Record<string, any>;
}

export interface Hass {
  states: Record<string, HassEntity>;
  callService(domain: string, service: string, data?: Record<string, any>): Promise<any>;
  callWS<T = any>(msg: Record<string, any>): Promise<T>;
  formatEntityState?(stateObj: HassEntity): string;
}

export type StatusKind = "missing" | "privacy" | "offline" | "crying" | "stirring" | "quiet" | "live";

export interface Status {
  kind: StatusKind;
  /** Timestamp (ms) the current state started, when known. */
  since: number | null;
  cameraId: string;
}

export interface Episode {
  start: number; // ms
  end: number | null; // ms, null while ongoing
  entityId: string;
}
