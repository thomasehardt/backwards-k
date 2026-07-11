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
- **Play-by-play recap** — template/rule-based (no model calls) narrative
  generation from a game's at-bat sequence; see the Recap tab.
- **Installable / offline-capable** — a PWA manifest and service worker, hosted
  on GitHub Pages, plus a signed native Android build distributed via a
  self-hosted F-Droid repo (see "Android" below).

## Project layout

```
index.html      the entire app — markup, styles, and logic in one file
manifest.json   PWA manifest
sw.js           offline-caching service worker
SCORING.md      the paper scoring notation this app's picker is based on
icons/, assets/ app icons
mobile/         Capacitor + Android native project (see "Android" below)
docs/           GitHub Pages: a copy of the web app + the self-hosted F-Droid repo
```

There's no build step for the web app. Open `index.html` directly, or serve the
folder with any static file server.

## Status

Working prototype, hosted as a real PWA (GitHub Pages) with a signed Android
build published on tagged releases. Game state persists in the browser via
`localStorage` — no backend, no cross-device sync yet.

### Known gaps

- **Left-on-base** isn't computed in the box score yet.
- Install/update flow hasn't been tested on a real Android device yet, only
  via local builds and `apksigner verify`.

## Play it in the browser

The app is also hosted as a plain PWA via GitHub Pages:
**https://thomasehardt.github.io/backwards-k/** — installable via "Add to
Home Screen" on mobile.

## Android

There's a native Android build too, via [Capacitor](https://capacitorjs.com/)
(`mobile/`) — same web app, wrapped as a real app. It's not on the Play
Store. A [GitHub Actions workflow](.github/workflows/android-build.yml)
builds and publishes a signed release APK on every version tag (`v*.*.*`).
Two ways to get it:

- **Sideload the latest APK directly** —
  [backwards-k-latest.apk](https://thomasehardt.github.io/backwards-k/backwards-k-latest.apk),
  always the most recent tagged release; install it manually (you'll need to
  allow installs from the source you download it from).
- **Add the self-hosted F-Droid repo** — in the F-Droid app, add this repo:
  `https://thomasehardt.github.io/backwards-k/fdroid-repo/repo`. You'll get
  real F-Droid-style installs and update notifications without it being in
  the official F-Droid catalog.

To build it yourself:

```bash
cd mobile
npm install
bash sync-web-assets.sh   # regenerates mobile/www/ from the root web app
npx cap sync android
npx cap open android      # opens Android Studio, or:
cd android && ./gradlew assembleDebug
```

See `CLAUDE.md` for the signing/release/F-Droid-repo details.

## Roadmap

- Left-on-base in the box score.
- A persistence story beyond `localStorage` if cross-device sync matters.
- iOS build via Capacitor.
- A fact-accuracy scorer for the recap generator (checks generated claims
  against `game.atbats`), so the non-LLM approach can be compared against an
  LLM-based one on equal footing.
