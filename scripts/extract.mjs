// Reads the ledger + briefing markdown and produces data/ledger-techniques.json
// (the full set of techniques the ledger knows about, enriched with checkpoints).
import fs from 'node:fs';
import path from 'node:path';

export const LEDGER = process.env.UX_LEDGER ||
  '/home/box/agent-data/agents/76ff2f7d-ccdd-4eea-8f51-f49812542a5d/ux-daily-ledger.json';
export const BRIEF_DIRS = (process.env.UX_BRIEF_DIRS || '/workspace/briefings,/workspace/ux-briefing').split(',');

const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };
export const slugOf = (id) => id.replace(/^clone-/, '').replace(/[^a-z0-9-]/gi, '-').toLowerCase();

function mdSections() {
  const out = [];
  for (const dir of BRIEF_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
      const txt = fs.readFileSync(path.join(dir, f), 'utf8');
      for (const sec of txt.split(/\n(?=## )/)) {
        const urls = [...sec.matchAll(/https?:\/\/[^\s)`>*]+/g)].map((m) => m[0]);
        const lines = sec.split('\n');
        let cps = [], inCp = false;
        for (const l of lines) {
          if (/checkpoint/i.test(l)) { inCp = true; cps = []; continue; }
          if (inCp) {
            const m = l.match(/^\s*\d+\.\s*(?:\[[ x]\]\s*)?(.*)$/);
            if (m) cps.push(m[1].replace(/\*\*/g, '').trim());
            else if (cps.length && l.trim() && !/^\s/.test(l)) inCp = false;
          }
        }
        const product = (sec.match(/\*\*Product:\*\*\s*(.+)/) || [])[1]?.trim();
        const title = (sec.match(/^## (.+)/) || [])[1]?.trim();
        const prompt = (sec.match(/```\n([\s\S]*?)```/) || [])[1]?.trim();
        out.push({ file: f, title, product, urls, hosts: urls.map(host), checkpoints: cps, prompt });
      }
    }
  }
  return out;
}

function productFromName(name, url) {
  const m = name.match(/\(([^)]*?)-style\)/i) || name.match(/^Clone ([A-Z][\w .]+?)-style/);
  if (m) return m[1].trim();
  const h = host(url);
  return h ? h.split('.')[0].replace(/^\w/, (c) => c.toUpperCase()) : '';
}

function checkpointsFromName(name) {
  const core = name.includes(':') ? name.split(':').slice(1).join(':') : name;
  return core.replace(/\([^)]*-style[^)]*\)/g, '').split(/\s\+\s|→|,\s/).map((s) => s.trim()).filter((s) => s.length > 2).slice(0, 6);
}

export function extract() {
  const L = JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
  const techById = Object.fromEntries(L.used_techniques.map((t) => (typeof t === 'string' ? { id: t, name: t } : t)).map((t) => [t.id, t]));
  const secs = mdSections();
  // data/ledger-overrides.json: id -> {name, product, checkpoints, checkpoint_source} for ledger entries stored as bare id strings
  const OV = fs.existsSync('data/ledger-overrides.json') ? JSON.parse(fs.readFileSync('data/ledger-overrides.json', 'utf8')) : {};
  for (const [id, o] of Object.entries(OV)) { const t = techById[id]; if (t && (!t.checkpoints?.length || t.name === id)) techById[id] = { ...t, ...o, id }; }
  const seen = new Map();
  for (const b of L.briefings) {
    b.technique_ids.forEach((id, i) => {
      if (seen.has(id)) return; // dedup: first appearance wins
      const url = b.technique_ids.length === b.sites.length ? b.sites[i] : (b.sites[i] || b.sites[0] || '');
      const t = techById[id] || { id, name: id };
      const h = host(url);
      const sec = secs.find((s) => s.hosts.includes(h) && s.checkpoints.length);
      seen.set(id, {
        id, slug: slugOf(id), name: t.name,
        date: b.date, slot: /^\d\d:\d\d$/.test(b.slot || '') ? b.slot : (b.slot || '—'),
        lens: b.lens, url, domain: h,
        product: t.product || sec?.product?.split('(')[0].trim() || productFromName(t.name, url),
        checkpoints: sec?.checkpoints?.length ? sec.checkpoints.slice(0, 6) : (t.checkpoints?.length ? t.checkpoints.slice(0, 6) : checkpointsFromName(t.name)),
        checkpoint_source: sec?.checkpoints?.length ? `briefing:${sec.file}` : (t.checkpoints?.length ? (t.checkpoint_source || 'ledger') : 'derived-from-ledger-name'),
        prompt: sec?.prompt || null,
      });
    });
  }
  // Foundational techniques that were never attached to a briefing slot.
  for (const t of L.used_techniques.map((x) => (typeof x === 'string' ? { id: x, name: x } : x))) if (!seen.has(t.id)) seen.set(t.id, {
    id: t.id, slug: slugOf(t.id), name: t.name, date: t.first_seen, slot: '—', lens: 'foundational-principle',
    url: '', domain: '', product: 'UX principle', checkpoints: checkpointsFromName(t.name),
    checkpoint_source: 'derived-from-ledger-name', prompt: null,
  });
  return [...seen.values()].sort((a, b) => (b.date + (b.slot || '')).localeCompare(a.date + (a.slot || '')));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const list = extract();
  fs.writeFileSync('data/ledger-techniques.json', JSON.stringify(list, null, 1));
  console.log(list.length, 'techniques;', list.filter((t) => t.checkpoint_source !== 'derived-from-ledger-name').length, 'with briefing checkpoints');
}
