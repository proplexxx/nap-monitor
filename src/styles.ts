// Design tokens follow the active Home Assistant theme; night mode overrides them
// with a dim amber palette and tints the video so the screen can sit on a nightstand.

const TOKENS = `
  --nm-bg: var(--card-background-color, #1c1f26);
  --nm-fg: var(--primary-text-color, #f3f4f6);
  --nm-fg2: var(--secondary-text-color, #9aa3b2);
  --nm-line: var(--divider-color, rgba(127,127,127,.28));
  --nm-chip: rgba(127,127,127,.14);
  --nm-accent: var(--primary-color, #7aa2f7);
  --nm-cry: var(--error-color, #ef5350);
  --nm-stir: var(--warning-color, #ffb300);
  --nm-quiet: var(--success-color, #43a047);
  --nm-muted: #8b8fa3;
  --nm-radius: var(--ha-card-border-radius, 16px);
  --nm-font: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, system-ui, -apple-system, sans-serif));
  --nm-video-filter: none;
  --nm-gap: 12px;
  --nm-ink: #fff;
`;

const NIGHT_TOKENS = `
  --nm-bg: #09070b;
  --nm-fg: #e6b78f;
  --nm-fg2: #9b7556;
  --nm-line: rgba(230,183,143,.18);
  --nm-chip: rgba(230,183,143,.08);
  --nm-accent: #e6b78f;
  --nm-quiet: #a86f3a;
  --nm-stir: #d9922e;
  --nm-cry: #d8453a;
  --nm-ink: #f3d7bd;
  --nm-video-filter: brightness(.55) sepia(.75) saturate(1.5) hue-rotate(-22deg);
`;

