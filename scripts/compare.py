# python3 scripts/compare.py <engine|slug,...> -> /tmp/cmp-<n>.jpg sheets (ref | impl pairs)
import json, sys, os
from PIL import Image, ImageDraw
a = json.load(open('data/assign.json'))
arg = sys.argv[1]
slugs = a.get(arg) or arg.split(',')
W, H = 480, 300
for si in range(0, len(slugs), 8):
    part = slugs[si:si+8]
    im = Image.new('RGB', (W*4, (H+14)*((len(part)+1)//2)), 'white'); d = ImageDraw.Draw(im)
    for k, sl in enumerate(part):
        x, y = (k % 2) * W * 2, (k // 2) * (H+14)
        for j, kind in enumerate(['ref', 'impl']):
            p = f'report/{kind}/{sl}.png'
            if os.path.exists(p): im.paste(Image.open(p).convert('RGB').resize((W-4, H)), (x + j*W, y+14))
        d.text((x+2, y+1), f'{sl}  [ref | impl]', fill='black')
    out = f'/tmp/cmp-{arg[:20]}-{si//8}.jpg'; im.save(out, quality=72); print(out)
