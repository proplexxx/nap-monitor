// Sheet bodies: PTZ, camera settings and cry history. Pure render functions that
// read live state through the context on every refresh.

import { html, nothing, type TemplateResult } from "lit";
import { I, icon } from "./icons";
import { locationEntities, locationLabel, settingRows } from "./model";
import type { CardConfig, ChildConfig, Episode, Hass, LocationConfig } from "./types";
import { fmtDay, fmtDur, fmtTime } from "./utils";

export interface SheetContext {
  hass: () => Hass;
  cfg: CardConfig;
  child: ChildConfig;
  loc: LocationConfig;
  call: (domain: string, service: string, data: Record<string, any>) => Promise<any>;
}

const has = (ctx: SheetContext, id: string) => !!ctx.hass().states[id];

/** Press-and-hold repeat for the PTZ pad. */
class PtzHold {
  private timer: ReturnType<typeof setInterval> | null = null;
  constructor(private ctx: SheetContext) {}
  press(dir: string) {
    const e = locationEntities(this.ctx.cfg, this.ctx.loc).ptz as any;
    return this.ctx.call("button", "press", { entity_id: e[dir] });
  }
  start(dir: string) {
    this.stopTimer();
    this.press(dir);
    this.timer = setInterval(() => this.press(dir), 500);
  }
  release() {
    if (this.timer) {
      this.stopTimer();
      this.press("stop");
    }
  }
  stopTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}

export function ptzSheet(ctx: SheetContext): { title: string; body: () => TemplateResult; onClose: () => void } {
  const hold = new PtzHold(ctx);
  const e = locationEntities(ctx.cfg, ctx.loc).ptz;
  const padBtn = (dir: "up" | "down" | "left" | "right", cls: string) =>
    html`<button
      class=${cls}
      aria-label=${`Move ${dir}`}
      @pointerdown=${(ev: PointerEvent) => {
        ev.preventDefault();
        hold.start(dir);
      }}
      @pointerup=${() => hold.release()}
      @pointerleave=${() => hold.release()}
      @pointercancel=${() => hold.release()}
    >
      ${icon(I[dir], 28)}
    </button>`;
  return {
    title: `${ctx.child.name} · ${locationLabel(ctx.loc)}`,
    onClose: () => hold.stopTimer(),
    body: () => {
      const st = ctx.hass().states;
      const preset = st[e.preset];
      const track = st[e.autoTrack];
      return html`
        ${has(ctx, e.left)
          ? html`<div class="pad">
              ${padBtn("up", "c2")} ${padBtn("left", "c1")}
              <button class="c5" aria-label="Stop" @click=${() => hold.press("stop")}>${icon(I.stop, 24)}</button>
              ${padBtn("right", "c3")} ${padBtn("down", "c4")}
            </div>
            <p class="hint center">Hold a direction to keep moving.</p>`
          : html`<p class="empty">This camera has no pan or tilt controls in Home Assistant.</p>`}
        ${preset
          ? html`<div class="row">
              <label>Preset position</label>
              <select @change=${(ev: Event) => ctx.call("select", "select_option", { entity_id: e.preset, option: (ev.target as HTMLSelectElement).value })}>
                ${(preset.attributes.options || []).map((o: string) => html`<option ?selected=${o === preset.state}>${o}</option>`)}
              </select>
            </div>`
          : nothing}
        ${track
          ? html`<div class="row">
              <label>Follow movement<span class="hint">Camera turns to keep motion in view</span></label>
              ${toggle(track.state === "on", () => ctx.call("switch", track.state === "on" ? "turn_off" : "turn_on", { entity_id: e.autoTrack }))}
            </div>`
          : nothing}
        <div class="btnrow">
          ${has(ctx, e.guardGo) ? html`<button class="btn" @click=${() => ctx.call("button", "press", { entity_id: e.guardGo })}>${icon(I.home, 18)} Go home</button>` : nothing}
          ${has(ctx, e.guardSet) ? html`<button class="btn" @click=${() => ctx.call("button", "press", { entity_id: e.guardSet })}>${icon(I.save, 18)} Save as home</button>` : nothing}
          ${has(ctx, e.calibrate) ? html`<button class="btn" @click=${() => ctx.call("button", "press", { entity_id: e.calibrate })}>${icon(I.calibrate, 18)} Recalibrate</button>` : nothing}
        </div>
      `;
    },
  };
}

