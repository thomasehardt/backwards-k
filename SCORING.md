# Scoring Notation Reference

Baseline notation used by this app, based on the standard method described in MLB's
[official scorekeeping guide](https://www.mlb.com/official-information/basics/score).
Individual scorers vary their own shorthand — this is the common baseline the app defaults to.

## The diamond

Each plate appearance gets a small diamond. The four corners stand for the four bases,
with the bottom corner as home. When a batter reaches a base, that corner gets marked;
when a runner crosses home, the whole diamond is filled in (this app uses a "scored"
toggle for that).

## Reaching base

| Result | Notation |
|---|---|
| Single | 1B (or "-" in the lower-right corner on paper) |
| Double | 2B (or "=" in the upper-right corner) |
| Triple | 3B (or "≡") |
| Home run | HR (or "≣", all four corners) |
| Walk | BB |
| Intentional walk | IBB |
| Hit by pitch | HP |
| Fielder's choice | FC |
| Reached on error | E |

## Outs

Groundouts and force outs are usually written as the fielders involved, in the order
the ball touched them — a groundout to short thrown to first is "6-3." A simple fly out
just gets the fielder's number, e.g. "7" for a catch in left field.

| Result | Notation |
|---|---|
| Strikeout (swinging) | K |
| Strikeout (looking) | Ꝁ (backwards K) |
| Groundout | fielder sequence, e.g. 6-3 |
| Flyout | fielder number, e.g. 7 |
| Foul out | F |
| Line out | L |
| Double play | DP |
| Sacrifice (bunt) | SH / SAC |
| Sacrifice fly | SF |
| Force out | FO |
| Unassisted | U |

## Other events worth tracking

| Event | Notation |
|---|---|
| Wild pitch | WP |
| Passed ball | PB |
| Balk | BK |
| Stolen base | SB |
| Bunt | B |

## Defensive positions, by number

1 Pitcher · 2 Catcher · 3 First base · 4 Second base · 5 Third base ·
6 Shortstop · 7 Left field · 8 Center field · 9 Right field

## Runs and RBI

When a run scores, the paper convention is a circle at the bottom of the box with the
play or player number that drove it in written inside — so you can trace every run back
to the hit (or out) that produced it, even after lineup substitutions. The app's "scored"
toggle plus its RBI counter are the digital equivalent of that circle.

## Inning totals

Runs and hits are totaled per inning first, then added up across innings for the final
line score. The app's box score does this automatically from the per-at-bat data instead
of requiring a manual re-tally at the end of the game.

## What this app's v1 doesn't cover yet

Full fielder-assist notation (6-3, 4-6-3, etc.) and the finer out types (L, F, U, B) —
the current picker only distinguishes K, K-looking, groundout, flyout, double play, and
sac. See `README.md` for what's planned next.
