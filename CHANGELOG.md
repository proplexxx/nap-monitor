# Changelog

## 0.1.0 — phase 0 (unreleased)

- Repository, TypeScript build and CI set up.
- New `nap-monitor-card` UI (Lit): status pill per tile (crying, quiet-for, stirring,
  privacy, offline), cry timeline strip, location chips that follow crying, room readouts,
  Grid / Focus / Fill layouts, night mode with schedule, exclusive audio, pop-out, PTZ,
  settings and history sheets (bottom sheets on phones). Takes the same YAML config as the
  hand-written prototype plus `title`, `color`, `sensors`, `layout`, `night_mode`,
  `night_start`, `night_end`, `fit`, `follow_cry`, `exclusive_audio`, `show_timeline`,
  `show_sensors` and `timeline_hours`.
- `nap_monitor` integration skeleton: single "household" config entry, serves the card
  bundle and registers it as a frontend resource, `nap_monitor/config` websocket command.
