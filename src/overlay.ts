// Document-level host for sheets and toasts, so they escape card clipping and
// transforms. One per document; it follows the card into a pop-out window.

import { html, nothing, render, type TemplateResult } from "lit";
import { I, icon } from "./icons";
import { OVERLAY_STYLE } from "./styles";

export interface SheetSpec {
  title: string;
  body: () => TemplateResult;
  onClose?: () => void;
}

interface Toast {
  id: number;
  msg: string;
  err: boolean;
}

export class Overlay {
  private host: HTMLElement;
  private container: HTMLElement;
  private sheet: SheetSpec | null = null;
  private toasts: Toast[] = [];
  private night = false;
  private seq = 0;
  private onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this.sheet) this.close();
  };

  constructor() {
    this.host = document.createElement("div");
    this.host.setAttribute("data-nap-monitor-overlay", "");
    const root = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = OVERLAY_STYLE;
    root.appendChild(style);
    this.container = document.createElement("div");
    root.appendChild(this.container);
    document.addEventListener("keydown", this.onKey);
    this.attach(document);
  }

  /** Move the overlay into another document (pop-out window) or back. */
  attach(doc: Document) {
    if (this.host.ownerDocument !== doc || !this.host.isConnected) doc.body.appendChild(this.host);
    this.render();
  }

  get isOpen() {
    return !!this.sheet;
  }

  setNight(night: boolean) {
    if (this.night !== night) {
      this.night = night;
      this.render();
    }
  }

  open(spec: SheetSpec) {
    this.sheet = spec;
    this.render();
  }

  close() {
    const s = this.sheet;
    this.sheet = null;
    this.render();
    s?.onClose?.();
  }

  /** Re-render the open sheet, e.g. after a state change. */
  refresh() {
    if (this.sheet) this.render();
  }

  toast(msg: string, err = false) {
    const t = { id: ++this.seq, msg, err };
    this.toasts = [...this.toasts, t];
    this.render();
    setTimeout(() => {
      this.toasts = this.toasts.filter((x) => x !== t);
      this.render();
    }, 5000);
  }

  private render() {
    render(
      html`<div class="ov ${this.night ? "night" : ""}">
        ${this.sheet
          ? html`<div class="sheet-wrap" @click=${() => this.close()}>
              <div class="sheet" role="dialog" aria-modal="true" aria-label=${this.sheet.title} @click=${(e: Event) => e.stopPropagation()}>
                <div class="handle"></div>
                <header>
                  <h2>${this.sheet.title}</h2>
                  <button class="ib" title="Close" aria-label="Close" @click=${() => this.close()}>${icon(I.close, 20)}</button>
                </header>
                <div class="body">${this.sheet.body()}</div>
              </div>
            </div>`
          : nothing}
        <div class="toasts" aria-live="polite">
          ${this.toasts.map((t) => html`<div class="toast ${t.err ? "err" : ""}">${t.msg}</div>`)}
        </div>
      </div>`,
      this.container,
    );
  }
}

export function getOverlay(): Overlay {
  const w = window as any;
  if (!w.__napMonitorOverlay) w.__napMonitorOverlay = new Overlay();
  return w.__napMonitorOverlay as Overlay;
}
