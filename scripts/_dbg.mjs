import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] }); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('console', m => console.log('C', m.type(), m.text())); p.on('pageerror', e => console.log('E', e.message));
await p.goto('http://localhost:4173/t/' + process.argv[2] + '/'); await p.waitForTimeout(2500);
console.log(await p.evaluate(() => { const r = document.querySelector('#demo, .demo, [data-demo]') ; return r ? [r.id, r.className, r.clientWidth, r.clientHeight, r.children.length, getComputedStyle(r).background.slice(0,60)] : document.body.innerHTML.slice(0, 500); }));
await b.close();
