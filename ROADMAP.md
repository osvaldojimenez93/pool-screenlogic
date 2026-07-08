# Roadmap

> Bun + HTMX control surface for Pentair ScreenLogic — hosted on a Synology NAS.

## Philosophy

- **Read first, write later** — get full visibility before enabling any controls
- **Simple & performant** — server-rendered HTML, no client-side framework bloat
- **Self-hosted** — Docker container on a Synology NAS with CI/CD

---

## Phase 1 — Observation Dashboard

Build a comprehensive read-only dashboard showing all equipment state.

- [x] Pool / spa / air temperatures
- [ ] Heat status & mode display (read-only)
- [ ] Pump status cards (watts, RPMs, GPMs, running state)
- [ ] All circuit states (what's on/off — display only)

## Phase 2 — History & Charts

Leverage the `getHistoryDataAsync()` API to show trends over time.

- [ ] Temperature history chart (pool, spa, air)
- [ ] Circuit run history (pool pump, spa, heater, solar on/off times)

## Phase 3 — Schedules & Weather (read-only)

Display the controller's schedule configuration and weather data.

- [ ] View all recurring schedules
- [ ] View egg timers
- [ ] Weather forecast display
- [ ] System info (firmware version, controller time)

## Phase 4 — Real-time Updates

Eliminate polling with push-based updates from the controller.

- [ ] Subscribe via `addClientAsync()` for equipment state events
- [ ] SSE or WebSocket bridge to the HTMX frontend
- [ ] Live temperature / circuit state refresh without page reload

## Phase 5 — Controls (writes)

Once observation is stable and trustworthy, enable write operations.

- [ ] Circuit on/off toggles
- [ ] Heat mode selection (off / solar / heater / solar preferred)
- [ ] Temperature set point adjustment
- [ ] Schedule create / edit / delete
- [ ] Egg timer management
- [ ] Light color mode commands

## Phase 6 — Deployment & Polish

Ship it to the NAS with a proper pipeline.

- [ ] Dockerfile (Bun on Alpine)
- [ ] CI pipeline: PR → lint/test → build image → push to registry
- [ ] Synology Container Manager deployment (watchtower or webhook trigger)
- [ ] Mobile-responsive layout (poolside use)
- [ ] Dark / light theme
- [ ] Connection resilience & error recovery
