// Shared fake Home Assistant environment for the card's browser tests.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
export const bundle = readFileSync(join(here, "../custom_components/nap_monitor/frontend/nap-monitor-card.js"), "utf8");

const ago = (ms) => new Date(Date.now() - ms).toISOString();
export const ent = (id, state, attributes = {}, changedAgo = 2 * 36e5) => ({ entity_id: id, state, attributes, last_changed: ago(changedAgo) });

export function makeStates() {
  const states = {};
  for (const k of ["mia_living_room", "mia_bedroom", "mia_primary_bedroom", "theo_bedroom"]) {
    Object.assign(states, {
      [`camera.${k}_fluent`]: ent(`camera.${k}_fluent`, "idle"),
      [`camera.${k}_clear`]: ent(`camera.${k}_clear`, "idle"),
      [`binary_sensor.${k}_baby_crying`]: ent(`binary_sensor.${k}_baby_crying`, "off"),
      [`binary_sensor.${k}_motion`]: ent(`binary_sensor.${k}_motion`, "off"),
      [`switch.${k}_privacy_mode`]: ent(`switch.${k}_privacy_mode`, "off"),
      [`button.${k}_ptz_left`]: ent(`button.${k}_ptz_left`, "unknown"),
      [`button.${k}_ptz_up`]: ent(`button.${k}_ptz_up`, "unknown"),
      [`button.${k}_ptz_stop`]: ent(`button.${k}_ptz_stop`, "unknown"),
      [`button.${k}_guard_go_to`]: ent(`button.${k}_guard_go_to`, "unknown"),
      [`select.${k}_ptz_preset`]: ent(`select.${k}_ptz_preset`, "Crib", { options: ["Crib", "Door"] }),
      [`switch.${k}_auto_tracking`]: ent(`switch.${k}_auto_tracking`, "off"),
      [`number.${k}_baby_cry_sensitivity`]: ent(`number.${k}_baby_cry_sensitivity`, "3", { min: 0, max: 5, step: 1 }),
      [`number.${k}_volume`]: ent(`number.${k}_volume`, "90", { min: 0, max: 100, step: 1 }),
      [`select.${k}_day_night_mode`]: ent(`select.${k}_day_night_mode`, "auto", { options: ["auto", "color", "black_white"] }),
      [`switch.${k}_infrared_lights_in_night_mode`]: ent(`switch.${k}_infrared_lights_in_night_mode`, "on"),
      [`light.${k}_status_led`]: ent(`light.${k}_status_led`, "off"),
      [`switch.${k}_siren_on_event`]: ent(`switch.${k}_siren_on_event`, "off"),
    });
  }
  states["sensor.mia_room_temperature"] = ent("sensor.mia_room_temperature", "70.6", { unit_of_measurement: "°F", friendly_name: "Mia Room Temperature" });
  states["sensor.mia_room_humidity"] = ent("sensor.mia_room_humidity", "44", { unit_of_measurement: "%", friendly_name: "Mia Room Humidity" });
  states["fan.mia_room"] = ent("fan.mia_room", "on", { friendly_name: "Mia Room Fan" });
  states["fan.theo_room"] = ent("fan.theo_room", "off", { friendly_name: "Theo Room Fan" });
  return states;
}

export const config = {
  type: "custom:nap-monitor-card",
  children: [
    { name: "Theo", color: "#7aa2f7", cameras: [{ key: "theo_bedroom", label: "Bedroom", sensors: ["fan.theo_room"] }] },
    {
      name: "Mia",
      color: "#f7a8b8",
      cameras: [
        { key: "mia_living_room", label: "Living room" },
        { key: "mia_bedroom", label: "Nursery", sensors: ["sensor.mia_room_temperature", "sensor.mia_room_humidity", "fan.mia_room"] },
        { key: "mia_primary_bedroom", label: "Primary bedroom" },
      ],
    },
  ],
  night_mode: "off",
  events_hours: 24,
};

/** Page HTML with a fake ha-camera-stream that renders a synthetic, playing <video>. */
export function pageHtml(states, { seedEpisodes = true } = {}) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{margin:0;background:#111318;color:#eee;font-family:system-ui,sans-serif} #mount{height:100vh}</style></head><body>
<script>
  class FakeStream extends HTMLElement {
    constructor(){ super(); this.attachShadow({mode:'open'}); }
    set hass(v){ this._hass=v }
    set muted(v){ this._muted=v; if (this._v) this._v.muted = v }
    set stateObj(v){
      this.dataset.entity = v.entity_id;
      if (this._v) return;
      const c = document.createElement('canvas'); c.width = 640; c.height = 360;
      const ctx = c.getContext('2d');
      const seed = [...v.entity_id].reduce((a,ch)=>a+ch.charCodeAt(0),0);
      const draw = () => {
        const g = ctx.createLinearGradient(0,0,640,360);
        g.addColorStop(0, 'hsl(' + (seed % 360) + ',22%,18%)'); g.addColorStop(1, 'hsl(' + ((seed+60) % 360) + ',18%,8%)');
        ctx.fillStyle = g; ctx.fillRect(0,0,640,360);
        ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(120,140,400,170); ctx.fillRect(140,120,360,30);
        ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.beginPath(); ctx.ellipse(320,230,60,38,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.font = '14px monospace'; ctx.fillText(v.entity_id + '  ' + new Date().toLocaleTimeString(), 16, 348);
      };
      draw(); setInterval(draw, 500);
      const vid = document.createElement('video'); vid.muted = this._muted !== false; vid.autoplay = true; vid.playsInline = true;
      vid.style.cssText = 'display:block;width:100%;height:100%;object-fit:cover';
      vid.srcObject = c.captureStream(10); this.shadowRoot.appendChild(vid); this._v = vid; vid.play().catch(()=>{});
    }
  }
  customElements.define("ha-camera-stream", FakeStream);
  window.__calls = [];
  const now = () => Date.now() / 1000;
  window.hass = {
    states: ${JSON.stringify(states)},
    callService: (d, s, data) => { window.__calls.push([d, s, data]); return Promise.resolve(); },
    callWS: (msg) => {
      if (msg.type === "logbook/get_events" && ${seedEpisodes}) {
        const out = [];
        for (const id of msg.entity_ids) {
          if (id.includes('living_room')) { out.push({ entity_id: id, state: "on", when: now() - 5*3600 }, { entity_id: id, state: "off", when: now() - 5*3600 + 420 }); }
          if (id.includes('mia_bedroom')) { out.push({ entity_id: id, state: "on", when: now() - 9.5*3600 }, { entity_id: id, state: "off", when: now() - 9.5*3600 + 900 }); }
          if (id.includes('theo')) { out.push({ entity_id: id, state: "on", when: now() - 2*3600 }, { entity_id: id, state: "off", when: now() - 2*3600 + 180 }); }
        }
        return Promise.resolve(out.sort((a,b)=>a.when-b.when));
      }
      return Promise.resolve([]);
    },
  };
</script>
<script type="module">${bundle}</script>
<div id="mount"></div>
</body></html>`;
}

export const executablePath = process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium";

/** Open a page at a real http origin (so localStorage works) serving the given HTML. */
export async function openPage(browser, html, options = {}) {
  const page = await browser.newPage(options);
  await page.route("http://nap-monitor.test/**", (route) => route.fulfill({ status: 200, contentType: "text/html; charset=utf-8", body: html }));
  await page.goto("http://nap-monitor.test/");
  return page;
}
