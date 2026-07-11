// Objective, geometric test for the cartoon replay's baseball field layout
// (see index.html's "cartoon replay: animation engine" section).
//
// Doesn't check pixels or screenshots — asserts the actual mathematical facts
// a correct baseball field diagram must satisfy, extracted straight from the
// same constants index.html uses to render it. Catches exactly the class of
// bug that shipped in two separate releases: foul lines that don't actually
// pass through the bases, because the endpoints were hand-picked instead of
// computed from the diamond itself. Run with: node tests/field-geometry.test.js

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const indexPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];

const startMarker = '/* ---------------- cartoon replay: animation engine (geometric theme) ----------------';
const endMarker = 'function cartoonFieldSVG(){';
const startIdx = script.indexOf(startMarker);
const endIdx = script.indexOf(endMarker);
if (startIdx < 0 || endIdx < 0) throw new Error('markers not found — did the field geometry code move in index.html?');

const src = script.slice(startIdx, endIdx) + `
globalThis.FIELD_VIEWBOX = FIELD_VIEWBOX; globalThis.HALF_DIAGONAL = HALF_DIAGONAL;
globalThis.FIELD_PT = FIELD_PT; globalThis.FIELD_CIRCUIT = FIELD_CIRCUIT;
globalThis.FOUL_LINE_LENGTH = FOUL_LINE_LENGTH; globalThis.FOUL_END_FIRST = FOUL_END_FIRST; globalThis.FOUL_END_THIRD = FOUL_END_THIRD;
globalThis.DIRT_MARGIN_X = DIRT_MARGIN_X; globalThis.DIRT_MARGIN_Y = DIRT_MARGIN_Y;
globalThis.DIAMOND_CENTER = DIAMOND_CENTER; globalThis.DIRT_RX = DIRT_RX; globalThis.DIRT_RY = DIRT_RY;
globalThis.FIELDER_POS = FIELDER_POS;
`;

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(src, sandbox);

const { FIELD_VIEWBOX, HALF_DIAGONAL, FIELD_PT, FOUL_END_FIRST, FOUL_END_THIRD, FOUL_LINE_LENGTH,
        DIAMOND_CENTER, DIRT_RX, DIRT_RY, FIELDER_POS } = sandbox;

