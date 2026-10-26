// Smoke test for the built card in headless Chromium against a fake Home Assistant.
// Run with: npm test   (after npm run build)
import { chromium } from "playwright";
import { existsSync } from "node:fs";
import { config, executablePath, makeStates, openPage, pageHtml } from "./fixture.mjs";

const browser = await chromium.launch({ executablePath: existsSync(executablePath) ? executablePath : undefined });
const page = await openPage(browser, pageHtml(makeStates()), { viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

const result = await page.evaluate(async (cfg) => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const q = (s) => sr.querySelector(s);
  const qa = (s) => [...sr.querySelectorAll(s)];
  const txt = (s) => q(s)?.textContent.trim().replace(/\s+/g, " ");
  const card = document.createElement("nap-monitor-card");
  card.setConfig(cfg);
  document.getElementById("mount").appendChild(card);
  card.hass = window.hass;
  await sleep(300);
  const sr = card.shadowRoot;
  const out = {};
  try {
  out.registered = !!window.customCards.find((c) => c.type === "nap-monitor-card");
  out.tiles = qa(".tile").length;
  out.streams = qa("ha-camera-stream").map((s) => s.dataset.entity);
  out.where = txt('[data-child="Mia"] .where');
  out.locChips = qa('[data-child="Mia"] .loc').map((b) => b.textContent.trim());
  out.statusLabels = qa(".status .label").map((l) => l.textContent);
  out.statusSubs = qa(".status .sub").map((l) => l.textContent);
  out.segButtons = qa(".seg button").map((b) => b.textContent.trim());
  out.readouts = qa('[data-child="Theo"] .readout').map((r) => r.textContent);
  await sleep(1500);
  out.connectingAfterPlay = qa(".video.connecting").length;
  out.timelineEpisodes = qa('[data-child="Theo"] .tl rect.ep').length;
  out.historyCount = txt('[data-child="Theo"] .acts .ib[title^="Cry history"] .lbl');

  // Theo starts crying: tile, status, header dot.
  const h2 = { ...window.hass, states: { ...window.hass.states } };
  h2.states["binary_sensor.theo_bedroom_baby_crying"] = { ...h2.states["binary_sensor.theo_bedroom_baby_crying"], state: "on", last_changed: new Date(Date.now() - 4 * 6e4).toISOString() };
  card.hass = h2;
  await sleep(100);
  out.cryingTiles = qa(".tile.crying").length;
  out.cryStatus = `${txt('[data-child="Theo"] .status .label')} ${txt('[data-child="Theo"] .status .sub')}`;
  out.headerDot = !!q(".seg button .dot");

  // Mia's nursery cam cries while the living room is selected: the tile follows.
  const h3 = { ...h2, states: { ...h2.states } };
  h3.states["binary_sensor.mia_bedroom_baby_crying"] = { ...h3.states["binary_sensor.mia_bedroom_baby_crying"], state: "on", last_changed: new Date().toISOString() };
  card.hass = h3;
  await sleep(100);
  out.followedTo = txt('[data-child="Mia"] .where');
  out.streamsAfterFollow = qa("ha-camera-stream").map((s) => s.dataset.entity);
  out.followReadouts = qa('[data-child="Mia"] .readout').map((r) => r.textContent);

  // Back to quiet; the living-room chip shows a dot when another location cries.
  const h4 = { ...h3, states: { ...h3.states } };
  h4.states["binary_sensor.mia_bedroom_baby_crying"] = { ...h4.states["binary_sensor.mia_bedroom_baby_crying"], state: "off" };
  h4.states["binary_sensor.mia_living_room_baby_crying"] = { ...h4.states["binary_sensor.mia_living_room_baby_crying"], state: "on" };
  card.hass = h4;
  await sleep(100);
  out.dotOnOtherChip = !!q('[data-child="Mia"] .loc:not(.on) .dot');
  out.whereAfterSecondCry = txt('[data-child="Mia"] .where'); // stays: current loc not crying → follows to living room
  const h5 = { ...h4, states: { ...h4.states } };
  h5.states["binary_sensor.mia_living_room_baby_crying"] = { ...h5.states["binary_sensor.mia_living_room_baby_crying"], state: "off" };
  h5.states["binary_sensor.theo_bedroom_baby_crying"] = { ...h5.states["binary_sensor.theo_bedroom_baby_crying"], state: "off" };
  card.hass = h5;
  await sleep(100);

  // Privacy mode replaces the stream with a resume button.
  const h6 = { ...h5, states: { ...h5.states } };
  h6.states["switch.mia_living_room_privacy_mode"] = { ...h6.states["switch.mia_living_room_privacy_mode"], state: "on" };
  card.hass = h6;
  await sleep(100);
  out.privacyLabel = txt('[data-child="Mia"] .status .label');
  out.resumeShown = !!q('[data-child="Mia"] .btn.resume');
  q('[data-child="Mia"] .btn.resume').click();
  card.hass = h5;
  await sleep(100);

  // Layout cycles grid → focus; night cycles auto/on/off (night_mode: off here → toggle).
  q(".hdr .tools .ib[title^='Layout']").click();
  await sleep(100);
  out.layout = q(".root").dataset.layout;
  out.focusMain = q(".tile.main")?.dataset.child;
  out.focusInsets = qa(".insets .tile.inset").map((t) => t.dataset.child);
  q(".hdr .tools .ib[aria-label^='Night mode']").click();
  await sleep(50);
  out.night = q(".root").classList.contains("night");

  // Exclusive audio: unmuting Mia mutes Theo.
  q('[data-child="Mia"] .quick .ib[aria-label="Unmute"]').click();
  await sleep(50);
  out.unmuted = qa(".quick .ib[aria-pressed='true']").length;

  // Back to the grid layout (insets have no action row) for the sheet tests.
  q(".hdr .tools .ib[title^='Layout']").click();
  q(".hdr .tools .ib[title^='Layout']").click();
  await sleep(100);
  out.layoutBack = q(".root").dataset.layout;

  // Sheets render in the document-level overlay.
  const ov = () => document.querySelector("[data-nap-monitor-overlay]").shadowRoot;
  q('[data-child="Mia"] .acts .ib[aria-label="Camera settings"]').click();
  await sleep(50);
  out.settingsTitle = ov().querySelector(".sheet h2").textContent;
  out.settingsSections = [...ov().querySelectorAll(".section")].map((s) => s.textContent);
  out.settingsRows = ov().querySelectorAll(".row").length;
  ov().querySelector(".switch").click();
  ov().querySelector("header .ib").click();
  await sleep(50);
  q('[data-child="Mia"] .acts .ib[aria-label="Move camera"]').click();
  await sleep(50);
  out.ptzPad = !!ov().querySelector(".pad");
  out.ptzPresets = [...ov().querySelectorAll("select option")].map((o) => o.textContent);
  const up = ov().querySelector("[aria-label='Move up']");
  up.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
  up.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  await sleep(50);
  out.sheetClosedByEscape = !ov().querySelector(".sheet");
  q('[data-child="Mia"] .acts .ib[aria-label="Cry history"]').click();
  await sleep(100);
  out.historyStats = [...ov().querySelectorAll(".stats b")].map((b) => b.textContent);
  out.historyRows = [...ov().querySelectorAll(".events li .w")].map((w) => w.textContent);
  out.calls = window.__calls;
  } catch (e) {
    out.__error = String(e && e.stack || e);
  }
  return out;
}, config);

if (result.__error) { console.error("evaluate threw:", result.__error); console.error(JSON.stringify(result, null, 1)); }

await browser.close();

let failed = 0;
const expect = (name, cond) => { if (!cond) { failed++; console.error("FAIL", name, JSON.stringify(result[name])); } else console.log("ok  ", name); };
expect("registered", result.registered);
expect("tiles", result.tiles === 2);
expect("streams", JSON.stringify(result.streams) === JSON.stringify(["camera.theo_bedroom_fluent", "camera.mia_living_room_fluent"]));
expect("where", result.where === "Living room");
expect("locChips", JSON.stringify(result.locChips) === JSON.stringify(["Living room", "Nursery", "Primary bedroom"]));
expect("statusLabels", JSON.stringify(result.statusLabels) === JSON.stringify(["Quiet", "Quiet"]));
expect("statusSubs", result.statusSubs.every((s) => s.startsWith("for 2h")));
expect("segButtons", JSON.stringify(result.segButtons) === JSON.stringify(["All", "Theo", "Mia"]));
expect("readouts", JSON.stringify(result.readouts) === JSON.stringify(["Fan off"]));
expect("connectingAfterPlay", result.connectingAfterPlay === 0);
expect("timelineEpisodes", result.timelineEpisodes === 1);
expect("historyCount", result.historyCount === "1");
expect("cryingTiles", result.cryingTiles === 1);
expect("cryStatus", result.cryStatus === "Crying for 4 min");
expect("headerDot", result.headerDot);
expect("followedTo", result.followedTo === "Nursery");
expect("streamsAfterFollow", JSON.stringify(result.streamsAfterFollow) === JSON.stringify(["camera.theo_bedroom_fluent", "camera.mia_bedroom_fluent"]));
expect("followReadouts", JSON.stringify(result.followReadouts) === JSON.stringify(["71°F", "44%", "Fan on"]));
expect("whereAfterSecondCry", result.whereAfterSecondCry === "Living room");
expect("dotOnOtherChip", result.dotOnOtherChip === false);
expect("privacyLabel", result.privacyLabel === "Privacy on");
expect("resumeShown", result.resumeShown);
expect("layout", result.layout === "focus");
expect("focusMain", result.focusMain === "Theo");
expect("focusInsets", JSON.stringify(result.focusInsets) === JSON.stringify(["Mia"]));
expect("night", result.night);
expect("unmuted", result.unmuted === 1);
expect("layoutBack", result.layoutBack === "grid");
expect("settingsTitle", result.settingsTitle === "Living room camera settings");
expect("settingsSections", JSON.stringify(result.settingsSections) === JSON.stringify(["Listening", "Night", "Detection", "Recording and alerts", "Privacy"]));
expect("settingsRows", result.settingsRows === 8);
expect("ptzPad", result.ptzPad);
expect("ptzPresets", JSON.stringify(result.ptzPresets) === JSON.stringify(["Crib", "Door"]));
expect("sheetClosedByEscape", result.sheetClosedByEscape);
expect("historyStats", JSON.stringify(result.historyStats) === JSON.stringify(["2", "15 min", "22 min"]));
expect("historyRows", JSON.stringify(result.historyRows) === JSON.stringify(["Living room", "Nursery"]));
expect("calls", JSON.stringify(result.calls) === JSON.stringify([
  ["switch", "turn_off", { entity_id: "switch.mia_living_room_privacy_mode" }],
  ["switch", "turn_off", { entity_id: "switch.mia_living_room_infrared_lights_in_night_mode" }],
  ["button", "press", { entity_id: "button.mia_living_room_ptz_up" }],
  ["button", "press", { entity_id: "button.mia_living_room_ptz_stop" }],
]));
if (errors.length) { failed++; console.error("page errors:", errors); }
if (failed) { console.error(`${failed} check(s) failed`); process.exit(1); }
console.log("all checks passed");
