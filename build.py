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
<!--pv-app-->
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
# Seguridad: política de contenido (CSP). Solo corren los scripts de esta build (por su huella sha256);
# cualquier código metido en la página no se ejecuta, y solo se puede hablar con GitHub.
import re,base64
html=head+body+tail
hashes=[]
for m in re.finditer(r'<script(?![^>]*type="application/json")[^>]*>(.*?)</script>',html,re.S):
    hashes.append("'sha256-"+base64.b64encode(hashlib.sha256(m.group(1).encode('utf-8')).digest()).decode()+"'")
csp=("default-src 'none'; script-src "+" ".join(hashes)+"; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
     "font-src https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://api.github.com https://gist.githubusercontent.com https://generativelanguage.googleapis.com; "
     "manifest-src 'self'; worker-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'")
html=html.replace('<meta charset="utf-8">','<meta charset="utf-8">\n<meta http-equiv="Content-Security-Policy" content="'+csp+'">\n<meta name="referrer" content="no-referrer">',1)
assert html.count('Content-Security-Policy')==1 and len(hashes)==2,len(hashes)
open(out+'index.html','w',encoding='utf-8').write(html)
open(out+'manifest.webmanifest','w',encoding='utf-8').write(json.dumps({
 "name":"Plan de Volumen","short_name":"Volumen","start_url":"./","scope":"./","display":"standalone",
 "background_color":"#0E1113","theme_color":"#0E1113","lang":"es",
 "icons":[{"src":"icons/icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icons/icon-512.png","sizes":"512x512","type":"image/png"},{"src":"icons/icon-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]},ensure_ascii=False,indent=1))
open(out+'sw.js','w',encoding='utf-8').write('''/* versión %s: cada build cambia este número y el teléfono baja la app nueva */
var C="pv-%s",FILES=["./","index.html","manifest.webmanifest","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",function(e){self.skipWaiting();e.waitUntil(caches.open(C).then(function(c){return c.addAll(FILES);}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C&&k!=="pv-fonts";}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
/* Arranque sin internet o con señal mala: la app se pide a internet, pero si no contesta en 3 s
   (o falla, o regresa una página rara del wifi del gym) se abre la copia guardada. La versión nueva
   se sigue bajando en segundo plano y queda lista para la próxima vez. */
var WAIT=3000,FONTS="pv-fonts";
function ok(r){return r&&r.ok&&r.type==="basic"&&!r.redirected;}
/* la app de verdad trae la marca pv-app; si no (página del wifi, error), no se guarda ni se muestra */
function revisar(r,nav){if(!ok(r))return Promise.resolve(false);if(!nav)return Promise.resolve(true);
  return r.clone().text().then(function(t){return t.indexOf("<!--pv-app-->")>=0;},function(){return false;});}
function guardar(req,r,nav){return revisar(r,nav).then(function(b){if(!b)return null;var cp=r.clone();caches.open(C).then(function(c){return c.put(req,cp);}).catch(function(){});return r;});}
function copia(req,nav){return caches.match(req,{ignoreSearch:true}).then(function(r){return r||(nav?caches.match("index.html").then(function(x){return x||caches.match("./");}):undefined);});}
function app(e){var req=e.request,nav=req.mode==="navigate",key=nav?new Request(new URL("./",location.href).href):req;
  var red=fetch(req.url,{cache:"no-store",credentials:"same-origin"}).then(function(r){return guardar(key,r,nav);});
  e.waitUntil(red.catch(function(){}));
  return new Promise(function(res){var listo=false,t;
    function deCopia(){if(listo)return;copia(key,nav).then(function(r){if(listo)return;if(r){listo=true;clearTimeout(t);res(r);}});}
    t=setTimeout(deCopia,WAIT);
    red.then(function(r){if(listo)return;if(r){listo=true;clearTimeout(t);res(r);}else{copia(key,nav).then(function(c){if(listo)return;listo=true;clearTimeout(t);res(c||Response.error());});}},
      function(){copia(key,nav).then(function(c){if(listo)return;listo=true;clearTimeout(t);res(c||Response.error());});});});}
/* letras de Google: se guardan la primera vez y después salen de la copia (sin internet no bloquean la pantalla) */
function letras(e){var req=e.request;return caches.open(FONTS).then(function(c){return c.match(req).then(function(h){if(h)return h;
  return Promise.race([fetch(req).then(function(r){if(r&&(r.ok||r.type==="opaque"))c.put(req,r.clone()).catch(function(){});return r;}),
    new Promise(function(_,no){setTimeout(no,WAIT);})]).catch(function(){
      return /googleapis/.test(req.url)?new Response("",{headers:{"Content-Type":"text/css"}}):Response.error();});});});}
self.addEventListener("fetch",function(e){if(e.request.method!=="GET")return;var u=new URL(e.request.url);
  if(u.origin===location.origin){e.respondWith(app(e));return;}
  if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com")e.respondWith(letras(e));});
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