function toggle(on: boolean, onChange: () => void): TemplateResult {
  return html`<button class="switch ${on ? "on" : ""}" role="switch" aria-checked=${String(on)} @click=${onChange}></button>`;
}

export function settingsSheet(ctx: SheetContext): { title: string; body: () => TemplateResult } {
  return {
    title: `${locationLabel(ctx.loc)} camera settings`,
    body: () => {
      const st = ctx.hass().states;
      const rows = settingRows(ctx.loc.key).filter((r) => !!st[r.id]);
      if (!rows.length) return html`<p class="empty">No adjustable settings found for this camera.</p>`;
      const sections = [...new Set(rows.map((r) => r.section))];
      return html`${sections.map(
        (sec) => html`
          <div class="section">${sec}</div>
          ${rows
            .filter((r) => r.section === sec)
            .map((r) => {
              const s = st[r.id];
              const dom = r.id.split(".")[0];
              const label = html`<label>${r.label}${r.hint ? html`<span class="hint">${r.hint}</span>` : nothing}</label>`;
              if (dom === "number") {
                const a = s.attributes;
                return html`<div class="row">
                  ${label}
                  <input
                    type="range"
                    min=${a.min ?? 0}
                    max=${a.max ?? 100}
                    step=${a.step ?? 1}
                    .value=${s.state}
                    @input=${(ev: Event) => {
                      const el = ev.target as HTMLInputElement;
                      (el.nextElementSibling as HTMLElement).textContent = el.value;
                    }}
                    @change=${(ev: Event) => ctx.call("number", "set_value", { entity_id: r.id, value: Number((ev.target as HTMLInputElement).value) })}
                  />
                  <span class="val">${s.state}</span>
                </div>`;
              }
              if (dom === "select") {
                return html`<div class="row">
                  ${label}
                  <select @change=${(ev: Event) => ctx.call("select", "select_option", { entity_id: r.id, option: (ev.target as HTMLSelectElement).value })}>
                    ${(s.attributes.options || []).map((o: string) => html`<option ?selected=${o === s.state}>${o}</option>`)}
                  </select>
                </div>`;
              }
              const on = s.state === "on";
              return html`<div class="row">${label}${toggle(on, () => ctx.call(dom === "light" ? "light" : "switch", on ? "turn_off" : "turn_on", { entity_id: r.id }))}</div>`;
            })}
        `,
      )}`;
    },
  };
}

export function historySheet(
  ctx: SheetContext,
  episodes: () => Episode[],
  labelFor: (entityId: string) => string,
  hours: number,
): { title: string; body: () => TemplateResult } {
  return {
    title: `${ctx.child.name}: last ${hours} hours`,
    body: () => {
      const items = episodes();
      if (!items.length) return html`<p class="empty">No crying in the last ${hours} hours.</p>`;
      const now = Date.now();
      const durs = items.filter((i) => i.end !== null).map((i) => i.end! - i.start);
      const longest = durs.length ? Math.max(...durs) : 0;
      const total = durs.reduce((a, b) => a + b, 0);
      const days = [...new Set(items.map((i) => fmtDay(i.start, now)))];
      return html`
        <div class="stats">
          <div><b>${items.length}</b><span>cries</span></div>
          <div><b>${longest ? fmtDur(longest) : "–"}</b><span>longest</span></div>
          <div><b>${total ? fmtDur(total) : "–"}</b><span>total</span></div>
        </div>
        ${days.map(
          (day) => html`
            <div class="section">${day}</div>
            <ul class="events">
              ${items
                .filter((i) => fmtDay(i.start, now) === day)
                .map(
                  (i) => html`<li>
                    <span class="t">${fmtTime(i.start)}</span>
                    <span class="w">${labelFor(i.entityId)}</span>
                    <span class="d ${i.end === null ? "live" : ""}">${i.end === null ? "still going" : fmtDur(i.end - i.start)}</span>
                  </li>`,
                )}
            </ul>
          `,
        )}
      `;
    },
  };
}
