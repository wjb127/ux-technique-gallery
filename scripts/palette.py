# Derive a per-technique color theme from its reference screenshot (report/ref/<slug>.png)
import json, os, colorsys, sys
from PIL import Image
d = json.load(open('data/ledger-techniques.json'))
out = {}
for t in d:
    p = f'report/ref/{t["slug"]}.png'
    if not os.path.exists(p): continue
    im = Image.open(p).convert('RGB').crop((0, 0, 1440, 900)).resize((180, 112))
    q = im.quantize(colors=24, method=Image.Quantize.MEDIANCUT).convert('RGB')
    cnt = sorted(q.getcolors(20000), reverse=True)
    tot = sum(c for c, _ in cnt)
    hexs = lambda rgb: '#%02x%02x%02x' % rgb
    bg = cnt[0][1]
    lum = lambda c: (0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255
    sat = lambda c: colorsys.rgb_to_hsv(*[v/255 for v in c])[1]
    accents = [c for n, c in cnt if sat(c) > 0.35 and 0.15 < max(c)/255 and n/tot > 0.004]
    dark = lum(bg) < 0.45
    far = [c for n, c in cnt if abs(lum(c) - lum(bg)) > 0.45]
    fg = far[0] if far else ((240,240,240) if dark else (20,20,20))
    panel = next((c for n, c in cnt[1:] if abs(lum(c)-lum(bg)) < 0.18 and c != bg), bg)
    out[t['slug']] = dict(bg=hexs(bg), fg=hexs(fg), panel=hexs(panel), dark=dark,
        ac=hexs(accents[0]) if accents else ('#7c5cff'), ac2=hexs(accents[1]) if len(accents) > 1 else ('#ff5c8a'),
        ac3=hexs(accents[2]) if len(accents) > 2 else '#ffc83d', coverage=round(cnt[0][0]/tot, 2))
json.dump(out, open('data/ref-palettes.json', 'w'), indent=1)
print(len(out))