let failures = [];
function assert(name, cond, detail) {
  if (!cond) failures.push(`${name}${detail ? ' — ' + detail : ''}`);
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`);
}
const dist = (a, b) => Math.hypot(a[0]-b[0], a[1]-b[1]);
const cross = (o, a, b) => (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]);
const close = (a, b, eps=0.01) => Math.abs(a-b) < eps;

// --- The diamond is a true rotated square ---
const sides = [
  dist(FIELD_PT.home, FIELD_PT.first),
  dist(FIELD_PT.first, FIELD_PT.second),
  dist(FIELD_PT.second, FIELD_PT.third),
  dist(FIELD_PT.third, FIELD_PT.home),
];
assert('all four basepaths are the same length', sides.every(s => close(s, sides[0], 0.5)), sides.join(', '));
assert('basepath length matches HALF_DIAGONAL * sqrt(2)', close(sides[0], HALF_DIAGONAL*Math.SQRT2, 0.5), `${sides[0]} vs ${HALF_DIAGONAL*Math.SQRT2}`);

const v1 = [FIELD_PT.first[0]-FIELD_PT.home[0], FIELD_PT.first[1]-FIELD_PT.home[1]];
const v2 = [FIELD_PT.third[0]-FIELD_PT.home[0], FIELD_PT.third[1]-FIELD_PT.home[1]];
const dot = v1[0]*v2[0] + v1[1]*v2[1];
assert('the two foul-line directions (home->first, home->third) are perpendicular', close(dot, 0, 0.5), `dot product ${dot}`);

// --- Foul lines actually pass through the bases (the bug that shipped twice) ---
assert('home, first base, and the first-base foul line endpoint are collinear',
  close(cross(FIELD_PT.home, FIELD_PT.first, FOUL_END_FIRST), 0, 1),
  `cross product ${cross(FIELD_PT.home, FIELD_PT.first, FOUL_END_FIRST)}`);
assert('home, third base, and the third-base foul line endpoint are collinear',
  close(cross(FIELD_PT.home, FIELD_PT.third, FOUL_END_THIRD), 0, 1),
  `cross product ${cross(FIELD_PT.home, FIELD_PT.third, FOUL_END_THIRD)}`);
assert('first-base foul line extends outward from home through first (not backward)',
  dist(FIELD_PT.home, FOUL_END_FIRST) > dist(FIELD_PT.home, FIELD_PT.first));
assert('third-base foul line extends outward from home through third (not backward)',
  dist(FIELD_PT.home, FOUL_END_THIRD) > dist(FIELD_PT.home, FIELD_PT.third));
assert('foul lines are the declared FOUL_LINE_LENGTH', close(dist(FIELD_PT.home, FOUL_END_FIRST), FOUL_LINE_LENGTH, 0.5));

// --- Pitcher's mound sits on the home-second axis, between them ---
const homeToSecond = dist(FIELD_PT.home, FIELD_PT.second);
const homeToPitcher = dist(FIELD_PT.home, FIELD_PT.pitcher);
assert("pitcher's mound is collinear with home and second base",
  close(cross(FIELD_PT.home, FIELD_PT.second, FIELD_PT.pitcher), 0, 1));
assert("pitcher's mound sits strictly between home and second base",
  homeToPitcher > 0 && homeToPitcher < homeToSecond);

// --- Infield dirt ellipse actually contains the whole diamond, with real margin ---
function normalizedDistFromEllipse(pt) {
  return Math.hypot((pt[0]-DIAMOND_CENTER[0])/DIRT_RX, (pt[1]-DIAMOND_CENTER[1])/DIRT_RY);
}
['home','first','second','third'].forEach(k => {
  const nd = normalizedDistFromEllipse(FIELD_PT[k]);
  assert(`dirt ellipse contains ${k} base with real margin (normalized dist < 0.95)`, nd < 0.95, `normalized dist ${nd.toFixed(3)}`);
});
assert("dirt ellipse is centered on the diamond's true center (midpoint(home,second) === midpoint(first,third))",
  close(DIAMOND_CENTER[0], (FIELD_PT.first[0]+FIELD_PT.third[0])/2, 0.01) &&
  close(DIAMOND_CENTER[1], (FIELD_PT.home[1]+FIELD_PT.second[1])/2, 0.01) &&
  close((FIELD_PT.home[0]+FIELD_PT.second[0])/2, (FIELD_PT.first[0]+FIELD_PT.third[0])/2, 0.01) &&
  close((FIELD_PT.home[1]+FIELD_PT.second[1])/2, (FIELD_PT.first[1]+FIELD_PT.third[1])/2, 0.01));
assert('dirt ellipse is wider than tall (rx > ry), matching the reference proportions', DIRT_RX > DIRT_RY);

// --- Fielder symmetry around the home-second (vertical) axis ---
const axisX = FIELD_PT.home[0];
assert('home-second axis is actually vertical (same x)', FIELD_PT.home[0] === FIELD_PT.second[0]);
[[3,5],[4,6],[7,9]].forEach(([l,r]) => {
  const L = FIELDER_POS[l], R = FIELDER_POS[r];
  assert(`fielders ${l} and ${r} mirror across the home-second axis`,
    close(L[1], R[1], 0.01) && close((L[0]+R[0])/2, axisX, 0.01),
    `${l}=${JSON.stringify(L)} ${r}=${JSON.stringify(R)} axis=${axisX}`);
});
[1,2,8].forEach(n => {
  assert(`fielder ${n} sits exactly on the home-second axis`, close(FIELDER_POS[n][0], axisX, 0.01));
});

// --- Everything meant to be on-canvas actually is ---
const allPts = [FIELD_PT.home, FIELD_PT.first, FIELD_PT.second, FIELD_PT.third, FIELD_PT.pitcher,
  FOUL_END_FIRST, FOUL_END_THIRD, ...Object.values(FIELDER_POS)];
const outOfBounds = allPts.filter(([x,y]) => x < 0 || x > FIELD_VIEWBOX.w || y < 0 || y > FIELD_VIEWBOX.h);
assert('every field element is within the viewBox', outOfBounds.length === 0, JSON.stringify(outOfBounds));

console.log(`\n${failures.length === 0 ? 'ALL PASS' : failures.length + ' FAILURE(S)'}`);
if (failures.length) { failures.forEach(f => console.log('  - ' + f)); process.exit(1); }