export const STYLE = `
:host { display: block; height: 100%; }
* { box-sizing: border-box; }
button { font: inherit; }
.root {
  ${TOKENS}
  font-family: var(--nm-font);
  color: var(--nm-fg);
  display: flex; flex-direction: column; gap: var(--nm-gap);
  height: 100%; min-height: 0; padding: 8px;
  -webkit-tap-highlight-color: transparent;
}
.root.night { ${NIGHT_TOKENS} background: var(--nm-bg); border-radius: var(--nm-radius); }
.root:fullscreen { background: #000; padding: 12px; }

/* header */
.hdr { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-height: 44px; }
.hdr .title { font-size: 20px; font-weight: 700; letter-spacing: -.01em; margin-right: 4px; }
.seg { display: inline-flex; background: var(--nm-chip); border-radius: 999px; padding: 3px; gap: 2px; }
.seg button { position: relative; border: 0; background: transparent; color: var(--nm-fg2); padding: 8px 14px; border-radius: 999px; font-size: 14px; font-weight: 600; cursor: pointer; line-height: 1; display: inline-flex; align-items: center; gap: 6px; }
.seg button.on { background: var(--nm-bg); color: var(--nm-fg); box-shadow: 0 1px 3px rgba(0,0,0,.35); }
.seg button .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--nm-cry); box-shadow: 0 0 0 0 var(--nm-cry); animation: ping 1.6s infinite; }
.tools { margin-left: auto; display: flex; gap: 6px; align-items: center; }
.ib { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 40px; min-width: 40px; padding: 0 10px; border-radius: 12px; border: 1px solid var(--nm-line); background: var(--nm-chip); color: var(--nm-fg); cursor: pointer; font-size: 13px; font-weight: 600; white-space: nowrap; }
.ib.on { background: var(--nm-fg); color: var(--nm-bg); border-color: transparent; }
.ib .lbl { display: inline; }
.ib:focus-visible, .seg button:focus-visible, .loc:focus-visible, .btn:focus-visible { outline: 2px solid var(--nm-accent); outline-offset: 2px; }
.chip { display: inline-flex; align-items: center; gap: 6px; height: 40px; padding: 0 14px; border-radius: 999px; border: 1px solid var(--nm-line); background: transparent; color: var(--nm-fg); cursor: pointer; font-size: 14px; }

/* tiles */
.grid { display: grid; gap: var(--nm-gap); flex: 1; min-height: 0; align-content: start; grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr)); }
.grid[data-n='1'] { grid-template-columns: 1fr; }
.tile { display: flex; flex-direction: column; min-width: 0; border-radius: var(--nm-radius); overflow: hidden; background: var(--nm-bg); border: 1px solid var(--nm-line); transition: box-shadow .3s, border-color .3s; }
.tile.crying { border-color: var(--nm-cry); box-shadow: 0 0 0 2px var(--nm-cry), 0 0 28px rgba(239,83,80,.35); animation: breathe 1.6s ease-in-out infinite; }
@keyframes breathe { 50% { box-shadow: 0 0 0 2px var(--nm-cry), 0 0 8px rgba(239,83,80,.15); } }
@keyframes ping { 70% { box-shadow: 0 0 0 6px rgba(239,83,80,0); } 100% { box-shadow: 0 0 0 0 rgba(239,83,80,0); } }
@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
@media (prefers-reduced-motion: reduce) { .tile.crying, .seg button .dot, .video.connecting::after { animation: none !important; } }

.video { position: relative; aspect-ratio: 16 / 9; background: #000; overflow: hidden; --video-max-height: none; }
.video ha-camera-stream { display: block; width: 100%; height: 100%; filter: var(--nm-video-filter); transition: filter .4s; }
/* Stretched tiles (Focus main, Fill): the video box takes the tile's height and the
   stream is sized by a ResizeObserver to cover or fit it, avoiding CSS sizing cycles. */
.video.stretch:not(:fullscreen) { aspect-ratio: auto; flex: 1 1 auto; min-height: 0; }
.video.stretch:not(:fullscreen) ha-camera-stream { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: var(--nm-stream-w, 100%); height: auto; }
.video.connecting::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent); animation: shimmer 1.6s infinite; pointer-events: none; }
.video:fullscreen, .video:-webkit-full-screen { aspect-ratio: auto; width: 100vw; height: 100vh; background: #000; display: flex; align-items: center; justify-content: center; }
.video:fullscreen ha-camera-stream, .video:-webkit-full-screen ha-camera-stream { width: min(100vw, 177.78vh); height: auto; max-height: 100vh; }
.scrim { position: absolute; left: 0; right: 0; height: 40%; pointer-events: none; z-index: 1; }
.scrim.top { top: 0; background: linear-gradient(rgba(0,0,0,.55), transparent); }
.scrim.bottom { bottom: 0; background: linear-gradient(transparent, rgba(0,0,0,.7)); }
.nostream { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #9aa3b2; text-align: center; padding: 16px; font-size: 14px; }
.nostream b { color: #cfd3dc; font-size: 15px; }

.ov-top { position: absolute; top: 10px; left: 12px; right: 10px; display: flex; align-items: center; gap: 8px; z-index: 2; }
.who { display: flex; align-items: center; gap: 8px; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.6); font-weight: 700; font-size: 16px; min-width: 0; }
.who .avatar { width: 10px; height: 10px; border-radius: 50%; background: var(--accent, var(--nm-accent)); flex: none; box-shadow: 0 0 0 2px rgba(0,0,0,.35); }
.who .name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.who .where { font-weight: 500; font-size: 12px; padding: 3px 9px; border-radius: 999px; background: rgba(0,0,0,.4); backdrop-filter: blur(6px); white-space: nowrap; }
.quick { margin-left: auto; display: flex; gap: 6px; }
.quick .ib { width: 36px; height: 36px; min-width: 36px; padding: 0; border: 0; background: rgba(0,0,0,.45); color: #fff; backdrop-filter: blur(6px); }
.quick .ib.on { background: #fff; color: #111; }

.ov-bottom { position: absolute; left: 12px; right: 12px; bottom: 16px; display: flex; align-items: flex-end; gap: 8px; z-index: 2; }
.status { display: inline-flex; align-items: center; gap: 10px; padding: 7px 14px 7px 8px; border-radius: 999px; background: rgba(0,0,0,.55); backdrop-filter: blur(8px); color: #fff; font-size: 15px; font-weight: 600; line-height: 1.1; max-width: 100%; }
.status .ic { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; background: var(--nm-muted); flex: none; }
.status .txt { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.status .sub { font-weight: 500; font-size: 12px; opacity: .8; white-space: nowrap; }
.status.quiet .ic { background: var(--nm-quiet); }
.status.live .ic { background: var(--nm-quiet); }
.status.stirring .ic { background: var(--nm-stir); color: #222; }
.status.crying { background: var(--nm-cry); }
.status.crying .ic { background: rgba(255,255,255,.25); }
.status.privacy .ic, .status.offline .ic, .status.missing .ic { background: var(--nm-muted); }
.readouts { margin-left: auto; display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
.readout { padding: 4px 9px; border-radius: 999px; background: rgba(0,0,0,.45); backdrop-filter: blur(6px); color: #fff; font-size: 12px; font-weight: 500; white-space: nowrap; }
.btn { display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 10px; border: 1px solid var(--nm-line); background: var(--nm-chip); color: var(--nm-fg); cursor: pointer; font-size: 14px; font-weight: 600; }
.btn.resume { background: #fff; color: #111; border-color: transparent; }

.tl { position: absolute; left: 0; right: 0; bottom: 0; height: 6px; z-index: 2; display: block; }
.tl rect.track { fill: rgba(255,255,255,.14); }
.tl rect.ep { fill: var(--nm-cry); }
.tl line { stroke: rgba(255,255,255,.18); stroke-width: 1; }

/* under the video */
.foot { display: flex; align-items: center; gap: 8px; padding: 8px 10px; flex-wrap: wrap; }
.locs { display: flex; gap: 4px; flex-wrap: wrap; }
.loc { position: relative; border: 1px solid var(--nm-line); background: transparent; color: var(--nm-fg2); border-radius: 999px; padding: 7px 12px; font-size: 13px; cursor: pointer; line-height: 1; }
.loc.on { background: var(--nm-fg); color: var(--nm-bg); border-color: transparent; font-weight: 600; }
.loc .dot { position: absolute; top: -3px; right: -3px; width: 9px; height: 9px; border-radius: 50%; background: var(--nm-cry); box-shadow: 0 0 0 2px var(--nm-bg); }
.acts { margin-left: auto; display: flex; gap: 4px; }
.acts .ib { height: 36px; min-width: 36px; padding: 0 8px; border-radius: 10px; background: transparent; color: var(--nm-fg2); }
.acts .ib.on { background: var(--nm-fg); color: var(--nm-bg); border-color: transparent; }
.acts .ib.txt { font-weight: 700; font-size: 12px; letter-spacing: .02em; }

/* focus layout: one big tile, the rest stacked beside it */
.root[data-layout='focus'] .grid { grid-template-columns: minmax(0, 1fr) minmax(200px, 26%); grid-template-rows: minmax(0, 1fr); align-content: stretch; }
.root[data-layout='focus'] .grid[data-n='1'] { grid-template-columns: 1fr; }
.root[data-layout='focus'] .tile.main { grid-column: 1; grid-row: 1; min-height: 0; }
.root[data-layout='focus'] .insets { grid-column: 2; grid-row: 1; display: flex; flex-direction: column; gap: var(--nm-gap); min-width: 0; min-height: 0; overflow: auto; }
.tile.inset { cursor: pointer; }
.tile.inset .foot, .tile.inset .quick, .tile.inset .readouts, .tile.inset .status .sub, .tile.inset .tl { display: none; }
.tile.inset .who { font-size: 13px; }
.tile.inset .who .where { display: none; }
.tile.inset .status { font-size: 12px; padding: 4px 10px 4px 5px; gap: 6px; }
.tile.inset .status .ic { width: 20px; height: 20px; }
.tile.inset .status .ic svg { width: 14px; height: 14px; }
.tile.inset .ov-bottom { bottom: 8px; left: 8px; right: 8px; }
.tile.inset .ov-top { top: 6px; left: 8px; right: 6px; }
.root.narrow[data-layout='focus'] .grid { grid-template-columns: 1fr; grid-template-rows: auto auto; align-content: start; }
.root.narrow[data-layout='focus'] .insets { grid-column: 1; grid-row: 2; flex-direction: row; overflow: visible; }
.root.narrow[data-layout='focus'] .insets .tile { flex: 1; min-width: 0; }

/* fill layout: tiles stretch to the available height */
.root:not(.narrow)[data-layout='fill'] .grid { grid-auto-rows: minmax(0, 1fr); align-content: stretch; }
.root:not(.narrow)[data-layout='fill'] .tile { min-height: 0; }

/* night */
.root.night .tile { border-color: var(--nm-line); }
.root.night .who, .root.night .status { color: var(--nm-ink); }
.root.night .status { background: rgba(10,6,4,.7); }
.root.night .status.crying { background: var(--nm-cry); color: #fff; }
.root.night .quick .ib, .root.night .readout { background: rgba(10,6,4,.6); color: var(--nm-ink); }
.root.night .scrim.top { background: linear-gradient(rgba(0,0,0,.7), transparent); }
.root.night .tools .ib:not(.on), .root.night .acts .ib:not(.on), .root.night .seg { opacity: .75; }
.root.night .hdr .title { color: var(--nm-fg2); }

@media (max-width: 600px) {
  .root { padding: 4px; --nm-gap: 8px; }
  .ib .lbl { display: none; }
  .ib { padding: 0; min-width: 40px; }
  .seg button { padding: 8px 11px; }
  .status { font-size: 14px; }
  .hdr .title { font-size: 17px; }
  .who { font-size: 14px; }
  .readouts { display: none; }
}
`;

