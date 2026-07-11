#!/usr/bin/env bash
# Regenerates mobile/www/ from the root web app. www/ is gitignored since
# it's just a derived copy — run this before `npx cap sync android` whenever
# the root index.html / manifest.json / sw.js / icons change.
set -euo pipefail
cd "$(dirname "$0")"

mkdir -p www
cp ../index.html www/index.html
cp ../manifest.json www/manifest.json
cp ../sw.js www/sw.js
cp -r ../icons www/

echo "synced mobile/www/ from root sources"
