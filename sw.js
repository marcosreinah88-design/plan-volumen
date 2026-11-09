/* versión 3fcead86aa: cada build cambia este número y el teléfono baja la app nueva */
var C="pv-3fcead86aa",FILES=["./","index.html","manifest.webmanifest","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",function(e){self.skipWaiting();e.waitUntil(caches.open(C).then(function(c){return c.addAll(FILES);}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
/* primero internet (para que siempre tengas la última versión), y si no hay señal, la copia guardada */
self.addEventListener("fetch",function(e){var u=new URL(e.request.url);if(e.request.method!=="GET"||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(function(r){var cp=r.clone();caches.open(C).then(function(c){c.put(e.request,cp);});return r;}).catch(function(){return caches.match(e.request,{ignoreSearch:true}).then(function(r){return r||caches.match("index.html");});}));});
/* avisos: los manda GitHub (Actions) y aquí se muestran */
self.addEventListener("push",function(e){var d={};try{d=e.data?e.data.json():{};}catch(x){d={t:"Plan de Volumen",b:e.data?e.data.text():""};}
  e.waitUntil(self.registration.showNotification(d.t||"Plan de Volumen",{body:d.b||"",tag:d.tag||undefined,icon:"icons/icon-192.png",badge:"icons/icon-192.png",data:{url:"./"}}));});
self.addEventListener("notificationclick",function(e){e.notification.close();e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(cs){for(var i=0;i<cs.length;i++){if("focus" in cs[i])return cs[i].focus();}return self.clients.openWindow("./");}));});