export const OVERLAY_STYLE = `
* { box-sizing: border-box; }
button { font: inherit; }
.ov { ${TOKENS} position: fixed; inset: 0; z-index: 9999; pointer-events: none; font-family: var(--nm-font); color: var(--nm-fg); }
.ov.night { ${NIGHT_TOKENS} }
.sheet-wrap { position: absolute; inset: 0; background: rgba(0,0,0,.5); pointer-events: auto; display: flex; align-items: center; justify-content: center; animation: fade .15s; }
.sheet { width: min(560px, 94vw); max-height: 86vh; overflow: auto; background: var(--nm-bg); color: var(--nm-fg); border-radius: 22px; padding: 14px 18px 22px; box-shadow: 0 24px 60px rgba(0,0,0,.5); animation: pop .18s; }
.handle { display: none; }
.sheet header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.sheet h2 { margin: 0; font-size: 18px; font-weight: 700; flex: 1; letter-spacing: -.01em; }
.ib { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 12px; border: 1px solid var(--nm-line); background: var(--nm-chip); color: var(--nm-fg); cursor: pointer; padding: 0; }
.row { display: flex; align-items: center; gap: 12px; padding: 11px 0; border-top: 1px solid var(--nm-line); }
.row:first-child, .section + .row { border-top: 0; }
.row label { flex: 1; font-size: 15px; }
.hint { display: block; color: var(--nm-fg2); font-size: 12px; margin-top: 2px; }
.hint.center { text-align: center; margin: -4px 0 12px; }
.row input[type=range] { width: 150px; accent-color: var(--nm-accent); }
.row .val { width: 34px; text-align: right; color: var(--nm-fg2); font-variant-numeric: tabular-nums; }
select { font: inherit; font-size: 14px; color: var(--nm-fg); background: var(--nm-bg); border: 1px solid var(--nm-line); border-radius: 10px; padding: 7px 10px; }
.switch { width: 46px; height: 26px; border-radius: 13px; border: 0; background: var(--nm-line); position: relative; cursor: pointer; padding: 0; flex: none; }
.switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: left .15s; }
.switch.on { background: var(--nm-quiet); }
.switch.on::after { left: 23px; }
.section { color: var(--nm-fg2); font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; margin: 18px 0 2px; }
.section:first-child { margin-top: 4px; }
.pad { display: grid; grid-template-columns: repeat(3, 68px); grid-template-rows: repeat(3, 68px); gap: 8px; justify-content: center; margin: 8px 0 10px; }
.pad button { border-radius: 18px; border: 1px solid var(--nm-line); background: var(--nm-chip); color: var(--nm-fg); cursor: pointer; display: grid; place-items: center; touch-action: none; user-select: none; -webkit-user-select: none; }
.pad button:active { background: var(--nm-fg); color: var(--nm-bg); }
.pad .c1 { grid-column: 1; grid-row: 2; } .pad .c2 { grid-column: 2; grid-row: 1; } .pad .c3 { grid-column: 3; grid-row: 2; } .pad .c4 { grid-column: 2; grid-row: 3; } .pad .c5 { grid-column: 2; grid-row: 2; }
.btnrow { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
.btn { display: inline-flex; align-items: center; gap: 6px; height: 38px; padding: 0 14px; border-radius: 12px; border: 1px solid var(--nm-line); background: var(--nm-chip); color: var(--nm-fg); cursor: pointer; font-size: 14px; font-weight: 600; }
.empty { color: var(--nm-fg2); font-size: 14px; padding: 8px 0; margin: 0; }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 4px 0 6px; }
.stats div { background: var(--nm-chip); border-radius: 14px; padding: 12px; display: flex; flex-direction: column; gap: 2px; }
.stats b { font-size: 22px; font-weight: 700; letter-spacing: -.02em; }
.stats span { color: var(--nm-fg2); font-size: 12px; }
.events { list-style: none; margin: 0; padding: 0; }
.events li { display: flex; gap: 12px; padding: 10px 0; border-top: 1px solid var(--nm-line); font-size: 14px; align-items: baseline; }
.events li:first-child { border-top: 0; }
.events .t { color: var(--nm-fg2); width: 84px; font-variant-numeric: tabular-nums; flex: none; }
.events .w { flex: 1; }
.events .d { color: var(--nm-fg2); font-variant-numeric: tabular-nums; }
.events .d.live { color: var(--nm-cry); font-weight: 600; }
.toasts { position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%); display: flex; flex-direction: column; gap: 8px; align-items: center; }
.toast { background: #2a2d35; color: #fff; padding: 10px 16px; border-radius: 12px; font-size: 14px; box-shadow: 0 8px 24px rgba(0,0,0,.4); animation: up .2s; max-width: 90vw; }
.toast.err { background: var(--nm-cry); }
@keyframes fade { from { opacity: 0; } }
@keyframes pop { from { opacity: 0; transform: translateY(8px) scale(.98); } }
@keyframes up { from { opacity: 0; transform: translateY(8px); } }
@media (max-width: 600px) {
  .sheet-wrap { align-items: flex-end; }
  .sheet { width: 100%; max-height: 92vh; border-radius: 22px 22px 0 0; padding-bottom: max(22px, env(safe-area-inset-bottom)); animation: slide .2s; }
  .handle { display: block; width: 40px; height: 4px; border-radius: 2px; background: var(--nm-line); margin: 0 auto 12px; }
  @keyframes slide { from { transform: translateY(24px); opacity: 0; } }
}
@media (prefers-reduced-motion: reduce) { .sheet-wrap, .sheet, .toast { animation: none !important; } }
`;
