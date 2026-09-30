import json,sys,os
from PIL import Image, ImageDraw
d=json.load(open('data/ledger-techniques.json'))
d=[t for t in d if os.path.exists(f'report/ref/{t["slug"]}.png')]
C,R,W,H=4,4,480,300
os.makedirs('/tmp/sheets',exist_ok=True)
for si in range(0,len(d),C*R):
  im=Image.new('RGB',(C*W,R*(H+16)),'white');dr=ImageDraw.Draw(im)
  for k,t in enumerate(d[si:si+C*R]):
    x,y=(k%C)*W,(k//C)*(H+16)
    im.paste(Image.open(f'report/ref/{t["slug"]}.png').convert('RGB').resize((W-4,H)),(x,y+16))
    dr.text((x+2,y+2),f'{si+k}:{t["slug"]}',fill='black')
  im.save(f'/tmp/sheets/s{si//(C*R):02d}.jpg',quality=70)
print(len(d))
