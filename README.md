# Backwards K

A mobile-first digital scorecard for keeping score at a baseball game — built to
replace the paper scorecard, not simplify away from it. It follows the same
notation experienced scorers already use (see [`SCORING.md`](SCORING.md)),
including the notation this project is named after: a backwards K for a called
third strike.

## Why

Paper scorecards are expressive — fielder sequences, force outs, sacrifice flies,
the little scored-run circle — but they don't total themselves, don't sync across
a phone and a scorebook, and don't survive a rained-out doubleheader. Backwards K
keeps the paper card's vocabulary and adds automatic box scores, saved game
history, and (optionally) real MLB data.

## Features

- **Live scoring** — tap through a lineup, record each plate appearance with the
  same result vocabulary as a paper scorecard (hits, walks, the full range of
  outs), and see the diamond fill in as runners advance.
- **Fielder detail** — record assist sequences (6-3, 4-6-3, ...) the way a real
  scorecard does, not just broad out categories.
- **Automatic runs/RBI** — a baserunning simulation derives who scored and who
  drove them in from the sequence of plays in an inning, instead of requiring
  manual entry for every runner.
- **Box score** — runs, hits, errors, and per-batter lines computed automatically
  from the at-bat data.
- **Game history** — multiple games saved locally, browsable from a Games tab.
- **MLB Stats API sync** — pull a real game's lineups and play-by-play from
  [statsapi.mlb.com](https://statsapi.mlb.com) into the scorecard, useful for
  testing against real games or just following along with one.
- **Installable / offline-capable** — a PWA manifest and service worker, plus a
  Capacitor scaffold for wrapping it as a native Android app.

## Project layout

```
index.html      the entire app — markup, styles, and logic in one file
manifest.json   PWA manifest
sw.js           offline-caching service worker
SCORING.md      the paper scoring notation this app's picker is based on
capacitor.config.json, package.json, www/   Capacitor native-app scaffold
icons/, assets/ app icons
```

There's no build step for the web app. Open `index.html` directly, or serve the
folder with any static file server.

## Status

Working prototype. Game state persists in the browser via `localStorage`. Not
yet deployed to a real domain or published to an app store.

### Known gaps

- **Left-on-base** isn't computed in the box score yet.
- Icons referenced by `manifest.json` exist under `icons/`, but the install
  experience hasn't been tested on a real device yet.

## Running it as a native app

The Capacitor scaffold (`capacitor.config.json`, `package.json`, `www/`) wraps
the web app for Android. The generated `android/` project itself isn't checked
in (see `.gitignore`) — regenerate it with:

```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```

From there it's a standard Android Studio build. An iOS build would follow the
same pattern (`npx cap add ios`) but hasn't been set up yet.

## Roadmap

- Left-on-base in the box score.
- Real hosting + a persistence story beyond `localStorage` if cross-device sync
  matters.
- iOS build via Capacitor.
- Non-LLM play-by-play recap generation from a finished game's at-bat sequence
  (unblocked now that at-bats carry a true chronological order).
