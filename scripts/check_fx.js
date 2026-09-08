// scripts/check_fx.js — every fx toggle must actually control something.
// The registry in ceremony.js and the $fx-hide map in main.scss are kept in
// sync by hand; this fails the moment a row is added and left unwired.
// Run: node scripts/check_fx.js
const fs = require('fs');
const assert = require('assert');

const js = fs.readFileSync(__dirname + '/../assets/js/ceremony.js', 'utf8');
const scss = fs.readFileSync(__dirname + '/../assets/scss/main.scss', 'utf8');

const registry = js.slice(js.indexOf('const FX = ['), js.indexOf('];', js.indexOf('const FX = [')));
const ids = [...registry.matchAll(/'[a-z]+',\s*'([a-z0-9]+)'/g)].map((m) => m[1]);
assert.ok(ids.length > 30, 'registry did not parse: ' + ids.length + ' ids');
assert.strictEqual(new Set(ids).size, ids.length, 'duplicate fx id in registry');

const hideMap = scss.slice(scss.indexOf('$fx-hide: ('), scss.indexOf(');', scss.indexOf('$fx-hide: (')));
const hidden = [...hideMap.matchAll(/^\s*([a-z]+):/gm)].map((m) => m[1]);

const unwired = ids.filter((id) =>
  !hidden.includes(id) &&                              // hidden by the SCSS map
  !js.includes("fxOn('" + id + "')") &&                // guarded live in JS
  !js.includes("run('" + id + "',") &&                 // skipped at bind time
  !scss.includes('html.off-' + id));                   // special-cased in SCSS

assert.deepStrictEqual(unwired, [], 'fx ids with no effect: ' + unwired.join(', '));

const orphans = hidden.filter((id) => !ids.includes(id));
assert.deepStrictEqual(orphans, [], 'SCSS hides ids not in the registry: ' + orphans.join(', '));

// Sliders are read by name in applyFx / reduced(); a typo silently pins them to 1.
['motion', 'audio', 'grain'].forEach((id) => {
  assert.ok(js.includes("fxNum('" + id + "')"), 'slider never read: ' + id);
});

// Selector interpolation guard: unnested #{$sel} in @each fails to distribute
// parent prefixes across comma-separated selectors (e.g. ".fog, .fog-inverse").
assert.ok(
  /html\.off-#\{\$id\}\s*\{\s*#\{\$sel\}/.test(scss),
  'SCSS $fx-hide loop must nest #{$sel} under html.off-#{$id} to scope comma selectors correctly'
);

// LibSass filter: opacity() guard: unescaped opacity() inside filter: compiles to legacy IE alpha().
const scssNoComments = scss.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
assert.ok(
  !/filter:\s*opacity\(/i.test(scssNoComments),
  'Unescaped filter: opacity() found in SCSS; escape as #{"opacity(...)"} for LibSass'
);

// The genre presets in docs/ are only useful if their ids are real.
const doc = fs.readFileSync(__dirname + '/../docs/fx-that-work-best-for-different-styles-of-edm.md', 'utf8');
const cited = [...new Set([...doc.matchAll(/"([a-z0-9]+)"/g)].map((m) => m[1]))];
const stale = cited.filter((id) => !ids.includes(id));
assert.deepStrictEqual(stale, [], 'docs cite unknown fx ids: ' + stale.join(', '));

console.log('fx ok — ' + ids.length + ' toggles, ' + hidden.length + ' css-hidden, 3 sliders, ' + cited.length + ' cited in docs');
