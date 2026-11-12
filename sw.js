/* versión 995529ad72: cada build cambia este número y el teléfono baja la app nueva */
var C="pv-995529ad72",FILES=["./","index.html","manifest.webmanifest","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png"];
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
