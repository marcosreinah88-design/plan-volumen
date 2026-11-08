"""Arma la app instalable para GitHub Pages: lee src/ y escribe index.html, manifest, sw.js e íconos en la raíz.
Uso: python3 build.py  (necesita Pillow para los íconos)"""
import json,os,io,hashlib
from PIL import Image,ImageDraw
base=os.path.dirname(os.path.abspath(__file__))+'/'
out=base;os.makedirs(out+'icons',exist_ok=True)
t=open(base+'src/app.html',encoding='utf-8').read()
css=open(base+'src/app.css',encoding='utf-8').read()
js=open(base+'src/app.js',encoding='utf-8').read().replace('/*DIET*/',open(base+'src/diet.js',encoding='utf-8').read())
assert js.count('var PWA=false;')==1
js=js.replace('var PWA=false;','var PWA=true;')
import datetime
js=js.replace('var APPV="dev";','var APPV="'+datetime.date.today().strftime('%Y.%m.%d')+'-'+hashlib.sha1(js.encode()).hexdigest()[:6]+'";')
data=json.load(open(base+'src/data.json',encoding='utf-8'))
dj=json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
body=t.replace('/*CSS*/',css).replace('/*APP*/',js).replace('/*DATA*/',dj)
ver=hashlib.sha1(body.encode()).hexdigest()[:10]
head='''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/icon-180.png">
<link rel="icon" href="icons/icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Volumen">
<style>html,body{margin:0}</style>
</head>
<body>
'''
tail='''
<script>
if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").then(function(r){r.update();}).catch(function(){});
  var reloaded=false;navigator.serviceWorker.addEventListener("controllerchange",function(){if(reloaded)return;reloaded=true;location.reload();});}
if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(function(){});
</script>
</body>
</html>
'''
open(out+'index.html','w',encoding='utf-8').write(head+body+tail)
open(out+'manifest.webmanifest','w',encoding='utf-8').write(json.dumps({
 "name":"Plan de Volumen","short_name":"Volumen","start_url":"./","scope":"./","display":"standalone",
 "background_color":"#0E1113","theme_color":"#0E1113","lang":"es",
 "icons":[{"src":"icons/icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icons/icon-512.png","sizes":"512x512","type":"image/png"},{"src":"icons/icon-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]},ensure_ascii=False,indent=1))
open(out+'sw.js','w',encoding='utf-8').write('''/* versión %s: cada build cambia este número y el teléfono baja la app nueva */
var C="pv-%s",FILES=["./","index.html","manifest.webmanifest","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",function(e){self.skipWaiting();e.waitUntil(caches.open(C).then(function(c){return c.addAll(FILES);}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
/* primero internet (para que siempre tengas la última versión), y si no hay señal, la copia guardada */
self.addEventListener("fetch",function(e){var u=new URL(e.request.url);if(e.request.method!=="GET"||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(function(r){var cp=r.clone();caches.open(C).then(function(c){c.put(e.request,cp);});return r;}).catch(function(){return caches.match(e.request,{ignoreSearch:true}).then(function(r){return r||caches.match("index.html");});}));});
/* avisos: los manda GitHub (Actions) y aquí se muestran */
self.addEventListener("push",function(e){var d={};try{d=e.data?e.data.json():{};}catch(x){d={t:"Plan de Volumen",b:e.data?e.data.text():""};}
  e.waitUntil(self.registration.showNotification(d.t||"Plan de Volumen",{body:d.b||"",tag:d.tag||undefined,icon:"icons/icon-192.png",badge:"icons/icon-192.png",data:{url:"./"}}));});
self.addEventListener("notificationclick",function(e){e.notification.close();e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(cs){for(var i=0;i<cs.length;i++){if("focus" in cs[i])return cs[i].focus();}return self.clients.openWindow("./");}));});
'''%(ver,ver))
def icon(n):
    S=n*4;im=Image.new('RGB',(S,S),'#0E1113');d=ImageDraw.Draw(im)
    r=int(S*0.30);cx=cy=S//2
    d.pieslice([cx-r,cy-r,cx+r,cy+r],-90,90,fill='#6B93FF');d.pieslice([cx-r,cy-r,cx+r,cy+r],90,270,fill='#F5A524')
    ri=int(r*0.55);d.ellipse([cx-ri,cy-ri,cx+ri,cy+ri],fill='#0E1113')
    im.resize((n,n),Image.LANCZOS).save(out+'icons/icon-%d.png'%n)
LOGO=base+'src/logo.png'
for n in (180,192,512):
    if os.path.exists(LOGO):Image.open(LOGO).convert('RGB').resize((n,n),Image.LANCZOS).save(out+'icons/icon-%d.png'%n)
    else:icon(n)
open(out+'.nojekyll','w').write('')
print('pwa',ver,os.path.getsize(out+'index.html')//1024,'KB')
