// Renders the card in several states and viewports to tests/__artifacts__/*.png
// for visual review. Run with: node tests/screenshots.mjs (after npm run build)
import { chromium } from "playwright";
import { existsSync, mkdirSync } from "node:fs";
import { config, executablePath, makeStates, openPage, pageHtml } from "./fixture.mjs";

const out = "tests/__artifacts__";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: existsSync(executablePath) ? executablePath : undefined });

async function shot(name, { width, height, mutate, before, mobile = false }) {
  const page = await openPage(browser, pageHtml(makeStates()), { viewport: { width, height }, isMobile: mobile, deviceScaleFactor: mobile ? 2 : 1 });
  page.on("pageerror", (e) => console.error(name, "pageerror", e));
  await page.evaluate(async ({ cfg, mutate }) => {
    localStorage.clear();
    const card = document.createElement("nap-monitor-card");
    card.setConfig(cfg);
    document.getElementById("mount").appendChild(card);
    const hass = { ...window.hass, states: { ...window.hass.states } };
    if (mutate) for (const [id, patch] of Object.entries(mutate)) hass.states[id] = { ...hass.states[id], ...patch };
    card.hass = hass;
    window.__card = card;
  }, { cfg: config, mutate });
  await page.waitForTimeout(1500);
  if (before) await page.evaluate(before);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/${name}.png` });
  await page.close();
  console.log("wrote", `${out}/${name}.png`);
}

const ago = (min) => new Date(Date.now() - min * 6e4).toISOString();
const theoCrying = { "binary_sensor.theo_bedroom_baby_crying": { state: "on", last_changed: ago(4) } };
const clickTool = (sel) => `window.__card.shadowRoot.querySelector("${sel}").click()`;

await shot("desktop-grid", { width: 1280, height: 860 });
await shot("desktop-grid-crying", { width: 1280, height: 860, mutate: theoCrying });
await shot("desktop-focus", { width: 1280, height: 860, mutate: theoCrying, before: clickTool(".hdr .tools .ib[title^='Layout']") });
await shot("desktop-night", { width: 1280, height: 860, before: clickTool(".hdr .tools .ib[aria-label^='Night mode']") });
await shot("desktop-privacy", { width: 1280, height: 860, mutate: { "switch.theo_bedroom_privacy_mode": { state: "on", last_changed: ago(12) } } });
await shot("desktop-history-sheet", { width: 1280, height: 860, before: clickTool("[data-child='Mia'] .acts .ib[aria-label='Cry history']") });
await shot("desktop-ptz-sheet", { width: 1280, height: 860, before: clickTool("[data-child='Mia'] .acts .ib[aria-label='Move camera']") });
await shot("desktop-settings-sheet", { width: 1280, height: 860, before: clickTool("[data-child='Mia'] .acts .ib[aria-label='Camera settings']") });
await shot("phone-grid", { width: 390, height: 844, mobile: true, mutate: theoCrying });
await shot("phone-night", { width: 390, height: 844, mobile: true, before: clickTool(".hdr .tools .ib[aria-label^='Night mode']") });
await shot("phone-settings-sheet", { width: 390, height: 844, mobile: true, before: clickTool("[data-child='Mia'] .acts .ib[aria-label='Camera settings']") });
await shot("tablet-fill", { width: 1024, height: 768, before: `${clickTool(".hdr .tools .ib[title^='Layout']")}; ${clickTool(".hdr .tools .ib[title^='Layout']")}` });
await browser.close();
