// Nap Monitor card. One tile per child, driven by the child's selected sleep
// location; status overlays read from the camera's cry/motion/privacy entities.

import { LitElement, html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { keyed } from "lit/directives/keyed.js";
import { styleMap } from "lit/directives/style-map.js";
import { fetchEpisodes } from "./history";
import { I, icon } from "./icons";
import { isCrying, locationEntities, locationLabel, locationStatus, normalizeConfig, sensorText } from "./model";
import { getOverlay, type Overlay } from "./overlay";
import { findVideo, isPoppedOut, togglePopOut } from "./popout";
import { loadPrefs, savePrefs, type ChildPref, type Prefs } from "./prefs";
import { historySheet, ptzSheet, settingsSheet, type SheetContext } from "./sheets";
import { STYLE } from "./styles";
import type { CardConfig, ChildConfig, Episode, Hass, Layout, LocationConfig, Status, StatusKind } from "./types";
import { fmtDur, inWindow, parseClock } from "./utils";

export const CARD_TAG = "nap-monitor-card";

const LAYOUTS: Layout[] = ["grid", "focus", "fill"];
const LAYOUT_META: Record<Layout, { label: string; icon: string; title: string }> = {
  grid: { label: "Grid", icon: I.grid, title: "Layout: grid. Tap for focus" },
  focus: { label: "Focus", icon: I.focus, title: "Layout: focus. Tap for fill" },
  fill: { label: "Fill", icon: I.fill, title: "Layout: fill. Tap for grid" },
};
const STATUS_META: Record<StatusKind, { icon: string; label: string }> = {
  missing: { icon: I.cameraOff, label: "Camera not found" },
  privacy: { icon: I.privacy, label: "Privacy on" },
  offline: { icon: I.offline, label: "Camera offline" },
  crying: { icon: I.cry, label: "Crying" },
  stirring: { icon: I.motion, label: "Stirring" },
  quiet: { icon: I.sleep, label: "Quiet" },
  live: { icon: I.play, label: "Live" },
};

export class NapMonitorCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _prefs: { state: true },
    _now: { state: true },
    _episodes: { state: true },
    _live: { state: true },
    _popped: { state: true },
    _fullscreen: { state: true },
    _narrow: { state: true },
  };

  hass?: Hass;
  private _config?: CardConfig;
  private _prefs: Prefs = loadPrefs();
  private _now = Date.now();
  private _episodes: Record<string, Episode[]> = {};
  private _live: Record<string, boolean> = {};
  private _popped = false;
  private _fullscreen = false;
  private _narrow = false;
  private _mq = window.matchMedia("(max-width: 760px)");
  private _onMq = () => {
    this._narrow = this._mq.matches;
  };
  private _ro?: ResizeObserver;

  private _overlay: Overlay = getOverlay();
  private _lastCry: Record<string, boolean> = {};
  private _seenHass = false;
  private _tick?: ReturnType<typeof setInterval>;
  private _histTimer?: ReturnType<typeof setInterval>;
  private _liveTimer?: ReturnType<typeof setInterval>;
  private _sizeRaf: number | null = null;
  private _onResize = () => this._sizeGridSoon();
  private _onFullscreen = () => {
    this._fullscreen = !!document.fullscreenElement;
    this._sizeGridSoon();
  };

  // ------------------------------------------------------------ HA card API

  setConfig(config: any) {
    this._config = normalizeConfig(config);
    this._prefs = loadPrefs();
    this._episodes = {};
    this._lastCry = {};
    this._seenHass = false;
  }

  getCardSize() {
    return 12;
  }

  getGridOptions() {
    return { columns: "full", rows: "auto" };
  }

  static getStubConfig() {
    return { children: [{ name: "Child", cameras: [{ key: "nursery", label: "Nursery" }] }] };
  }

  // -------------------------------------------------------------- lifecycle

  protected createRenderRoot() {
    const root = super.createRenderRoot() as ShadowRoot;
    const style = document.createElement("style");
    style.textContent = STYLE;
    root.appendChild(style);
    return root;
  }

  connectedCallback() {
    super.connectedCallback();
    this._tick = setInterval(() => {
      this._now = Date.now();
    }, 30e3);
    this._histTimer = setInterval(() => this._refreshHistory(), 5 * 60e3);
    this._liveTimer = setInterval(() => this._checkLive(), 1000);
    window.addEventListener("resize", this._onResize);
    document.addEventListener("fullscreenchange", this._onFullscreen);
    this._narrow = this._mq.matches;
    this._mq.addEventListener("change", this._onMq);
    this._ro = new ResizeObserver((entries) => entries.forEach((e) => this._fitStream(e.target as HTMLElement)));
    this._sizeGridSoon();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._tick);
    clearInterval(this._histTimer);
    clearInterval(this._liveTimer);
    window.removeEventListener("resize", this._onResize);
    document.removeEventListener("fullscreenchange", this._onFullscreen);
    this._mq.removeEventListener("change", this._onMq);
    this._ro?.disconnect();
    if (!isPoppedOut() && this._overlay.isOpen) this._overlay.close();
  }

  protected willUpdate(changed: PropertyValues) {
    if (!this._config || !this.hass) return;
    if (changed.has("hass") || changed.has("_config")) this._onStateChange();
    this._overlay.setNight(this._night);
  }

  protected updated(changed: PropertyValues) {
    if (changed.has("_prefs") || changed.has("_config") || changed.has("_fullscreen") || changed.has("_narrow")) this._sizeGridSoon();
    if (changed.has("hass") && this._overlay.isOpen) this._overlay.refresh();
    if (this._ro) {
      this._ro.disconnect();
      this.renderRoot.querySelectorAll<HTMLElement>(".video").forEach((v) => {
        this._ro!.observe(v);
        this._fitStream(v);
      });
    }
  }

  /** Size the stream so it covers (or fits inside) a stretched video box. */
  private _fitStream(box: HTMLElement) {
    const w = box.clientWidth;
    const h = box.clientHeight;
    if (!w || !h) return;
    const stream = box.querySelector("ha-camera-stream");
    const v = stream ? findVideo(stream) : null;
    const ratio = v && v.videoWidth && v.videoHeight ? v.videoWidth / v.videoHeight : 16 / 9;
    const fitW = h * ratio;
    const target = this._config?.fit === "contain" ? Math.min(w, fitW) : Math.max(w, fitW);
    box.style.setProperty("--nm-stream-w", `${Math.round(target)}px`);
  }

  // --------------------------------------------------------------- derived

  private get _night(): boolean {
    const p = this._prefs.night;
    if (p === true || p === false) return p;
    const cfg = this._config!;
    if (cfg.night_mode === "on") return true;
    if (cfg.night_mode === "off") return false;
    const d = new Date(this._now);
    return inWindow(d.getHours() * 60 + d.getMinutes(), parseClock(cfg.night_start), parseClock(cfg.night_end));
  }

  private get _layout(): Layout {
    return this._prefs.layout || this._config!.layout;
  }

  private _cp(child: ChildConfig): ChildPref {
    const p = this._prefs.children[child.name] || { loc: child.cameras[0].key, muted: true, hd: false };
    if (!child.cameras.some((c) => c.key === p.loc)) p.loc = child.cameras[0].key;
    this._prefs.children[child.name] = p;
    return p;
  }

  private _loc(child: ChildConfig): LocationConfig {
    const p = this._cp(child);
    return child.cameras.find((c) => c.key === p.loc) || child.cameras[0];
  }

  private _visibleChildren(): ChildConfig[] {
    const cfg = this._config!;
    const f = this._prefs.filter;
    const one = f && f !== "all" ? cfg.children.find((c) => c.name === f) : undefined;
    return one ? [one] : cfg.children;
  }

  private _save() {
    savePrefs(this._prefs);
    this._prefs = { ...this._prefs };
  }

  private _cryEpisodes(child: ChildConfig): Episode[] {
    return this._episodes[child.name] || [];
  }

  // -------------------------------------------------------- state reactions

  /** Follow crying across a child's locations, refocus, and refresh history on cry edges. */
  private _onStateChange() {
    const cfg = this._config!;
    const hass = this.hass!;
    const first = !this._seenHass;
    this._seenHass = true;
    let prefsChanged = false;
    let refresh: ChildConfig[] = [];

    for (const child of cfg.children) {
      const pref = this._cp(child);
      let newlyCrying: LocationConfig | null = null;
      for (const loc of child.cameras) {
        const crying = isCrying(hass, cfg, loc);
        const was = this._lastCry[loc.key];
        if (crying && was === false) newlyCrying = newlyCrying || loc;
        if (was !== undefined && was !== crying) refresh.push(child);
        this._lastCry[loc.key] = crying;
      }
      const current = child.cameras.find((c) => c.key === pref.loc) || child.cameras[0];
      if (cfg.follow_cry && !isCrying(hass, cfg, current)) {
        const target = newlyCrying || (first ? child.cameras.find((l) => isCrying(hass, cfg, l)) : undefined);
        if (target && target.key !== pref.loc) {
          pref.loc = target.key;
          prefsChanged = true;
        }
      }
      if (newlyCrying && this._layout === "focus" && this._prefs.focus !== child.name) {
        this._prefs.focus = child.name;
        prefsChanged = true;
      }
    }
    if (prefsChanged) this._save();
    if (first) this._refreshHistory();
    else [...new Set(refresh)].forEach((c) => this._refreshHistory(c));
  }

  private async _refreshHistory(only?: ChildConfig) {
    if (!this.hass || !this._config) return;
    const cfg = this._config;
    const kids = only ? [only] : cfg.children;
    await Promise.all(
      kids.map(async (child) => {
        const ids = child.cameras.map((l) => locationEntities(cfg, l).cry).filter((id) => !!this.hass!.states[id]);
        try {
          const eps = await fetchEpisodes(this.hass!, ids, Math.max(cfg.events_hours, cfg.timeline_hours));
          this._episodes = { ...this._episodes, [child.name]: eps };
        } catch (e) {
          /* history is decoration; the live view stays */
        }
      }),
    );
  }

  /** Mark tiles whose <video> is actually playing so the status can say "connecting" until then. */
  private _checkLive() {
    if (!this._config) return;
    let changed = false;
    const next: Record<string, boolean> = { ...this._live };
    for (const child of this._config.children) {
      const el = this.renderRoot.querySelector(`[data-child="${CSS.escape(child.name)}"] ha-camera-stream`);
      const v = el ? findVideo(el) : null;
      const live = !!(v && v.readyState >= 2 && !v.paused);
      if (next[child.name] !== live) {
        next[child.name] = live;
        changed = true;
      }
    }
    if (changed) this._live = next;
  }

  private _sizeGridSoon() {
    if (this._sizeRaf) return;
    this._sizeRaf = requestAnimationFrame(() => {
      this._sizeRaf = null;
      this._sizeGrid();
    });
  }

  /** On wide screens Focus and Fill take the rest of the viewport below the card; Grid and phones flow naturally. */
  private _sizeGrid() {
    const grid = this.renderRoot.querySelector(".grid") as HTMLElement | null;
    if (!grid) return;
    if (this._layout === "grid" || this._narrow) {
      grid.style.height = "";
      return;
    }
    const w = this.ownerDocument.defaultView || window;
    const r = grid.getBoundingClientRect();
    const top = this._fullscreen || this._popped ? r.top : r.top + (w.scrollY || 0);
    const h = Math.max(240, Math.floor(w.innerHeight - top - 12));
    grid.style.height = `${h}px`;
  }

  // --------------------------------------------------------------- actions

  private _call(domain: string, service: string, data: Record<string, any>) {
    return this.hass!.callService(domain, service, data).catch((e: any) => this._overlay.toast(`Couldn't do that: ${e?.message || e}`, true));
  }

  private _cycleLayout() {
    this._prefs.layout = LAYOUTS[(LAYOUTS.indexOf(this._layout) + 1) % LAYOUTS.length];
    this._save();
  }

  private _cycleNight() {
    const cfg = this._config!;
    if (cfg.night_mode === "auto") {
      // auto → on → off → auto
      const p = this._prefs.night;
      this._prefs.night = p == null ? true : p === true ? false : null;
    } else {
      this._prefs.night = !this._night;
    }
    this._save();
  }

  private _setFilter(name: string) {
    this._prefs.filter = name;
    this._save();
  }

  private _setLocation(child: ChildConfig, key: string) {
    this._cp(child).loc = key;
    this._save();
  }

  private _toggleMute(child: ChildConfig) {
    const p = this._cp(child);
    p.muted = !p.muted;
    if (!p.muted && this._config!.exclusive_audio) {
      for (const c of this._config!.children) if (c !== child) this._cp(c).muted = true;
    }
    this._save();
  }

  private _toggleHd(child: ChildConfig) {
    const p = this._cp(child);
    const loc = this._loc(child);
    if (!p.hd && !this.hass!.states[locationEntities(this._config!, loc).cameraHd]) {
      this._overlay.toast(`No HD stream for ${locationLabel(loc)} yet`);
      return;
    }
    p.hd = !p.hd;
    this._save();
  }

  private _focusOn(child: ChildConfig) {
    this._prefs.focus = child.name;
    this._save();
  }

  private async _fullscreenAll() {
    const root = this.renderRoot.querySelector(".root") as HTMLElement;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await root.requestFullscreen();
    } catch (e: any) {
      this._overlay.toast(`Full screen failed: ${e?.message || e}`, true);
    }
  }

  private async _fullscreenTile(child: ChildConfig) {
    const tile = this.renderRoot.querySelector(`[data-child="${CSS.escape(child.name)}"] .video`) as any;
    const v: any = tile ? findVideo(tile.querySelector("ha-camera-stream")) : null;
    try {
      if (v?.webkitEnterFullscreen && (!tile.requestFullscreen || /iPhone|iPad|iPod/.test(navigator.userAgent))) {
        v.webkitEnterFullscreen();
        return;
      }
      if (tile.requestFullscreen) await tile.requestFullscreen();
      else if (tile.webkitRequestFullscreen) tile.webkitRequestFullscreen();
      else throw new Error("not supported here");
      try {
        await (screen.orientation as any)?.lock?.("landscape");
      } catch (e) {
        /* best effort */
      }
    } catch (e: any) {
      this._overlay.toast(`Full screen failed: ${e?.message || e}`, true);
    }
  }

  private async _popOut() {
    try {
      await togglePopOut({
        card: this,
        feeds: () =>
          this._visibleChildren().map((child) => {
            const el = this.renderRoot.querySelector(`[data-child="${CSS.escape(child.name)}"] ha-camera-stream`);
            return { name: child.name, video: el ? findVideo(el) : null, crying: isCrying(this.hass, this._config!, this._loc(child)) };
          }),
        onChange: (open) => {
          this._popped = open;
          this._sizeGridSoon();
        },
        moveOverlay: (doc) => this._overlay.attach(doc),
      });
    } catch (e: any) {
      this._overlay.toast(`Pop out failed: ${e?.message || e}`, true);
    }
  }

  private _sheetCtx(child: ChildConfig): SheetContext {
    return { hass: () => this.hass!, cfg: this._config!, child, loc: this._loc(child), call: (d, s, data) => this._call(d, s, data) };
  }

  private _openPtz(child: ChildConfig) {
    this._overlay.open(ptzSheet(this._sheetCtx(child)));
  }

  private _openSettings(child: ChildConfig) {
    this._overlay.open(settingsSheet(this._sheetCtx(child)));
  }

  private _openHistory(child: ChildConfig) {
    const cfg = this._config!;
    const labelFor = (id: string) => {
      const l = child.cameras.find((c) => locationEntities(cfg, c).cry === id);
      return l ? locationLabel(l) : id;
    };
    this._refreshHistory(child);
    this._overlay.open(historySheet(this._sheetCtx(child), () => this._cryEpisodes(child).filter((e) => e.start > Date.now() - cfg.events_hours * 36e5 || e.end === null), labelFor, cfg.events_hours));
  }

  // ---------------------------------------------------------------- render

  protected render() {
    if (!this._config) return nothing;
    if (!this.hass) return html`<div class="root"><p class="nostream">Waiting for Home Assistant…</p></div>`;
    const cfg = this._config;
    const layout = this._layout;
    const night = this._night;
    const kids = this._visibleChildren();
    const main = layout === "focus" && kids.length > 1 ? kids.find((c) => c.name === this._prefs.focus) || kids[0] : null;

    return html`<div class=${classMap({ root: true, night, narrow: this._narrow })} data-layout=${layout}>
      ${this._renderHeader(kids, night)}
      <div class="grid" data-n=${String(kids.length)}>
        ${main
          ? html`${this._renderTile(main, "main")}<div class="insets">${kids.filter((c) => c !== main).map((c) => this._renderTile(c, "inset"))}</div>`
          : kids.map((c) => this._renderTile(c, "plain"))}
      </div>
    </div>`;
  }

  private _renderHeader(kids: ChildConfig[], night: boolean): TemplateResult {
    const cfg = this._config!;
    const filter = this._prefs.filter && cfg.children.some((c) => c.name === this._prefs.filter) ? this._prefs.filter : "all";
    const lay = LAYOUT_META[this._layout];
    const nightTitle = cfg.night_mode === "auto" ? (this._prefs.night == null ? "Night mode: automatic" : night ? "Night mode: on" : "Night mode: off") : night ? "Night mode on" : "Night mode off";
    const nightIcon = cfg.night_mode === "auto" && this._prefs.night == null ? I.nightAuto : night ? I.night : I.day;
    return html`<header class="hdr">
      ${cfg.title ? html`<span class="title">${cfg.title}</span>` : nothing}
      ${cfg.children.length > 1
        ? html`<div class="seg" role="tablist" aria-label="Which child to show">
            <button role="tab" class=${classMap({ on: filter === "all" })} aria-selected=${String(filter === "all")} @click=${() => this._setFilter("all")}>${icon(I.kids, 16)} All</button>
            ${cfg.children.map((c) => {
              const crying = c.cameras.some((l) => isCrying(this.hass, cfg, l));
              return html`<button role="tab" class=${classMap({ on: filter === c.name })} aria-selected=${String(filter === c.name)} @click=${() => this._setFilter(c.name)}>
                ${crying ? html`<span class="dot" aria-label="crying"></span>` : nothing}${c.name}
              </button>`;
            })}
          </div>`
        : nothing}
      <div class="tools">
        ${cfg.tv_scripts.map((s) => html`<button class="chip" title=${`Show on ${s.name}`} @click=${() => this._call("script", "turn_on", { entity_id: s.script })}>${icon(I.tv, 18)}<span class="lbl">${s.name}</span></button>`)}
        ${kids.length > 1 ? html`<button class="ib" title=${lay.title} aria-label=${lay.title} @click=${() => this._cycleLayout()}>${icon(lay.icon, 20)}<span class="lbl">${lay.label}</span></button>` : nothing}
        <button class=${classMap({ ib: true, on: night })} title=${nightTitle} aria-label=${nightTitle} aria-pressed=${String(night)} @click=${() => this._cycleNight()}>${icon(nightIcon, 20)}<span class="lbl">Night</span></button>
        <button class=${classMap({ ib: true, on: this._popped })} title="Float as a small window" aria-label="Pop out" @click=${() => this._popOut()}>${icon(I.pip, 20)}</button>
        <button class="ib" title=${this._fullscreen ? "Exit full screen" : "Full screen"} aria-label="Full screen" @click=${() => this._fullscreenAll()}>${icon(this._fullscreen ? I.fullscreenExit : I.fullscreen, 20)}</button>
      </div>
    </header>`;
  }

  private _renderTile(child: ChildConfig, mode: "plain" | "main" | "inset"): TemplateResult {
    const cfg = this._config!;
    const hass = this.hass!;
    const pref = this._cp(child);
    const loc = this._loc(child);
    const ents = locationEntities(cfg, loc);
    const status = locationStatus(hass, cfg, loc, pref.hd);
    const cam = hass.states[status.cameraId];
    const streaming = !!cam && status.kind !== "privacy" && status.kind !== "offline";
    const live = !!this._live[child.name];
    const inset = mode === "inset";
    const accent = child.color ? { "--accent": child.color } : {};
    const readouts = cfg.show_sensors && !inset ? (loc.sensors || []).map((id) => sensorText(hass, id)).filter((t): t is string => !!t) : [];
    const hasPtz = !!hass.states[ents.ptz.left] || !!hass.states[ents.ptz.preset];
    const stretch = !this._narrow && (this._layout === "fill" || mode === "main");

    return html`<section
      class=${classMap({ tile: true, main: mode === "main", inset, crying: status.kind === "crying" })}
      data-child=${child.name}
      style=${styleMap(accent)}
      aria-label=${`${child.name}, ${STATUS_META[status.kind].label}`}
      @click=${inset ? () => this._focusOn(child) : nothing}
    >
      <div class=${classMap({ video: true, stretch, connecting: streaming && !live })}>
        ${streaming
          ? keyed(
              status.cameraId,
              html`<ha-camera-stream .hass=${hass} .stateObj=${cam} .muted=${pref.muted} .controls=${false} .allowExoPlayer=${cfg.native_player}></ha-camera-stream>`,
            )
          : this._renderNoStream(status, loc)}
        <div class="scrim top"></div>
        <div class="scrim bottom"></div>
        <div class="ov-top">
          <div class="who">
            <span class="avatar"></span>
            <span class="name">${child.name}</span>
            ${child.cameras.length > 1 ? html`<span class="where">${locationLabel(loc)}</span>` : nothing}
          </div>
          <div class="quick">
            <button class=${classMap({ ib: true, on: !pref.muted })} title=${pref.muted ? "Unmute" : "Mute"} aria-label=${pref.muted ? "Unmute" : "Mute"} aria-pressed=${String(!pref.muted)} @click=${(e: Event) => { e.stopPropagation(); this._toggleMute(child); }}>${icon(pref.muted ? I.muted : I.sound, 18)}</button>
            <button class="ib" title="Full screen this camera" aria-label="Full screen this camera" @click=${(e: Event) => { e.stopPropagation(); this._fullscreenTile(child); }}>${icon(I.fullscreen, 18)}</button>
          </div>
        </div>
        <div class="ov-bottom">
          ${this._renderStatus(status, streaming && !live)}
          ${status.kind === "privacy"
            ? html`<button class="btn resume" @click=${(e: Event) => { e.stopPropagation(); this._call("switch", "turn_off", { entity_id: ents.privacy }); }}>${icon(I.play, 18)} Resume</button>`
            : nothing}
          ${readouts.length ? html`<div class="readouts">${readouts.map((t) => html`<span class="readout">${t}</span>`)}</div>` : nothing}
        </div>
        ${cfg.show_timeline && !inset ? this._renderTimeline(child) : nothing}
      </div>
      ${inset ? nothing : this._renderFoot(child, loc, pref, hasPtz)}
    </section>`;
  }

  private _renderNoStream(status: Status, loc: LocationConfig): TemplateResult {
    const m = STATUS_META[status.kind];
    const detail =
      status.kind === "missing"
        ? `Looking for ${status.cameraId}`
        : status.kind === "privacy"
          ? "The lens is turned away. Resume to watch."
          : status.kind === "offline"
            ? `${locationLabel(loc)} camera is not responding`
            : "";
    return html`<div class="nostream">${icon(m.icon, 40)}<b>${m.label}</b>${detail ? html`<span>${detail}</span>` : nothing}</div>`;
  }

  private _renderStatus(status: Status, connecting: boolean): TemplateResult {
    const m = STATUS_META[status.kind];
    // _now only exists to trigger re-renders; durations always use the real clock.
    void this._now;
    const since = status.since != null ? Math.max(0, Date.now() - status.since) : null;
    let sub = "";
    if (status.kind === "crying" && since != null) sub = `for ${fmtDur(since)}`;
    else if (status.kind === "quiet" && since != null) sub = `for ${fmtDur(since)}`;
    else if (status.kind === "stirring" && since != null) sub = `quiet for ${fmtDur(since)}`;
    else if (status.kind === "privacy" && since != null) sub = `since ${fmtDur(since)} ago`;
    else if (status.kind === "offline" && since != null) sub = `for ${fmtDur(since)}`;
    if (connecting && (status.kind === "quiet" || status.kind === "live" || status.kind === "stirring")) sub = sub ? `${sub} · connecting…` : "connecting…";
    return html`<div class="status ${status.kind}" role="status">
      <span class="ic">${icon(m.icon, 18)}</span>
      <span class="txt"><span class="label">${m.label}</span>${sub ? html`<span class="sub">${sub}</span>` : nothing}</span>
    </div>`;
  }

  /** Thin strip along the bottom of the video: red marks where crying happened in the last N hours. */
  private _renderTimeline(child: ChildConfig): TemplateResult | typeof nothing {
    const hours = this._config!.timeline_hours;
    const end = this._now;
    const start = end - hours * 36e5;
    const W = 1000;
    const x = (t: number) => Math.max(0, Math.min(W, ((t - start) / (end - start)) * W));
    const eps = this._cryEpisodes(child).filter((e) => e.end === null || e.end > start);
    const ticks: number[] = [];
    const first = new Date(start);
    first.setMinutes(0, 0, 0);
    for (let t = first.getTime() + 36e5; t < end; t += 36e5) if (new Date(t).getHours() % 3 === 0) ticks.push(t);
    return svg`<svg class="tl" viewBox="0 0 ${W} 6" preserveAspectRatio="none" aria-label=${`Crying in the last ${hours} hours: ${eps.length} episode${eps.length === 1 ? "" : "s"}`}>
      <rect class="track" x="0" y="0" width=${W} height="6"></rect>
      ${ticks.map((t) => svg`<line x1=${x(t)} x2=${x(t)} y1="0" y2="6"></line>`)}
      ${eps.map((e) => {
        const a = x(e.start);
        const b = e.end === null ? W : x(e.end);
        return svg`<rect class="ep" x=${a} y="0" width=${Math.max(3, b - a)} height="6"></rect>`;
      })}
    </svg>`;
  }

  private _renderFoot(child: ChildConfig, loc: LocationConfig, pref: ChildPref, hasPtz: boolean): TemplateResult {
    const cfg = this._config!;
    const hass = this.hass!;
    const multi = child.cameras.length > 1;
    const n = this._cryEpisodes(child).filter((e) => e.end === null || e.end > this._now - cfg.timeline_hours * 36e5).length;
    return html`<div class="foot">
      ${multi
        ? html`<div class="locs" role="tablist" aria-label=${`Where ${child.name} is sleeping`}>
            ${child.cameras.map((l) => {
              const on = l.key === loc.key;
              const crying = !on && isCrying(hass, cfg, l);
              return html`<button role="tab" class=${classMap({ loc: true, on })} aria-selected=${String(on)} title=${crying ? `Crying detected in ${locationLabel(l)}` : locationLabel(l)} @click=${() => this._setLocation(child, l.key)}>
                ${locationLabel(l)}${crying ? html`<span class="dot"></span>` : nothing}
              </button>`;
            })}
          </div>`
        : nothing}
      <div class="acts">
        <button class=${classMap({ ib: true, txt: true, on: pref.hd })} title="Switch between HD and low-bandwidth stream" aria-pressed=${String(pref.hd)} @click=${() => this._toggleHd(child)}>HD</button>
        ${hasPtz ? html`<button class="ib" title="Move camera" aria-label="Move camera" @click=${() => this._openPtz(child)}>${icon(I.move, 20)}</button>` : nothing}
        <button class="ib" title="Camera settings" aria-label="Camera settings" @click=${() => this._openSettings(child)}>${icon(I.tune, 20)}</button>
        <button class="ib" title=${`Cry history: ${n} in the last ${cfg.timeline_hours} hours`} aria-label="Cry history" @click=${() => this._openHistory(child)}>${icon(I.history, 20)}${n ? html`<span class="lbl">${n}</span>` : nothing}</button>
      </div>
    </div>`;
  }
}
