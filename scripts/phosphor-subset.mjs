// Builds src/data/phosphor-subset.json from @phosphor-icons/core (MIT): a curated set of real Phosphor icons in all 6 weights.
import fs from 'node:fs';
import { icons } from '@phosphor-icons/core';
const W = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'];
const FIRST = 77; // alphabetical head of the catalog, like the live grid
const EXTRA = ['cat', 'paw-print', 'certificate', 'identification-badge', 'identification-card', 'notification', 'chart-scatter', 'island', 'church', 'gps', 'gps-fix', 'gps-slash', 'fingerprint', 'fingerprint-simple', 'key', 'keyhole', 'lock', 'lock-key', 'lock-laminated', 'lock-simple', 'password', 'shield', 'shield-check', 'shield-checkered', 'shield-chevron', 'shield-plus', 'shield-star', 'heart', 'star', 'house', 'gear', 'magnifying-glass', 'pencil-simple', 'coffee', 'cloud-sun', 'moon-stars', 'snowflake', 'tree-evergreen', 'gift', 'bell', 'camera', 'music-notes', 'game-controller', 'dog', 'bird', 'fish', 'butterfly', 'rocket-launch', 'planet', 'paper-plane-tilt', 'pen-nib', 'palette', 'paint-brush', 'cube', 'sparkle', 'smiley', 'at', 'text-t', 'link', 'dice-five', 'arrow-counter-clockwise', 'download-simple', 'copy', 'x', 'x-circle', 'caret-down', 'megaphone-simple', 'hand-heart', 'arrow-elbow-down-right', 'arrow-up-right', 'arrow-circle-down', 'arrow-circle-up-right', 'cat', 'watch', 'map-pin', 'piano-keys', 'sliders', 'wave-sine', 'wave-square', 'wave-triangle', 'wave-sawtooth'];
const byName = Object.fromEntries(icons.map((i) => [i.name, i]));
const names = [...new Set([...icons.slice(0, FIRST).map((i) => i.name), ...EXTRA])].filter((n) => byName[n]);
const strip = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const out = names.map((n) => { const i = byName[n]; const p = {}; for (const w of W) { const f = `node_modules/@phosphor-icons/core/assets/${w}/${n}${w === 'regular' ? '' : '-' + w}.svg`; p[w] = strip(fs.readFileSync(f, 'utf8')); } return { n, tags: i.tags.filter((t) => t !== '*new*' && t !== '*updated*'), isNew: i.tags.includes('*new*'), upd: i.tags.includes('*updated*'), cp: i.codepoint, v: i.published_in, cat: i.categories, p }; });
fs.writeFileSync('src/data/phosphor-subset.json', JSON.stringify({ total: icons.length, icons: out }));
console.log(out.length, 'icons of', icons.length, (fs.statSync('src/data/phosphor-subset.json').size / 1024).toFixed(0) + 'KB');
