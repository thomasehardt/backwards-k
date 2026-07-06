# Backwards K — from prototype to app store

## What's in this prototype
- `index.html` — the whole app (setup, live scoring, box score). Game state saves automatically as you go.
- `manifest.json` + `sw.js` — make it installable to a home screen and usable offline, once hosted on a real domain.

Try it in this chat first — tap through Lineup → Score → Box. Data persists across reloads inside this preview, but that storage is specific to this artifact, not your real deployment.

## Step 1 — Host it as a real PWA (this week)
Push these three files to any static host:
- **Vercel** or **Netlify**: drag-and-drop deploy, free tier, gives you an installable HTTPS URL in minutes
- **GitHub Pages**: free, good if you want the code in a public repo

Once it's live at a real HTTPS URL, replace the in-artifact storage calls with a real backend (see Step 2) and the "Add to Home Screen" flow will actually install it like an app on Android and iOS.

## Step 2 — Add real persistence
The prototype's storage won't carry over to a real deployment. Swap it for:
- **Simplest**: `localStorage` (works fine once it's your own hosted site — the restriction only applies inside Claude's artifact preview)
- **If you want scores to sync across devices**: a small backend — Supabase or Firebase both have generous free tiers and handle auth + a database with very little setup

## Step 3 — Wrap it for the App Store / Play Store
Use **Capacitor** (by the Ionic team) — it wraps your existing web app in a real native shell, so you submit to both stores without rewriting the UI:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Backwards K" "com.yourname.backwardsk"
npx cap add ios
npx cap add android
npx cap copy
npx cap open ios      # opens Xcode
npx cap open android  # opens Android Studio
```

From there it's standard app-store submission: an Apple Developer account ($99/yr) for iOS, a Google Play Developer account ($25 one-time) for Android. You'll want real app icons (the manifest above expects 192px and 512px PNGs) and a couple of screenshots.

## What this v1 prototype simplifies (worth deciding on next)
- **RBI and runs are entered manually** rather than derived from a full baserunner simulation (tracking force plays, runners advancing on a single, etc.). Building the full engine is very doable but is its own chunk of work — worth doing once the core flow feels right.
- **No fielding/position picker** for outs (6-3, 4-3, etc.) yet — currently just K / GO / FO / DP / SAC.
- **Errors and left-on-base** aren't auto-computed in the box score yet.

Happy to build any of these out next, or start on the Capacitor wrapping once you've tested the core flow.
