# Nap Monitor

A nursery camera monitor for Home Assistant built for parents: one tile per child, several
sleep locations per child, cry awareness, night dimming, PTZ and camera settings without
leaving the dashboard. Everything stays local (go2rtc WebRTC, RTSP, Reolink, Frigate).

> **Status: phase 0.** The card is configured in YAML and the integration only serves it.
> Children, locations and cameras move into the integration's UI in phase 1. See
> [PLAN.md](PLAN.md).

## Install

1. HACS → Integrations → ⋮ → *Custom repositories* → add this repo as **Integration**.
2. Download **Nap Monitor**, restart Home Assistant.
3. Settings → Devices & services → *Add integration* → **Nap Monitor**. This registers the
   card on every dashboard, so no manual resource entry is needed.
4. Add a card with `type: custom:nap-monitor-card` (see below).

Card-only use without the integration: copy
`custom_components/nap_monitor/frontend/nap-monitor-card.js` to `www/` and add
`/local/nap-monitor-card.js` as a dashboard resource (module).

## The card

One tile per child. The tile shows whichever of that child's sleep locations is selected,
with a status pill (Crying · for 4 min, Quiet · for 2h, Stirring, Privacy on, Camera
offline), a thin strip along the bottom of the video marking cries in the last 12 hours,
optional room readouts (temperature, humidity, fan…), and location chips to switch beds.
When another of the child's cameras detects crying the tile follows it automatically.

- **Layouts**: Grid, Focus (one big tile, the others beside it, tap to swap) and Fill
  (tiles stretch to the screen for a wall tablet). The layout button cycles them.
- **Night mode**: dim amber UI with the video tinted so the screen can sit on a
  nightstand. Automatic on a schedule, or toggled from the header.
- **Audio**: one tile at a time; unmuting one mutes the others.
- **Sheets**: pan/tilt pad with press-and-hold and presets, camera settings grouped by
  Listening / Night / Detection / Recording / Privacy, and cry history with per-day
  episodes and totals. Bottom sheets on phones.
- **Pop out**: floats the monitor in an always-on-top window (document picture-in-picture
  on desktop Chrome, stitched video picture-in-picture elsewhere).

### Configuration

```yaml
type: custom:nap-monitor-card
title: Nursery                      # optional header title
children:
  - name: Theo
    color: "#7aa2f7"                # optional accent dot
    cameras:                        # one entry per sleep location ("locations" also works)
      - key: theo_bedroom          # entity-id stem shared by the camera's entities
        label: Bedroom
        sensors: [fan.theo_room]   # optional readouts shown on the tile
  - name: Mia
    color: "#f7a8b8"
    cameras:
      - key: mia_living_room
        label: Living room
      - key: mia_bedroom
        label: Nursery
        sensors: [sensor.nursery_temperature, sensor.nursery_humidity, fan.mia_room]
      - key: mia_primary_bedroom
        label: Primary bedroom
layout: grid                        # grid | focus | fill (the header button overrides per device)
night_mode: auto                    # auto | on | off
night_start: "19:30"                # auto window, local time
night_end: "07:00"
fit: cover                          # cover | contain, for stretched tiles in Focus and Fill
follow_cry: true                    # switch a child's tile to the location that is crying
exclusive_audio: true               # unmuting one tile mutes the others
show_timeline: true
show_sensors: true
timeline_hours: 12
events_hours: 24                    # window for the history sheet
stream_suffix: _fluent              # low-res stream: camera.<key><stream_suffix>
hd_suffix: _clear                   # HD stream:      camera.<key><hd_suffix>
native_player: false                # allow ExoPlayer in the companion app
tv_scripts: []                      # [{ name: Living room TV, script: script.cast_nursery }]
```

Per location you can override the guessed entities with `camera`, `camera_hd`, `cry`,
`motion` and `privacy`. PTZ and settings sheets look for Reolink-style entities such as
`button.<key>_ptz_left`, `select.<key>_ptz_preset`, `number.<key>_baby_cry_sensitivity`
and `switch.<key>_privacy_mode`, and hide anything that is not present.

Per-browser preferences (layout, night override, child filter, selected location, mute,
HD) are kept in `localStorage`. Household state moves into the integration in phase 1.

## Development

```bash
npm ci && npm run build        # builds custom_components/nap_monitor/frontend/nap-monitor-card.js
npm run typecheck
npm test                       # Playwright smoke test against the built bundle
node tests/screenshots.mjs     # renders tests/__artifacts__/*.png for a visual check

python -m venv .venv && .venv/bin/pip install -r requirements_dev.txt
.venv/bin/pytest
.venv/bin/ruff check custom_components tests
```

The built bundle is committed so a HACS download works without a build step; CI fails if
`src/` and the bundle drift.

## License

MIT
