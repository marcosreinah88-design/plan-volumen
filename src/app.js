(function(){
"use strict";
var $=function(id){return document.getElementById(id);};
var PD=JSON.parse(document.getElementById("pvdata").textContent);
var IMG=PD.img, GD=PD.days, FR=PD.frag;

/*DIET*/

/* ================= constantes del plan ================= */
var KEYS=["dom","lun","mar","mie","jue","vie","sab"];
var GK=["lun","mar","mie","jue","vie","sab"];
var SHORT={lun:"Empuje",mar:"Pull day",mie:"Pierna A",jue:"Brazos",vie:"Torso",sab:"Pierna B",dom:"Batch"};
var WSHORT={lun:"Empuje",mar:"Pull day",mie:"Pierna",jue:"Brazos",vie:"Torso",sab:"Pierna",dom:"Batch"};
var GYMT={lun:"11:45",mar:"10:15",mie:"11:45",jue:"10:15",vie:"15:00",sab:"10:00"};
var GMIN={lun:80,mar:85,mie:75,jue:90,vie:80,sab:80};
var CLS={lun:[["7:00","8:15","Otorrino"],["8:30","10:15","Cirugía"],["19:00","20:15","Gastroenterología"]],
  mar:[["7:00","8:40","Oftalmología"],["9:00","10:15","Psiquiatría"],["13:00","18:00","Campos Clínicos"]],
  vie:[["13:30","15:00","Anfiteatro (das la clase)"]]};
CLS.mie=CLS.lun; CLS.jue=CLS.mar;
var START=new Date(2026,10,2);
var RIRW=[["RIR 3","Aprende técnica y pesos"],["RIR 2","Sube reps o carga"],["RIR 2","Sube reps o carga"],["RIR 1","Aislamientos casi al fallo"],["RIR 0–1","Aislamientos al fallo; básicos a RIR 1"],["Descarga","Mitad de series, mismo peso, RIR 3+"]];
var MES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
var MES3=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
var BASEKG=68.7, TANITA=new Date(2027,0,24);
var KCAL=0,PROT=0; ORDER.forEach(function(k){KCAL+=T[k].kcal;PROT+=T[k].p;});
var fmt=new Intl.NumberFormat("es-MX"), fmt1=new Intl.NumberFormat("es-MX",{maximumFractionDigits:1});

/* ================= utilidades ================= */
function pad(n){return (n<10?"0":"")+n;}
function day0(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate());}
function addD(d,n){var x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()+n);return x;}
function iso(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());}
function fromIso(s){var p=s.split("-");return new Date(+p[0],+p[1]-1,+p[2]);}
function ddiff(a,b){return Math.round((day0(a)-day0(b))/864e5);}
function mins(s){var p=s.split(":");return (+p[0])*60+(+p[1]);}
function nowMin(){var n=new Date();return n.getHours()*60+n.getMinutes();}
function mondayOf(d){var x=day0(d);return addD(x,-((x.getDay()+6)%7));}
function blockInfo(d){var w=Math.floor(ddiff(d,START)/7);if(w<0)return {pre:true,block:1,wk:0};return {block:Math.floor(w/6)+1,wk:w%6};}
function slug(s){return s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,48);}
function nsets(sr){return parseInt(sr,10)||3;}
function restSec(r){var m=String(r).match(/(\d+)(?:\s*[–-]\s*(\d+))?\s*(min|s)/);if(!m)return 90;var a=+m[1],b=m[2]?+m[2]:a,v=(a+b)/2;return m[3]==="min"?Math.round(v*60):Math.round(v);}
function esc(s){return String(s==null?"":s).replace(/[&<>"'`]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"}[c];});}
function dur(m){m=Math.max(0,Math.round(m));if(m<60)return m+" min";var h=Math.floor(m/60),r=m%60;return h+" h"+(r?" "+r:"");}
function e1rm(kg,r){return kg*(1+r/30);}
function dcol(k){return "var(--d-"+k+")";}
function kgs(v){return fmt1.format(v);}
/* cargas del gym: se anotan y se muestran en libras, tal cual. Peso corporal: se guarda y se muestra en kg (se puede cambiar a lb). */
var LB=2.20462;
function bwU(){var c=sget("cfg");return c&&c.bw==="lb"?"lb":"kg";}
function toU(kg){return bwU()==="lb"?kg*LB:kg;}
function fromU(v){return bwU()==="lb"?v/LB:v;}
function bw(kg){return fmt1.format(Math.round(toU(kg)*10)/10);}
function bwOk(v){return bwU()==="lb"?(v>=88&&v<=440):(v>=40&&v<=200);}
function bwMinMax(){return bwU()==="lb"?'min="88" max="440"':'min="40" max="200"';}
function bwName(){return bwU()==="lb"?"libras":"kilos";}
function bwEx(){return bwU()==="lb"?"152.4":"69.2";}
function sameDay(a,b){return ddiff(a,b)===0;}
var ICON={swap:'<path d="M7 7h11l-3-3M17 17H6l3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  cls:'<path d="M2.5 5.5h6.5a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H2.5zM21.5 5.5H15a3 3 0 0 0-3 3v11a2 2 0 0 1 2-2h7.5z"/>',
  meal:'<path d="M3 11h18a9 9 0 0 1-18 0Z"/><path d="M8.5 7.5c0-1.5 1-2 1-3.5M12.5 7.5c0-1.5 1-2 1-3.5M16.5 7.5c0-1.5 1-2 1-3.5"/>',
  gym:'<path d="M6.5 6.5v11M3.5 9v6M17.5 6.5v11M20.5 9v6M6.5 12h11"/>',
  prep:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3 2"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>',
  moon:'<path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.6 6.6 0 0 0 9.7 9.7Z"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  lock:'<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/>',
  scale:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8.5 10a5 5 0 0 1 7 0M12 10l1.5-2"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  play:'<path d="M8 5.5l11 6.5-11 6.5z"/>',
  chart:'<path d="M3.5 3.5v17h17"/><path d="M7.5 15l4-4.5 3 3 5.5-6.5"/>'
};
function ic(n){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+ICON[n]+'</svg>';}
ICON.batch=ICON.meal;
ICON.cre='<rect x="2.6" y="8.6" width="18.8" height="6.8" rx="3.4" transform="rotate(-40 12 12)"/><path d="M9.6 9.1l4.8 5.8"/>';
var toastT=0;
function toast(msg){var t=$("toast");t.textContent=msg;t.classList.add("on");clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove("on");},2600);}

/* ================= guardado: cuenta (db privada) con respaldo en el equipo ================= */
/* PWA: versión instalable (GitHub Pages). Guarda todo en el equipo y tiene respaldo; la build de GitHub cambia esto a true */
var PWA=false;
/* si alguien intenta meter la app instalable dentro de otra página (para engañarte con clics), se sale */
if(PWA){try{if(window.top!==window.self){window.top.location=window.self.location.href;}}catch(e){document.documentElement.style.display="none";}}
var S={col:null,cache:{},timer:{},busy:{},again:{},dirty:{},mode:"local"};
/* ===== seguridad: todo lo que se lee del equipo, de un respaldo o de GitHub pasa por aquí antes de usarse.
   Quita caracteres con los que se podría meter código (< > " ' ` \), llaves peligrosas (__proto__), tamaños absurdos y tipos raros. ===== */
var BADK={"__proto__":1,"constructor":1,"prototype":1};
var BADC=/[<>"'`\\\u0000-\u001f\u007f\u2028\u2029]/g;
function sanV(v,dep){
  if(v===null||typeof v==="boolean")return v;
  if(typeof v==="number")return isFinite(v)?v:null;
  if(typeof v==="string")return v.slice(0,300).replace(BADC,"");
  if(dep>6||typeof v!=="object")return undefined;
  if(Array.isArray(v)){var a=[];for(var i=0;i<v.length&&i<500;i++){var x=sanV(v[i],dep+1);a.push(x===undefined?null:x);}return a;}
  var o={},ks=Object.keys(v),n=0;
  for(var j=0;j<ks.length&&n<600;j++){var k=ks[j];BADC.lastIndex=0;if(BADK[k]||k.length>80||/[<>"'`\\\u0000-\u001f\u007f\u2028\u2029]/.test(k))continue;var y=sanV(v[k],dep+1);if(y!==undefined){o[k]=y;n++;}}
  return o;
}
function sanDoc(k,v){
  if(v==null||typeof v!=="object"||Array.isArray(v))return null;
  var o=sanV(v,0),obj=function(x){return x!=null&&typeof x==="object"&&!Array.isArray(x);};
  if(String(k).indexOf("d-")===0){
    var nm=(typeof MENUS!=="undefined"&&MENUS)?MENUS.length:4;
    if(o.mn!=null&&!(typeof o.mn==="number"&&o.mn===Math.floor(o.mn)&&o.mn>=0&&o.mn<nm))delete o.mn;
    if(o.rk!=null&&!(typeof o.rk==="string"&&(o.rk==="sup"||(GD&&Object.prototype.hasOwnProperty.call(GD,o.rk)))))delete o.rk;
    ["m","s","sw"].forEach(function(f){if(o[f]!=null&&!obj(o[f]))delete o[f];});
    if(o.s)Object.keys(o.s).forEach(function(id){if(!Array.isArray(o.s[id]))delete o.s[id];});
    if(o.rod!=null&&!(typeof o.rod==="number"&&o.rod===Math.floor(o.rod)&&o.rod>=0&&o.rod<=10))delete o.rod;
    if(o.fin!=null&&o.fin!==0&&o.fin!==1)delete o.fin;
    if(o.cf!=null&&!(typeof o.cf==="number"&&o.cf===Math.floor(o.cf)&&o.cf>=0&&o.cf<=20))delete o.cf;
  }
  if(k==="weights")o.e=Array.isArray(o.e)?o.e.filter(function(r){return Array.isArray(r)&&typeof r[0]==="string"&&/^\d{4}-\d\d-\d\d$/.test(r[0])&&typeof r[1]==="number"&&r[1]>20&&r[1]<400;}):[];
  if(k==="cfg"&&o.bw!=null&&o.bw!=="kg"&&o.bw!=="lb")delete o.bw;
  if(k==="tanita"&&o.e!=null&&!obj(o.e))delete o.e;
  if(k==="tanita"&&o.e)Object.keys(o.e).forEach(function(d){var x=o.e[d];if(!obj(x))return;
    if(x.h!=null&&!(typeof x.h==="string"&&/^([01]\d|2[0-3]):[0-5]\d$/.test(x.h)))delete x.h;
    if(x.cond!=null){x.cond=Array.isArray(x.cond)?x.cond.filter(function(c){return typeof c==="string"&&Object.prototype.hasOwnProperty.call(TCOND,c);}):[];if(!x.cond.length)delete x.cond;}
    if(x.nota!=null){if(typeof x.nota!=="string")delete x.nota;else x.nota=x.nota.slice(0,300);}});
  return o;
}
function lsGet(k){try{var v=localStorage.getItem("pvm:"+k);return v?sanDoc(k,JSON.parse(v)):null;}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem("pvm:"+k,JSON.stringify(v));}catch(e){}}
function sget(k){if(!(k in S.cache))S.cache[k]=lsGet(k);return S.cache[k];}
function sput(k,v){if(/^(d-|weights$|tanita$)/.test(k)&&typeof mdSoon==="function")mdSoon();v._t=Date.now();S.cache[k]=v;lsSet(k,v);S.dirty[k]=1;if(PWA)ghSoon();if(S.col){clearTimeout(S.timer[k]);S.timer[k]=setTimeout(function(){flush(k);},700);}}
function flush(k){
  if(!S.col)return;
  if(S.busy[k]){S.again[k]=1;return;}
  S.busy[k]=1;S.dirty[k]=0;setSync("busy");
  var body=JSON.parse(JSON.stringify(S.cache[k]));
  var tries=0;
  (function go(){
    S.col.doc(k).set(body).then(function(){S.busy[k]=0;setSync("on");if(S.again[k]){S.again[k]=0;flush(k);}},
    function(e){
      var c=e&&e.code;
      if(c==="unavailable"&&tries<1){tries++;setTimeout(go,800+Math.random()*900);return;}
      S.busy[k]=0;
      if(c==="quota_exceeded"){toast("Tu espacio de registros está lleno; se guardó solo en este equipo.");}
      setSync("local");S.col=null;acctSet("off");
    });
  })();
}
function setSync(m){
  S.mode=m;var d=$("syncdot"),t=$("synctxt");
  d.classList.toggle("on",m==="on"||m==="busy");
  t.textContent=m==="on"?(PWA?"Sincronizado":"Guardado"):m==="busy"?"Guardando…":PWA?"En tu equipo":"Este equipo";
  $("syncpill").title=m==="local"?(PWA?"Tus registros se guardan en este equipo. Haz un respaldo en Progreso cada semana":"Tus registros se guardan solo en este navegador"):"Tus registros se guardan en tu cuenta y te siguen a cualquier dispositivo";
}
function dk(d){return "d-"+iso(d);}
function dayDoc(d){var k=dk(d),v=sget(k);if(!v){v={day:iso(d),m:{},s:{},w:0};S.cache[k]=v;}if(!v.m)v.m={};if(!v.s)v.s={};return v;}
function saveDay(d){var v=dayDoc(d);v.day=iso(d);sput(dk(d),v);}
function getDoc(k,def){var v=sget(k);if(!v){v=def;S.cache[k]=v;}return v;}

/* juntar sin borrar: si el mismo registro existe en este equipo y en la cuenta, se combinan.
   Base = la copia más reciente; de la otra se agrega lo que falte (series hechas, comidas marcadas, ejercicios, pesos). */
function cp(o){return JSON.parse(JSON.stringify(o));}
function rowDone(r){return !!(r&&r[2]);}
function newerOf(a,b){return (a._t||0)>=(b._t||0)?[a,b]:[b,a];}
function mergeDay(a,b){
  var nb=newerOf(a,b),nw=nb[0],ol=nb[1],out=cp(nw);
  /* un cambio a propósito (borrar, reiniciar, corregir) gana completo sobre copias viejas */
  if((nw._auth||0)>(ol._auth||0)){out._t=Math.max(a._t||0,b._t||0);return out;}
  out.m=out.m||{};out.s=out.s||{};
  var om=ol.m||{};Object.keys(om).forEach(function(k){if(om[k]&&out.m[k]===undefined)out.m[k]=om[k];});
  var os=ol.s||{};Object.keys(os).forEach(function(id){
    var o=os[id]||[];if(!out.s[id]){out.s[id]=cp(o);return;}
    var n=out.s[id];for(var j=0;j<o.length;j++){if(!rowDone(n[j])&&rowDone(o[j]))n[j]=cp(o[j]);}
  });
  out.w=Math.max(a.w||0,b.w||0);if(a.ml!=null||b.ml!=null){out.ml=(nw.ml!=null?nw.ml:ol.ml);}
  if(a.cf!=null||b.cf!=null){out.cf=(nw.cf!=null?nw.cf:ol.cf);}
  if(!out.ss&&ol.ss){out.ss=ol.ss;if(ol.se)out.se=ol.se;}
  else if(out.ss&&ol.ss&&ol.ss<out.ss)out.ss=ol.ss;
  if(ol.lt&&(!out.lt||ol.lt>out.lt))out.lt=ol.lt;
  if(!out.med&&ol.med)out.med=ol.med;if(!out.gc&&ol.gc)out.gc=ol.gc;if(out.rod==null&&ol.rod!=null)out.rod=ol.rod;if(out.fin==null&&ol.fin!=null)out.fin=ol.fin;
  out._t=Math.max(a._t||0,b._t||0);
  return out;
}
function mergeMap(a,b,pick){
  var nb=newerOf(a,b),nw=nb[0],ol=nb[1],out={};
  Object.keys(nw).concat(Object.keys(ol)).forEach(function(id){if(id==="_t"||out.hasOwnProperty(id))return;var v=pick(nw[id],ol[id]);if(v!=null)out[id]=cp(v);});
  out._t=Math.max(a._t||0,b._t||0);return out;
}
function mergeDocs(k,a,b){
  a=a?sanDoc(k,a):null;b=b?sanDoc(k,b):null;
  if(!a)return b?cp(b):null;if(!b)return cp(a);
  if(k.indexOf("d-")===0)return mergeDay(a,b);
  if(k==="last")return mergeMap(a,b,function(n,o){if(!n)return o;if(!o)return n;return (o.d||"")>(n.d||"")?o:n;});
  if(k==="tanita"){var o=cp(newerOf(a,b)[0]);o.e={};[a,b].forEach(function(x){Object.keys(x.e||{}).forEach(function(d){var v=x.e[d];if(!o.e[d]||(v&&(v._t||0)>(o.e[d]._t||0)))o.e[d]=cp(v);});});o._t=Math.max(a._t||0,b._t||0);return o;}
  if(k==="best")return mergeMap(a,b,function(n,o){if(!n)return o;if(!o)return n;return (o.e||0)>(n.e||0)?o:n;});
  var nb=newerOf(a,b),nw=nb[0],ol=nb[1],out=cp(nw);
  if(k==="weights"){var m={};(ol.e||[]).forEach(function(x){m[x[0]]=x;});(nw.e||[]).forEach(function(x){m[x[0]]=x;});out.e=Object.keys(m).sort().map(function(d){return cp(m[d]);});}
  else if(k==="shop"){Object.keys(ol).forEach(function(mi){if(mi!=="_t"&&!out[mi])out[mi]=cp(ol[mi]);});}
  out._t=Math.max(a._t||0,b._t||0);
  return out;
}
/* cuenta: "wait" mientras conecta, "on" conectada, "off" sin cuenta en esta ventana */
S.acct="wait";var connecting=false;
function acctSet(st){S.acct=st;acctUI();}
function acctUI(){
  var b=$("acct");if(!b)return;
  if(PWA||S.acct!=="off"){b.hidden=true;b.innerHTML="";return;}
  var paint=function(why,btn){
    b.innerHTML='<div class="ac-t"><b>Esta ventana no tiene tu cuenta</b><span>'+why+'</span></div><div class="ac-b">'+(btn||'')+'<button class="btn ghost sm" type="button" data-acct="retry">Reintentar</button></div>';
    b.hidden=false;
  };
  paint('Aquí no aparece tu historial y lo que anotes se queda solo en este celular. Ábrelo desde la app de Claude, o inicia sesión en claude.ai en esta misma ventana y toca Reintentar.');
  if(!(window.claude&&typeof window.claude.use==="function"))return;
  window.claude.use("permissions").then(function(pm){
    if(!pm||S.acct!=="off")return;
    return pm.state("db").then(function(st){
      if(S.acct!=="off")return;
      if(st==="denied")paint('Le dijiste que no al permiso de guardar en tu cuenta, así que lo que anotes se queda solo en este celular y no ves tu historial.','<button class="btn pri sm" type="button" data-acct="manage">Abrir permisos</button>');
      else if(st==="prompt")paint('Falta que le des permiso de guardar en tu cuenta. Mientras, lo que anotes se queda solo en este celular y no ves tu historial.','<button class="btn pri sm" type="button" data-acct="perm">Dar permiso</button>');
    });
  }).catch(function(){});
}
function connect(){
  if(S.col||connecting)return;
  if(PWA){setSync("local");return;}
  if(!window.claude||typeof window.claude.use!=="function"){acctSet("off");return;}
  connecting=true;
  var tm=setTimeout(function(){if(!S.col)acctSet("off");},10000);
  function fail(){clearTimeout(tm);connecting=false;if(!S.col){setSync("local");acctSet("off");}}
  Promise.all([window.claude.use("db"),window.claude.use("user")]).then(function(r){
    var db=r[0],user=r[1];
    if(!db||!user){fail();return;}
    return user.id().then(function(id){
      if(!id){fail();return;}
      var col=db.collection("data/users/"+id);
      var from=iso(addD(mondayOf(TODAY),-21));
      return Promise.all([col.doc("weights").get(),col.doc("best").get(),col.doc("last").get(),col.doc("shop").get(),col.doc("cfg").get(),col.doc("tanita").get(),col.where("day",">=",from).get()]).then(function(res){
        clearTimeout(tm);connecting=false;
        var push=[];
        function merge(k,snap){
          var rem=snap&&snap.exists?snap.data():null,loc=lsGet(k),out=mergeDocs(k,loc,rem);
          if(!out)return;
          S.cache[k]=out;lsSet(k,out);
          if(!rem||JSON.stringify(out)!==JSON.stringify(rem))push.push(k);
        }
        ["weights","best","last","shop","cfg","tanita"].forEach(function(k,i){merge(k,res[i]);});
        var seen={};
        res[6].docs.forEach(function(sn){seen[sn.id]=1;merge(sn.id,sn);});
        for(var i=-21;i<=7;i++){var k=dk(addD(TODAY,i));if(!seen[k]&&lsGet(k))merge(k,null);}
        var L=S.cache.last,lchg=false;
        if(L)push.forEach(function(k){
          if(k.indexOf("d-")!==0)return;var dd=S.cache[k],day=k.slice(2);if(!dd||!dd.s)return;
          Object.keys(dd.s).forEach(function(id){
            var e=L[id];if(!e||e.d!==day)return;
            var sets=(dd.s[id]||[]).filter(rowDone).map(function(r){return [+r[0]||0,+r[1]||0];}).filter(function(x){return x[1]>0;});
            if(sets.length&&JSON.stringify(sets)!==JSON.stringify(e.s)){e.s=sets;lchg=true;}
          });
        });
        if(lchg){L._t=Date.now();lsSet("last",L);if(push.indexOf("last")<0)push.push("last");}
        S.col=col;setSync("on");acctSet("on");
        if(wsel===wsel0&&!wfor&&!wtoday){wsel=defWsel(TODAY);wsel0=wsel;}
        /* en vivo: si otro equipo (o una corrección) guarda un día más nuevo, esta ventana lo toma completo */
        try{col.where("day",">=",from).onSnapshot(function(q){
          var chg=false;
          q.docs.forEach(function(sn){var k=sn.id,rem=sn.data();if(!rem||S.busy[k]||S.dirty[k])return;var loc=S.cache[k];
            if(!loc||(rem._t||0)>(loc._t||0)){S.cache[k]=JSON.parse(JSON.stringify(rem));lsSet(k,S.cache[k]);chg=true;}});
          if(chg){var ae=document.activeElement;if(!(ae&&ae.tagName==="INPUT"))renderAll();}
        },function(){});}catch(e){}
        push.forEach(function(k){flush(k);});
        if(push.length)toast("Se juntaron tus registros de este celular con los de tu cuenta");
        var ae=document.activeElement;if(!(ae&&ae.tagName==="INPUT"&&view==="entreno"))renderAll();
      });
    });
  }).catch(fail);
}

/* ================= estado de la vista ================= */
var TODAY=day0(new Date()), selDay=TODAY, view="hoy", wsel=null, cmSeg="semana", cmMenu=weekMenu(TODAY), openMeal={};
var TKEY=KEYS[TODAY.getDay()];
wsel=GD[TKEY]?TKEY:"lun";

function exList(k,d){var G=d?GDat(d):GD;return G[k]?G[k].ex:[];}
function exId(e){return e.id||slug(e.n);}
function routineTotal(k){var t=0;exList(k).forEach(function(e){t+=nsets(e.sr);});return t;}
/* ===== modos de semana (plan anti-abandono): completa, ocupada (4 días, 2 series), supervivencia (2–3 sesiones de cuerpo completo) ===== */
(function(){
  function pick(k,n){var e=(GD[k]?GD[k].ex:[]).filter(function(x){return x.n.indexOf(n)===0;})[0];return e?JSON.parse(JSON.stringify(e)):null;}
  var L=[pick("lun","Press inclinado con mancuernas"),pick("mar","Jalón al pecho"),pick("sab","Peso muerto rumano"),pick("jue","Press militar con mancuernas"),pick("jue","Curl con barra EZ"),pick("jue","Jalón de tríceps con cuerda")].filter(Boolean);
  L.forEach(function(e){e.sr="2 × "+(e.sr.split("×")[1]||"8–12").trim();e.ss="";});
  if(L.length>5){L[4].ss="Superserie";L[5].ss="Superserie";}
  GD.sup={id:"sup",eyebrow:"Supervivencia",t:"Cuerpo completo",tm:"30–40 min · "+L.length*2+" series",notes:["Semana de supervivencia: haz esta sesión 2 o 3 veces, cuando puedas. Cada una cuenta como semana ganada si llegas a 2."],ex:L};
  GYMT.sup="cuando puedas";GMIN.sup=40;SHORT.sup="Cuerpo completo";WSHORT.sup="Completo";
})();
var MODES={full:{n:"Completa",d:"Los 6 días de la rutina."},ocu:{n:"Ocupada",d:"4 días (lun, mar, mié y vie) con 2 series por ejercicio. Jueves y sábado son descanso."},sup:{n:"Supervivencia",d:"2 o 3 sesiones cortas de cuerpo completo cuando puedas. Los demás días no cuentan en contra."}};
var OCU=["lun","mar","mie","vie"];
/* ===== rutina con fecha: desde el lunes 9 nov 2026 entra la versión ajustada (revisión del 7 nov).
   Los días anteriores se siguen viendo y contando con la rutina de antes, así no cambia nada de lo ya hecho. ===== */
var CHG=new Date(2026,10,9),REV=new Date(2026,10,22);
function routine9(G){
  /* brazos del viernes al final del sábado: ~48 h de descanso después del jueves */
  var mv=G.vie.ex.filter(function(e){return /^Curl en polea baja|^Extensión de tríceps en polea con barra recta/.test(e.n);});
  G.vie.ex=G.vie.ex.filter(function(e){return mv.indexOf(e)<0;});G.sab.ex=G.sab.ex.concat(mv);
  /* cuádriceps de 5 a 7 series por semana */
  G.mie.ex.forEach(function(e){if(/^Extensión de cuádriceps/.test(e.n)){e.sr="4 × 10–15";e.note=(e.note?e.note+" ":"")+PD.nov9.cuad;}});
  G.sab.ex.forEach(function(e){if(/^Extensión de cuádriceps/.test(e.n))e.sr="3 × 10–15";});
  /* viernes: dominadas asistidas (o jalón supino); lunes: press francés con mancuernas (no hay barra EZ) */
  G.vie.ex=G.vie.ex.map(function(e){return /^Dominadas/.test(e.n)?JSON.parse(JSON.stringify(PD.nov9.dom)):e;});
  G.lun.ex=G.lun.ex.map(function(e){return /^Press francés/.test(e.n)?JSON.parse(JSON.stringify(PD.nov9.pf)):e;});
  /* lunes: aperturas en máquina (pec deck) en vez de polea, pedido el 9 nov; la polea queda como opción si la máquina está ocupada */
  G.lun.ex=G.lun.ex.map(function(e){return /^Aperturas en polea/.test(e.n)?JSON.parse(JSON.stringify(PD.nov9.ap)):e;});
  /* lunes: elevaciones laterales con mancuernas en vez de polea (no le gustó la polea, 9 nov); mismo ejercicio que jueves, comparte historial */
  G.lun.ex=G.lun.ex.map(function(e){return /^Elevaciones laterales en polea/.test(e.n)?JSON.parse(JSON.stringify(G.jue.ex.filter(function(x){return /^Elevaciones laterales con mancuernas/.test(x.n);})[0]||e)):e;});
  G.mie.tm="≈80 min · 20 series";G.vie.tm="≈70 min · 16 series";G.sab.tm="≈95 min · 24 series";
  return G;
}
var GD0=GD,GD9=routine9(JSON.parse(JSON.stringify(GD))),GMIN0=GMIN,GMIN9={};
Object.keys(GMIN0).forEach(function(k){GMIN9[k]=GMIN0[k];});GMIN9.mie=80;GMIN9.vie=70;GMIN9.sab=95;
function GDat(d){return ddiff(d,CHG)<0?GD0:GD9;}
function GMat(d){return ddiff(d,CHG)<0?GMIN0:GMIN9;}
/* variantes: un ejercicio puede traer otra opción (sin máquina asistida ni liga: jalón supino). La elección se guarda en cfg.alt */
function applyAlt(){var A=(sget("cfg")||{}).alt||{};[GD0,GD9].forEach(function(G){GK.forEach(function(k){(G[k]&&G[k].ex||[]).forEach(function(e,i){var b=e._base||e;if(!b.alt)return;var w=A[exId(b)]?b.alt:b;if(w!==e){if(w!==b)w._base=b;G[k].ex[i]=w;}});});});}
function setRoutine(){GD=GDat(TODAY);GMIN=GMat(TODAY);applyAlt();}
setRoutine();
function defWsel(t){return dayRK(t)||(modeOf(t)==="sup"?"sup":GD[KEYS[t.getDay()]]?KEYS[t.getDay()]:"lun");}
wsel=defWsel(TODAY);var wsel0=wsel;
/* cambio de día (medianoche o al volver a abrir): todo regresa a "hoy" para que nada se guarde en el día anterior */
function newDay(t){wsel0=null;var wasT=sameDay(selDay,TODAY);TODAY=t;setRoutine();TKEY=KEYS[t.getDay()];if(wasT||ddiff(selDay,t)>0)selDay=t;wsel=defWsel(t);wtoday=false;wfor=null;sessEdit=false;renderAll();}
function weekKey(d){return iso(mondayOf(d));}
function modeOf(d){var C=sget("cfg")||{};return (C.wm&&C.wm[weekKey(d)])||"full";}
function setMode(d,m){var C=JSON.parse(JSON.stringify(sget("cfg")||{}));if(!C.wm)C.wm={};if(m==="full")delete C.wm[weekKey(d)];else C.wm[weekKey(d)]=m;sput("cfg",C);}
function capFor(d){return modeOf(d)==="ocu"?2:99;}
function setsN(e,d){return Math.min(nsets(e.sr),capFor(d||woDate()));}
/* qué rutina cuenta ese día (null = descanso, no cuenta en contra) */
function dayRK(d){var v=sget(dk(d));return v&&v.rk&&GD[v.rk]?v.rk:null;}
function setRK(d,k){var dd=dayDoc(d),def=KEYS[d.getDay()];delete dd.gc;if(k===def&&modeOf(d)==="full")delete dd.rk;else dd.rk=k;dd._auth=Date.now();saveDay(d);}
/* gimnasio cerrado ese día (dd.gc): si no hiciste series, el gym no cuenta ni en racha ni en estadísticas; la dieta sí, como el domingo */
function gymClosed(d){var v=sget(dk(d));if(!v||!v.gc)return false;var s=v.s||{};return !Object.keys(s).some(function(x){return (s[x]||[]).some(rowDone);});}
function planKey(d){return gymClosed(d)?null:planKey0(d);}
function planKey0(d){var rk=dayRK(d);if(rk)return rk;var m=modeOf(d),k=KEYS[d.getDay()],done=rawDone(d)>0;
  if(m==="sup")return done?"sup":null;
  if(m==="ocu")return OCU.indexOf(k)>=0?k:(done&&GD[k]?k:null);
  return GD[k]?k:null;}
function planTotal(d){var k=planKey(d);if(!k)return 0;var cap=capFor(d),t=0;exList(k,d).forEach(function(e){t+=Math.min(nsets(e.sr),cap);});return t;}
function entTotal(k,d){var cap=capFor(d),t=0;exList(k,d).forEach(function(e){t+=Math.min(nsets(e.sr),cap);});return t;}
/* series hechas de un día: solo las de la rutina que cuenta ese día y hasta el número de series que toca
   (antes contaba cualquier serie guardada en el día: otra rutina, el ejercicio alterno o series de más) */
function rawDone(d){var dd=dayDoc(d),n=0;Object.keys(dd.s).forEach(function(x){(dd.s[x]||[]).forEach(function(r){if(r&&r[2])n++;});});return n;}
function doneSets(d){var k=planKey(d);if(!k)return rawDone(d);var dd=dayDoc(d),cap=capFor(d),n=0;
  exList(k,d).forEach(function(e){var b=e._base||e,ids=[exId(e)];if(b!==e)ids.push(exId(b));else if(b.alt)ids.push(exId(b.alt));
    var lim=Math.min(nsets(e.sr),cap);for(var j=0;j<lim;j++){if(ids.some(function(id){return rowDone((dd.s[id]||[])[j]);}))n++;}});
  return n;}
/* batido opcional: 1 scoop (≈30 g) en agua = 3 equivalentes de AOA muy bajo en grasa */
var BAT={kcal:120,p:21};
function hm(m){return Math.floor(m/60)+":"+pad(m%60);}
function mealsDone(d){var dd=dayDoc(d),n=0,kc=0,p=0;ORDER.forEach(function(k){if(dd.m[k]){n++;kc+=T[k].kcal;p+=T[k].p;}});if(dd.m.bat){kc+=BAT.kcal;p+=BAT.p;}return {n:n,kc:kc,p:p};}

/* ================= HOY ================= */
function mealName(d,k){var h=DAYS[d.getDay()].h;return (HNAME[h]&&HNAME[h][k])||T[k].n;}
/* menú del día: el de la semana, o el que elegiste ese día */
function dayMenu(d){var v=sget(dk(d));return v&&v.mn!=null&&MENUS[v.mn]?v.mn:weekMenu(d);}
var mpick=false,rpick=false,swOpen={};
/* todas las opciones de un mismo tiempo de comida (mismos equivalentes) */
function allMeals(k){
  var out=[],seen={};function add(o,src){if(o&&o.t&&!seen[o.t]){seen[o.t]=1;out.push({o:o,src:src});}}
  var DK=["lun","mar","mie","jue","vie","sab"],DN={lun:"lun",mar:"mar",mie:"mié",jue:"jue",vie:"vie",sab:"sáb"};
  MENUS.forEach(function(M,i){
    if(k==="com"||k==="cen")DK.forEach(function(x){if(M.days[x])add(M.days[x][k],"Menú "+(i+1)+" · "+DN[x]);});
    else if(k==="des")add(M.des,"Menú "+(i+1));
    else if(k==="col")add(M.col,"Menú "+(i+1));
  });
  if(k==="com"||k==="cen")add(DOM[k],"Domingo");
  if(k==="des")add(DES_B,"Sin licuadora");
  if(k==="col")add(COL_B,"Para llevar");
  if(k==="pre")PRE.forEach(function(o,i){add(o,"Opción "+(i+1));});
  return out;
}
function mealOpts(d,k){var base=mealOpts0(d,k),v=sget(dk(d)),t=v&&v.sw&&v.sw[k];
  if(t&&t!==base[0].t){var hit=allMeals(k).filter(function(x){return x.o.t===t;})[0];if(hit)return [hit.o,base[0],true];}
  return base;}
function mealOpts0(d,k){
  var DY=DAYS[d.getDay()],M=MENUS[dayMenu(d)],isSun=DY.k==="dom";
  if(k==="com"||k==="cen")return [isSun?DOM[k]:M.days[DY.k][k],null];
  if(k==="des")return [M.des,DES_B];
  if(k==="col")return isSun?[COL_B,M.col]:[M.col,COL_B];
  var hosp=DY.h==="MJ";return hosp?[PRE[1],PRE[0]]:[PRE[0],PRE[1]];
}
function chips(eq){return '<div class="eqs">'+eq.map(function(e){var g=G[e[0]];return '<span class="eq" style="--gc:var('+g.c+')"><b>'+e[1]+'</b>'+g.s+'</span>';}).join("")+'</div>';}
function dish(o){return '<div class="dish"><h4>'+o.t+'</h4><p>'+o.d+'</p>'+(o.tip?'<p class="tip">'+o.tip+'</p>':'')+'</div>';}

function ringHTML(id,color){return '<div class="ring" id="'+id+'"><svg viewBox="0 0 100 100" role="img"><circle class="trk" cx="50" cy="50" r="42"/><circle class="val" cx="50" cy="50" r="42" style="stroke:'+color+'" stroke-dasharray="263.9" stroke-dashoffset="263.9"/><circle class="ov" cx="50" cy="50" r="42" style="--rc:'+color+'" stroke-dasharray="263.9" stroke-dashoffset="263.9"/><text x="50" y="46"></text><text class="u" x="50" y="66"></text></svg><div class="lab"><span></span><b></b><em></em></div></div>';}
function setRing(id,p,big,unit,label,sub){
  var r=$(id);if(!r)return;var c=r.querySelector(".val"),t=r.querySelectorAll("text");
  t[0].textContent=big;t[1].textContent=unit;r.querySelector(".lab span").textContent=label;r.querySelector(".lab b").textContent=sub;
  r.querySelector("svg").setAttribute("aria-label",label+": "+big+" "+sub);
  var off=(263.9*(1-Math.max(0,Math.min(1,p)))).toFixed(1),ex=Math.max(0,Math.min(1,p-1)),ov=r.querySelector(".ov"),ooff=(263.9*(1-ex)).toFixed(1);
  /* segunda vuelta más oscura con sombra: cuánto te pasaste de la meta */
  r.classList.toggle("over",p>1.005);
  r.querySelector(".lab em").textContent=p>1.005?"+"+Math.round((p-1)*100)+"% de más":"";
  requestAnimationFrame(function(){requestAnimationFrame(function(){c.setAttribute("stroke-dashoffset",off);if(ov)ov.setAttribute("stroke-dashoffset",ooff);});});
}
function relName(d){var x=ddiff(d,TODAY);return x===0?"Hoy":x===1?"Mañana":x===-1?"Ayer":"";}

function renderHero(){
  var d=selDay,k=KEYS[d.getDay()],DY=DAYS[d.getDay()],mi=dayMenu(d),M=MENUS[mi],bi=blockInfo(d),rel=relName(d),wm=weekMenu(d),chg=mi!==wm;
  var md=modeOf(d),rk=dayRK(d),pk=rk||(md==="sup"?null:(md==="ocu"&&OCU.indexOf(k)<0?null:(GD[k]?k:null)));
  var gymTag=rk?'<span class="tag" style="--tc:var(--gym)"><i></i>'+GD[rk].t+' <small class="chg">cambiada</small></span>':md==="sup"?'<span class="tag" style="--tc:var(--gym)"><i></i>Supervivencia · 2–3 sesiones cortas</span>':pk?'<span class="tag" style="--tc:var(--gym)"><i></i>'+GD[k].t+' · '+GYMT[k]+(md==="ocu"?' · 2 series':'')+'</span>':'<span class="tag" style="--tc:var(--muted)"><i></i>Descanso'+(md==="ocu"&&GD[k]?' · semana ocupada':'')+'</span>';
  if(gymClosed(d))gymTag='<span class="tag" style="--tc:var(--muted)"><i></i>Gimnasio cerrado</span>';
  $("hero").style.setProperty("--dc",dcol(k));
  $("hero").innerHTML='<div class="hero-top"><div class="bigdate"><span class="n">'+d.getDate()+'</span><div class="w"><b>'+DY.n+'</b><span>'+MES[d.getMonth()]+' '+d.getFullYear()+(rel?' · '+rel:'')+'</span></div></div></div>'+
    '<div class="hero-tags">'+gymTag.replace('<span class="tag"','<button type="button" class="tag mtag'+(rk?' chg':'')+'" data-rpick aria-expanded="'+rpick+'"').replace(/<\/span>$/,'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5"/></svg></button>')+
    (rpick?'<div class="mpick"><p class="small muted">¿Qué rutina hiciste '+(rel==="Hoy"?'hoy':'este día')+'?</p><div class="mpk">'+GK.concat(["sup"]).map(function(x){return '<button type="button" data-rk="'+x+'" aria-pressed="'+(x===pk)+'"><b>'+GD[x].t+(x===k&&GD[k]?' <em>del día</em>':'')+'</b><span>'+(x==="sup"?'Sesión corta, 30–40 min':DAYS[KEYS.indexOf(x)].n)+'</span></button>';}).join("")+'</div></div>':'')+'<button type="button" class="tag mtag'+(chg?' chg':'')+'" data-mpick style="--tc:var(--food)" aria-expanded="'+mpick+'"><i></i>Menú '+(mi+1)+' · '+M.n+(chg?' <small>cambiado</small>':'')+'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5"/></svg></button></div>'+
    (mpick?'<div class="mpick"><p class="small muted">¿Qué menú comiste '+(rel==="Hoy"?'hoy':'este día')+'? Esta semana toca el Menú '+(wm+1)+'.</p><div class="mpk">'+MENUS.map(function(X,i){return '<button type="button" data-mn="'+i+'" aria-pressed="'+(i===mi)+'"><b>Menú '+(i+1)+(i===wm?' <em>semana</em>':'')+'</b><span>'+X.n+'</span></button>';}).join("")+'</div></div>':'')+
    '<div class="rings">'+ringHTML("rk","var(--food)")+ringHTML("rp","var(--ok)")+ringHTML("rs","var(--gym)")+'</div>';
  updRings();
}
function updRings(){
  var d=selDay,k=KEYS[d.getDay()],m=mealsDone(d),tot=planTotal(d),ds=doneSets(d);
  setRing("rk",m.kc/KCAL,fmt.format(m.kc),"kcal","Calorías","de "+fmt.format(KCAL));
  setRing("rp",m.p/PROT,m.p,"g prot","Proteína","de "+PROT+" g");
  if(tot)setRing("rs",ds/tot,ds,"series","Entreno","de "+tot);
  else if(gymClosed(d))setRing("rs",0,"—","cerrado","Entreno","gimnasio cerrado");else setRing("rs",0,"—","descanso","Entreno","día libre");
}
/* ===== semanas pasadas: se pueden ver, no editar ===== */
function locked(d){return ddiff(d,mondayOf(TODAY))<0;}
function roHoy(){return locked(selDay);}
function roWo(){return !!(wfor&&locked(wfor));}
function wkMin(){var m=mondayOf(START),k=Object.keys(collectDays()).sort()[0];if(k){var f=mondayOf(fromIso(k));if(ddiff(f,m)<0)m=f;}return m;}
function wkRange(mon){var sun=addD(mon,6);return mon.getMonth()===sun.getMonth()?mon.getDate()+'–'+sun.getDate()+' '+MES3[sun.getMonth()]:mon.getDate()+' '+MES3[mon.getMonth()]+' – '+sun.getDate()+' '+MES3[sun.getMonth()];}
function wnavHTML(mon){var n=Math.round(ddiff(mondayOf(TODAY),mon)/7),prev=ddiff(mon,wkMin())>0,chv=function(d){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+d+'"/></svg>';};
  return '<button type="button" class="wnb" data-wk="-1" aria-label="Semana anterior"'+(prev?'':' disabled')+'>'+chv("M15 6l-6 6 6 6")+'</button><div class="wnl"><b>'+(n===0?'Esta semana':n===1?'Semana pasada':'Hace '+n+' semanas')+'</b><span>'+wkRange(mon)+(n>0?' · solo para ver':'')+'</span></div>'+(n>0?'<button type="button" class="wnb wnh" data-wk="0">Hoy</button>':'')+'<button type="button" class="wnb" data-wk="1" aria-label="Semana siguiente"'+(n>0?'':' disabled')+'>'+chv("M9 6l6 6-6 6")+'</button>';}
function roBlock(e){e.preventDefault();e.stopPropagation();toast("Semana pasada: solo para ver");}
/* rutina que se muestra al ver un día pasado: la que hiciste ese día */
function woKey(d){var k=dayKeyOf(d);return GDat(d)[k]?k:"lun";}
function renderWeek(){
  var mon=mondayOf(selDay),h="";
  for(var i=0;i<7;i++){
    var d=addD(mon,i),k=KEYS[d.getDay()],m=mealsDone(d),tot=planTotal(d),ds=doneSets(d);
    var mw=k==="dom"?m.n/5*100:m.n/5*50, sw=tot?Math.min(1,ds/tot)*50:0;
    h+='<button type="button" class="wd'+(sameDay(d,TODAY)?' today':'')+'" data-d="'+iso(d)+'" aria-pressed="'+sameDay(d,selDay)+'" style="--wc:'+dcol(k)+'" aria-label="'+DAYS[d.getDay()].n+' '+d.getDate()+'"><span class="l">'+DAYS[d.getDay()].s+'</span><span class="d">'+d.getDate()+'</span><span class="g">'+WSHORT[k]+'</span><span class="bar"><i class="m" style="width:'+mw+'%"></i><i class="s" style="width:'+sw+'%"></i></span></button>';
  }
  $("week").innerHTML=h;$("hwnav").innerHTML=wnavHTML(mon);$("v-hoy").classList.toggle("ro",roHoy());
}
function dayItems(d){
  var k=KEYS[d.getDay()],DY=DAYS[d.getDay()],hr=HRS[DY.h],it=[];
  (CLS[k]||[]).forEach(function(c){it.push({type:"cls",s:mins(c[0]),e:mins(c[1]),t:c[2],a:c[0],b:c[1]});});
  ORDER.forEach(function(m){var s=mins(hr[m]);it.push({type:"meal",k:m,s:s,e:s+30,a:hr[m]});});
  var GM=GMat(d),cl=gymClosed(d),ge=GD[k]&&!cl?mins(GYMT[k])+GM[k]:null;
  if(ge!=null)it.push({type:"cre",s:ge,e:ge+30,a:hm(ge),post:true});
  else it.push({type:"cre",s:mins(hr.des)+1,e:mins(hr.des)+31,a:hr.des});
  var bt=ge!=null?ge+1:mins(hr.pre)+1;it.push({type:"bat",s:bt,e:bt+30,a:ge!=null?hm(ge):hr.pre,post:ge!=null});
  var rkk=dayRK(d);if(rkk){var gt=GYMT[k]&&GYMT[k].indexOf(":")>0?GYMT[k]:"10:00",s0=mins(gt);it.push({type:"gym",k:rkk,s:s0,e:s0+GM[rkk],a:gt,cl:cl});}
  else if(GD[k]&&(planKey0(d)===k||(modeOf(d)==="full"))){var s=mins(GYMT[k]);it.push({type:"gym",k:k,s:s,e:s+GM[k],a:GYMT[k],cl:cl});}
  if(k==="mie")it.push({type:"prep",s:mins("21:30"),e:mins("21:50"),a:"21:30"});
  if(k==="dom")it.push({type:"batch",s:mins("12:00"),e:mins("13:30"),a:"12:00"});
  it.sort(function(x,y){return x.s-y.s||(x.type==="cls"?-1:1);});
  return it;
}
function itemTitle(d,x){
  if(x.type==="cls")return [x.t,x.a+"–"+x.b];
  if(x.type==="meal"){var o=mealOpts(d,x.k)[0];return [mealName(d,x.k)+": "+o.t,T[x.k].kcal+" kcal · "+T[x.k].p+" g de proteína"];}
  if(x.type==="gym"){if(x.cl)return ["Gimnasio cerrado","No cuenta en tu racha"];var gg=GDat(d)[x.k]||GD[x.k];return ["Entreno: "+gg.t,gg.tm];}
  if(x.type==="cre")return ["Creatina · 5 g",x.post?"Al terminar el entreno, en agua o en tu batido":"Con el desayuno, en el licuado o en agua"];
  if(x.type==="bat")return ["Batido de proteína (opcional)","≈"+BAT.kcal+" kcal · "+BAT.p+"–24 g de proteína"];
  if(x.type==="prep")return ["Prep para el jueves","20 minutos antes de dormir"];
  return ["Batch del Menú "+(weekMenu(d)+1),"90 minutos de cocina"];
}
function renderNext(){
  var box=$("next");
  if(!sameDay(selDay,TODAY)){box.innerHTML="";return;}
  var d=TODAY,its=dayItems(d),n=nowMin(),dd=dayDoc(d),cur=null,nx=null,due=null;
  its.forEach(function(x){
    if(x.type==="cre"&&x.post&&!dd.m.cre&&x.s<=n&&n<x.s+120)due=x;
    if(x.type==="bat"||x.cl)return;
    var done=(x.type==="meal"&&dd.m[x.k])||(x.type==="cre"&&dd.m.cre);
    if(!cur&&x.type!=="meal"&&x.type!=="cre"&&x.s<=n&&n<x.e)cur=x;
    if(!nx&&x.s>n&&!done)nx=x;
  });
  var x,lab,cd,cdl,dday=d;
  if(cur&&cur.type==="gym"){x=cur;lab="Ahora";cd=dur(cur.e-n);cdl="Quedan";}
  else if(due){x=due;lab="Ahora · al salir del gym";cd="";cdl="";}
  else if(nx){x=nx;lab="Siguiente · "+nx.a;cd=dur(nx.s-n);cdl="Faltan";}
  else if(cur){x=cur;lab="Ahora";cd=dur(cur.e-n);cdl="Termina en";}
  else{dday=addD(d,1);var t=dayItems(dday);x=t[0];lab="Mañana · "+x.a;cd="";cdl="";}
  var tt=itemTitle(dday,x),col=x.type==="gym"?"var(--gym)":x.type==="cls"?"var(--muted)":x.type==="cre"?"var(--d-jue)":"var(--food)";
  box.innerHTML='<div class="next" style="--nc:'+col+'"><div class="ico">'+ic(x.type==="cls"?"cls":x.type==="gym"?"gym":x.type==="prep"?"prep":x.type==="cre"?"cre":"meal")+'</div><div class="t"><span class="eyebrow">'+lab+'</span><b>'+tt[0]+'</b><span>'+tt[1]+'</span></div>'+(cd?'<div class="cd">'+cd+'<small>'+cdl+'</small></div>':'')+'</div>';
}
function creStreak(){var n=0,d=TODAY,v=sget(dk(d));if(!(v&&v.m&&v.m.cre))d=addD(d,-1);while(n<500){v=sget(dk(d));if(!(v&&v.m&&v.m.cre))break;n++;d=addD(d,-1);}return n;}
function creBlock(d){
  var dd=dayDoc(d),fut=ddiff(d,TODAY)>0,id=iso(d)+"cre",op=!!openMeal[id],st=sameDay(d,TODAY)?creStreak():0,gd=!!GD[KEYS[d.getDay()]]&&!gymClosed(d);
  var hn=[gd?"post-entreno":"con el desayuno",st>1?"racha de "+st+" días":""].filter(Boolean).join(" · ");
  return '<article class="meal sup'+(dd.m.cre?' done':'')+'"><div class="meal-h"><button type="button" class="k" data-tog="'+id+'" aria-expanded="'+op+'"><span class="eyebrow">Suplemento</span><b>Creatina monohidratada · 5 g</b><span>0 kcal · no cambia tus equivalentes</span><span class="hn">'+hn+'</span></button>'+
    '<input type="checkbox" class="chk" data-meal="cre"'+(dd.m.cre?' checked':'')+(fut?' disabled title="Aún no llega este día"':locked(d)?' disabled title="Semana pasada: solo para ver"':'')+' aria-label="Marcar creatina como tomada"></div>'+
    '<div class="meal-b"'+(op?'':' hidden')+'><div class="dish"><p>'+(gd?'5 g al terminar el entreno, en un vaso de agua o dentro de tu batido de proteína. El domingo, que no hay gym, tómala con el desayuno.':'Hoy no hay gym: 5 g con el desayuno, en el licuado o en un vaso de agua. En los días de descanso también se toma.')+' Revisa la etiqueta: casi todos los botes traen un scoop de 5 g.</p>'+
    '<p class="tip">Tomarla después de entrenar te ayuda a no olvidarla; lo que más cuenta es no saltarte ningún día. No hace falta fase de carga: con la dosis diaria el músculo se satura en unas 4 semanas. En esas semanas la báscula puede subir un poco más rápido; es agua dentro del músculo, no grasa. Si te sacan química sanguínea, avisa que la tomas: sube un poco la creatinina sin que signifique daño renal.</p></div></div></article>';
}
function batBlock(d){
  var dd=dayDoc(d),fut=ddiff(d,TODAY)>0,id=iso(d)+"bat",op=!!openMeal[id],k=KEYS[d.getDay()];
  return '<article class="meal opt'+(dd.m.bat?' done':'')+'"><div class="meal-h"><button type="button" class="k" data-tog="'+id+'" aria-expanded="'+op+'"><span class="eyebrow">Opcional</span><b>Batido de proteína</b><span>≈'+BAT.kcal+' kcal · '+BAT.p+'–24 g P</span><span class="hn">'+(GD[k]&&!gymClosed(d)?'post-entreno':'cuando quieras')+'</span></button>'+
    '<input type="checkbox" class="chk" data-meal="bat"'+(dd.m.bat?' checked':'')+(fut?' disabled title="Aún no llega este día"':locked(d)?' disabled title="Semana pasada: solo para ver"':'')+' aria-label="Marcar batido de proteína como tomado"></div>'+
    '<div class="meal-b"'+(op?'':' hidden')+'>'+chips([["MB",3]])+'<div class="dish"><p>1 scoop (≈ 30 g) de proteína en polvo en 250–300 ml de agua. '+(GD[k]&&!gymClosed(d)?'Tómalo al salir del gym.':'Hoy no hay gym: tómalo a la hora que te acomode.')+'</p>'+
    '<p class="tip">Es un extra sobre tus '+fmt.format(KCAL)+' kcal. Si lo tomas a diario y en 2 semanas subes más de 0.4 kg por semana, quita 1 cereal de la cena, o úsalo en vez del pollo o el atún de un tiempo (1 scoop = 3 equivalentes de AOA muy bajo en grasa). Si lo marcas, se suma a tus anillos de hoy.</p></div></div></article>';
}
function mealBlock(d,k){
  var dd=dayDoc(d),o=mealOpts(d,k),t=T[k],DY=DAYS[d.getDay()],hn=HNOTE[DY.h][k]||"",fut=ddiff(d,TODAY)>0,id=iso(d)+k,op=!!openMeal[id];
  return '<article class="meal'+(dd.m[k]?' done':'')+'"><div class="meal-h"><button type="button" class="k" data-tog="'+id+'" aria-expanded="'+op+'"><span class="eyebrow">'+mealName(d,k)+'</span><b>'+o[0].t+(o[2]?' <em class="swt">cambiada</em>':'')+'</b><span>'+t.kcal+' kcal · '+t.p+' g P</span>'+(hn?'<span class="hn">'+hn+'</span>':'')+'</button>'+
    '<input type="checkbox" class="chk" data-meal="'+k+'"'+(dd.m[k]?' checked':'')+(fut?' disabled title="Aún no llega este día"':locked(d)?' disabled title="Semana pasada: solo para ver"':'')+' aria-label="Marcar '+mealName(d,k).toLowerCase()+' como comida"></div>'+
    '<div class="meal-b"'+(op?'':' hidden')+'>'+chips(t.eq)+'<div class="dish"><p>'+o[0].d+'</p>'+(o[0].tip?'<p class="tip">'+o[0].tip+'</p>':'')+'</div>'+
    (o[1]?'<details class="alt"><summary>'+(o[2]?'Lo que tocaba hoy':'Otra opción con los mismos equivalentes')+'</summary>'+dish(o[1])+'</details>':'')+
    '<button type="button" class="btn ghost sm swb" data-swo="'+id+'" aria-expanded="'+!!swOpen[id]+'">'+ic("swap")+(o[2]?'Cambiar otra vez':'Cambiar por otra '+mealName(d,k).toLowerCase())+'</button>'+
    (swOpen[id]?'<div class="swl" role="list">'+allMeals(k).map(function(x){var on=x.o.t===o[0].t;return '<button type="button" role="listitem" data-sw="'+k+'" data-t="'+esc(x.o.t)+'" aria-pressed="'+on+'"><b>'+x.o.t+'</b><span>'+x.src+'</span></button>';}).join("")+'</div>':'')+
    '</div></article>';
}
function gymBlock(d,k){
  var g=GDat(d)[k],tot=planTotal(d)||entTotal(k,d),ds=doneSets(d),fut=ddiff(d,TODAY)>0,dd=dayDoc(d),st="";
  if(dd.ss&&dd.se)st="duró "+dur(Math.round((dd.se-dd.ss)/60000));else if(dd.ss&&sameDay(d,TODAY))st="en curso desde "+hhmm(dd.ss);
  return '<div class="gymcard"><div class="h"><span class="eyebrow" style="color:var(--gym)">Entreno · '+g.tm+'</span>'+(st?'<span class="r mono small" style="color:var(--gym)">'+st+'</span>':'')+'</div><div class="h"><b>'+g.t+'</b><span class="r mono small muted">'+ds+'/'+tot+' series</span></div><div class="prog"><i style="width:'+Math.min(100,ds/tot*100)+'%"></i></div>'+
    '<ol>'+g.ex.map(function(e){return '<li'+(e.arm?' class="arm"':'')+'><span>'+e.n+'</span><span>'+e.sr+'</span></li>';}).join("")+'</ol>'+
    '<div class="gbtns"><button class="btn pri" type="button" data-start="'+k+'">'+ic("play")+(locked(d)?'Ver entreno':ds?'Seguir entreno':fut?'Ver entreno':'Empezar entreno')+'</button>'+(ds?'':'<button class="btn ghost" type="button" data-gc="1">'+ic("lock")+'Gimnasio cerrado</button>')+'</div></div>';
}
function gymClosedBlock(d,k){var g=GDat(d)[k]||GD[k];return '<div class="gymcard gcl"><div class="h"><span class="eyebrow">Entreno · '+g.t+'</span></div><div class="h"><b>Gimnasio cerrado</b></div><p class="small muted">Este día no cuenta en tu racha ni en tus días de gym. La dieta sí cuenta, igual que el domingo. Si entrenas en otro lado, anota tus series y cuenta normal.</p><div class="gbtns"><button class="btn ghost sm" type="button" data-gc="0">Deshacer</button></div></div>';
}
function renderTimeline(){
  var d=selDay,its=dayItems(d),isT=sameDay(d,TODAY),n=nowMin(),past=ddiff(d,TODAY)<0,dd=dayDoc(d),h="",nowPut=false,rel=relName(d);
  $("tlh").textContent=rel==="Hoy"?"Tu día":rel?rel:DAYS[d.getDay()].n+" "+d.getDate();
  $("tlsub").textContent=MENUS[dayMenu(d)].n;
  its.forEach(function(x){
    if(isT&&!nowPut&&x.s>n){nowPut=true;h+='<div class="ti now"><div class="tm">'+pad(Math.floor(n/60))+":"+pad(n%60)+'</div><div class="rail"><span class="dot"></span></div><div class="bd"><div class="ln"></div></div></div>';}
    var gone=past||(isT&&x.e<=n);
    if(x.type==="cls"){h+='<div class="ti cls'+(gone?' past':'')+'"><div class="tm">'+x.a+'</div><div class="rail"><span class="dot"></span></div><div class="bd"><div class="cls-b"><b>'+x.t+'</b><span class="mono">'+x.a+'–'+x.b+'</span></div></div></div>';return;}
    if(x.type==="bat"){h+='<div class="ti'+(dd.m.bat?' done':'')+(gone?' past':'')+'" style="--ic:var(--ok)"><div class="tm">'+x.a+(x.post?'<small>al terminar</small>':'')+'</div><div class="rail"><span class="dot"></span></div><div class="bd">'+batBlock(d)+'</div></div>';return;}
    if(x.type==="cre"){h+='<div class="ti'+(dd.m.cre?' done':'')+(gone?' past':'')+'" style="--ic:var(--d-jue)"><div class="tm">'+x.a+(x.post?'<small>al terminar</small>':'')+'</div><div class="rail"><span class="dot"></span></div><div class="bd">'+creBlock(d)+'</div></div>';return;}
    if(x.type==="meal"){h+='<div class="ti'+(dd.m[x.k]?' done':'')+(gone?' past':'')+'" style="--ic:var(--food)"><div class="tm">'+x.a+'</div><div class="rail"><span class="dot"></span></div><div class="bd">'+mealBlock(d,x.k)+'</div></div>';return;}
    if(x.type==="gym"&&x.cl){h+='<div class="ti gcl'+(gone?' past':'')+'" style="--ic:var(--muted)"><div class="tm">'+x.a+'<small>cerrado</small></div><div class="rail"><span class="dot"></span></div><div class="bd">'+gymClosedBlock(d,x.k)+'</div></div>';return;}
    if(x.type==="gym"){var tot=planTotal(d)||entTotal(x.k,d),ds=doneSets(d);h+='<div class="ti'+(tot&&ds>=tot?' done':'')+(gone?' past':'')+'" style="--ic:var(--gym)"><div class="tm">'+x.a+'<small>'+GMat(d)[x.k]+' min</small></div><div class="rail"><span class="dot"></span></div><div class="bd">'+gymBlock(d,x.k)+'</div></div>';return;}
    var M=MENUS[weekMenu(d)];
    if(x.type==="prep"){h+='<div class="ti'+(gone?' past':'')+'" style="--ic:var(--muted)"><div class="tm">'+x.a+'</div><div class="rail"><span class="dot"></span></div><div class="bd"><div class="mini"><b>Prep para el jueves · 20 min</b><p>'+WED_BASE+M.wed+'</p></div></div></div>';return;}
    h+='<div class="ti'+(gone?' past':'')+'" style="--ic:var(--food)"><div class="tm">'+x.a+'<small>90 min</small></div><div class="rail"><span class="dot"></span></div><div class="bd"><div class="mini"><b>Batch del Menú '+(weekMenu(d)+1)+': '+M.n+'</b><p>'+M.short+'. Lo de lunes a miércoles va al refri; lo de jueves a sábado, al congelador.</p><button class="btn food sm" type="button" data-batch="'+weekMenu(d)+'">Ver pasos y lista del súper</button></div></div></div>';
  });
  if(isT&&!nowPut)h+='<div class="ti now"><div class="tm">'+pad(Math.floor(n/60))+":"+pad(n%60)+'</div><div class="rail"><span class="dot"></span></div><div class="bd"><div class="ln"></div></div></div>';
  $("tl").innerHTML=h;
}
function addWater(v){var dd=dayDoc(selDay),n=Math.max(0,Math.min(10000,waterMl(dd)+v));dd.ml=n;dd._auth=Date.now();saveDay(selDay);renderHabits();if(v>0)toast("+"+fmt.format(v)+" ml · llevas "+fmt.format(n)+" ml");}
/* jarra: se llena hacia la meta y se derrama cuando la pasas */
function jugSVG(ml){
  var f=Math.min(1,ml/WGOAL),over=ml>WGOAL,top=26,bot=138,y=bot-f*(bot-top),extra=ml-WGOAL;
  var body='M28 20 C24 34 18 46 18 70 C18 104 22 124 30 133 Q35 138 46 138 H74 Q85 138 90 133 C98 124 102 104 102 70 C102 46 96 34 92 20 Z';
  var wave='M-80 0 Q-70 -4 -60 0 T-40 0 T-20 0 T0 0 T20 0 T40 0 T60 0 T80 0 T100 0 T120 0 T140 0 T160 0 V130 H-80 Z';
  var ticks=[1,2].map(function(n){var ty=bot-(n*1000/WGOAL)*(bot-top);return '<line class="jt" x1="84" x2="96" y1="'+ty+'" y2="'+ty+'"/>';}).join("");
  var bub=f>0.08?[[40,60,0],[62,85,.8],[78,45,1.6],[52,100,2.3]].map(function(b){return '<circle class="bub" cx="'+b[0]+'" cy="'+b[1]+'" r="'+(1.6+((b[0]%3)*.5))+'" style="animation-delay:'+b[2]+'s"/>';}).join(""):'';
  var spill=over?'<g class="spill"><ellipse class="dome" cx="56" cy="22" rx="34" ry="5"/><path class="stream" d="M9 11 C-2 30 -2 80 2 146"/><circle class="drop d1" cx="1" cy="70" r="2.4"/><circle class="drop d2" cx="3" cy="100" r="2"/><circle class="drop d3" cx="0" cy="125" r="2.2"/><ellipse class="puddle" cx="26" cy="148" rx="'+Math.min(40,18+extra/40)+'" ry="4"/></g>':'';
  return '<div class="jug'+(over?' over':'')+(f>=1?' full':'')+'" role="img" aria-label="Jarra de agua: '+fmt.format(ml)+' de '+fmt.format(WGOAL)+' ml'+(over?', te pasaste '+fmt.format(extra)+' ml':'')+'">'+
    '<svg viewBox="-10 0 140 156" aria-hidden="true"><defs>'+
      '<clipPath id="jugclip"><path d="'+body+'"/></clipPath>'+
      '<linearGradient id="jwg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="wg0"/><stop offset="1" class="wg1"/></linearGradient>'+
      '<linearGradient id="jglass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="gl0"/><stop offset=".5" class="gl1"/><stop offset="1" class="gl2"/></linearGradient>'+
    '</defs>'+
    '<clipPath id="jhclip"><rect x="90" y="'+(over?0:y)+'" width="40" height="160"/></clipPath>'+
    '<path class="jh2" d="M97 40 C124 40 126 104 98 106"/><path class="jh" d="M97 40 C124 40 126 104 98 106"/><path class="jhw" clip-path="url(#jhclip)" d="M97 40 C124 40 126 104 98 106"/><path class="jhs" d="M108 50 C116 58 117 86 110 96"/>'+
    '<path class="jglass" d="'+body+'"/>'+
    '<g clip-path="url(#jugclip)"><g class="jw" style="transform:translateY('+(over?top-6:y)+'px)"><path class="w2" d="'+wave+'"/><path class="w1" d="'+wave+'" fill="url(#jwg)"/>'+bub.replace(/cy="(\d+)"/g,function(m,v){return 'cy="'+(+v*0.8)+'"';})+'</g>'+ticks+'</g>'+
    '<path class="jo" d="'+body+'"/><path class="jin" d="'+body+'" transform="translate(60 80) scale(.955) translate(-60 -80)"/><path class="jbase" d="M33 134 Q36 137 46 137 H74 Q84 137 87 134"/><path class="jlip" d="M28 20 Q18 17 7 10 Q22 9 34 15"/><ellipse class="jrim" cx="60" cy="20" rx="32" ry="3.5"/>'+
    '<path class="jshine" d="M30 42 C25 62 25 98 31 122"/><path class="jshine s2" d="M38 34 C36 40 35 46 35 52"/>'+
    spill+'</svg><span class="jl"><b>'+(over?'+'+fmt.format(extra):fmt.format(ml))+'</b> '+(over?'ml de más':'ml')+'</span></div>';
}
/* tazas de café del día (opcional, solo registro; 12 nov 2026). dd.m.caf viene de la tarjeta vieja = 1 taza */
/* taza dibujada: llena (con café) o vacía (contorno punteado) */
var cafPop=false;
function mugSVG(on){return '<svg viewBox="0 0 44 44" aria-hidden="true">'+(on?'<path class="stm" d="M15 9c-2-2.2 2-3.8 0-6M21 9c-2-2.2 2-3.8 0-6M27 9c-2-2.2 2-3.8 0-6"/>':'')+'<ellipse class="sau" cx="21" cy="39" rx="16" ry="2.6"/><path class="hdl" d="M32 18h2.6a4.8 4.8 0 0 1 0 9.6H31.4"/><path class="bod" d="M8 14h24v12.5A10.5 10.5 0 0 1 21.5 37h-3A10.5 10.5 0 0 1 8 26.5Z"/>'+(on?'<ellipse class="cof" cx="20" cy="14.6" rx="11" ry="2.4"/><path class="shn" d="M11.5 18v7.5a7 7 0 0 0 3 5.8"/>':'')+'</svg>';}
function cafN(dd){return dd.cf!=null?dd.cf:(dd.m&&dd.m.caf?1:0);}
function addCaf(v){var dd=dayDoc(selDay),n=Math.max(0,Math.min(20,cafN(dd)+v));dd.cf=n;if(dd.m)delete dd.m.caf;dd._auth=Date.now();saveDay(selDay);cafPop=v>0;renderHabits();if(v>0)toast(n===1?"Primer café del día":"Llevas "+n+" cafés hoy");}
function waterMl(dd){return dd.ml!=null?dd.ml:(dd.w||0)*375;}
var WGOAL=3000;
/* medicamento de la mañana: se guarda en el día como la hora en que lo marcaste */
function renderMed(){
  var d=selDay,dd=dayDoc(d),fut=ddiff(d,TODAY)>0,isT=sameDay(d,TODAY),on=!!dd.med,el=$("med");if(!el)return;
  el.hidden=false;
  var t=on&&dd.med>1?new Date(dd.med):null,ts=t&&sameDay(day0(t),d)?pad(t.getHours())+":"+pad(t.getMinutes()):"";
  el.className="med"+(on?" on":"")+(fut?" fut":"");
  el.innerHTML='<button type="button" class="medb" data-med="1" aria-pressed="'+on+'"'+(fut||locked(d)?' disabled':'')+'><span class="mck">'+(on?ic("check"):"")+'</span><span class="mtx"><b>Medicamento de la mañana</b><span>'+(on?(isT?"Ya te lo tomaste":"Te lo tomaste")+(ts?" · "+ts:""):fut?"Lo podrás marcar ese día en la mañana":(isT?"¿Ya te lo tomaste? Toca para marcarlo":"No quedó marcado ese día"+(locked(d)?"":". Toca si sí te lo tomaste")))+'</span></span>'+(on&&!locked(d)?'<span class="mun">Quitar</span>':'')+'</button>';
}
$("med").addEventListener("click",function(e){var b=e.target.closest("[data-med]");if(!b)return;var d=selDay;if(ddiff(d,TODAY)>0)return;var dd=dayDoc(d);
  if(dd.med){delete dd.med;dd._auth=Date.now();}else{dd.med=sameDay(d,TODAY)?Date.now():1;if(navigator.vibrate)try{navigator.vibrate(15);}catch(er){}}
  saveDay(d);renderMed();if(dd.med)toast(sameDay(d,TODAY)?"Medicamento marcado":"Marcado en ese día");});
function wqDay(d){var k=KEYS[d.getDay()];return k==="lun"||k==="mie"||k==="vie";}
function wqCount(){var W=getDoc("weights",{e:[]});return W.e.filter(function(r){var d=fromIso(r[0]);return ddiff(d,CHG)>=0&&ddiff(d,REV)<0;}).length;}
function renderWq(){var el=$("wq");if(!el)return;var d=selDay,rev=sameDay(TODAY,REV)&&sameDay(d,TODAY);
  if(!sameDay(d,TODAY)||!(wqDay(d)||rev)){el.hidden=true;el.innerHTML="";return;}
  var W=getDoc("weights",{e:[]}),r=W.e.filter(function(x){return x[0]===iso(TODAY);})[0],sub=ddiff(TODAY,CHG)<0?"Desde el lunes 9 cuentan para la revisión del domingo 22 nov":ddiff(TODAY,REV)<0?"Llevas "+wqCount()+" de 6 para la revisión del domingo 22 nov":"Tu ritmo está en Progreso";
  el.hidden=false;el.className="med wqm"+(r?" on":"");
  if(rev&&!wqDay(d)){el.innerHTML='<button type="button" class="medb" data-wqgo="1"><span class="mck">'+ic("scale")+'</span><span class="mtx"><b>Hoy toca revisar tu peso</b><span>Compara tus promedios semanales con la meta en Progreso</span></span><span class="mun">Ver</span></button>';return;}
  el.innerHTML=r?'<button type="button" class="medb" data-wqgo="1"><span class="mck">'+ic("check")+'</span><span class="mtx"><b>Peso de hoy: '+bw(r[1])+' '+bwU()+'</b><span>'+sub+'</span></span><span class="mun">Ver</span></button>'
    :'<form class="medb wqf" id="wqf"><span class="mck">'+ic("scale")+'</span><span class="mtx"><b>Pésate hoy</b><span>En ayunas, después de ir al baño. Lunes, miércoles y viernes.</span></span><span class="wq wqin"><input type="number" inputmode="decimal" step="0.1" '+bwMinMax()+' id="wqi" placeholder="'+bw(lastWeight()||BASEKG)+'" aria-label="Peso de hoy en '+bwName()+'"><span class="muted small">'+bwU()+'</span><button class="btn pri sm" type="submit">Guardar</button></span></form>';
}
$("wq").addEventListener("submit",function(e){e.preventDefault();var v=parseFloat(($("wqi").value||"").replace(",","."));if(!bwOk(v)){toast("Escribe tu peso en "+bwName()+", por ejemplo "+bwEx());return;}
  addWeight(iso(TODAY),fromU(v));renderWq();toast("Peso guardado: "+kgs(v)+" "+bwU());});
$("wq").addEventListener("click",function(e){if(!e.target.closest("[data-wqgo]"))return;setPgSeg("res");show("progreso");var c=$("pgw");if(c)c.scrollIntoView({block:"start"});});
function renderHabits(){
  var d=selDay,dd=dayDoc(d),w=dd.w||0,k=KEYS[d.getDay()],fut=ddiff(d,TODAY)>0,isT=sameDay(d,TODAY);
  var ml=waterMl(dd),pc=Math.min(100,ml/WGOAL*100),dis=fut||locked(d)?' disabled':'';
  var hb='<div class="sec-h" style="gap:8px"><h3 style="font-size:1rem">Agua</h3><span class="r mono small'+(ml>=WGOAL?' ok':' muted')+'">'+fmt.format(ml)+' / '+fmt.format(WGOAL)+' ml</span></div>'+
    '<div class="wrow"><div class="wctl"><div class="wbar" role="progressbar" aria-label="Agua" aria-valuemin="0" aria-valuemax="'+WGOAL+'" aria-valuenow="'+ml+'"><i style="width:'+pc+'%"></i></div>'+
    '<div class="wadd">'+[250,500,750,1000].map(function(v){return '<button type="button" class="btn ghost sm" data-ml="'+v+'"'+dis+'>+'+fmt.format(v)+'</button>';}).join("")+'</div>'+
    '<form class="wcus" id="wcus"><input type="number" inputmode="numeric" step="1" min="1" max="5000" id="wmli" placeholder="Otra cantidad" aria-label="Mililitros de agua"'+dis+'><span>ml</span><button class="btn ghost sm" type="submit"'+dis+'>Sumar</button><button class="btn ghost sm" type="button" data-ml="-250"'+(dis||!ml?' disabled':'')+' aria-label="Quitar 250 ml">−250</button></form></div>'+jugSVG(ml)+'</div>'+
    '<p class="small muted">Meta: 3,000 ml. En días de pierna, 300 a 700 ml más.</p>';
  var cf=cafN(dd),slots=Math.max(4,cf+1),cups="";
  for(var i=0;i<slots;i++){
    if(i<cf)cups+='<span class="cup on'+(i===cf-1&&cafPop?' pop':'')+'">'+mugSVG(true)+'</span>';
    else if(i===cf)cups+='<button type="button" class="cup add" data-cf="1"'+(dis||cf>=20?' disabled':'')+' aria-label="Sumar una taza de café">'+mugSVG(false)+'<b aria-hidden="true">+</b></button>';
    else cups+='<span class="cup off" aria-hidden="true">'+mugSVG(false)+'</span>';
  }
  cafPop=false;
  hb+='<div class="cafe"><div class="cfh"><div><h3>Café</h3><span class="small muted">opcional · solo registro</span></div>'+
    '<div class="cfn"><b>'+cf+'</b><span>'+(cf===1?'taza':'tazas')+'</span></div></div>'+
    '<div class="cfcups" role="group" aria-label="'+cf+' '+(cf===1?'taza':'tazas')+' de café hoy">'+cups+'</div>'+
    '<div class="cff"><p class="small muted">Sin azúcar no cambia tu dieta. Después de las 2 de la tarde puede quitarte el sueño.</p>'+
    '<button type="button" class="btn ghost sm" data-cf="-1"'+(dis||!cf?' disabled':'')+' aria-label="Quitar una taza">−1</button></div></div>';
  $("habits").innerHTML=hb;
}
/* ===== resumen de la semana: domingo (esta semana) y lunes (la que acaba de pasar) ===== */
function wsumData(mon){
  var sun=addD(mon,6),end=ddiff(sun,TODAY)>0?TODAY:sun,c=dcount(mon,end),wm=modeOf(mon),goal=wm==="full"?6:wm==="ocu"?4:2;
  var W=getDoc("weights",{e:[]}).e,wa=function(a,b){return avg(W.filter(function(r){var d=fromIso(r[0]);return ddiff(d,a)>=0&&ddiff(d,b)<=0;}).map(function(r){return r[1];}));};
  var a=wa(mon,sun),p=wa(addD(mon,-7),addD(mon,-1));
  var D=collectDays(),from=iso(mon),to=iso(sun),names={},up=[];
  [GDat(mon),GDat(sun)].forEach(function(G){allEx(G).forEach(function(x){names[x.id]=x.n;});});
  Object.keys(names).forEach(function(id){var H=exHistory(id,D),wk=H.filter(function(h){return h.d>=from&&h.d<=to;}),pre=H.filter(function(h){return h.d<from;});
    if(!wk.length||!pre.length)return;var b=wk.reduce(function(x,y){return (y.top[0]>x.top[0]||(y.top[0]===x.top[0]&&y.top[1]>x.top[1]))?y:x;}),q=pre[pre.length-1];
    if(b.top[0]>q.top[0])up.push([names[id],"+"+kgs(b.top[0]-q.top[0])+" lb"]);else if(b.top[0]===q.top[0]&&b.top[1]>q.top[1])up.push([names[id],"+"+(b.top[1]-q.top[1])+" rep"]);});
  var rod=Object.keys(D).filter(function(dt){return dt>=from&&dt<=to&&typeof D[dt].rod==="number";}).sort().map(function(dt){return D[dt].rod;});
  return {c:c,goal:goal,wm:wm,a:a,p:p,up:up,rod:rod,mon:mon,sun:sun};
}
function renderWsum(){var el=$("wsum");if(!el)return;var dw=TODAY.getDay();
  if(!sameDay(selDay,TODAY)||(dw!==0&&dw!==1)){el.hidden=true;el.innerHTML="";return;}
  var mon=dw===0?mondayOf(TODAY):addD(mondayOf(TODAY),-7);if(ddiff(mon,START)<0){el.hidden=true;return;}
  var x=wsumData(mon),won=x.c.g>=x.goal,dw0=x.c.fp?x.c.f+'/'+x.c.fp:'—',wd=x.a!=null&&x.p!=null?x.a-x.p:null;
  var wtx=wd==null?(x.a!=null?bw(x.a)+' '+bwU():'—'):(wd>=0?'+':'')+fmt1.format(Math.round(toU(wd)*10)/10)+' '+bwU();
  var h='<div class="sec-h"><h3 style="font-size:1.05rem">'+(dw===0?'Tu semana':'La semana pasada')+'</h3><span class="r eyebrow">'+x.mon.getDate()+'–'+x.sun.getDate()+' '+MES3[x.sun.getMonth()]+' · '+MODES[x.wm].n.toLowerCase()+'</span></div>';
  h+='<div class="kpis"><div class="stat'+(won?' ok':'')+'"><b>'+x.c.g+'<small>/'+x.goal+'</small></b><span>sesiones</span></div><div class="stat'+(x.c.fp&&x.c.f*10>=x.c.fp*8?' ok':'')+'"><b>'+dw0+'</b><span>días de dieta</span></div><div class="stat'+(wd!=null&&wd>=0.1&&wd<=0.4?' ok':'')+'"><b>'+wtx+'</b><span>'+(wd==null?'promedio de peso':'peso vs semana anterior')+'</span></div></div>';
  h+='<p class="small">'+(won?'<b>Semana ganada.</b> Cumpliste el modo que elegiste.':'Te faltaron '+(x.goal-x.c.g)+' de '+x.goal+' sesiones. Lo faltado no se repone: la regla es no faltar dos veces seguidas.')+'</p>';
  if(x.up.length)h+='<p class="small muted">Subiste en '+x.up.length+': '+x.up.slice(0,6).map(function(u){return '<b style="color:var(--fg)">'+esc(u[0].split(" (")[0])+'</b> '+u[1];}).join(' · ')+(x.up.length>6?' y '+(x.up.length-6)+' más':'')+'</p>';
  else h+='<p class="small muted">Esta semana no subiste peso ni reps. En Entreno, cada ejercicio te dice qué toca hoy.</p>';
  if(x.rod.length)h+='<p class="small muted">Rodilla: '+x.rod.join(' · ')+(Math.max.apply(null,x.rod)<=1?' (sin molestias)':'')+'</p>';
  if(dw===0)h+='<p class="small muted">Antes del batch: elige en Entreno el modo de la semana que viene.</p>';
  el.hidden=false;el.className="card wsum";el.innerHTML=h;}
function renderHoy(){renderHero();renderWeek();renderMed();renderWq();renderWsum();renderNext();renderTimeline();renderHabits();}

$("hwnav").addEventListener("click",function(e){var b=e.target.closest("[data-wk]");if(!b||b.disabled)return;var s=+b.dataset.wk;
  if(s===0)selDay=TODAY;else{var nd=addD(selDay,7*s);selDay=ddiff(mondayOf(nd),mondayOf(TODAY))>=0?TODAY:nd;}
  rpick=false;mpick=false;wfor=null;renderHoy();vin($("week"));vin($("tl"));});
$("v-hoy").addEventListener("click",function(e){if(roHoy()&&e.target.closest("[data-mpick],[data-rpick],[data-rk],[data-mn],[data-gc],[data-swo],[data-sw],[data-med],[data-ml],.chk"))roBlock(e);},true);
$("v-hoy").addEventListener("submit",function(e){if(roHoy())roBlock(e);},true);
$("week").addEventListener("click",function(e){var b=e.target.closest(".wd");if(!b)return;selDay=fromIso(b.dataset.d);wfor=null;renderHoy();vin($("tl"));});
$("tl").addEventListener("click",function(e){
  var gcb=e.target.closest("[data-gc]");if(gcb){var gd0=selDay,gdd=dayDoc(gd0),on=gcb.dataset.gc==="1";if(on)gdd.gc=1;else{delete gdd.gc;gdd._auth=Date.now();}saveDay(gd0);renderHoy();toast(on?"Gimnasio cerrado: ese día no cuenta en tu racha":"Listo, el entreno de ese día vuelve a contar");return;}
  var t=e.target.closest("[data-tog]");
  if(t){var id=t.dataset.tog;openMeal[id]=!openMeal[id];t.setAttribute("aria-expanded",openMeal[id]);t.closest(".meal").querySelector(".meal-b").hidden=!openMeal[id];return;}
  var so=e.target.closest("[data-swo]");if(so){swOpen[so.dataset.swo]=!swOpen[so.dataset.swo];renderTimeline();return;}
  var sw=e.target.closest("[data-sw]");if(sw){var d=selDay,dd=dayDoc(d),k=sw.dataset.sw,base=mealOpts0(d,k)[0];if(!dd.sw)dd.sw={};
    if(sw.dataset.t===base.t)delete dd.sw[k];else dd.sw[k]=sw.dataset.t;dd._auth=Date.now();saveDay(d);swOpen[iso(d)+k]=false;openMeal[iso(d)+k]=true;renderTimeline();
    toast(sw.dataset.t===base.t?"De vuelta a lo que tocaba":"Cambiada por "+sw.dataset.t.toLowerCase());return;}
  var s=e.target.closest("[data-start]");
  if(s){wsel=s.dataset.start;wtoday=false;wfor=sameDay(selDay,TODAY)||ddiff(selDay,TODAY)>0?null:selDay;show("entreno");return;}
  var b=e.target.closest("[data-batch]");
  if(b){cmMenu=+b.dataset.batch;cmSeg="batch";show("comida");}
});
$("tl").addEventListener("change",function(e){
  var c=e.target;if(!c.classList.contains("chk"))return;
  var dd=dayDoc(selDay);dd.m[c.dataset.meal]=c.checked;saveDay(selDay);
  var art=c.closest(".meal");art.classList.toggle("done",c.checked);art.closest(".ti").classList.toggle("done",c.checked);
  if(c.checked){c.classList.add("pop");setTimeout(function(){c.classList.remove("pop");},400);
    if(c.dataset.meal==="cre"){var st=creStreak();toast(st>1?"Creatina: "+st+" días seguidos":"Creatina tomada");}
    else if(c.dataset.meal==="bat"){toast("Batido: +"+BAT.kcal+" kcal y ≈"+BAT.p+" g de proteína");}
    else{var m=mealsDone(selDay);if(m.n===5)toast("Las 5 comidas del día: "+fmt.format(KCAL)+" kcal y "+PROT+" g de proteína.");}}
  updRings();renderWeek();renderNext();
});
$("habits").addEventListener("click",function(e){
  var c=e.target.closest("[data-cf]");if(c){addCaf(+c.dataset.cf);return;}
  var b=e.target.closest("[data-ml]");if(!b)return;addWater(+b.dataset.ml);
});
$("habits").addEventListener("submit",function(e){
  e.preventDefault();if(e.target.id==="wcus"){var m=parseInt($("wmli").value,10);if(!(m>0&&m<=5000)){toast("Escribe cuántos ml tomaste, por ejemplo 600");return;}addWater(m);return;}
});

/* ================= ENTRENO ================= */
/* día en el que se guarda lo que anotas: el del chip elegido si ya pasó esta semana, si no hoy */
var wtoday=false,wfor=null;/* wfor: día elegido desde Hoy para anotar ese entreno */
function chipDate(k){return k==="sup"?TODAY:addD(mondayOf(TODAY),GK.indexOf(k));}
function WG(){return GDat(woDate());}
function woDate(){if(!wtoday&&wfor&&ddiff(wfor,TODAY)<=0)return wfor;if(!wtoday&&wsel&&TKEY!=="dom"){if(wsel===dayRK(TODAY))return TODAY;var d=chipDate(wsel);if(ddiff(d,TODAY)<0)return d;}return TODAY;}
function woPast(){return !sameDay(woDate(),TODAY);}
function lastFor(id){var L=getDoc("last",{});var r=L[id];if(!r)return null;var w=iso(woDate());if(r.d===w)return r.p||null;if(r.d>w&&r.p&&r.p.d<w)return r.p;return r;}
/* prueba de dominadas: semana 5 de cada bloque (RIR 0–1), el viernes */
function nextTest(){for(var d=day0(TODAY),i=0;i<120;i++,d=addD(d,1)){var bi=blockInfo(d);if(!bi.pre&&bi.wk===4&&d.getDay()===5)return d;}return null;}
function noteTx(n){if(n.indexOf("{prueba}")<0)return n;var t=nextTest(),x=!t?"":sameDay(t,TODAY)?"hoy toca":blockInfo(TODAY).wk===4&&ddiff(t,TODAY)<7?"este viernes "+t.getDate()+" "+MES3[t.getMonth()]:"la próxima: viernes "+t.getDate()+" "+MES3[t.getMonth()];return n.replace("{prueba}",x);}
function bwH(e){if(!e.bwx)return "";var w=lastWeight();return '<p class="ex-note">'+(w?'Tu último peso: <b>'+bw(w)+' '+bwU()+'</b>. Anota ese número menos la ayuda.':'Pésate en ayunas (lunes, miércoles y viernes) y aquí verás tu número para restarle la ayuda.')+'</p>';}
function altH(e){var b=e._base||e;if(!b.alt)return "";var on=e!==b,o=on?b:b.alt;return '<p class="ex-alt">'+esc(on?b.alt.altl:b.altl)+' <button type="button" class="lnk" data-alt="'+exId(b)+'">Cambiar a '+esc(o.n.split(" (")[0].toLowerCase())+'</button></p>';}
/* ===== peso sugerido: doble progresión. Si la vez pasada llegaste al tope de reps en todas las series con tu peso más alto, hoy +5 lb; si no, mismo peso y +1 rep ===== */
var STEP=5;
function repRange(sr){var m=String(sr).match(/(\d+)\s*[–-]\s*(\d+)/);return m?[+m[1],+m[2]]:null;}
function sugFor(e,last,n){
  if(!last||!last.s)return null;var rr=repRange(e.sr);if(!rr)return null;
  var S=last.s.filter(function(x){return +x[0]>0&&+x[1]>0;});if(!S.length)return null;
  var top=Math.max.apply(null,S.map(function(x){return +x[0];})),T=S.filter(function(x){return +x[0]===top;}),minR=Math.min.apply(null,T.map(function(x){return +x[1];}));
  var bi=blockInfo(woDate());
  if(!bi.pre&&bi.wk===5)return {k:"eq",w:top,t:'Descarga: <b>'+kgs(top)+' lb</b>, mitad de series y lejos del fallo.'};
  if(T.length>=Math.min(2,n)&&minR>=rr[1])return {k:"up",w:top+STEP,r:rr[0],t:'Hoy: <b>'+kgs(top+STEP)+' lb</b> × '+rr[0]+'+ reps'+(e.bwx?' (5 lb menos de ayuda)':'')+'. La vez pasada llegaste a '+rr[1]+' en todas.'};
  if(minR<rr[0])return {k:"eq",w:top,t:'Hoy: <b>'+kgs(top)+' lb</b> otra vez, hasta sacar '+rr[0]+' reps en todas. Si vuelves a quedar corto, baja '+STEP+' lb.'};
  return {k:"eq",w:top,t:'Hoy: <b>'+kgs(top)+' lb</b> y busca +1 rep. Cuando llegues a '+rr[1]+' en todas, subes '+STEP+' lb.'};
}
/* ===== rodilla: dolor 0–10 al terminar pierna (dd.rod); avisa cuando llevas 2+ semanas sin molestias ===== */
var LEGK={mie:1,sab:1};
function rodList(){var D=collectDays(),out=[];Object.keys(D).sort().forEach(function(dt){var v=D[dt].rod;if(typeof v==="number")out.push([dt,v]);});return out;}
function rodReady(){var L=rodList(),run=[];for(var i=L.length-1;i>=0&&L[i][1]<=1;i--)run.push(L[i]);if(run.length<4)return null;var dd=ddiff(TODAY,fromIso(run[run.length-1][0]));return dd>=14?{n:run.length,w:Math.floor(dd/7)}:null;}
function rodMsg(v){return v==null?'Al terminar pierna, toca cuánto te molestó la rodilla. 0 es nada.':v<=1?'Sin molestias. Cuando lleves 2 semanas así, te aviso para lo de la sentadilla.':v<=3?'Molestia leve: repite peso y rango la próxima, sin subir.':'Dolió: la próxima baja peso o rango, y si sigue, coméntalo con tu fisio.';}
function rodCard(){var d=woDate(),v=dayDoc(d).rod,L=rodList().filter(function(x){return x[0]!==iso(d);}).slice(-5);
  var b='';for(var i=0;i<=10;i++)b+='<button type="button" data-rod="'+i+'"'+(roWo()?' disabled':'')+' aria-pressed="'+(v===i)+'" class="'+(i<=1?'g':i<=3?'w':'r')+'">'+i+'</button>';
  return '<article class="card rod"><div class="sec-h"><h3 style="font-size:1rem">¿Cómo quedó la rodilla?</h3><span class="r small muted">0 nada · 10 mucho</span></div><div class="rodb" role="group" aria-label="Dolor de rodilla de 0 a 10">'+b+'</div><p class="small muted">'+rodMsg(v)+'</p>'+(L.length?'<p class="small muted">Antes: '+L.map(function(x){return fmtD(x[0])+' <b style="color:var(--fg)">'+x[1]+'</b>';}).join(' · ')+'</p>':'')+'</article>';}
function renderEntreno(){
  applyAlt();var ro=roWo(),dis=ro?' disabled':'',k=wsel,g=WG()[k],bi=blockInfo(ro?wfor:TODAY),todayK=dayRK(TODAY)||KEYS[TODAY.getDay()];
  var wm=modeOf(ro?wfor:TODAY);
  $("ewnav").innerHTML=wnavHTML(mondayOf(woDate()));$("v-entreno").classList.toggle("ro",ro);
  if(ro){var mon0=mondayOf(wfor);$("wdays").innerHTML=[0,1,2,3,4,5,6].map(function(i){var d=addD(mon0,i),x=woKey(d),has=doneSets(d)>0;if(i===6&&!has)return '';
    return '<button type="button" class="chip'+(has?'':' dim')+'" data-wdd="'+iso(d)+'" aria-pressed="'+sameDay(d,wfor)+'" style="--cc:'+dcol(x)+'"><i></i>'+DAYS[d.getDay()].s+' '+d.getDate()+' · '+(x==="sup"?'Cuerpo completo':SHORT[x])+'</button>';}).join("");}
  else $("wdays").innerHTML=(wm==="sup"||wsel==="sup"?["sup"]:[]).concat(GK).map(function(x){var rest=wm==="ocu"&&OCU.indexOf(x)<0;return '<button type="button" class="chip'+(rest||(wm==="sup"&&x!=="sup")?' dim':'')+'" data-wd="'+x+'" aria-pressed="'+(x===k)+'" style="--cc:'+dcol(x)+'"><i></i>'+(x==="sup"?'Cuerpo completo':DAYS[KEYS.indexOf(x)].s+' · '+SHORT[x]+(rest?' · descanso':'')+(x===todayK?' · hoy':''))+'</button>';}).join("");
  var notes=(g.notes||[]).filter(function(n){return !/límites|Domingo libre/.test(n);}).map(function(n){return '<p class="note'+(/LCA|rodilla/.test(n)?'':' info')+'">'+n+(/LCA/.test(n)?' <a href="#" data-goguia>Cómo ir quitando límites</a>.':'')+'</p>';}).join("");
  var hasHist=g.ex.some(function(e){return !!lastFor(exId(e));});
  if(!hasHist)notes+='<p class="note info"><b>Primera vez con esta rutina:</b> elige pesos con los que llegues al rango dejando '+(bi.pre?'3':RIRW[bi.wk][0].replace("RIR ",""))+' repeticiones en reserva. Lo que anotes hoy aparecerá aquí la próxima vez.</p>';
  if(!wfor&&k!==todayK&&GD[k])notes='<p class="note info">¿Hoy te tocó cambiar de músculos? <a href="#" data-rkset="'+k+'">Hoy hice '+g.t.toLowerCase()+'</a></p>'+notes;
  else if(dayRK(TODAY)&&k===todayK)notes='<p class="note info">Hoy cambiaste a <b>'+g.t+'</b>. <a href="#" data-rkset="'+KEYS[TODAY.getDay()]+'">Regresar a la rutina del día</a></p>'+notes;
  if(wfor&&!wtoday&&!sameDay(wfor,TODAY))notes='<p class="note"><b>Anotando en el '+DAYS[wfor.getDay()].n.toLowerCase()+' '+wfor.getDate()+' '+MES3[wfor.getMonth()]+'.</b> Las series y el tiempo se guardan en ese día. <a href="#" data-wtoday="1">Guardarlo hoy</a></p>';
  else if(todayK==="dom")notes='<p class="note info"><b>Hoy domingo descansas.</b> Si entrenas hoy, lo que anotes se guarda en el domingo. Para anotar un día pasado, elígelo en Hoy.</p>';
  else if(k!==todayK&&k!=="sup"){var cd=chipDate(k);
    if(ddiff(cd,TODAY)<0)notes=(wtoday?'<p class="note info">Lo que anotes se guarda <b>hoy</b>. <a href="#" data-wtoday="0">Guardarlo el '+DAYS[cd.getDay()].n.toLowerCase()+' '+cd.getDate()+'</a></p>':'<p class="note info">Lo que anotes se guarda el <b>'+DAYS[cd.getDay()].n.toLowerCase()+' '+cd.getDate()+' '+MES3[cd.getMonth()]+'</b> y sale en ese día en Hoy. <a href="#" data-wtoday="1">¿Lo hiciste hoy?</a></p>')+notes;
    else notes='<p class="note info">Hoy toca <b>'+GD[todayK].t+'</b>. Si entrenas esta rutina hoy, se guarda con la fecha de hoy.</p>'+notes;}
  if(gymClosed(woDate()))notes='<p class="note info"><b>Marcaste el gimnasio cerrado este día.</b> Si entrenas en otro lado, anota tus series y el día cuenta normal.</p>'+notes;
  if(LEGK[k]){var rr0=rodReady();if(rr0)notes+='<p class="note info"><b>Rodilla: '+rr0.w+' semanas sin molestias.</b> Pregúntale a tu fisio por la sentadilla en Smith o hack hasta 90°.</p>';}
  if(wm==="ocu")notes='<p class="note info"><b>Semana ocupada:</b> 2 series por ejercicio; jueves y sábado descansas sin culpa.</p>'+notes;
  if(ro)notes='<p class="note info"><b>Solo para ver.</b> Es lo que anotaste el '+DAYS[wfor.getDay()].n.toLowerCase()+' '+wfor.getDate()+' '+MES3[wfor.getMonth()]+'. Las semanas pasadas no se editan. <a href="#" data-wk="0">Volver a esta semana</a></p>'+(gymClosed(wfor)?'<p class="note info"><b>Ese día marcaste el gimnasio cerrado.</b></p>':doneSets(wfor)?'':'<p class="note">Ese día no anotaste series.</p>');
  if(!bi.pre&&bi.wk===5)notes='<p class="note"><b>Semana de descarga:</b> haz la mitad de las series de cada ejercicio con el mismo peso y RIR 3 o más.</p>'+notes;
  var modeH=ro?'<div class="wmode"><span class="eyebrow">Modo de esa semana: '+MODES[wm].n.toLowerCase()+'</span></div>':'<div class="wmode"><span class="eyebrow">Modo de esta semana</span><div class="seg" role="group" aria-label="Modo de la semana">'+["full","ocu","sup"].map(function(m){return '<button type="button" data-wmode="'+m+'" aria-pressed="'+(m===wm)+'">'+MODES[m].n+'</button>';}).join("")+'</div><p class="small muted">'+MODES[wm].d+'</p></div>';
  $("wohead").innerHTML=modeH+'<div class="wo-head" style="--dc:'+dcol(k)+'"><div class="tt"><div style="display:grid;gap:6px"><span class="eyebrow">'+(k==="sup"?'Supervivencia · cuando puedas':DAYS[KEYS.indexOf(k)].n+' · '+GYMT[k])+' · '+(wm==="ocu"&&k!=="sup"?entTotal(k,TODAY)+' series':g.tm)+'</span><h1>'+g.t+'</h1></div></div>'+
    '<div class="stats"><div class="stat" id="stS"><b></b><span>series hechas</span></div><div class="stat" id="stV"><b></b><span>lb movidas'+(woPast()?'':' hoy')+'</span></div><div class="stat"><b>'+(bi.pre?'—':RIRW[bi.wk][0])+'</b><span>'+(bi.pre?'el bloque empieza el 2 nov':'Sem '+(bi.wk+1)+': '+RIRW[bi.wk][1].toLowerCase())+'</span></div></div><div class="sess" id="sess"></div>'+notes+'</div>';
  var dd=dayDoc(woDate());
  $("exlist").innerHTML=g.ex.map(function(e,i){
    var id=exId(e),n=setsN(e),rows=dd.s[id]||[],last=lastFor(id),reps=(e.sr.split("×")[1]||"").trim(),done=0,sug=ro?null:sugFor(e,last,n);
    var setsH="";
    for(var j=0;j<n;j++){
      var r=rows[j]||[],ok=!!r[2],ph=sug&&sug.k==="up"?[sug.w,sug.r]:last&&last.s&&last.s[j]&&+last.s[j][1]>0?last.s[j]:null;if(ok)done++;
      var isKg=r.length>3,wv=isKg?r[3]:r[0],wph=ph?(isKg?kgs(Math.round(ph[0]/LB*2)/2):kgs(ph[0])):"—";
      setsH+='<div class="set'+(ok?' ok':'')+'" data-n="'+j+'"><span class="sn">'+(j+1)+'</span>'+
        '<label><input type="number" inputmode="decimal" step="0.5" min="0" data-f="0"'+dis+' value="'+(wv!=null&&wv!==""?wv:"")+'" placeholder="'+wph+'" aria-label="'+(isKg?'Kilos':'Libras')+', serie '+(j+1)+'"><button type="button" class="unit'+(isKg?' kg':'')+'" data-unit'+dis+' aria-label="Cambiar a '+(isKg?'libras':'kilos')+'">'+(isKg?'kg':'lb')+'</button></label>'+
        '<label><input type="number" inputmode="numeric" step="1" min="0" data-f="1"'+dis+' value="'+(r[1]!=null&&r[1]!==""?r[1]:"")+'" placeholder="'+(ph?ph[1]:reps)+'" aria-label="Repeticiones, serie '+(j+1)+'"><span>reps</span></label>'+
        '<button type="button" class="go"'+dis+' aria-pressed="'+ok+'" aria-label="Serie '+(j+1)+' hecha">'+ic("check")+'</button></div>';
    }
    var lastS=last&&last.s?last.s.filter(function(s){return +s[1]>0;}):[];
    var lastH=lastS.length?'<p class="ex-last">Última vez (lb): <b>'+lastS.map(function(s){return kgs(s[0])+'×'+s[1];}).join(" · ")+'</b> · '+fromIso(last.d).getDate()+' '+MES3[fromIso(last.d).getMonth()]+'</p>':'';
    return '<article class="ex'+(e.arm?' arm':'')+(done>=n?' complete':'')+'" data-i="'+i+'" data-x="'+id+'"><div class="ex-top"><button type="button" class="thumbs" data-lb="'+i+'" aria-label="Ver cómo se hace '+esc(e.n)+'"><img src="'+IMG[e.img[0]]+'" alt=""><img src="'+IMG[e.img[1]!=null?e.img[1]:e.img[0]]+'" alt=""><span class="num">'+(i+1)+'</span></button>'+
      '<div class="ex-info"><h3>'+e.n+'</h3><div class="ex-meta"><span>'+e.sr+'</span><span>· '+e.rest+'</span>'+(e.ss?'<span class="ss">'+e.ss+'</span>':'')+(e.arm?'<span class="armt">brazo</span>':'')+'<button type="button" class="lnk hl" data-hist="'+id+'" aria-label="Ver historial de '+esc(e.n)+'">'+ic("chart")+'Historial</button>'+(musOf(e)?'<button type="button" class="lnk hl mtog" data-mus="'+id+'" aria-expanded="'+!!musOpen[id]+'" aria-controls="mus-'+id+'"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4.5" r="2.2"/><path d="M7 9.5h10M12 9.5v6M12 15.5l-3 6M12 15.5l3 6M7 9.5l-2 5M17 9.5l2 5"/></svg>Músculos<i class="chv" aria-hidden="true"></i></button>':'')+'</div>'+lastH+(sug?'<p class="ex-sug'+(sug.k==="up"?' up':'')+'">'+sug.t+'</p>':'')+(e.note?'<p class="ex-note">'+noteTx(e.note)+'</p>':'')+bwH(e)+(ro?'':altH(e))+'</div></div>'+(musOf(e)?'<button type="button" class="mrow" id="mus-'+id+'" data-lb="'+i+'" aria-label="Ver en grande los músculos que trabaja '+esc(e.n)+'"'+(musOpen[id]?'':' hidden')+'>'+musSVG(musOf(e),false)+musTxt(musOf(e))+'</button>':'')+'<div class="sets">'+setsH+'</div></article>';
  }).join("")+(LEGK[k]&&!gymClosed(woDate())?rodCard():"");
  updWoStats();sessBox();
  var pc=$("wdays").querySelector('[aria-pressed="true"]');if(pc){var w=$("wdays");w.scrollLeft=pc.offsetLeft-(w.clientWidth-pc.offsetWidth)/2;}
}
/* cronómetro de la sesión completa: se guarda en el día de hoy (ss inicio, se fin, lt última serie) */
var sessIv=0;
function sess(d){var dd=dayDoc(d||TODAY);if(!dd.ss)return {st:"off",ms:0};if(dd.se)return {st:"end",ss:dd.ss,se:dd.se,ms:dd.se-dd.ss};if(d&&!sameDay(d,TODAY))return {st:"end",ss:dd.ss,se:dd.lt||dd.ss,ms:(dd.lt||dd.ss)-dd.ss};return {st:"on",ss:dd.ss,ms:Date.now()-dd.ss};}
/* reiniciar el cronómetro de cualquier día: borra inicio, fin y última serie (no toca las series) */
var rstArm=0,sessEdit=false;
function sessSet(d,hm,min){var p=hm.split(":"),st=new Date(d.getFullYear(),d.getMonth(),d.getDate(),+p[0],+p[1]).getTime(),dd=dayDoc(d);dd.ss=st;dd.se=st+min*60000;dd.lt=dd.se;dd._auth=Date.now();saveDay(d);sessEdit=false;sessUI();if(view==="hoy")renderHoy();toast("Sesión guardada: "+dur(min));}
function sessReset(d){var dd=dayDoc(d);delete dd.ss;delete dd.se;delete dd.lt;dd._auth=Date.now();saveDay(d);sessUI();toast("Cronómetro reiniciado"+(sameDay(d,TODAY)?". Arranca de nuevo con tu siguiente serie":""));}
function clock(ms){var t=Math.max(0,Math.floor(ms/1000)),h=Math.floor(t/3600),m=Math.floor(t%3600/60),x=t%60;return (h?h+":"+pad(m):m)+":"+pad(x);}
function hhmm(ts){var d=new Date(ts);return d.getHours()+":"+pad(d.getMinutes());}
function sessStart(){var dd=dayDoc(TODAY);if(dd.ss&&!dd.se)return;dd.ss=Date.now();delete dd.se;saveDay(TODAY);sessUI();}
function sessEnd(){var dd=dayDoc(TODAY);if(!dd.ss||dd.se)return;dd.se=Date.now();dd._auth=Date.now();saveDay(TODAY);sessUI();toast("Sesión terminada: "+dur(Math.round((dd.se-dd.ss)/60000)));}
/* fin de la rutina: la sesión acaba con la última serie marcada, no cuando tocas el botón */
function sessEndLast(){var dd=dayDoc(TODAY);if(!dd.ss||dd.se)return;var t=dd.lt&&dd.lt>dd.ss?dd.lt:Date.now();dd.se=Math.max(dd.ss+60000,t);dd._auth=Date.now();saveDay(TODAY);sessUI();toast("Sesión terminada: "+dur(Math.round((dd.se-dd.ss)/60000)));}
/* repara días terminados cuyo fin quedó en la hora en que tocaste el botón (más de 15 min después de la última serie) */
function finFix(d){var dd=dayDoc(d);if(dd.fin===1&&dd.ss&&dd.se&&dd.lt&&dd.lt>dd.ss&&dd.se-dd.lt>15*60000){dd.se=Math.max(dd.ss+60000,dd.lt);dd._auth=Date.now();saveDay(d);sessUI();}}
function sessResume(){var dd=dayDoc(TODAY);if(!dd.se)return;delete dd.se;dd._auth=Date.now();saveDay(TODAY);sessUI();}
function sessAutoClose(){var dd=dayDoc(TODAY);if(dd.ss&&!dd.se){var lt=dd.lt||dd.ss;if(Date.now()-lt>2*3600000){dd.se=Math.max(dd.ss+60000,lt+5*60000);saveDay(TODAY);}}}
function blkPill(){
  var p=$("blkpill"),S1=sess();
  if(S1.st==="on"){p.classList.add("live");p.innerHTML=ic("prep")+'<b>'+clock(S1.ms)+'</b>';p.title="Sesión en curso desde las "+hhmm(S1.ss)+". Toca para ir a Entreno";p.setAttribute("aria-label","Sesión en curso, "+clock(S1.ms)+". Ir a Entreno");return;}
  var bi=blockInfo(TODAY);p.classList.remove("live");p.removeAttribute("aria-label");
  p.textContent=bi.pre?"Empieza el 2 nov":(bi.block>1?"B"+bi.block+" · ":"")+"Sem "+(bi.wk+1)+" · "+RIRW[bi.wk][0];
  p.title="Bloque "+bi.block+", semana "+(bi.wk+1)+" de 6: "+RIRW[bi.wk][1];
}
function sessBox(){
  var b=$("sess");if(!b)return;var wd=woDate(),past=woPast(),S1=sess(wd),goal=GMat(wd)[wsel]||80,over=S1.ms>goal*60000;
  b.hidden=false;var futc=wsel&&ddiff(chipDate(wsel),TODAY)>0;
  var rst=roWo()?'':(S1.st==="off"?'':'<button class="btn ghost sm rst" type="button" data-sess="reset" data-d="'+iso(wd)+'">'+(rstArm?'¿Seguro? Toca otra vez':'Reiniciar')+'</button>')+'<button class="btn ghost sm rst" type="button" data-sess="edit">Poner tiempo</button>';
  if(sessEdit){var sd=new Date(S1.ss||new Date(wd.getFullYear(),wd.getMonth(),wd.getDate(),+(GYMT[wsel]||"10:00").split(":")[0],+(GYMT[wsel]||"10:00").split(":")[1]).getTime()),mn=S1.ss?Math.max(1,Math.round(S1.ms/60000)):(GMIN[wsel]||80);
    b.hidden=false;b.className="sess edit";
    b.innerHTML='<div class="sess-t"><span class="eyebrow">Poner tiempo'+(past?' · '+DAYS[wd.getDay()].n.toLowerCase()+' '+wd.getDate():'')+'</span><div class="sess-f"><label>Empezaste<input type="time" id="sesIni" value="'+pad(sd.getHours())+':'+pad(sd.getMinutes())+'"></label><label>Duró<span><input type="number" id="sesMin" inputmode="numeric" min="1" max="600" value="'+mn+'"> min</span></label></div></div><div class="sess-b"><button class="btn pri sm" type="button" data-sess="save" data-d="'+iso(wd)+'">Guardar</button><button class="btn ghost sm rst" type="button" data-sess="cancel">Cancelar</button></div>';
    return;}
  if(futc&&!past){var fd=chipDate(wsel);b.className="sess off fut";
    b.innerHTML='<div class="sess-t"><span class="eyebrow">Sesión del '+DAYS[fd.getDay()].n.toLowerCase()+' '+fd.getDate()+'</span><b>0:00</b><span class="small muted">Ese día todavía no llega. Su cronómetro aparece aquí cuando llegue. El tiempo de hoy está en el chip de hoy.</span></div>';return;}
  b.className="sess "+S1.st+(over?" over":"");
  var btn=past?'':S1.st==="off"?'<button class="btn pri sm" type="button" data-sess="start">'+ic("play")+'Empezar</button>':S1.st==="on"?'<button class="btn ghost sm" type="button" data-sess="end">Terminar</button>':'<button class="btn ghost sm" type="button" data-sess="resume">Reanudar</button>';
  var sub=S1.st==="off"?(past?"No hay tiempo guardado ese día":"Arranca solo con tu primera serie"):S1.st==="on"?"Desde las "+hhmm(S1.ss)+" · meta ≈"+goal+" min":"De "+hhmm(S1.ss)+" a "+hhmm(S1.se)+" · meta ≈"+goal+" min";
  b.innerHTML='<div class="sess-t"><span class="eyebrow">'+(past?"Sesión del "+DAYS[wd.getDay()].n.toLowerCase()+" "+wd.getDate():futc?"Sesión de hoy, "+DAYS[TODAY.getDay()].n.toLowerCase()+" "+TODAY.getDate():S1.st==="on"?"Sesión en curso":S1.st==="end"?"Sesión terminada":"Sesión")+'</span><b id="sessclock">'+clock(S1.ms)+'</b><span class="small muted">'+sub+'</span></div><div class="sess-b">'+btn+rst+'</div><div class="prog"><i id="sessbar" style="width:'+Math.min(100,S1.ms/(goal*600))+'%"></i></div>';
}
function sessUI(){
  blkPill();sessBox();
  var on=sess().st==="on";
  if(on&&!sessIv)sessIv=setInterval(sessTick,1000);
  if(!on&&sessIv){clearInterval(sessIv);sessIv=0;}
}
function sessTick(){
  var S1=sess();if(S1.st!=="on"){sessUI();return;}
  var c=clock(S1.ms),pb=$("blkpill").querySelector("b");if(pb)pb.textContent=c;
  if(woPast()||sessEdit)return;var e=$("sessclock");if(e)e.textContent=c;
  var bar=$("sessbar");if(bar){var g=(GMat(woDate())[wsel]||80)*60000;bar.style.width=Math.min(100,S1.ms/g*100)+"%";$("sess").classList.toggle("over",S1.ms>g);}
}
function updWoStats(){
  var k=wsel,dd=dayDoc(woDate()),tot=entTotal(k,woDate()),n=0,vol=0;
  exList(k,woDate()).forEach(function(e){(dd.s[exId(e)]||[]).forEach(function(r,j){if(r&&r[2]&&j<setsN(e)){n++;vol+=(+r[0]||0)*(+r[1]||0);}});});
  var s=$("stS"),v=$("stV");if(!s)return;
  s.querySelector("b").textContent=n+"/"+tot;s.classList.toggle("ok",n>=tot);
  v.querySelector("b").textContent=fmt.format(Math.round(vol));
  var wd=woDate(),fin=dayDoc(wd).fin===1;
  /* rutina completa: el cronómetro se detiene solo (solo hoy y si sigue corriendo) */
  if(n>=tot&&!fin&&sameDay(wd,TODAY)&&sess().st==="on")sessEndLast();
  if(fin&&!roWo())finFix(wd);
  var fh='';
  if(roWo())fh=n?'<div class="wo-done"><b>'+(n>=tot?'Entreno completo':'Rutina a medias')+'</b><p class="small muted">'+n+(n<tot?' de '+tot:'')+' series y '+fmt.format(Math.round(vol))+' lb movidas.</p></div>'+cmpHTML(k,wd,n>=tot):'';
  else if(fin)fh='<div class="wo-done"><b>'+(n>=tot?'Entreno completo':'Rutina terminada')+'</b><p class="small muted">'+n+(n<tot?' de '+tot:'')+' series y '+fmt.format(Math.round(vol))+' lb movidas. Toca tu cena de post-entreno.</p><button class="btn ghost sm" type="button" data-fin="0">Seguir entrenando</button></div>'+cmpHTML(k,wd,n>=tot);
  else if(n>=tot)fh='<button class="wo-done wo-tap" type="button" data-fin="1"><b>Entreno completo</b><p class="small muted">'+tot+' series y '+fmt.format(Math.round(vol))+' lb movidas. Toca tu cena de post-entreno.</p><span class="wo-cta">Toca para ver la comparación</span></button>';
  else if(n>0)fh='<button class="btn ghost wo-fin" type="button" data-fin="1">Terminar la rutina aquí ('+n+' de '+tot+' series)</button>';
  $("wofoot").innerHTML=fh;
  var rc=$("woreco");if(rc){var h0=fin||roWo()?'':recoHTML(k,wd);rc.hidden=!h0;rc.innerHTML=h0;}
}
$("wofoot").addEventListener("click",function(e){var b=e.target.closest("[data-fin]");if(!b)return;var d=woDate(),dd=dayDoc(d),on=b.dataset.fin==="1";
  dd.fin=on?1:0;dd._auth=Date.now();saveDay(d);
  if(on&&sameDay(d,TODAY)&&sess().st==="on")sessEndLast();
  updWoStats();if(on){var f=$("wofoot");if(f.scrollIntoView)f.scrollIntoView({behavior:"smooth",block:"start"});}});
/* ===== al completar la rutina: comparación con la misma sesión de la semana pasada y análisis por reglas (sin internet) ===== */
function dayKeyOf(d){var rk=dayRK(d);if(rk)return rk;return modeOf(d)==="sup"?"sup":KEYS[d.getDay()];}
function sessSum(rows,n){
  var S=(rows||[]).slice(0,n).filter(function(r){return r&&r[2]&&+r[1]>0;}).map(function(r){return [+r[0]||0,+r[1]||0];});if(!S.length)return null;
  var w=Math.max.apply(null,S.map(function(x){return x[0];})),T=S.filter(function(x){return x[0]===w;});
  return {s:S,w:w,rt:T.reduce(function(a,x){return a+x[1];},0),nt:T.length,minR:Math.min.apply(null,T.map(function(x){return x[1];})),reps:S.reduce(function(a,x){return a+x[1];},0),vol:S.reduce(function(a,x){return a+x[0]*x[1];},0)};}
function prevSession(k,d,ids){var D=collectDays();
  for(var i=1;i<=42;i++){var p=addD(d,-i),v=D[iso(p)];if(!v||!v.s||gymClosed(p)||dayKeyOf(p)!==k)continue;
    if(ids.some(function(id){return (v.s[id]||[]).some(rowDone);}))return {d:p,doc:v,ago:i};}
  return null;}
function cmpData(k,d){
  var L=exList(k,d),ids=L.map(exId),P=prevSession(k,d,ids);if(!P)return null;var dd=dayDoc(d),bi=blockInfo(d),deload=!bi.pre&&bi.wk===5;
  var X=L.map(function(e){var id=exId(e),n=setsN(e,d),c=sessSum(dd.s[id],n),p=sessSum(P.doc.s[id],99),rr=repRange(e.sr),o={e:e,n:String(e.n).split(" (")[0].split(",")[0],c:c,p:p,rr:rr};
    if(!c)return o;if(!p){o.st="new";return o;}
    var dw=c.w-p.w;
    if(dw>0){o.st="up";o.tag="+"+kgs(dw)+" lb";}
    else if(dw<0){o.st=c.vol>p.vol?"mix":"down";o.tag="−"+kgs(-dw)+" lb";}
    else{var dr=c.rt-p.rt;if(c.nt!==p.nt)dr=c.reps-p.reps;o.st=dr>0?"up":dr<0?"down":"eq";o.tag=dr>0?"+"+dr+" rep":dr<0?"−"+(-dr)+" rep":"igual";}
    o.top=rr&&c.nt>=Math.min(2,n)&&c.minR>=rr[1];
    o.fade=c.s.length>=3&&c.nt>=2&&(function(){var T=c.s.filter(function(x){return x[0]===c.w;});return T[T.length-1][1]<=Math.floor(T[0][1]*0.7);})();
    return o;});
  var both=X.filter(function(o){return o.c&&o.p;}),cv=0,pv=0,cr=0,pr=0;both.forEach(function(o){cv+=o.c.vol;pv+=o.p.vol;cr+=o.c.reps;pr+=o.p.reps;});
  var Sc=sess(d),Sp=sess(P.d);
  return {P:P,X:X,both:both,cv:cv,pv:pv,cr:cr,pr:pr,deload:deload,mc:Sc.st==="off"?0:Math.round(Sc.ms/60000),mp:Sp.st==="off"?0:Math.round(Sp.ms/60000),goal:GMat(d)[k]||0};
}
/* recomendaciones para la siguiente sesión de la misma rutina; pre=true cuando se muestran al empezar (Entreno, arriba) */
function cmpNext(x,pre){
  var next=[],B=x.X.filter(function(o){return o.c&&o.p;}),dn=B.filter(function(o){return o.st==="down";}),eq=B.filter(function(o){return o.st==="eq";});
  if(x.deload){next.push(pre?'Terminó la descarga: regresa a tus pesos de antes.':'La semana que viene vuelve el bloque: regresa a tus pesos de antes de la descarga.');return next;}
  var tp=x.X.filter(function(o){return o.c&&o.top;});if(tp.length)next.push((pre?'Sube ':'La próxima sube ')+STEP+' lb en '+cmpList(tp.map(function(o){return o.n;}))+': '+(pre?'la vez pasada llegaste':'llegaste')+' al tope de reps en todas.');
  if(dn.length)next.push('En '+cmpList(dn.map(function(o){return o.n;}))+' repite el peso '+(pre?'de la vez pasada':'de hoy')+' hasta recuperar las reps. Si bajas dos semanas seguidas, revisa sueño y comida.');
  var fd=x.X.filter(function(o){return o.c&&o.fade&&o.st!=="up";});if(fd.length)next.push('En '+cmpList(fd.map(function(o){return o.n;}))+' se te cayeron mucho las reps de la primera a la última serie: descansa el tiempo completo ('+esc(fd[0].e.rest)+').');
  var eq2=eq.filter(function(o){return !o.top;});if(eq2.length)next.push('En '+cmpList(eq2.map(function(o){return o.n;}))+' busca +1 rep en la primera serie con el mismo peso.');
  if(x.mc&&x.goal&&x.mc>x.goal+15)next.push('Usa el cronómetro de descanso y no alargues entre series para quedar en ≈'+x.goal+' min.');
  if(!next.length)next.push('Sigue con lo que te sugiere cada ejercicio: +1 rep hasta el tope del rango y luego +'+STEP+' lb.');
  return next.slice(0,4);}
/* al empezar: las recomendaciones que dejó la última sesión de esta rutina (solo si hoy todavía no la terminas) */
function recoHTML(k,d){
  var ids=exList(k,d).map(exId),P=prevSession(k,d,ids);if(!P)return '';
  var x=cmpData(k,P.d);
  if(!x){var dd0=P.doc,bi=blockInfo(P.d);x={deload:!bi.pre&&bi.wk===5,mc:0,goal:0,X:exList(k,P.d).map(function(e){var n=setsN(e,P.d),c=sessSum(dd0.s[exId(e)],n),rr=repRange(e.sr),o={e:e,n:String(e.n).split(" (")[0].split(",")[0],c:c,p:null};
    if(c){o.top=rr&&c.nt>=Math.min(2,n)&&c.minR>=rr[1];var T=c.s.filter(function(z){return z[0]===c.w;});o.fade=c.s.length>=3&&T.length>=2&&T[T.length-1][1]<=Math.floor(T[0][1]*0.7);}return o;})};}
  var pd=P.d;
  return '<div class="cmpb n reco"><span class="eyebrow">Recomendaciones de la vez pasada · '+DAYS[pd.getDay()].n.toLowerCase()+' '+pd.getDate()+' '+MES3[pd.getMonth()]+'</span><ul>'+cmpNext(x,true).map(function(t){return '<li>'+t+'</li>';}).join("")+'</ul></div>';}
function cmpList(a){a=a.map(function(x){return '<b style="color:var(--fg)">'+esc(x)+'</b>';});return a.length<2?a.join(""):a.slice(0,-1).join(", ")+" y "+a[a.length-1];}
function cmpHTML(k,d,all){
  var x=cmpData(k,d);
  if(!x)return '<div class="card cmp"><h3>Comparación</h3><p class="small muted">Es la primera vez que registras esta rutina. La semana que viene, al terminar, verás aquí qué mejoraste contra hoy.</p></div>';
  var pd=x.P.d,lab=x.P.ago===7?'el '+DAYS[pd.getDay()].n.toLowerCase()+' pasado, '+pd.getDate()+' '+MES3[pd.getMonth()]:'tu última sesión igual, '+DAYS[pd.getDay()].n.toLowerCase()+' '+pd.getDate()+' '+MES3[pd.getMonth()];
  var vp=x.pv?Math.round((x.cv-x.pv)/x.pv*100):0,up=x.both.filter(function(o){return o.st==="up";}),dn=x.both.filter(function(o){return o.st==="down";}),eq=x.both.filter(function(o){return o.st==="eq";}),mx=x.both.filter(function(o){return o.st==="mix";});
  var h='<div class="card cmp"><div class="sec-h"><h3>Contra la semana pasada</h3><span class="r small muted">'+lab+'</span></div>';
  h+='<div class="kpis"><div class="stat'+(vp>0?' ok':'')+'"><b>'+(vp>0?'+':vp<0?'−':'')+Math.abs(vp)+'%</b><span>volumen (lb × reps)</span></div><div class="stat'+(x.cr>x.pr?' ok':'')+'"><b>'+(x.cr>x.pr?'+':x.cr<x.pr?'−':'')+Math.abs(x.cr-x.pr)+'</b><span>reps totales</span></div><div class="stat'+(up.length?' ok':'')+'"><b>'+up.length+'<small>/'+x.both.length+'</small></b><span>ejercicios arriba</span></div></div>';
  h+='<ul class="cmpl">'+x.X.map(function(o){if(!o.c)return '';
    var a=o.p?kgs(o.p.w)+'×'+o.p.s.filter(function(s){return s[0]===o.p.w;}).map(function(s){return s[1];}).join('/'):'—',b=kgs(o.c.w)+'×'+o.c.s.filter(function(s){return s[0]===o.c.w;}).map(function(s){return s[1];}).join('/');
    return '<li class="'+(o.st||'new')+'"><span class="nm">'+esc(o.n)+'</span><span class="vs">'+a+' → <b>'+b+'</b></span><span class="tg">'+(o.st==="new"?'nuevo':o.tag)+'</span></li>';}).join("")+'</ul><p class="small muted">Libras × reps de las series con tu peso más alto.</p>';
  var good=[],bad=[],next=cmpNext(x,false);if(!all)bad.push('Terminaste la rutina a medias. Si fue por tiempo, la próxima elige el modo Ocupada.');
  if(up.length)good.push('Subiste en '+cmpList(up.map(function(o){return o.n;}))+'.');
  if(vp>=3)good.push('Moviste '+vp+'% más volumen que la semana pasada.');
  if(all)good.push('Completaste todas las series.');
  if(x.mc&&x.goal&&x.mc<=x.goal+10)good.push('Terminaste en '+dur(x.mc)+(x.mp?' (la semana pasada '+dur(x.mp)+')':'')+', dentro de la meta.');
  if(x.deload){bad.push('Es semana de descarga: bajar peso o series es lo que toca, no cuenta como retroceso.');}
  else{
    if(dn.length)bad.push('Bajaste en '+cmpList(dn.map(function(o){return o.n+' ('+o.tag+')';}))+'.');
    if(eq.length)bad.push('Repetiste exactamente lo mismo en '+cmpList(eq.map(function(o){return o.n;}))+'.');
    if(mx.length)bad.push('En '+cmpList(mx.map(function(o){return o.n;}))+' bajaste peso pero hiciste más reps: está bien si fue por técnica.');
    if(x.mc&&x.goal&&x.mc>x.goal+15)bad.push('La sesión duró '+dur(x.mc)+', '+dur(x.mc-x.goal)+' más que la meta.');
  }
  if(!bad.length)bad.push('Nada en contra hoy.');
  var blk=function(t,c,a){return '<div class="cmpb '+c+'"><span class="eyebrow">'+t+'</span><ul>'+a.map(function(s){return '<li>'+s+'</li>';}).join("")+'</ul></div>';};
  h+=blk('Qué hiciste bien','g',good)+blk('Qué no salió','w',bad)+blk('Qué mejorar la próxima','n',next.slice(0,4))+'</div>';
  return h;
}
var LB=2.20462;
function toLb(v){return v===""||v==null?"":Math.round(v*LB*10)/10;}
function setRow(el){
  var art=el.closest(".ex"),id=art.dataset.x,j=+el.closest(".set").dataset.n,dd=dayDoc(woDate());
  if(!dd.s[id])dd.s[id]=[];
  while(dd.s[id].length<=j)dd.s[id].push(["","",0]);
  return {art:art,id:id,j:j,row:dd.s[id][j],e:WG()[wsel].ex[+art.dataset.i]};
}
var inT=0;
$("exlist").addEventListener("input",function(e){
  var t=e.target;if(t.tagName!=="INPUT")return;var o=setRow(t),v=t.value===""?"":+t.value;if(+t.dataset.f===0&&o.row.length>3){o.row[3]=v;o.row[0]=toLb(v);}else o.row[+t.dataset.f]=v;
  clearTimeout(inT);var wd0=woDate();inT=setTimeout(function(){saveDay(wd0);},500);
  if(o.row[2])updateLast(o.id,o.e);
});
$("exlist").addEventListener("click",function(e){
  var rb=e.target.closest("[data-rod]");if(rb){var rd=woDate(),rdd=dayDoc(rd),rv=+rb.dataset.rod;if(rdd.rod===rv){delete rdd.rod;rdd._auth=Date.now();}else rdd.rod=rv;saveDay(rd);var card=rb.closest(".rod");if(card)card.outerHTML=rodCard();if(rdd.rod!=null)toast("Rodilla: "+rv+" de 10");return;}
  var al=e.target.closest("[data-alt]");if(al){var C=JSON.parse(JSON.stringify(sget("cfg")||{}));if(!C.alt)C.alt={};if(C.alt[al.dataset.alt])delete C.alt[al.dataset.alt];else C.alt[al.dataset.alt]=1;sput("cfg",C);
    var ix=+al.closest(".ex").dataset.i;renderEntreno();var ne=WG()[wsel].ex[ix];if(ne)toast("Ahora: "+ne.n.split(" (")[0].toLowerCase());return;}
  var mt=e.target.closest("[data-mus]");if(mt){var mid=mt.dataset.mus,on=!musOpen[mid];musOpen[mid]=on;mt.setAttribute("aria-expanded",on);var pnl=document.getElementById("mus-"+mid);if(pnl)pnl.hidden=!on;return;}
  var hs=e.target.closest("[data-hist]");if(hs){goStats(hs.dataset.hist);return;}
  var lb=e.target.closest("[data-lb]");if(lb){openLB(WG()[wsel].ex[+lb.dataset.lb]);return;}
  var un=e.target.closest("[data-unit]");if(un){
    /* cambia lb/kg en todas las series del ejercicio; siempre se guarda también en lb */
    var o0=setRow(un),toKg=o0.row.length<=3,rows=dayDoc(woDate()).s[o0.id],n0=setsN(o0.e);
    while(rows.length<n0)rows.push(["","",0]);
    rows.forEach(function(r){if(toKg){r[3]=r[0]===""||r[0]==null?"":Math.round(r[0]/LB*2)/2;}else if(r.length>3){r.length=3;}});
    saveDay(woDate());
    var art=o0.art;art.querySelectorAll(".set").forEach(function(row,ix){var r=rows[ix]||[],inp=row.querySelector('[data-f="0"]'),bt=row.querySelector("[data-unit]");
      inp.value=toKg?(r[3]!==""&&r[3]!=null?r[3]:""):(r[0]!==""&&r[0]!=null?r[0]:"");
      var ph=parseFloat(String(inp.placeholder).replace(",","."));if(!isNaN(ph))inp.placeholder=kgs(toKg?Math.round(ph/LB*2)/2:Math.round(ph*LB));
      inp.setAttribute("aria-label",(toKg?"Kilos":"Libras")+", serie "+(ix+1));bt.textContent=toKg?"kg":"lb";bt.classList.toggle("kg",toKg);bt.setAttribute("aria-label","Cambiar a "+(toKg?"libras":"kilos"));});
    toast(toKg?"Anotas en kg: lo convierto a lb para tu historial":"De vuelta a lb");return;}
  var go=e.target.closest(".go");if(!go)return;
  ensureAudio();
  var o=setRow(go),row=go.closest(".set"),ins=row.querySelectorAll("input");
  if(!o.row[2]){
    [0,1].forEach(function(f){var cur=f===0&&o.row.length>3?o.row[3]:o.row[f];if(cur===""||cur==null){var p=parseFloat(String(ins[f].placeholder).replace(",","."));if(!isNaN(p)&&!/–/.test(ins[f].placeholder)){if(f===0&&o.row.length>3){o.row[3]=p;o.row[0]=toLb(p);}else o.row[f]=p;ins[f].value=p;}}});
    o.row[2]=1;
  }else{o.row[2]=0;dayDoc(woDate())._auth=Date.now();}
  row.classList.toggle("ok",!!o.row[2]);go.setAttribute("aria-pressed",!!o.row[2]);if(o.row[2]){go.classList.remove("pop");void go.offsetWidth;go.classList.add("pop");}
  if(o.row[2]&&navigator.vibrate)try{navigator.vibrate(15);}catch(er){}
  var past=woPast(),sesNew=false;if(o.row[2]&&!past){var dd0=dayDoc(TODAY);dd0.lt=Date.now();if(!dd0.ss||dd0.se){if(!dd0.ss)sesNew=true;dd0.ss=dd0.ss||Date.now();delete dd0.se;}}
  saveDay(woDate());
  var n=setsN(o.e),dd=dayDoc(woDate()),dn=(dd.s[o.id]||[]).filter(function(r,ix){return r&&r[2]&&ix<n;}).length;
  o.art.classList.toggle("complete",dn>=n);
  updateLast(o.id,o.e);
  updWoStats();sessUI();
  if(o.row[2]&&!past){
    var ex=WG()[wsel].ex,i=+o.art.dataset.i,nxt=ex[i+1];
    var lastSet=o.j===n-1;
    if(o.e.ss&&nxt&&nxt.ss===o.e.ss){toast("Superserie: pasa a "+nxt.n.split(" (")[0].toLowerCase());}
    else startRest(restSec(o.e.rest),lastSet&&nxt?"Sigue: "+nxt.n:o.e.n);
  }
  if(sesNew)toast("Arrancó el cronómetro de tu sesión");
});
function updateLast(id,e){
  var wdt=woDate(),dd=dayDoc(wdt),rows=(dd.s[id]||[]).filter(function(r){return r&&r[2];}),L=getDoc("last",{}),B=getDoc("best",{}),cur=L[id],td=iso(wdt);
  var sets=rows.map(function(r){return [+r[0]||0,+r[1]||0];}).filter(function(x){return x[1]>0;});
  if(cur&&cur.d>td){
    /* ya hay un registro más nuevo: solo actualiza el "anterior" si este día es más reciente */
    if(sets.length){if(!cur.p||cur.p.d<=td)cur.p={d:td,s:sets};}
    else if(cur.p&&cur.p.d===td)cur.p=null;
  }else{
    if(cur&&cur.d<td){L[id]={d:td,s:sets,p:{d:cur.d,s:cur.s}};}
    else if(cur){cur.s=sets;}
    else L[id]={d:td,s:sets,p:null};
    if(!sets.length){if(L[id].p){L[id]={d:L[id].p.d,s:L[id].p.s,p:null};}else delete L[id];}
  }
  sput("last",L);
  var b=B[id],chg=false;
  sets.forEach(function(s){if(s[0]>0&&s[1]>0){var v=e1rm(s[0],s[1]);if(!b||v>b.e+0.01){b={n:e.n,kg:s[0],r:s[1],e:Math.round(v*10)/10,d:td};chg=true;}}});
  if(chg){var was=B[id];B[id]=b;sput("best",B);if(was)toast("Nuevo récord en "+e.n.split(" (")[0].toLowerCase()+": "+kgs(b.kg)+" lb × "+b.r);}
}
$("v-entreno").addEventListener("click",function(e){if(roWo()&&e.target.closest("[data-unit],.go,[data-rod],[data-alt],[data-fin],[data-sess],[data-wmode],[data-rkset],[data-wtoday]"))roBlock(e);},true);
$("v-entreno").addEventListener("input",function(e){if(roWo())roBlock(e);},true);
$("v-entreno").addEventListener("click",function(e){var b=e.target.closest("[data-wk]");if(!b||b.disabled)return;e.preventDefault();var s=+b.dataset.wk;
  var base=wfor||(wsel==="sup"||!GD[wsel]||wsel===dayRK(TODAY)?TODAY:chipDate(wsel)),nd=addD(base,7*s);
  if(s===0||ddiff(mondayOf(nd),mondayOf(TODAY))>=0){wfor=null;wsel=defWsel(TODAY);}else{wfor=nd;wsel=woKey(nd);}
  wtoday=false;sessEdit=false;renderEntreno();vin($("exlist"));});
$("wdays").addEventListener("click",function(e){var bd=e.target.closest("[data-wdd]");if(bd){wfor=fromIso(bd.dataset.wdd);wsel=woKey(wfor);sessEdit=false;renderEntreno();vin($("exlist"));return;}var b=e.target.closest("[data-wd]");if(!b)return;wsel=b.dataset.wd;wtoday=false;wfor=null;sessEdit=false;renderEntreno();vin($("exlist"));});
$("wohead").addEventListener("click",function(e){var sb=e.target.closest("[data-sess]");if(sb){ensureAudio();var a=sb.dataset.sess;if(a==="edit"){sessEdit=true;sessBox();var f=$("sesMin");if(f)f.focus();return;}if(a==="cancel"){sessEdit=false;sessBox();return;}
if(a==="save"){var hm=$("sesIni").value,mn=parseInt($("sesMin").value,10);if(!/^\d{1,2}:\d{2}$/.test(hm)||!(mn>0&&mn<=600)){toast("Escribe la hora de inicio y los minutos que duró");return;}sessSet(fromIso(sb.dataset.d),hm,mn);return;}
if(a==="reset"){if(!rstArm){rstArm=1;sessBox();setTimeout(function(){if(rstArm){rstArm=0;sessBox();}},3500);return;}rstArm=0;sessReset(fromIso(sb.dataset.d));return;}if(a==="start")sessStart();else if(a==="end")sessEnd();else sessResume();return;}var rks=e.target.closest("[data-rkset]");if(rks){e.preventDefault();var nk=rks.dataset.rkset;setRK(TODAY,nk);wsel=GD[nk]?nk:"lun";wtoday=false;renderAll();toast(GD[nk]?"Hoy queda como "+GD[nk].t.toLowerCase():"Hoy queda como descanso");return;}var wmb=e.target.closest("[data-wmode]");if(wmb){var m=wmb.dataset.wmode;setMode(TODAY,m);wfor=null;if(m==="sup")wsel="sup";else if(wsel==="sup")wsel=GD[TKEY]&&TKEY!=="sup"?TKEY:"lun";renderAll();toast("Semana "+MODES[m].n.toLowerCase()+": "+MODES[m].d);return;}var wt=e.target.closest("[data-wtoday]");if(wt){e.preventDefault();wtoday=wt.dataset.wtoday==="1";wfor=null;renderEntreno();return;}if(e.target.closest("[data-goguia]")){e.preventDefault();show("guia");var el=$("lcap");if(el)el.scrollIntoView({block:"start"});}});

/* temporizador de descanso */
var TM={end:0,dur:0,iv:0,hide:0},AC=null;
function ensureAudio(){try{if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(C)AC=new C();}if(AC&&AC.state==="suspended")AC.resume();}catch(e){}}
function beep(){try{if(!AC)return;[0,0.22,0.44].forEach(function(t,i){var o=AC.createOscillator(),g=AC.createGain();o.type="sine";o.frequency.value=i===2?1175:880;g.gain.setValueAtTime(0.0001,AC.currentTime+t);g.gain.exponentialRampToValueAtTime(0.25,AC.currentTime+t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,AC.currentTime+t+0.18);o.connect(g);g.connect(AC.destination);o.start(AC.currentTime+t);o.stop(AC.currentTime+t+0.2);});}catch(e){}if(navigator.vibrate)try{navigator.vibrate([180,90,180]);}catch(e){}}
function startRest(sec,label){
  var el=$("timer");clearTimeout(TM.hide);el.classList.remove("end");
  TM.dur=sec;TM.end=Date.now()+sec*1000;$("tmt").textContent="Descanso · "+Math.round(sec/60*10)/10+" min";$("tms").textContent=label;
  el.classList.add("on");clearInterval(TM.iv);TM.iv=setInterval(tick,250);tick();
}
function tick(){
  var left=Math.max(0,TM.end-Date.now()),s=Math.ceil(left/1000);
  $("tmtxt").textContent=Math.floor(s/60)+":"+pad(s%60);
  $("tmval").setAttribute("stroke-dashoffset",(138.2*(1-left/(TM.dur*1000))).toFixed(1));
  if(left<=0){clearInterval(TM.iv);$("timer").classList.add("end");$("tmt").textContent="¡A la siguiente serie!";beep();TM.hide=setTimeout(stopRest,7000);}
}
function stopRest(){clearInterval(TM.iv);clearTimeout(TM.hide);$("timer").classList.remove("on","end");}
$("tmadd").addEventListener("click",function(){if($("timer").classList.contains("end")){clearTimeout(TM.hide);$("timer").classList.remove("end");TM.end=Date.now()+15000;TM.dur=15;TM.iv=setInterval(tick,250);}else{TM.end+=15000;TM.dur+=15;}tick();});
$("tmskip").addEventListener("click",stopRest);

/* visor de imágenes */
var lbFrom=null;
/* ===== mapa de músculos: cuerpo de frente y de espalda con lo que trabaja cada ejercicio ===== */
var MUSN={pecS:"pecho superior",pec:"pecho",dA:"hombro frontal",dL:"hombro lateral",dP:"hombro posterior",bic:"bíceps",brq:"braquial",ant:"antebrazo",abs:"abdomen",obl:"oblicuos",cua:"cuádriceps",adu:"aductores",trp:"trapecio",lat:"dorsal ancho",rom:"espalda media",tri:"tríceps",lum:"lumbares",glu:"glúteos",isq:"isquiotibiales",gem:"gemelos",sol:"sóleo"};
var MUSX=[
 ["press inclinado",["pecS","pec"],["dA","tri"]],["press de banca plano",["pec"],["dA","tri"]],["aperturas en polea",["pec"],["dA"]],["aperturas en maquina",["pec"],["dA"]],
 ["elevaciones laterales",["dL"],["trp"]],["extension de triceps",["tri"],[]],["press frances",["tri"],[]],["jalon de triceps",["tri"],[]],
 ["jalon al pecho",["lat"],["bic","rom","dP"]],["remo con pecho apoyado",["rom","lat"],["dP","bic","trp"]],["remo",["lat","rom"],["bic","dP"]],
 ["pullover",["lat"],["tri","pec"]],["aperturas inversas",["dP"],["rom","trp"]],["face pull",["dP"],["rom","trp"]],
 ["curl martillo",["brq","ant"],["bic"]],["curl de muneca",["ant"],[]],["curl femoral",["isq"],[]],["curl",["bic"],["brq","ant"]],
 ["peso muerto rumano",["isq","glu"],["lum"]],["peso muerto",["glu","isq","lum"],["cua","trp","ant"]],["hip thrust",["glu"],["isq"]],
 ["extension de cuadriceps",["cua"],[]],["elevacion de talones sentado",["sol"],["gem"]],["elevacion de talones",["gem"],["sol"]],
 ["crunch",["abs"],["obl"]],["press militar",["dA"],["dL","tri","trp"]],["press de banca agarre cerrado",["tri"],["pec","dA"]],
 ["dominadas",["lat"],["bic","rom"]],["fondos",["pec"],["tri","dA"]],["aductores",["adu"],[]]];
function musOf(e){var s=String(e.n).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
  /* el orden importa: lo más específico va primero */
  var best=null;MUSX.forEach(function(m){if(s.indexOf(m[0])===0&&(!best||m[0].length>best[0].length))best=m;});return best?{p:best[1],s:best[2]}:null;}
/* mitad izquierda de cada figura; la derecha es su espejo */
var MUSF={trpF:"M45,30 L36,38 L45,37 Z",dL:"M31,37 C23,38 20,47 21,55 L26,53 C26,47 28,41 34,38 Z",dA:"M34,38 C28,41 26,47 26,53 L30,54 C32,48 35,43 38,39 Z",
 pecS:"M38,39 L49,38 L49,45 C44,45 39,46 33,49 C34,45 36,41 38,39 Z",pec:"M33,49 C39,46 44,45 49,45 L49,58 C43,61 37,60 31,55 Z",
 brq:"M21,57 C19,64 20,71 22,77 L25,76 C23,71 22,64 24,56 Z",bic:"M24,56 C22,64 23,71 25,76 L30,75 C31,68 31,61 30,55 Z",
 ant:"M21,80 C18,89 18,98 20,106 L26,106 C28,97 29,88 30,79 Z",abs:"M43,61 L49,60 L49,68 L43,68 Z M43,70 L49,70 L49,77 L43,77 Z M43,79 L49,79 L49,86 L43,86 Z M43,88 L49,88 L49,99 C46,98 44,96 43,93 Z",
 obl:"M32,58 C36,61 39,62 41,62 L41,93 C38,92 35,89 34,84 C33,76 34,67 32,58 Z",cua:"M33,104 C29,116 29,135 33,150 L45,150 C47,138 47,120 45,108 C41,105 37,104 33,104 Z",
 adu:"M45,108 C47,120 47,132 46,142 C48,136 49,122 49,111 Z",
 gemF:"M33,158 C31,166 32,176 34,184 L37,184 C36,175 36,166 37,158 Z",tib:"M38,158 C38,168 39,178 39,190 L43,190 C45,178 45,168 44,158 Z"};
var MUSB={trp:"M50,27 L42,35 L31,38 L40,43 L46,52 L50,64 L54,52 L60,43 L69,38 L58,35 Z",dP:"M31,38 C25,40 21,47 22,55 L27,52 C28,47 32,43 39,42 Z",
 rom:"M40,44 L46,52 L48,62 L41,58 Z",lat:"M33,48 C33,60 37,73 44,84 L49,85 L49,66 L41,60 L39,46 Z",lum:"M44,86 L49,86 L49,100 L43,98 Z",
 tri:"M22,57 C20,64 21,72 24,77 L30,76 C31,69 31,61 29,54 Z",ant:"M21,80 C18,89 18,98 20,106 L26,106 C28,97 29,88 30,79 Z",
 glu:"M35,99 C32,107 35,117 42,120 C47,120 50,117 50,112 L50,101 C45,100 40,99 35,99 Z",isq:"M34,122 C31,133 32,145 35,152 L46,152 C47,142 47,131 46,122 C42,122 38,122 34,122 Z",
 gem:"M33,159 C30,166 32,174 36,178 L45,178 C46,172 46,164 44,159 Z",sol:"M35,179 C35,184 36,188 37,191 L43,191 C44,187 45,183 45,179 Z"};
var MUSBASE='<ellipse cx="50" cy="15" rx="9" ry="11"/><path d="M45,24 L55,24 L56,33 L44,33 Z"/>'+
 '<path d="M38,37 C44,35 56,35 62,37 L68,44 C70,60 66,75 65,90 C66,96 68,100 66,104 L50,108 L34,104 C32,100 34,96 35,90 C34,75 30,60 32,44 Z"/>'+
 '<g id="hm"><path d="M31,37 C21,38 19,48 20,56 C18,66 19,74 21,79 C18,89 18,98 20,106 L27,107 C29,97 31,88 31,78 C32,70 32,60 33,48 Z"/><ellipse cx="23" cy="112" rx="4" ry="6"/>'+
 '<path d="M33,102 C28,116 29,136 33,152 C31,166 32,180 35,192 L43,192 C46,180 46,166 45,154 C48,138 49,120 50,108 Z"/><ellipse cx="39" cy="196" rx="7" ry="3.2"/></g>'+
 '<use href="#hm" transform="translate(100,0) scale(-1,1)"/>';
var musN=0,musOpen={};
function musSVG(m,big){
  if(!m)return "";var P={},Q={};m.p.forEach(function(k){P[k]=1;});m.s.forEach(function(k){Q[k]=1;});
  function cl(k){var kk=k==="trpF"?"trp":k==="gemF"?"gem":k;return P[kk]?"mp":Q[kk]?"ms":"m0";}
  function side(D,mirror){var o="";Object.keys(D).forEach(function(k){if(k==="trp")return;o+='<path class="'+cl(k)+'" d="'+D[k]+'"/>';});
    return o+'<g transform="translate(100,0) scale(-1,1)">'+o+'</g>';}
  function base(){var uid="h"+(++musN);return MUSBASE.replace('id="hm"','id="'+uid+'"').replace('href="#hm"','href="#'+uid+'"');}
  var front='<g class="mb">'+base()+'</g>'+side(MUSF);
  var back='<g class="mb">'+base()+'</g><path class="'+cl("trp")+'" d="'+MUSB.trp+'"/>'+side(MUSB);
  var lbl=m.p.map(function(k){return MUSN[k];}).join(", ");
  return '<svg class="musc'+(big?' big':'')+'" viewBox="0 0 210 '+(big?212:200)+'" role="img" aria-label="Trabaja '+lbl+(m.s.length?'; ayudan '+m.s.map(function(k){return MUSN[k];}).join(", "):'')+'">'+
    '<g>'+front+'</g><g transform="translate(110,0)">'+back+'</g>'+(big?'<text x="50" y="210" class="mt">Frente</text><text x="160" y="210" class="mt">Espalda</text>':'')+'</svg>';
}
function musTxt(m){if(!m)return "";return '<span class="mtx2"><b>'+m.p.map(function(k){return MUSN[k];}).join(", ")+'</b>'+(m.s.length?' · ayudan '+m.s.map(function(k){return MUSN[k];}).join(", "):'')+'</span>';}
function openLB(e){
  lbFrom=document.activeElement;
  $("lbbox").innerHTML='<div class="h"><h3 id="lbt">'+e.n+'</h3><button class="x" type="button" data-close aria-label="Cerrar">'+ic("x")+'</button></div><div class="imgs"><figure><img src="'+IMG[e.img[0]]+'" alt="Posición inicial de '+esc(e.n)+'"><figcaption>Inicio</figcaption></figure><figure><img src="'+IMG[e.img[1]!=null?e.img[1]:e.img[0]]+'" alt="Posición final de '+esc(e.n)+'"><figcaption>Final</figcaption></figure></div>'+(musOf(e)?'<div class="mbig">'+musSVG(musOf(e),true)+'<p class="small"><span class="mkey p"></span>Trabaja: <b>'+musOf(e).p.map(function(k){return MUSN[k];}).join(", ")+'</b>'+(musOf(e).s.length?'<br><span class="mkey s"></span>Ayudan: '+musOf(e).s.map(function(k){return MUSN[k];}).join(", "):'')+'</p></div>':'')+'<div class="ex-meta"><span>'+e.sr+'</span><span>· descanso '+e.rest+'</span>'+(e.ss?'<span class="ss">'+e.ss+'</span>':'')+'</div>'+(e.note?'<p class="small">'+e.note+'</p>':'')+'<p class="small muted">Imágenes: Free Exercise DB (dominio público). Úsalas como referencia de posición.</p>';
  $("lb").hidden=false;$("lbbox").querySelector("[data-close]").focus();
}
function closeLB(){$("lb").hidden=true;if(lbFrom&&lbFrom.focus)lbFrom.focus();}
$("lb").addEventListener("click",function(e){if(e.target.id==="lb"||e.target.closest("[data-close]"))closeLB();});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!$("lb").hidden)closeLB();});

/* ================= COMIDA ================= */
function renderComida(){
  var thisM=weekMenu(TODAY);
  $("cmsub").textContent="Esta semana: Menú "+(thisM+1);
  $("menus").innerHTML=MENUS.map(function(M,i){return '<button type="button" class="mn" data-m="'+i+'" aria-pressed="'+(i===cmMenu)+'">'+(i===thisM?'<em>Esta semana</em>':'<em>&nbsp;</em>')+'<b>Menú '+(i+1)+'</b><span>'+M.n+'</span></button>';}).join("");
  $("cmseg").querySelectorAll("button").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.s===cmSeg);});
  $("menus").hidden=(cmSeg==="inter"||cmSeg==="num");
  var M=MENUS[cmMenu],h="";
  if(cmSeg==="semana"){
    var tk=0,tp=0,tl=0,th=0;DS.forEach(function(r){var g=G[r[0]];tk+=g.k*r[1];tp+=g.p*r[1];tl+=g.l*r[1];th+=g.h*r[1];});
    var dots="";DS.forEach(function(r){var g=G[r[0]];for(var j=0;j<r[1];j++)dots+='<i style="--gc:var('+g.c+')"></i>';dots+='<i class="gap"></i>';});
    h+='<div class="macros"><div class="mac"><b>'+fmt.format(tk)+'</b><span>kcal al día</span></div><div class="mac"><b>'+tp+' g</b><span>proteína (2.0 g/kg)</span></div><div class="mac"><b>'+th+' g</b><span>hidratos de carbono</span></div><div class="mac"><b>'+tl+' g</b><span>grasas</span></div></div>';
    h+='<div class="card" style="display:grid;gap:8px"><span class="eyebrow">49 equivalentes al día</span><div class="dots">'+dots+'</div><div class="legend">'+[["Verduras","--c-v"],["Frutas","--c-f"],["Cereales","--c-c"],["Leguminosas","--c-lg"],["Origen animal","--c-a"],["Leche","--c-l"],["Grasas","--c-g"],["Azúcares","--c-az"]].map(function(x){return '<span style="--gc:var('+x[1]+')">'+x[0]+'</span>';}).join("")+'</div></div>';
    h+='<div class="sec-h"><h2 style="font-size:1.35rem">Comida y cena</h2><span class="r eyebrow">toca un día</span></div><div class="daylist">';
    [1,2,3,4,5,6,0].forEach(function(i){
      var DY=DAYS[i],dd=DY.k==="dom"?{com:DOM.com,cen:DOM.cen}:M.days[DY.k],isT=i===TODAY.getDay()&&cmMenu===thisM;
      h+='<details class="dayrow'+(isT?' today':'')+'" style="--wc:'+dcol(DY.k)+'"'+(isT?' open':'')+'><summary><div class="dh"><b>'+DY.s+'</b><span>'+SHORT[DY.k]+'</span></div><div class="dm"><div><span class="eyebrow">Comida</span><b>'+dd.com.t+'</b></div><div><span class="eyebrow">Cena</span><b>'+dd.cen.t+'</b></div></div></summary><div class="more">'+dish(dd.com)+dish(dd.cen)+'</div></details>';
    });
    h+='</div><div class="sec-h"><h2 style="font-size:1.35rem">Fijos de cada día</h2></div><div class="fixed">';
    h+='<div class="box" style="border-left:4px solid var(--ok)"><div class="sec-h"><h3>Batido de proteína</h3><span class="r mono small muted">opcional · ≈'+BAT.kcal+' kcal · '+BAT.p+'–24 g P</span></div>'+chips([["MB",3]])+'<p class="small">1 scoop (≈ 30 g) de proteína en agua, al terminar el entreno junto con la creatina, o cuando quieras el domingo. Es un extra sobre el plan: si lo tomas diario y subes más de 0.4 kg por semana, quita 1 cereal de la cena o úsalo en vez del pollo de un tiempo.</p></div>';
    h+='<div class="box" style="border-left:4px solid var(--d-jue)"><div class="sec-h"><h3>Creatina</h3><span class="r mono small muted">5 g · 0 kcal · diario</span></div><p class="small">Creatina monohidratada al terminar cada entreno, en agua o en tu batido; el domingo, con el desayuno. No cambia tus equivalentes ni tus calorías.</p></div>';
    [["des",[M.des,DES_B]],["col",[M.col,COL_B]],["pre",PRE]].forEach(function(f){var t=T[f[0]];h+='<div class="box"><div class="sec-h"><h3>'+t.n+'</h3><span class="r mono small muted">'+t.kcal+' kcal · '+t.p+' g P</span></div>'+chips(t.eq)+dish(f[1][0])+'<details class="alt"><summary>Otra opción</summary>'+dish(f[1][1])+'</details></div>';});
    h+='</div>';
  }else if(cmSeg==="batch"){
    h+='<div class="card" style="display:grid;gap:6px"><span class="eyebrow">Domingo · 90 min</span><h3 style="font-family:var(--display);font-weight:800;font-size:1.6rem;text-transform:uppercase;line-height:1">'+M.n+'</h3><p class="small muted">'+M.short+'. Con olla exprés, una olla grande, una olla con tapa para el arroz y el horno o la air fryer se cocina todo a la vez. Lo de lunes a miércoles va al refri; lo de jueves a sábado, al congelador.</p></div>';
    h+='<div class="card"><ol class="steps">'+M.steps.map(function(s){return '<li><span class="t">'+s[0]+'</span><div><b>'+s[1]+'</b> '+s[2]+'</div></li>';}).join("")+'</ol></div>';
    h+='<div class="tbl"><table><thead><tr><th>Qué</th><th>Refri</th><th>Congelador</th></tr></thead><tbody>'+M.store.map(function(r){return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>';}).join("")+'</tbody></table></div>';
    h+='<div class="mini"><b>Miércoles en la noche · 20 min</b><p>'+WED_BASE+M.wed+'</p></div>';
  }else if(cmSeg==="super"){
    var SH=getDoc("shop",{}),sh=SH[cmMenu]||{},tot=0,dn=0;
    M.shop.forEach(function(g,gi){g[1].forEach(function(it,ii){tot++;if(sh[gi+"-"+ii])dn++;});});
    h+='<div class="sec-h"><p class="small muted">Para el Menú '+(cmMenu+1)+', de lunes a sábado. Toca para tachar.</p><span class="r mono small">'+dn+'/'+tot+'</span></div><div class="prog" style="--gym:var(--food)"><i style="width:'+(tot?dn/tot*100:0)+'%;background:var(--food)"></i></div>';
    h+='<div class="shop">'+M.shop.map(function(g,gi){return '<div class="box"><h4>'+g[0]+'</h4><ul>'+g[1].map(function(it,ii){var id="s"+cmMenu+"-"+gi+"-"+ii;return '<li><label for="'+id+'"><input type="checkbox" id="'+id+'" data-sh="'+gi+'-'+ii+'"'+(sh[gi+"-"+ii]?' checked':'')+'><span>'+it+'</span></label></li>';}).join("")+'</ul></div>';}).join("")+'</div>';
    h+='<button class="btn ghost sm" type="button" id="shreset" style="justify-self:start">Desmarcar todo</button>';
  }else if(cmSeg==="inter"){
    h+='<p class="small muted">Cualquier alimento de la misma columna vale lo mismo. Cambia sin miedo, mientras respetes cuántos equivalentes lleva cada tiempo.</p><div class="grid2">'+X.map(function(x){var g=G[x[0]];return '<div class="xcard" style="--gc:var('+g.c+')"><h3 class="gname" style="--gc:var('+g.c+')">'+g.n+'</h3><span class="m">1 eq = '+g.k+' kcal · '+g.p+' g P · '+g.l+' g L · '+g.h+' g HC</span><ul>'+x[1].map(function(r){return '<li><span>'+r[0]+'</span><span>'+r[1]+'</span></li>';}).join("")+'</ul></div>';}).join("")+'</div>'+FR.fuera;
    h+=FR.alerts;
  }else{
    var tk2=0,tp2=0,tl2=0,th2=0,rows="";
    DS.forEach(function(r){var g=G[r[0]],n=r[1];tk2+=g.k*n;tp2+=g.p*n;tl2+=g.l*n;th2+=g.h*n;rows+='<tr><td><span class="gname" style="--gc:var('+g.c+')">'+g.n+'</span></td><td class="n">'+n+'</td><td class="n">'+g.k*n+'</td><td class="n">'+g.p*n+'</td><td class="n">'+g.l*n+'</td><td class="n">'+g.h*n+'</td></tr>';});
    h+='<div class="tbl"><table><thead><tr><th>Grupo</th><th class="n">Eq</th><th class="n">kcal</th><th class="n">P</th><th class="n">L</th><th class="n">HC</th></tr></thead><tbody>'+rows+'</tbody><tfoot><tr><td>Total</td><td class="n">49</td><td class="n">'+fmt.format(tk2)+'</td><td class="n">'+tp2+'</td><td class="n">'+tl2+'</td><td class="n">'+th2+'</td></tr></tfoot></table></div>';
    h+='<div class="tbl"><table><thead><tr><th>Tiempo</th><th>Hora</th><th class="n">kcal</th><th class="n">P</th><th class="n">HC</th><th class="n">L</th></tr></thead><tbody>'+ORDER.slice().sort(function(a,b){return mins(HRS.LM[a])-mins(HRS.LM[b]);}).map(function(k){var t=T[k];return '<tr><td>'+t.n+'</td><td class="mono small">'+HRS.LM[k]+' / '+HRS.MJ[k]+'</td><td class="n">'+t.kcal+'</td><td class="n">'+t.p+'</td><td class="n">'+t.h+'</td><td class="n">'+t.l+'</td></tr>';}).join("")+'</tbody></table></div><p class="small muted">Hora: lunes y miércoles / martes y jueves. El viernes y el fin de semana se recorren según tu día.</p>';
    h+='<section class="guide-why" style="display:grid;gap:10px">'+FR.kcal+'</section><section class="guide-why" style="display:grid;gap:10px">'+FR.ajustar+'</section><section class="guide-why" style="display:grid;gap:10px">'+FR.sinllevar+'</section>';
    h+='<details class="src-d"><summary>Fuentes de la dieta</summary>'+FR.dietsrc+'</details>';
  }
  $("cmbody").innerHTML=h;
}
$("menus").addEventListener("click",function(e){var b=e.target.closest("[data-m]");if(!b)return;cmMenu=+b.dataset.m;renderComida();});
$("cmseg").addEventListener("click",function(e){var b=e.target.closest("[data-s]");if(!b)return;cmSeg=b.dataset.s;renderComida();});
$("cmbody").addEventListener("change",function(e){var c=e.target;if(!c.dataset.sh)return;var SH=getDoc("shop",{});if(!SH[cmMenu])SH[cmMenu]={};if(c.checked)SH[cmMenu][c.dataset.sh]=1;else delete SH[cmMenu][c.dataset.sh];sput("shop",SH);renderComida();});
$("cmbody").addEventListener("click",function(e){if(e.target.id!=="shreset")return;var SH=getDoc("shop",{});SH[cmMenu]={};sput("shop",SH);renderComida();});

/* ================= PROGRESO ================= */
function lastWeight(){var W=getDoc("weights",{e:[]});return W.e.length?W.e[W.e.length-1][1]:null;}
function addWeight(d,kg){var W=getDoc("weights",{e:[]});W.e=W.e.filter(function(r){return r[0]!==d;});W.e.push([d,Math.round(kg*100)/100]);W.e.sort(function(a,b){return a[0]<b[0]?-1:1;});sput("weights",W);}
function avg(a){return a.length?a.reduce(function(s,x){return s+x;},0)/a.length:null;}
var recAll=false,pgSeg=(function(){try{return localStorage.getItem("pvm:pgseg")||"res";}catch(e){return "res";}})();
var PGS={res:["pgw","pgweek","pgdias"],ej:["pgex","pgrec"],cu:["pgtan"],med:["pgmed"]};
function setPgSeg(v){pgSeg=v;try{localStorage.setItem("pvm:pgseg",v);}catch(e){}}
function pgSegUI(){Object.keys(PGS).forEach(function(k){PGS[k].forEach(function(id){$(id).hidden=k!==pgSeg;});});$("pgseg").querySelectorAll("[data-pg]").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.pg===pgSeg);});}
$("pgseg").addEventListener("click",function(e){var b=e.target.closest("[data-pg]");if(!b)return;setPgSeg(b.dataset.pg);pgSegUI();if(pgSeg==="med"){renderMedallas();vin($("pgmed"));}window.scrollTo(0,0);});
function renderProgreso(){pgSegUI();
  var W=getDoc("weights",{e:[]}),E=W.e.map(function(r){return {d:fromIso(r[0]),kg:r[1],s:r[0]};});
  var last=E.length?E[E.length-1]:null;
  var a7=avg(E.filter(function(x){var g=ddiff(TODAY,x.d);return g>=0&&g<7;}).map(function(x){return x.kg;}));
  var p7=avg(E.filter(function(x){var g=ddiff(TODAY,x.d);return g>=7&&g<14;}).map(function(x){return x.kg;}));
  var wk=(a7!=null&&p7!=null)?a7-p7:null;
  var verdict=wk==null?"Necesitas 2 semanas de registros para ver el ritmo.":wk<0.1?"Vas por debajo: si sigue así 2 semanas, suma 1 cereal y 1 grasa en la cena.":wk>0.4?"Vas rápido: si sigue así, quita 1 cereal de la comida y 1 de la cena.":"Vas en el ritmo ideal.";
  var h='<div class="sec-h"><h3 style="font-size:1.05rem">Peso</h3><span class="r eyebrow">meta '+(bwU()==="lb"?'+0.3 a +0.55 lb':'+0.15 a +0.25 kg')+'/sem</span></div>';
  h+='<form class="wform" id="wf"><label><input type="number" inputmode="decimal" step="0.1" '+bwMinMax()+' id="wi" placeholder="'+bw(last?last.kg:BASEKG)+'" aria-label="Peso en '+bwName()+'"><span>'+bwU()+'</span></label><button class="btn pri" type="submit">Guardar</button></form>';
  h+='<div class="kpis"><div class="stat"><b>'+(last?bw(last.kg):'—')+'</b><span>'+(last?'último · '+last.d.getDate()+' '+MES3[last.d.getMonth()]:'sin registros')+'</span></div><div class="stat"><b>'+(a7!=null?bw(a7):'—')+'</b><span>promedio 7 días</span></div><div class="stat'+(wk!=null&&wk>=0.1&&wk<=0.4?' ok':'')+'"><b>'+(wk!=null?(wk>=0?'+':'')+fmt1.format(Math.round(toU(wk)*10)/10):'—')+'</b><span>'+bwU()+' vs semana pasada</span></div></div>';
  h+=chartSVG(E)+'<p class="small muted">'+verdict+'</p>';
  if(ddiff(TODAY,REV)<0)h+='<p class="note info"><b>Revisión: domingo 22 nov</b> · llevas '+wqCount()+' de 6 pesadas (lun, mié y vie en ayunas).</p>';
  else if(sameDay(TODAY,REV))h+='<p class="note"><b>Hoy toca la revisión.</b> '+verdict+'</p>';
  if(E.length)h+='<details><summary class="small" style="cursor:pointer;color:var(--muted)">Ver registros ('+E.length+')</summary><ul class="rec">'+E.slice().reverse().slice(0,30).map(function(x){return '<li><span>'+x.d.getDate()+' '+MES3[x.d.getMonth()]+' '+x.d.getFullYear()+'</span><span>'+bw(x.kg)+' '+bwU()+' <button type="button" class="btn ghost sm" data-delw="'+x.s+'" aria-label="Borrar registro del '+x.s+'" style="padding:2px 8px;margin-left:6px">×</button></span></li>';}).join("")+'</ul></details>';
  $("pgw").innerHTML=h;

  var mon=mondayOf(TODAY),bars="",ts=0,tp=0,tm=0,water=0,gmin=0,cre=0,upto=0;
  for(var i=0;i<7;i++){var d=addD(mon,i),k=KEYS[d.getDay()],tot=planTotal(d),ds=doneSets(d),m=mealsDone(d);ts+=ds;tp+=tot;tm+=m.n;water+=waterMl(dayDoc(d));var dq=dayDoc(d);if(ddiff(d,TODAY)<=0){upto++;if(dq.m.cre)cre++;}if(dq.ss)gmin+=((dq.se||(sameDay(d,TODAY)?Date.now():dq.lt||dq.ss))-dq.ss)/60000;
    var hp=tot?Math.min(1,ds/tot)*100:0;
    bars+='<div title="'+DAYS[d.getDay()].n+': '+ds+'/'+tot+' series, '+m.n+'/5 comidas"><i'+(sameDay(d,TODAY)?' style="outline:2px solid var(--gym);outline-offset:1px"':'')+'><b style="height:'+hp+'%"></b></i><span>'+DAYS[d.getDay()].s+'</span></div>';}
  $("pgweek").innerHTML='<div class="sec-h"><h3 style="font-size:1.05rem">Esta semana</h3><span class="r eyebrow">'+mon.getDate()+'–'+addD(mon,6).getDate()+' '+MES3[addD(mon,6).getMonth()]+'</span></div><div class="kpis"><div class="stat"><b>'+ts+'<small style="font-size:.9rem;color:var(--muted)">/'+tp+'</small></b><span>series</span></div><div class="stat"><b>'+tm+'<small style="font-size:.9rem;color:var(--muted)">/35</small></b><span>comidas</span></div><div class="stat"><b>'+fmt1.format(water/1000)+'<small style="font-size:.9rem;color:var(--muted)"> L</small></b><span>agua</span></div></div><div class="bars" role="img" aria-label="Series hechas por día esta semana">'+bars+'</div>'+(gmin>=1?'<p class="small muted">Tiempo entrenando esta semana: <b style="color:var(--fg)">'+dur(gmin)+'</b></p>':'')+'<p class="small muted">Creatina: <b style="color:var(--fg)">'+cre+' de '+upto+'</b> días de esta semana</p>';

  var B=getDoc("best",{}),ids=Object.keys(B).filter(function(k){return k!=="_t"&&B[k]&&B[k].d;});
  var order={};GK.forEach(function(k,ki){GD[k].ex.forEach(function(e,ei){var id=exId(e);if(!(id in order))order[id]=ki*20+ei;});});
  ids.sort(function(a,b){return (order[a]==null?999:order[a])-(order[b]==null?999:order[b]);});
  $("pgrec").innerHTML='<div class="sec-h"><h3 style="font-size:1.05rem">Mejores series</h3><span class="r eyebrow">1RM estimado</span></div>'+(ids.length?'<ul class="rec">'+ids.slice(0,recAll?999:6).map(function(id){var b=B[id],dd=fromIso(b.d);return '<li><button type="button" class="recb" data-exs="'+esc(id)+'"><span>'+esc(b.n)+'<small>'+dd.getDate()+' '+MES3[dd.getMonth()]+'</small></span><span>'+kgs(b.kg)+' lb × '+b.r+' · <b>'+kgs(b.e)+'</b></span></button></li>';}).join("")+'</ul>'+(ids.length>6?'<button type="button" class="btn ghost sm" data-recall>'+(recAll?'Ver menos':'Ver las '+ids.length)+'</button>':''):'<p class="empty">Cuando marques series en Entreno, aquí aparece tu mejor serie de cada ejercicio.</p>');
  renderDias();renderExStats();
  renderTanita();if(pgSeg==="med")renderMedallas();
  var bi=blockInfo(TODAY);$("pgsub").textContent=bi.pre?"":"Bloque "+bi.block+" · semana "+(bi.wk+1);
}
var fmtI=new Intl.NumberFormat("es-MX",{maximumFractionDigits:0});
/* ===== composición corporal (Tanita): la primera medición viene del reporte de julio; las nuevas se guardan en el doc "tanita" ===== */
var TAN0={d:"2026-07-04",kg:68.7,gp:17.2,gk:11.8,mm:54.0,mg:56.9,vis:2,bmr:1705,tbw:59,ecw:40.7,os:2.9,seg:{bi:-1,bd:-1,tr:-2,pi:-2,pd:-1},cx:"Obesidad oculta"};
var TGOAL={kg:[72,74],mm:[57,58],gp:[15,18]};
var tanSel=null,tanForm=false;
/* cómo fue la medición: afecta la comparación (agua, comida y ejercicio mueven la bioimpedancia) */
var TCOND={ayu:"En ayunas",comi:"Después de comer",ent:"Después de entrenar",nob:"Sin ir al baño",agua:"Mucha agua antes",des:"Dormí mal",enf:"Enfermo o deshidratado"};
var TCOND_RISK={comi:1,ent:1,nob:1,agua:1,des:1,enf:1};
var tanNote=false;
function hm12(h){var a=h.split(":"),H=+a[0];return (H%12||12)+":"+a[1]+(H<12?" am":" pm");}
function tanNoteFields(c){c=c||{};var cs=c.cond||[];
  return '<fieldset class="wide tnote"><legend>Cómo fue la medición (opcional)</legend>'+
    '<label><span>Hora</span><input type="time" id="t_h" value="'+(c.h||"")+'"></label>'+
    '<div class="tchips" role="group" aria-label="Condiciones">'+Object.keys(TCOND).map(function(k){return '<button type="button" class="chip" data-tcond="'+k+'" aria-pressed="'+(cs.indexOf(k)>=0)+'">'+TCOND[k]+'</button>';}).join("")+'</div>'+
    '<label class="wide"><span>Nota</span><textarea id="t_nota" maxlength="300" rows="2" placeholder="Ej.: me la hice en otra sucursal, con ropa de calle…">'+esc(c.nota||"")+'</textarea></label></fieldset>';}
function tanNoteRead(x){var h=($("t_h")||{}).value||"";if(/^([01]\d|2[0-3]):[0-5]\d$/.test(h))x.h=h;else delete x.h;
  var cs=[];document.querySelectorAll("#pgtan [data-tcond][aria-pressed=true]").forEach(function(b){cs.push(b.dataset.tcond);});if(cs.length)x.cond=cs;else delete x.cond;
  var n=(($("t_nota")||{}).value||"").trim().slice(0,300);if(n)x.nota=n;else delete x.nota;return x;}
function tanNoteView(c){var parts=[];if(c.h)parts.push('<span class="tn-h">'+hm12(c.h)+'</span>');(c.cond||[]).forEach(function(k){if(TCOND[k])parts.push('<span class="tn-c'+(TCOND_RISK[k]?' risk':'')+'">'+TCOND[k]+'</span>');});
  if(!parts.length&&!c.nota)return "";
  var risk=(c.cond||[]).filter(function(k){return TCOND_RISK[k];});
  return '<div class="tnv">'+(parts.length?'<div class="tn-l">'+parts.join("")+'</div>':'')+(c.nota?'<p class="small">'+esc(c.nota)+'</p>':'')+
    (risk.length?'<p class="small muted">Ojo al comparar ('+risk.map(function(k){return TCOND[k].toLowerCase();}).join(", ")+'): eso cambia el agua del cuerpo y puede mover la grasa y el músculo unos puntos.</p>':'')+'</div>';}
var SEGN={bi:"Brazo izq.",bd:"Brazo der.",tr:"Tronco",pi:"Pierna izq.",pd:"Pierna der."};
function tanList(){var T=sget("tanita"),m={};m[TAN0.d]=TAN0;if(T&&T.e)Object.keys(T.e).forEach(function(d){var x=T.e[d];if(x&&x.del)delete m[d];else if(x)m[d]=x;});
  return Object.keys(m).sort().map(function(d){var x=JSON.parse(JSON.stringify(m[d]));x.d=d;return x;});}
function tanSave(d,x){var T=JSON.parse(JSON.stringify(sget("tanita")||{e:{}}));if(!T.e)T.e={};x._t=Date.now();T.e[d]=x;sput("tanita",T);}
function tanW(kg){return bw(kg)+' <small>'+bwU()+'</small>';}
function tanDelta(cur,prev,key,good,kgUnit){
  if(!prev||prev[key]==null||cur[key]==null)return "";var dv=cur[key]-prev[key];if(Math.abs(dv)<0.05)return '<em class="td eq">sin cambio</em>';
  var v=kgUnit?toU(Math.abs(dv)):Math.abs(dv),ok=good===0?null:(dv>0)===(good>0);
  return '<em class="td '+(ok==null?"eq":ok?"up":"dn")+'">'+(dv>0?"+":"−")+fmt1.format(Math.round(v*10)/10)+(kgUnit?" "+bwU():key==="gp"||key==="tbw"||key==="ecw"?" pts":"")+'</em>';}
function tanBar(lbl,from,cur,g,kgUnit,unit){
  var lo=Math.min(from,g[0])-(g[1]-g[0]||1)*1.2,hi=Math.max(cur,g[1])+(g[1]-g[0]||1)*0.8;
  function P(v){return Math.max(0,Math.min(100,(v-lo)/(hi-lo)*100));}
  function F(v){return kgUnit?bw(v):fmt1.format(v);}
  var inG=cur>=g[0]&&cur<=g[1];
  return '<div class="tbar"><div class="tbh"><span>'+lbl+'</span><b>'+F(cur)+' '+unit+'</b><span class="muted">meta '+F(g[0])+'–'+F(g[1])+'</span></div>'+
   '<div class="tbt"><i class="tg" style="left:'+P(g[0])+'%;width:'+(P(g[1])-P(g[0]))+'%"></i><i class="tf" style="left:'+Math.min(P(from),P(cur))+'%;width:'+Math.abs(P(cur)-P(from))+'%"></i><i class="t0" style="left:'+P(from)+'%" title="julio"></i><i class="tc'+(inG?' in':'')+'" style="left:'+P(cur)+'%"></i></div></div>';}
function renderTanita(){
  var L=tanList(),i=tanSel==null?L.length-1:Math.max(0,Math.min(L.length-1,tanSel)),c=L[i],p=i>0?L[i-1]:null,b=L[0],dd=fromIso(c.d),dl=ddiff(TANITA,TODAY);
  var h='<div class="sec-h"><h3 style="font-size:1.05rem">Composición corporal</h3><span class="r eyebrow">Tanita · '+dd.getDate()+' '+MES3[dd.getMonth()]+' '+dd.getFullYear()+'</span></div>';
  if(L.length>1)h+='<div class="seg tsel" role="group" aria-label="Medición">'+L.map(function(x,j){var q=fromIso(x.d);return '<button type="button" data-tsel="'+j+'" aria-pressed="'+(j===i)+'"'+(x.h||x.cond||x.nota?' class="hasn" title="Tiene nota"':'')+'>'+q.getDate()+' '+MES3[q.getMonth()]+(q.getFullYear()!==TODAY.getFullYear()?' '+String(q.getFullYear()).slice(2):'')+'</button>';}).join("")+'</div>';
  if(tanNote&&!tanForm)h+='<form class="tform" id="tnf">'+tanNoteFields(c)+'<div class="wide" style="display:flex;gap:8px"><button class="btn pri" type="submit">Guardar nota</button><button class="btn ghost" type="button" data-tnote="0">Cancelar</button></div></form>';
  else h+=tanNoteView(c);
  var mmLow=c.mm!=null&&c.mm<56.7;
  var T=[
   ["Peso",c.kg!=null?tanW(c.kg):"—","",tanDelta(c,p,"kg",1,true)],
   ["Grasa corporal",c.gp!=null?fmt1.format(c.gp)+' <small>%</small>':"—",c.gk!=null?tanW(c.gk).replace(/<\/?small>/g,"")+" de grasa":"",tanDelta(c,p,"gp",-1)],
   ["Masa muscular",c.mm!=null?tanW(c.mm):"—",'<span class="'+(mmLow?"lo":"okk")+'">'+(mmLow?"baja":"en rango")+'</span> · deseable '+bw(56.7)+'–'+bw(71.9),tanDelta(c,p,"mm",1,true)],
   ["Masa magra",c.mg!=null?tanW(c.mg):"—","todo lo que no es grasa",tanDelta(c,p,"mg",1,true)],
   ["Grasa visceral",c.vis!=null?fmt1.format(c.vis):"—",c.vis!=null?'<span class="'+(c.vis<=12?"okk":"lo")+'">'+(c.vis<=12?"saludable":"alta")+'</span> · sano de 1 a 12':"",tanDelta(c,p,"vis",-1)],
   ["Metabolismo basal",c.bmr!=null?fmtI.format(c.bmr)+' <small>kcal</small>':"—","lo que gastas en reposo",tanDelta(c,p,"bmr",1)],
   ["Agua corporal",c.tbw!=null?fmt1.format(c.tbw)+' <small>%</small>':"—","",tanDelta(c,p,"tbw",0)],
   ["Agua extracelular",c.ecw!=null?fmt1.format(c.ecw)+' <small>%</small>':"—","del agua total (ECW/TBW)",tanDelta(c,p,"ecw",0)],
   ["Masa ósea",c.os!=null?tanW(c.os):"—","",tanDelta(c,p,"os",0,true)]];
  T=T.filter(function(t){return t[1]!=="—";});
  h+='<div class="tgrid">'+T.map(function(t){return '<div class="tcell"><span class="tl">'+t[0]+'</span><b>'+t[1]+'</b>'+(t[3]||"")+(t[2]?'<span class="ts">'+t[2]+'</span>':'')+'</div>';}).join("")+'</div>';
  if(c.cx)h+='<p class="small muted"><b style="color:var(--ink)">Complexión: '+esc(c.cx)+'.</b> '+(/oculta/i.test(c.cx)?'Quiere decir poco músculo para tu peso, no que tengas obesidad. Se corrige subiendo músculo, que es justo lo que hace este plan.':'')+'</p>';
  if(c.seg){h+='<div class="tseg"><span class="tl">Músculo por segmento <small>(0 = promedio)</small></span><div>'+["bd","tr","bi","pd","pi"].map(function(k){var v=c.seg[k];return '<div class="sg '+(v==null?"":v<0?"neg":v>0?"pos":"zer")+'"><b>'+(v==null?"—":(v>0?"+":v<0?"−":"")+Math.abs(v))+'</b><span>'+SEGN[k]+'</span></div>';}).join("")+'</div></div>';}
  h+='<div class="tgo"><span class="tl">Hacia la meta de 6 meses <small>(punto gris = julio)</small></span>'+
    (c.kg!=null?tanBar("Peso",b.kg,c.kg,TGOAL.kg,true,bwU()):"")+(c.mm!=null?tanBar("Masa muscular",b.mm,c.mm,TGOAL.mm,true,bwU()):"")+(c.gp!=null?tanBar("Grasa",b.gp,c.gp,TGOAL.gp,false,"%"):"")+'</div>';
  h+='<div class="cd-bar tcd"><b class="disp" style="font-size:2.2rem;color:var(--food)">'+Math.max(0,dl)+'</b><p class="small muted">días para la próxima Tanita ('+TANITA.getDate()+' '+MES3[TANITA.getMonth()]+' '+TANITA.getFullYear()+'). Ve en ayunas, sin entrenar antes y a la misma hora que la anterior para poder compararlas.</p></div>';
  if(!tanForm)h+='<div style="display:flex;gap:8px;flex-wrap:wrap">'+(PWA?(gemKey()?'<label class="btn pri sm">Escanear hoja con IA<input type="file" class="fpick" accept="image/*,application/pdf" data-tscan></label>':'<button type="button" class="btn pri sm" data-tadd="1">Escanear hoja con IA</button>'):'')+'<button type="button" class="btn ghost sm" data-tadd="1">Agregar medición nueva</button>'+(tanNote?'':'<button type="button" class="btn ghost sm" data-tnote="1">'+(c.h||c.cond||c.nota?'Editar nota':'Agregar nota')+'</button>')+(c.d!==TAN0.d?'<button type="button" class="btn ghost sm" data-tdel="'+c.d+'">Borrar esta medición</button>':'')+'</div>';
  else{var u=bwU();function F(id,l,un,st,ph){return '<label><span>'+l+'</span><input type="number" inputmode="decimal" step="'+st+'" id="'+id+'" placeholder="'+ph+'"><em>'+un+'</em></label>';}
    h+='<form class="tform" id="tf">'+(PWA?'<div class="wide tai" id="t_ai">'+tanAiBox()+'</div>':'')+'<label class="wide"><span>Fecha</span><input type="date" id="t_d" value="'+iso(TODAY)+'" max="'+iso(TODAY)+'"></label>'+
     F("t_kg","Peso",u,"0.1",bw(c.kg))+F("t_gp","Grasa","%","0.1",c.gp)+F("t_gk","Masa grasa",u,"0.1",bw(c.gk))+F("t_mm","Masa muscular",u,"0.1",bw(c.mm))+F("t_mg","Masa magra",u,"0.1",bw(c.mg))+F("t_vis","Grasa visceral","nivel","1",c.vis)+F("t_bmr","Metabolismo basal","kcal","1",c.bmr)+F("t_tbw","Agua total","%","0.1",c.tbw)+F("t_ecw","ECW/TBW","%","0.1",c.ecw)+F("t_os","Masa ósea",u,"0.1",bw(c.os))+
     '<fieldset class="wide"><legend>Músculo por segmento (opcional)</legend>'+["bd","tr","bi","pd","pi"].map(function(k){return '<label><span>'+SEGN[k]+'</span><select id="t_s_'+k+'"><option value="">—</option>'+[-4,-3,-2,-1,0,1,2,3,4].map(function(v){return '<option value="'+v+'">'+(v>0?"+":"")+v+'</option>';}).join("")+'</select></label>';}).join("")+'</fieldset>'+
     '<label class="wide"><span>Complexión que marca</span><input type="text" id="t_cx" maxlength="40" placeholder="'+esc(c.cx||"")+'"></label>'+tanNoteFields(null)+
     '<div class="wide" style="display:flex;gap:8px"><button class="btn pri" type="submit">Guardar medición</button><button class="btn ghost" type="button" data-tadd="0">Cancelar</button></div><p class="small muted wide">Llena lo que traiga tu hoja. Lo que dejes vacío no se guarda.</p></form>';}
  $("pgtan").innerHTML=h;
}
$("pgtan").addEventListener("click",function(e){
  var s=e.target.closest("[data-tsel]");if(s){tanSel=+s.dataset.tsel;tanNote=false;renderTanita();return;}
  var tc=e.target.closest("[data-tcond]");if(tc){var on=tc.getAttribute("aria-pressed")!=="true";tc.setAttribute("aria-pressed",on);
    if(on&&(tc.dataset.tcond==="ayu"||tc.dataset.tcond==="comi")){var o=$("pgtan").querySelector('[data-tcond="'+(tc.dataset.tcond==="ayu"?"comi":"ayu")+'"]');if(o)o.setAttribute("aria-pressed","false");}return;}
  var tn=e.target.closest("[data-tnote]");if(tn){tanNote=tn.dataset.tnote==="1";if(tanNote)tanForm=false;renderTanita();if(tanNote){var f=$("t_h");if(f)f.focus();}return;}
  var a=e.target.closest("[data-tadd]");if(a){tanForm=a.dataset.tadd==="1";tanNote=false;if(!GEM.busy)GEM.msg="";renderTanita();if(tanForm){var el=$("t_kg");if(el)el.focus();}return;}
  var d=e.target.closest("[data-tdel]");if(d){if(d.dataset.arm!=="1"){d.dataset.arm="1";d.textContent="¿Seguro? Toca otra vez";setTimeout(function(){if(d.isConnected){d.dataset.arm="";d.textContent="Borrar esta medición";}},3500);return;}tanSave(d.dataset.tdel,{del:1});tanSel=null;renderTanita();toast("Medición borrada");}
});
$("pgtan").addEventListener("submit",function(e){
  if(e.target.id==="tnf"){e.preventDefault();var L=tanList(),i=tanSel==null?L.length-1:Math.max(0,Math.min(L.length-1,tanSel)),c=JSON.parse(JSON.stringify(L[i])),d=c.d;delete c.d;delete c._t;
    tanNoteRead(c);tanSave(d,c);tanNote=false;renderTanita();toast("Nota guardada");return;}
  if(e.target.id!=="tf")return;e.preventDefault();
  var dt=$("t_d").value;if(!dt||dt>iso(TODAY)){toast("Pon una fecha válida");return;}
  function n(id){var v=$(id).value;if(v===""||v==null)return null;v=parseFloat(String(v).replace(",","."));return isFinite(v)?v:null;}
  var x={},kgF={kg:1,gk:1,mm:1,mg:1,os:1},cnt=0;
  ["kg","gp","gk","mm","mg","vis","bmr","tbw","ecw","os"].forEach(function(k){var v=n("t_"+k);if(v==null)return;if(kgF[k])v=Math.round(fromU(v)*100)/100;x[k]=v;cnt++;});
  if(x.kg!=null&&!(x.kg>=40&&x.kg<=200)){toast("Revisa el peso");return;}
  if(x.gp!=null&&!(x.gp>2&&x.gp<60)){toast("Revisa el % de grasa");return;}
  var seg={},sc=0;Object.keys(SEGN).forEach(function(k){var v=$("t_s_"+k).value;if(v!==""){seg[k]=+v;sc++;}});if(sc)x.seg=seg;
  var cx=$("t_cx").value.trim();if(cx)x.cx=cx;
  tanNoteRead(x);
  if(!cnt){toast("Llena al menos un valor");return;}
  if(x.kg!=null){var W=JSON.parse(JSON.stringify(getDoc("weights",{e:[]})));if(!W.e.some(function(r){return r[0]===dt;})){W.e.push([dt,x.kg]);W.e.sort(function(a,b){return a[0]<b[0]?-1:1;});sput("weights",W);}}
  tanSave(dt,x);tanForm=false;tanSel=null;GEM.msg="";renderProgreso();toast("Medición guardada");
});
/* ===== leer la hoja de la Tanita con IA (Gemini): la clave es de Marcos y vive solo en este equipo (pvmgem:key);
   la foto o el PDF van directo a Google y nada se guarda hasta que él revisa los números y toca "Guardar medición" ===== */
var GEM={busy:false,msg:"",ok:false};
var GEM_MODELS=["gemini-3.8-flash","gemini-3.5-flash","gemini-flash-latest"];
var GEM_PROMPT="Eres un lector de reportes de composición corporal Tanita (por ejemplo MC-980, MC-780, BC-418). Lee el documento y devuelve SOLO un objeto JSON con estas claves. Usa null cuando el dato no aparezca; no inventes ni estimes nada. Números con punto decimal, sin unidades.\n"+
 "fecha: fecha de la medición en formato AAAA-MM-DD (o null)\n"+
 "u: unidad en que vienen las masas en la hoja, \"kg\" o \"lb\"\n"+
 "kg: peso corporal\ngp: grasa corporal en %\ngk: masa grasa\nmm: masa muscular (muscle mass)\nmg: masa libre de grasa (FFM, fat free mass)\n"+
 "vis: nivel de grasa visceral\nbmr: metabolismo basal en kcal\ntbw: agua corporal total en % del peso\ntbw_kg: agua corporal total en masa\n"+
 "ecw: agua extracelular como % del agua total (ECW/TBW)\nos: masa ósea\ncx: tipo de complexión física tal como aparece (texto corto, en español si se puede)\n"+
 "seg: objeto con la puntuación muscular por segmento (entero de -4 a 4, la gráfica de puntuación o calificación muscular segmental, no la masa en kg), con claves bd (brazo derecho), bi (brazo izquierdo), tr (tronco), pd (pierna derecha), pi (pierna izquierda); null si no aparece.\n"+
 "hora: hora de la medición en formato 24 h HH:MM, si la hoja la trae (o null)\n"+
 "Si la hoja trae varias mediciones, usa la más reciente.";
function gemKey(){try{return localStorage.getItem("pvmgem:key")||"";}catch(e){return "";}}
function gemSetKey(v){try{if(v)localStorage.setItem("pvmgem:key",v);else localStorage.removeItem("pvmgem:key");}catch(e){}}
function gemKeyCard(inForm){
  return '<div class="ghs gfirst"><p class="small muted">'+(inForm?'Para que la IA lea tu hoja necesita una clave gratis de Google Gemini. Se pega una sola vez en cada equipo:':'Con una clave gratis de Google Gemini, la app lee la foto o el PDF de tu Tanita y llena la medición sola. Se pega una sola vez en cada equipo:')+'</p>'+
    '<ol class="small"><li>Abre <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Google AI Studio</a> con tu cuenta de Google y acepta los términos.</li><li>Toca <b>Create API key</b> (crear clave). Si te pide proyecto, deja el que te propone.</li><li>Copia la clave (empieza con <b>AQ.</b> o <b>AIza</b>) y pégala aquí. No pide tarjeta.</li></ol>'+
    '<div class="ghf"><input id="gemkey" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="AQ.… o AIza…" aria-label="Clave de Gemini"><button class="btn pri" type="button" data-gem="save">Guardar clave</button></div>'+
    '<p class="small muted">La clave se queda solo en este equipo. La hoja viaja directo a Google para leerla; en el plan gratis Google puede usar lo que le mandas para mejorar sus modelos.</p></div>';
}
function tanAiBox(){
  if(!gemKey())return gemKeyCard(true);
  if(GEM.busy)return '<p class="small tai-st"><i class="tai-dot"></i>Leyendo tu hoja con Gemini…</p>';
  return (GEM.msg?'<p class="'+(GEM.ok?'note info':'note')+'">'+GEM.msg+'</p>':'<p class="small muted">Sube la foto o el PDF de tu hoja y la IA llena los campos. Tú revisas y guardas.</p>')+
    '<div class="gbtns"><label class="btn ghost sm">'+(GEM.msg?'Escanear otra hoja':'Escanear hoja con IA')+'<input type="file" class="fpick" accept="image/*,application/pdf" data-tscan></label></div>';
}
function tanAiPaint(){var b=$("t_ai");if(b)b.innerHTML=tanAiBox();}
function b64OfBlob(f){return new Promise(function(ok,no){var r=new FileReader();r.onload=function(){var s=String(r.result||"");ok(s.slice(s.indexOf(",")+1));};r.onerror=function(){no(r.error);};r.readAsDataURL(f);});}
/* las fotos se achican a 2000 px (más rápido y gasta menos cupo); un PDF o una foto que el navegador no abre van tal cual */
function gemPart(f){
  var mt=(f.type||"").toLowerCase();
  if(mt==="application/pdf"||/\.pdf$/i.test(f.name||""))return b64OfBlob(f).then(function(d){return {mime_type:"application/pdf",data:d};});
  return new Promise(function(ok){
    var u=URL.createObjectURL(f),im=new Image();
    im.onload=function(){try{var M=2000,k=Math.min(1,M/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement("canvas");c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);
      var g=c.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,c.width,c.height);g.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);var s=c.toDataURL("image/jpeg",0.9);ok({mime_type:"image/jpeg",data:s.slice(s.indexOf(",")+1)});}
      catch(e){URL.revokeObjectURL(u);ok(null);}};
    im.onerror=function(){URL.revokeObjectURL(u);ok(null);};
    im.src=u;
  }).then(function(p){return p||b64OfBlob(f).then(function(d){return {mime_type:mt||"image/jpeg",data:d};});});
}
function gemErr(m){var e=new Error(m);e.user=1;return e;}
function gemAsk(key,part){
  var body=JSON.stringify({contents:[{role:"user",parts:[{text:GEM_PROMPT},{inline_data:part}]}],generationConfig:{temperature:0,responseMimeType:"application/json"}});
  var i=0;
  function go(){
    var m=GEM_MODELS[i];
    /* si un modelo no contesta en 60 s se prueba el siguiente */
    var ac=typeof AbortController!=="undefined"?new AbortController():null,tmo=ac?setTimeout(function(){ac.abort();},60000):0;
    return fetch("https://generativelanguage.googleapis.com/v1beta/models/"+m+":generateContent",{method:"POST",headers:{"content-type":"application/json","x-goog-api-key":key},body:body,referrerPolicy:"no-referrer",credentials:"omit",signal:ac?ac.signal:undefined})
    .then(function(r){clearTimeout(tmo);return r.json().catch(function(){return {};}).then(function(j){
      if(r.ok)return j;
      var st=(j&&j.error&&j.error.status)||"",msg=String((j&&j.error&&j.error.message)||"");
      if((r.status===404||r.status>=500)&&i<GEM_MODELS.length-1){i++;return go();}
      if(/API_KEY|API key/i.test(msg)||r.status===401||r.status===403)throw gemErr("Google no aceptó la clave. Revisa que la copiaste completa o crea otra en AI Studio.");
      if(r.status===429||st==="RESOURCE_EXHAUSTED")throw gemErr("Se acabó el cupo gratis por ahora. Espera un minuto y vuelve a intentar.");
      if(r.status===400)throw gemErr("Gemini no pudo abrir ese archivo. Prueba con una foto (JPG o PNG) o el PDF original.");
      throw gemErr(r.status>=500?"Gemini está saturado en este momento. Intenta de nuevo en unos minutos.":"Gemini no respondió bien ("+r.status+"). Intenta de nuevo en un rato.");
    });},function(e){clearTimeout(tmo);if(e&&e.name==="AbortError"){if(i<GEM_MODELS.length-1){i++;return go();}throw gemErr("Gemini tardó demasiado en contestar. Intenta de nuevo en un rato.");}throw gemErr("No hay conexión con Gemini. Revisa tu internet.");});
  }
  return go().then(function(j){
    var c=j&&j.candidates&&j.candidates[0],t=c&&c.content&&c.content.parts?c.content.parts.map(function(p){return p.text||"";}).join(""):"";
    t=t.replace(/^\s*```(?:json)?/i,"").replace(/```\s*$/,"").trim();
    try{return JSON.parse(t);}catch(e){throw gemErr("La IA no pudo leer la hoja. Prueba con una foto más nítida y derecha.");}
  });
}
/* todo lo que contesta la IA se revisa: solo números en rangos posibles, masas pasadas a kg, segmentos enteros de −4 a 4 */
function gemClean(o){
  if(!o||typeof o!=="object"||Array.isArray(o))return null;
  function N(v,lo,hi){v=typeof v==="string"?parseFloat(v.replace(",",".")):v;return typeof v==="number"&&isFinite(v)&&v>=lo&&v<=hi?v:null;}
  var lb=String(o.u||"").toLowerCase()==="lb",K=function(v){return v==null?null:Math.round((lb?v/LB:v)*100)/100;};
  var x={kg:K(N(o.kg,30,550)),gp:N(o.gp,2,70),gk:K(N(o.gk,0,300)),mm:K(N(o.mm,10,330)),mg:K(N(o.mg,20,440)),vis:N(o.vis,1,60),bmr:N(o.bmr,600,5000),tbw:N(o.tbw,20,80),ecw:N(o.ecw,20,60),os:K(N(o.os,0.5,20))};
  if(x.kg!=null&&!(x.kg>=40&&x.kg<=200))x.kg=null;
  if(x.tbw==null){var tk=K(N(o.tbw_kg,10,330));if(tk!=null&&x.kg)x.tbw=Math.round(tk/x.kg*1000)/10;if(x.tbw!=null&&!(x.tbw>=20&&x.tbw<=80))x.tbw=null;}
  if(x.vis!=null)x.vis=Math.round(x.vis*2)/2;if(x.bmr!=null)x.bmr=Math.round(x.bmr);
  var seg={};if(o.seg&&typeof o.seg==="object")Object.keys(SEGN).forEach(function(k){var v=N(o.seg[k],-4,4);if(v!=null)seg[k]=Math.round(v);});x.seg=seg;
  x.cx=typeof o.cx==="string"?o.cx.replace(/[\u0000-\u001f<>]/g,"").trim().slice(0,40):"";
  x.h=typeof o.hora==="string"&&/^([01]\d|2[0-3]):[0-5]\d$/.test(o.hora)?o.hora:null;
  x.d=typeof o.fecha==="string"&&/^\d{4}-\d\d-\d\d$/.test(o.fecha)&&!isNaN(fromIso(o.fecha))&&o.fecha<=iso(TODAY)&&o.fecha>="2020-01-01"?o.fecha:null;
  return x;
}
function tanAiFill(x){
  var n=0,kgF={kg:1,gk:1,mm:1,mg:1,os:1};
  document.querySelectorAll("#tf .ai").forEach(function(el){el.classList.remove("ai");});
  function put(id,v){var el=$(id);if(!el||v==null||v==="")return;el.value=v;el.classList.add("ai");n++;}
  ["kg","gp","gk","mm","mg","vis","bmr","tbw","ecw","os"].forEach(function(k){var v=x[k];if(v==null)return;put("t_"+k,kgF[k]?Math.round(toU(v)*10)/10:v);});
  Object.keys(x.seg||{}).forEach(function(k){put("t_s_"+k,String(x.seg[k]));});
  if(x.cx)put("t_cx",x.cx);
  if(x.h)put("t_h",x.h);
  if(x.d){var dEl=$("t_d");if(dEl){dEl.value=x.d;dEl.classList.add("ai");}}
  return n;
}
function tanScan(f){
  if(!f)return;
  if(f.size>15*1024*1024){toast("El archivo pesa demasiado (máx. 15 MB)");return;}
  var key=gemKey();if(!key){tanForm=true;renderTanita();return;}
  if(GEM.busy)return;
  GEM.busy=true;GEM.msg="";GEM.ok=false;
  if(!tanForm||!$("tf")){tanForm=true;renderTanita();}else tanAiPaint();
  gemPart(f).then(function(p){return gemAsk(key,p);}).then(function(o){
    var x=gemClean(o);GEM.busy=false;
    var n=x&&$("tf")?tanAiFill(x):0;
    if(!n){GEM.ok=false;GEM.msg="No encontré datos de Tanita en ese archivo. Prueba con una foto más nítida de la hoja completa.";}
    else{GEM.ok=true;GEM.msg="Listo: llené "+n+" campos (marcados en azul)."+(x.d?"":" No vi la fecha, revisa que sea la correcta.")+" <b>Revisa cada número contra tu hoja</b> antes de tocar Guardar; la IA puede equivocarse.";}
    tanAiPaint();
  }).catch(function(e){GEM.busy=false;GEM.ok=false;GEM.msg=e&&e.user?e.message:"No se pudo leer el archivo. Intenta de nuevo.";tanAiPaint();});
}
$("pgtan").addEventListener("change",function(e){var t=e.target;if(!t.matches||!t.matches("[data-tscan]"))return;var f=t.files&&t.files[0];t.value="";tanScan(f);});
/* la caja de la clave va dentro del formulario de la medición, por eso no es un <form> propio: se guarda con el botón o con Enter */
function gemSaveKey(){var v=($("gemkey").value||"").trim();
  if(!/^[A-Za-z0-9_.\-]{30,120}$/.test(v)){toast("Esa clave no se ve completa");return;}
  gemSetKey(v);GEM.msg="";toast("Clave de Gemini guardada");
  if(view==="ajustes")renderAjustes();else if($("tf"))tanAiPaint();else renderTanita();}
document.addEventListener("keydown",function(e){if(e.key==="Enter"&&e.target&&e.target.id==="gemkey"){e.preventDefault();gemSaveKey();}});
document.addEventListener("click",function(e){var b=e.target.closest("[data-gem]");if(!b)return;
  if(b.dataset.gem==="save"){gemSaveKey();return;}
  if(b.dataset.gem==="off"){if(b.dataset.arm!=="1"){b.dataset.arm="1";b.textContent="¿Seguro? Toca otra vez";return;}gemSetKey("");toast("Clave borrada de este equipo");renderAjustes();}});
/* ===== estadística por ejercicio: se arma con las series guardadas en cada día ===== */
var HIST={loaded:false,loading:false},exMet="top",exStat=null;
try{exStat=localStorage.getItem("pvm:exstat");exMet=localStorage.getItem("pvm:exmet")||"top";}catch(e){}
var MET={top:["Peso","lb"],e1:["1RM est.","lb"],vol:["Volumen","lb"],reps:["Reps","reps"]};
function loadHistory(){
  if(HIST.loaded||HIST.loading)return;
  if(!S.col)return;
  HIST.loading=true;
  var qq;try{qq=S.col.where("day",">=","2020-01-01").orderBy("day","desc").limit(1000).get();}catch(e){qq=Promise.reject(e);}
  qq.then(function(q){
    q.docs.forEach(function(sn){var k=sn.id,rem=sn.data();if(!rem||S.dirty[k]||S.busy[k])return;var loc=S.cache[k];if(!loc||(rem._t||0)>(loc._t||0))S.cache[k]=JSON.parse(JSON.stringify(rem));});
    HIST.loaded=true;HIST.loading=false;if(view==="progreso"){renderDias();renderExStats();}
  },function(){HIST.loaded=true;HIST.loading=false;if(view==="progreso")renderExStats();});
}
function collectDays(){
  try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf("pvm:d-")===0){var kk=k.slice(4);if(!(kk in S.cache))S.cache[kk]=lsGet(kk);}}}catch(e){}
  var out={};Object.keys(S.cache).forEach(function(k){var v=S.cache[k];if(k.indexOf("d-")===0&&v&&v.s)out[k.slice(2)]=v;});return out;
}
function exHistory(id,days){
  var H=[];Object.keys(days).sort().forEach(function(dt){
    var rows=days[dt].s[id];if(!rows)return;
    var sets=rows.filter(function(r){return r&&r[2];}).map(function(r){return [+r[0]||0,+r[1]||0];}).filter(function(x){return x[1]>0;});if(!sets.length)return;
    var top=sets.reduce(function(a,b){return (b[0]>a[0]||(b[0]===a[0]&&b[1]>a[1]))?b:a;});
    var e1=0;sets.forEach(function(x){if(x[0]>0&&x[1]>0)e1=Math.max(e1,e1rm(x[0],x[1]));});
    H.push({d:dt,sets:sets,top:top,e1:Math.round(e1*10)/10,vol:sets.reduce(function(a,x){return a+x[0]*x[1];},0),reps:sets.reduce(function(a,x){return a+x[1];},0)});
  });
  return H;
}
function allEx(G){var out=[],seen={};G=G||GD;applyAlt();GK.forEach(function(k){G[k].ex.forEach(function(e){var b=e._base||e;[e,b,b.alt].forEach(function(x){if(!x)return;var id=exId(x);if(seen[id])return;seen[id]=1;out.push({id:id,n:x.n,k:k});});});});return out;}
function metVal(h,m){return m==="top"?h.top[0]:m==="e1"?h.e1:m==="vol"?h.vol:h.reps;}
function fmtD(dt){var d=fromIso(dt);return d.getDate()+" "+MES3[d.getMonth()];}
function goStats(id){exStat=id;try{localStorage.setItem("pvm:exstat",id);}catch(e){}setPgSeg("ej");show("progreso");var c=$("pgex");if(c)c.scrollIntoView({block:"start"});}
/* ===== días cumplidos por semana, mes y año ===== */
var diasSeg="sem";try{diasSeg=localStorage.getItem("pvm:diasseg")||"sem";}catch(e){}
var MESL=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
function gymOk(d){var tot=planTotal(d);return tot>0&&doneSets(d)*2>=tot;}
function dietOk(d){return mealsDone(d).n>=4;}
function dayStat(d){var k=KEYS[d.getDay()],gd=ddiff(d,TODAY)>0?!!planKey(d)||modeOf(d)==="sup"&&false:planTotal(d)>0||(modeOf(d)!=="sup"&&!!planKey(d)),isT=sameDay(d,TODAY),fut=ddiff(d,TODAY)>0,pre=ddiff(d,START)<0;
  var go=!fut&&!pre&&gd&&gymOk(d),fo=!fut&&!pre&&dietOk(d);return {gd:gd,go:go,fo:fo,both:fo&&(gd&&d.getDay()!==0?go:true),fut:fut,pre:pre,isT:isT,cl:!pre&&gymClosed(d)};}
function dcell(d,num){
  var st=dayStat(d);if(st.pre)return '<i class="dc pre" aria-hidden="true"></i>';
  var kind=st.fut?"fut":st.both?"both":st.go?"gym":st.fo?"diet":"none";
  var cls="dc "+kind+(st.isT?" tod":"")+(st.gd?"":" rest"),lbl=DAYS[d.getDay()].n+" "+d.getDate()+" "+MES3[d.getMonth()]+": ";
  lbl+=st.fut?"todavía no llega":st.both?(st.gd&&st.go?"gym y dieta cumplidos":(st.cl?"dieta cumplida, gimnasio cerrado":"dieta cumplida, día de descanso")):(st.gd?(st.go?"gym cumplido":"sin gym")+", ":(st.cl?"gimnasio cerrado, ":"descanso, "))+(st.fo?"dieta cumplida":"sin dieta");
  var inner=num?'<span>'+d.getDate()+'</span>'+(st.both||st.fut?'':'<u><b class="g'+(st.go?' on':'')+'"></b><b class="f'+(st.fo?' on':'')+'"></b></u>'):'';
  return '<i class="'+cls+'" data-d="'+iso(d)+'" tabindex="'+(st.fut?'-1':'0')+'" role="img" aria-label="'+lbl+'">'+inner+'</i>';
}
function dcount(from,to){var c={g:0,gp:0,f:0,fp:0,b:0,bp:0};for(var d=from;ddiff(d,to)<=0;d=addD(d,1)){var st=dayStat(d);if(st.pre||st.fut)continue;var cnt=!st.isT;if(st.gd&&(cnt||st.go))c.gp++;if(st.go)c.g++;if(cnt||st.fo)c.fp++;if(st.fo)c.f++;if(cnt||st.both)c.bp++;if(st.both)c.b++;}return c;}
function pct(a,b){return b?Math.round(a/b*100):0;}
function dsum(c){return '<div class="dsum"><div><span>Gym</span><i><b class="g" style="width:'+pct(c.g,c.gp)+'%"></b></i><em>'+c.g+'/'+c.gp+'</em></div><div><span>Dieta</span><i><b class="f" style="width:'+pct(c.f,c.fp)+'%"></b></i><em>'+c.f+'/'+c.fp+'</em></div></div>';}
function dstreaks(){var cur=0,best=0,run=0,started=false;
  for(var d=day0(TODAY);ddiff(d,START)>=0;d=addD(d,-1)){var st=dayStat(d);if(st.isT&&!st.both)continue;if(st.both){if(!started)cur++;}else started=true;}
  for(var d2=day0(START);ddiff(d2,TODAY)<=0;d2=addD(d2,1)){var s2=dayStat(d2);if(s2.both){run++;if(run>best)best=run;}else if(!s2.isT)run=0;}
  return {cur:cur,best:best};}
/* burbuja con lo que se hizo ese día */
function dtipHTML(d){
  var st=dayStat(d),k=planKey(d)||KEYS[d.getDay()],dd=dayDoc(d),g=GDat(d)[k],tot=planTotal(d),ds=doneSets(d),m=mealsDone(d);
  var h='<b class="tt">'+DAYS[d.getDay()].n+' '+d.getDate()+' '+MES3[d.getMonth()]+'</b>';
  if(st.fut)return h+'<p>Todavía no llega.</p>';
  if(g&&tot){h+='<p class="tg'+(st.go?' ok':'')+'"><i></i>'+g.t+' · '+ds+'/'+tot+' series'+(dd.ss&&dd.se?' · '+dur((dd.se-dd.ss)/60000):'')+'</p>';
    var names={};allEx(GDat(d)).forEach(function(x){names[x.id]=x.n;});
    var done=Object.keys(dd.s).filter(function(id){return (dd.s[id]||[]).some(rowDone);}).map(function(id){
      var rows=dd.s[id].filter(rowDone),top=rows.reduce(function(a,r){return (+r[0]||0)>(+a[0]||0)?r:a;},rows[0]);
      return '<li>'+esc((names[id]||id).split(/ \(|,/)[0])+'<span>'+rows.length+'×'+(+top[0]>0?' · '+kgs(+top[0])+' lb':'')+'</span></li>';});
    h+=done.length?'<ul>'+done.join("")+'</ul>':'<p class="mu">No marcaste series.</p>';}
  else h+='<p class="tg rest"><i></i>'+(gymClosed(d)?'Gimnasio cerrado':'Descanso')+'</p>';
  h+='<p class="tf'+(st.fo?' ok':'')+'"><i></i>Comidas '+m.n+'/5'+(dd.m&&dd.m.cre?' · creatina':'')+(cafN(dd)?' · '+cafN(dd)+' café'+(cafN(dd)>1?'s':''):'')+(dd.med?' · medicamento':'')+'</p>';
  return h;
}
function dtipShow(el){var t=$("dtip");if(!t){t=document.createElement("div");t.id="dtip";t.setAttribute("role","tooltip");document.body.appendChild(t);}
  t.innerHTML=dtipHTML(fromIso(el.dataset.d));t.hidden=false;
  var r=el.getBoundingClientRect(),w=t.offsetWidth,hh=t.offsetHeight,x=Math.min(Math.max(8,r.left+r.width/2-w/2),innerWidth-w-8),y=r.top-hh-8;
  if(y<8)y=r.bottom+8;t.style.left=x+"px";t.style.top=y+"px";dtipEl=el;}
function dtipHide(){var t=$("dtip");if(t)t.hidden=true;dtipEl=null;}
var dtipEl=null;
function renderDias(){
  var box=$("pgdias");if(!box)return;collectDays();
  var h="",s0=day0(START),hd='<div class="dhead">'+["L","M","M","J","V","S","D"].map(function(x){return '<span>'+x+'</span>';}).join("")+'</div>';
  if(diasSeg==="sem"){
    for(var m=mondayOf(TODAY);ddiff(m,mondayOf(s0))>=0;m=addD(m,-7)){var e=addD(m,6),cur=sameDay(m,mondayOf(TODAY));
      var cells="";for(var i=0;i<7;i++)cells+=dcell(addD(m,i),true);
      h+='<div class="dblk'+(cur?' cur':'')+'"><div class="dbh"><b>'+m.getDate()+(m.getMonth()!==e.getMonth()?' '+MES3[m.getMonth()]:'')+'–'+e.getDate()+' '+MES3[e.getMonth()]+'</b>'+(cur?'<small>esta semana</small>':'')+'<strong>'+dcount(m,e).b+'<small> verdes</small></strong></div>'+dsum((function(c){if(modeOf(m)==="sup")c.gp=Math.max(2,c.g);return c;})(dcount(m,e)))+(modeOf(m)!=="full"?'<p class="dmode">Semana '+MODES[modeOf(m)].n.toLowerCase()+(modeOf(m)==="sup"?': meta de 2 sesiones':': 4 días')+'</p>':'')+hd+'<div class="dgrid big">'+cells+'</div></div>';}
  }else if(diasSeg==="mes"){
    for(var mo=new Date(TODAY.getFullYear(),TODAY.getMonth(),1);ddiff(mo,new Date(s0.getFullYear(),s0.getMonth(),1))>=0;mo=new Date(mo.getFullYear(),mo.getMonth()-1,1)){
      var last=new Date(mo.getFullYear(),mo.getMonth()+1,0),f0=ddiff(mo,mondayOf(s0))<0?mondayOf(s0):mo,pad0=(f0.getDay()+6)%7,cells="";
      for(var i=0;i<pad0;i++)cells+='<i class="dc pre" aria-hidden="true"></i>';
      for(var d=f0;ddiff(d,last)<=0;d=addD(d,1))cells+=dcell(d,true);
      h+='<div class="dblk"><div class="dbh"><b>'+MESL[mo.getMonth()]+' '+mo.getFullYear()+'</b><strong>'+dcount(mo,last).b+'<small> verdes</small></strong></div>'+dsum(dcount(mo,last))+''+hd+'<div class="dgrid">'+cells+'</div></div>';}
  }else{
    for(var y=TODAY.getFullYear();y>=s0.getFullYear();y--){var ms="";
      for(var mi=0;mi<12;mi++){var mo=new Date(y,mi,1),last=new Date(y,mi+1,0),pad0=(mo.getDay()+6)%7,cells="";
        for(var i=0;i<pad0;i++)cells+='<i class="dc pre" aria-hidden="true"></i>';
        for(var d=mo;ddiff(d,last)<=0;d=addD(d,1))cells+=ddiff(d,s0)<0?'<i class="dc old" aria-hidden="true"></i>':dcell(d,false);
        var c=dcount(mo,last),act=ddiff(last,s0)>=0&&ddiff(mo,TODAY)<=0;ms+='<div class="dmini'+(act?'':' off')+'"><span>'+MES3[mi]+(act?' <b>'+c.b+'</b>':'')+'</span><div class="dhead sm">'+["L","M","M","J","V","S","D"].map(function(x){return '<span>'+x+'</span>';}).join("")+'</div><div class="dgrid sm">'+cells+'</div></div>';}
      h+='<div class="dblk"><div class="dbh"><b>'+y+'</b><strong>'+dcount(new Date(y,0,1),new Date(y,11,31)).b+'<small> verdes</small></strong></div>'+dsum(dcount(new Date(y,0,1),new Date(y,11,31)))+'<div class="dyear">'+ms+'</div></div>';}
  }
  box.innerHTML='<div class="sec-h"><h3 style="font-size:1.05rem">Días cumplidos</h3><span class="r eyebrow">desde el 2 nov</span></div>'+
    '<div class="seg" role="group" aria-label="Agrupar días cumplidos"><button type="button" data-ds="sem" aria-pressed="'+(diasSeg==="sem")+'">Por semana</button><button type="button" data-ds="mes" aria-pressed="'+(diasSeg==="mes")+'">Por mes</button><button type="button" data-ds="ano" aria-pressed="'+(diasSeg==="ano")+'">Por año</button></div>'+
    (function(){var S2=dstreaks(),mc=dcount(new Date(TODAY.getFullYear(),TODAY.getMonth(),1),TODAY);return '<div class="dhero"><div class="fire"><b>'+S2.cur+'</b><span>'+(S2.cur===1?'día':'días')+' seguidos<br>en verde</span></div><div><b>'+S2.best+'</b><span>mejor racha</span></div><div><b>'+mc.b+'</b><span>verdes en '+MESL[TODAY.getMonth()].toLowerCase()+'</span></div></div>';})()+
    '<div class="dleg"><span><i class="kb"></i>Las dos</span><span><i class="kg"></i>Solo gym</span><span><i class="kf"></i>Solo dieta</span><span><i class="kn"></i>Ninguno</span></div>'+
    '<div class="dwrap">'+h+'</div>'+
    '<details class="pgmore"><summary>¿Cómo se cuenta?</summary><p class="small muted">Un día queda en verde cuando cumples gym y dieta (el domingo, solo dieta). El gym cuenta si marcaste al menos la mitad de las series y la dieta si marcaste 4 de las 5 comidas. Hoy se pinta en cuanto lo cumplas.</p></details>';
}
function renderExStats(){
  var box=$("pgex");if(!box)return;
  if(!HIST.loaded)loadHistory();
  var days=collectDays(),EX=allEx(),cnt={};
  var lastD={};
  EX.forEach(function(x){var hh=exHistory(x.id,days);cnt[x.id]=hh.length;lastD[x.id]=hh.length?hh[hh.length-1].d:"";});
  if(!exStat||!cnt.hasOwnProperty(exStat)){
    var bestD="";exStat=null;
    EX.forEach(function(x){if(lastD[x.id]>bestD||(lastD[x.id]&&lastD[x.id]===bestD&&cnt[x.id]>cnt[exStat])){bestD=lastD[x.id];exStat=x.id;}});
    if(!exStat)exStat=exId(GD[wsel].ex[0]);
  }
  var H=exHistory(exStat,days),cur=EX.filter(function(x){return x.id===exStat;})[0];
  var opts="";GK.forEach(function(k){var list=EX.filter(function(x){return x.k===k;});if(!list.length)return;opts+='<optgroup label="'+DAYS[KEYS.indexOf(k)].n+' · '+SHORT[k]+'">'+list.map(function(x){return '<option value="'+x.id+'"'+(x.id===exStat?' selected':'')+'>'+esc(x.n)+(cnt[x.id]?' ('+cnt[x.id]+')':'')+'</option>';}).join("")+'</optgroup>';});
  var h='<div class="sec-h"><h3 style="font-size:1.05rem">Por ejercicio</h3><span class="r eyebrow">'+(H.length?H.length+(H.length===1?' sesión':' sesiones'):'sin registros')+'</span></div>';
  h+='<label class="sel"><span class="sr">Ejercicio</span><select id="exsel">'+opts+'</select></label>';
  if(!H.length){
    h+='<p class="empty">'+(HIST.loading?'Cargando tu historial…':'Aún no hay series de este ejercicio. Cuando las marques en Entreno, aquí verás cómo suben el peso y las repeticiones.')+'</p>';
    box.innerHTML=h;return;
  }
  var best=H.reduce(function(a,b){return b.e1>a.e1?b:a;}),bestSet=best.sets.reduce(function(a,x){return e1rm(x[0],x[1])>e1rm(a[0],a[1])?x:a;});
  var first=H[0],last=H[H.length-1],chg=first.e1>0&&H.length>1?Math.round((last.e1-first.e1)/first.e1*100):null;
  h+='<div class="kpis"><div class="stat"><b>'+kgs(bestSet[0])+'×'+bestSet[1]+'</b><span>mejor serie (lb) · '+fmtD(best.d)+'</span></div><div class="stat'+(chg!=null&&chg>0?' ok':'')+'"><b>'+kgs(last.e1)+'</b><span>1RM est. (lb)'+(chg!=null?' · '+(chg>=0?'+':'')+chg+' % desde '+fmtD(first.d):'')+'</span></div><div class="stat"><b>'+fmt.format(Math.round(last.vol))+'</b><span>volumen última vez (lb)</span></div></div>';
  h+='<div class="seg met" role="group" aria-label="Qué graficar">'+Object.keys(MET).map(function(m){return '<button type="button" data-met="'+m+'" aria-pressed="'+(m===exMet)+'">'+MET[m][0]+'</button>';}).join("")+'</div>';
  h+='<div class="exchart" id="exchart">'+exChartSVG(H,exMet)+'<div class="tip" id="extip" hidden></div></div>';
  h+='<p class="small muted">'+(exMet==="top"?'Peso de tu serie más pesada de cada sesión; el número chico son sus repeticiones.':exMet==="e1"?'1RM estimado con la fórmula de Epley: peso × (1 + reps/30). Sirve para comparar sesiones con distintas reps.':exMet==="vol"?'Volumen: suma de peso × repeticiones de todas las series de la sesión.':'Repeticiones totales de la sesión, sumando todas las series.')+(H.length===1?' Desde tu segunda sesión verás la línea de progreso.':' Toca un punto para ver el detalle.')+'</p>';
  h+='<details class="hist"'+(H.length<=6?' open':'')+'><summary class="small" style="cursor:pointer;color:var(--muted)">Historial de sesiones ('+H.length+')</summary><ul class="rec">'+H.slice().reverse().map(function(x){var d=fromIso(x.d);return '<li><span>'+fmtD(x.d)+'<small>'+DAYS[d.getDay()].n+'</small></span><span>'+x.sets.map(function(s){return kgs(s[0])+'×'+s[1];}).join(" · ")+'<small>1RM '+kgs(x.e1)+' · vol '+fmt.format(Math.round(x.vol))+'</small></span></li>';}).join("")+'</ul></details>';
  box.innerHTML=h;
  box._H=H;
}
function niceStep(r,whole){var raw=r/4,p=Math.pow(10,Math.floor(Math.log10(raw||1))),c=whole?[1,2,5,10]:[1,2,2.5,5,10],st=10*p;for(var i=0;i<c.length;i++){if(c[i]*p>=raw){st=c[i]*p;break;}}return whole?Math.max(1,Math.round(st)):st;}
function exChartSVG(H,m){
  var Wd=Math.max(300,Math.min(720,Math.round(($("pgex").clientWidth||360)-34))),Hd=210,L=40,R=16,Tp=22,Bt=24;
  var vals=H.map(function(h){return metVal(h,m);}),mn=Math.min.apply(null,vals),mx=Math.max.apply(null,vals);
  /* rango mínimo para que una diferencia de 1 rep o 5 lb no parezca un salto enorme */
  var minSpan=m==="reps"?Math.max(4,mx*0.2):Math.max(10,mx*0.12);
  if(mx-mn<minSpan){var mid=(mx+mn)/2;mn=mid-minSpan/2;mx=mid+minSpan/2;if(mn<0){mx-=mn;mn=0;}}
  var step=niceStep(mx-mn,true),y0=Math.max(0,Math.floor((mn-step*0.5)/step)*step),y1=Math.ceil((mx+step*0.5)/step)*step;
  var t0=fromIso(H[0].d),t1=fromIso(H[H.length-1].d),span=Math.max(1,ddiff(t1,t0));
  function X(h){return H.length===1?(L+(Wd-L-R)/2):L+(Wd-L-R)*ddiff(fromIso(h.d),t0)/span;}
  function Y(v){return Tp+(Hd-Tp-Bt)*(1-(v-y0)/(y1-y0));}
  var s='<svg class="chart" viewBox="0 0 '+Wd+' '+Hd+'" role="img" aria-label="'+MET[m][0]+' por sesión: de '+fmt1.format(vals[0])+' a '+fmt1.format(vals[vals.length-1])+' '+MET[m][1]+'"><defs><linearGradient id="gx" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--gym)" stop-opacity=".22"/><stop offset="1" stop-color="var(--gym)" stop-opacity="0"/></linearGradient></defs><g class="grid">';
  for(var v=y0;v<=y1+1e-9;v+=step)s+='<line x1="'+L+'" x2="'+(Wd-R)+'" y1="'+Y(v).toFixed(1)+'" y2="'+Y(v).toFixed(1)+'"/>';
  s+='</g><g class="ax">';
  for(v=y0;v<=y1+1e-9;v+=step)s+='<text x="'+(L-6)+'" y="'+(Y(v)+3.5).toFixed(1)+'" text-anchor="end">'+fmt.format(Math.round(v*10)/10)+'</text>';
  s+='<text x="'+(L-6)+'" y="'+(Tp-9)+'" text-anchor="end">'+MET[m][1]+'</text>';
  var xt=H.length===1?[H[0]]:H.length===2?[H[0],H[1]]:[H[0],H[Math.floor((H.length-1)/2)],H[H.length-1]];
  xt.forEach(function(h,i){s+='<text x="'+X(h).toFixed(1)+'" y="'+(Hd-7)+'" text-anchor="'+(H.length>1&&i===0?'start':H.length>1&&i===xt.length-1?'end':'middle')+'">'+fmtD(h.d)+'</text>';});
  s+='</g>';
  var pts=H.map(function(h){return [X(h),Y(metVal(h,m))];});
  if(pts.length>1){s+='<path class="area" style="fill:url(#gx)" d="M'+pts.map(function(p){return p[0].toFixed(1)+","+p[1].toFixed(1);}).join(" L")+" L"+pts[pts.length-1][0].toFixed(1)+","+(Hd-Bt)+" L"+pts[0][0].toFixed(1)+","+(Hd-Bt)+'Z"/><path class="line" d="M'+pts.map(function(p){return p[0].toFixed(1)+","+p[1].toFixed(1);}).join(" L")+'"/>';}
  s+='<line class="cross" id="excross" x1="0" x2="0" y1="'+Tp+'" y2="'+(Hd-Bt)+'" style="display:none"/>';
  var bi=0;vals.forEach(function(v,i){if(v>vals[bi])bi=i;});
  pts.forEach(function(p,i){s+='<circle class="pt'+(i===pts.length-1?' last':'')+'" data-i="'+i+'" cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="4.5"/>';});
  function lab(i){var h=H[i],t=m==="top"?kgs(h.top[0])+'×'+h.top[1]:m==="reps"?h.reps+' reps':fmt.format(Math.round(metVal(h,m)))+' lb';var x=Math.min(Math.max(pts[i][0],L+24),Wd-R-24);return '<text class="lbl" x="'+x.toFixed(1)+'" y="'+(pts[i][1]-11).toFixed(1)+'" text-anchor="middle">'+t+'</text>';}
  s+=lab(pts.length-1);if(vals[bi]>vals[vals.length-1])s+=lab(bi);
  s+='<rect class="hit" x="'+L+'" y="0" width="'+(Wd-L-R)+'" height="'+Hd+'" fill="transparent"/>';
  return s+'</svg>';
}
function exTip(ev){
  var box=$("pgex"),wrap=$("exchart");if(!box||!wrap||!box._H)return;
  var svg=wrap.querySelector("svg"),r=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal,sc=r.width/vb.width,px=(ev.clientX-r.left)/sc;
  var cs=svg.querySelectorAll(".pt"),bi=0,bd=1e9;cs.forEach(function(c,i){var d=Math.abs(+c.getAttribute("cx")-px);if(d<bd){bd=d;bi=i;}});
  var H=box._H,h=H[bi],c=cs[bi],cx=+c.getAttribute("cx"),cy=+c.getAttribute("cy");
  cs.forEach(function(x,i){x.classList.toggle("on",i===bi);});
  var cr=$("excross");cr.setAttribute("x1",cx);cr.setAttribute("x2",cx);cr.style.display="";
  var t=$("extip"),d=fromIso(h.d);
  t.innerHTML='<b>'+DAYS[d.getDay()].n+' '+fmtD(h.d)+'</b><span>Serie top: '+kgs(h.top[0])+' lb × '+h.top[1]+'</span><span>'+h.sets.map(function(s){return kgs(s[0])+'×'+s[1];}).join(" · ")+'</span><span>1RM est. '+kgs(h.e1)+' lb · vol '+fmt.format(Math.round(h.vol))+' lb</span>';
  t.hidden=false;
  var w=wrap.clientWidth,tw=t.offsetWidth,left=Math.min(Math.max(cx*sc,tw/2+4),w-tw/2-4);
  t.style.left=left+"px";t.style.top=Math.max(cy*sc-12,t.offsetHeight+4)+"px";
}
$("pgex").addEventListener("change",function(e){if(e.target.id==="exsel"){exStat=e.target.value;try{localStorage.setItem("pvm:exstat",exStat);}catch(er){}renderExStats();}});
$("pgex").addEventListener("click",function(e){var b=e.target.closest("[data-met]");if(b){exMet=b.dataset.met;try{localStorage.setItem("pvm:exmet",exMet);}catch(er){}renderExStats();return;}if(e.target.closest("#exchart svg"))exTip(e);});
$("pgex").addEventListener("pointermove",function(e){if(e.pointerType==="mouse"&&e.target.closest("#exchart svg"))exTip(e);});
$("pgex").addEventListener("pointerleave",function(){var t=$("extip");if(t)t.hidden=true;var cr=$("excross");if(cr)cr.style.display="none";});
$("pgrec").addEventListener("click",function(e){if(e.target.closest("[data-recall]")){recAll=!recAll;renderProgreso();return;}var b=e.target.closest("[data-exs]");if(b){exStat=b.dataset.exs;try{localStorage.setItem("pvm:exstat",exStat);}catch(er){}renderExStats();$("pgex").scrollIntoView({block:"start",behavior:"smooth"});}});
function chartSVG(E){
  var Wd=Math.max(300,Math.min(720,Math.round(($("pgw").clientWidth||360)-34))),Hd=Math.round(Math.min(240,Math.max(190,Wd*0.55))),L=30,R=12,Tp=14,Bt=24;
  E=E.map(function(x){return {d:x.d,kg:toU(x.kg),s:x.s};});var BU=toU(BASEKG),UN=bwU();
  var x0=START,lastD=E.length?E[E.length-1].d:TODAY,x1=addD(lastD>TODAY?lastD:TODAY,14);
  if(E.length&&E[0].d<x0)x0=E[0].d;
  var span=Math.max(14,ddiff(x1,x0));
  var anchor=null;E.forEach(function(x){if(!anchor&&x.d>=START)anchor=x;});
  var a0=anchor?anchor.kg:BU,ad=anchor?anchor.d:START;
  function g(d,r){return a0+toU(r)*ddiff(d,ad)/7;}
  var ys=E.map(function(x){return x.kg;}).concat([a0,g(x1,0.25),g(x0,0.15)]);
  var y0=Math.floor(Math.min.apply(null,ys)-0.6),y1=Math.ceil(Math.max.apply(null,ys)+0.6);
  function X(d){return L+(Wd-L-R)*ddiff(d,x0)/span;}
  function Y(v){return Tp+(Hd-Tp-Bt)*(1-(v-y0)/(y1-y0));}
  var s='<svg class="chart" viewBox="0 0 '+Wd+' '+Hd+'" role="img" aria-label="Gráfica de peso con la franja de la meta"><defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--gym)" stop-opacity=".28"/><stop offset="1" stop-color="var(--gym)" stop-opacity="0"/></linearGradient></defs><g class="grid">';
  var step=(y1-y0)>14?5:(y1-y0)>6?2:1;if(step===5){y0=Math.floor(y0/5)*5;}
  for(var v=y0;v<=y1;v+=step)s+='<line x1="'+L+'" x2="'+(Wd-R)+'" y1="'+Y(v).toFixed(1)+'" y2="'+Y(v).toFixed(1)+'"/>';
  s+='</g><g class="ax">';
  for(v=y0;v<=y1;v+=step)s+='<text x="'+(L-6)+'" y="'+(Y(v)+3.5).toFixed(1)+'" text-anchor="end">'+v+'</text>';
  var tickStep=span>120?30:span>50?14:7;if(Wd<420&&tickStep===7&&span>21)tickStep=14;
  for(var i=0;i<=span;i+=tickStep){var d=addD(x0,i);s+='<text x="'+X(d).toFixed(1)+'" y="'+(Hd-8)+'" text-anchor="middle">'+d.getDate()+' '+MES3[d.getMonth()]+'</text>';}
  s+='</g>';
  s+='<polygon class="band" points="'+[[ad,0.15],[x1,0.15]].map(function(p){return X(p[0]).toFixed(1)+","+Y(g(p[0],p[1])).toFixed(1);}).join(" ")+' '+[[x1,0.25],[ad,0.25]].map(function(p){return X(p[0]).toFixed(1)+","+Y(g(p[0],p[1])).toFixed(1);}).join(" ")+'"/>';
  s+='<line class="goal" x1="'+X(ad).toFixed(1)+'" y1="'+Y(a0).toFixed(1)+'" x2="'+X(x1).toFixed(1)+'" y2="'+Y(g(x1,0.2)).toFixed(1)+'"/>';
  if(E.length){
    var pts=E.map(function(x){return [X(x.d),Y(x.kg)];});
    if(pts.length>1)s+='<path class="area" d="M'+pts.map(function(p){return p[0].toFixed(1)+","+p[1].toFixed(1);}).join(" L")+" L"+pts[pts.length-1][0].toFixed(1)+","+(Hd-Bt)+" L"+pts[0][0].toFixed(1)+","+(Hd-Bt)+'Z"/><path class="line" d="M'+pts.map(function(p){return p[0].toFixed(1)+","+p[1].toFixed(1);}).join(" L")+'"/>';
    pts.forEach(function(p,i){s+='<circle class="pt'+(i===pts.length-1?' last':'')+'" cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="'+(i===pts.length-1?5:3.5)+'"/>';});
    var lp=pts[pts.length-1];s+='<text class="lbl" x="'+Math.min(lp[0],Wd-R-40).toFixed(1)+'" y="'+(lp[1]-10).toFixed(1)+'" text-anchor="middle">'+kgs(Math.round(E[E.length-1].kg*10)/10)+' '+UN+'</text>';
  }else{
    s+='<circle class="base" cx="'+X(START).toFixed(1)+'" cy="'+Y(BU).toFixed(1)+'" r="4"/><text class="lbl" x="'+(X(START)+8).toFixed(1)+'" y="'+(Y(BU)-8).toFixed(1)+'">'+kgs(Math.round(BU*10)/10)+' '+UN+' (Tanita)</text>';
  }
  return s+'</svg>';
}
$("pgw").addEventListener("submit",function(e){e.preventDefault();var v=parseFloat(($("wi").value||"").replace(",","."));if(!bwOk(v)){toast("Escribe tu peso en "+bwName()+", por ejemplo "+bwEx());return;}addWeight(iso(TODAY),fromU(v));renderProgreso();toast("Peso guardado: "+kgs(v)+" "+bwU());});
$("pgw").addEventListener("click",function(e){var u=e.target.closest("[data-u]");if(u){var C=sget("cfg")||{};if(C.bw!==u.dataset.u){C.bw=u.dataset.u;sput("cfg",C);renderProgreso();}return;}var b=e.target.closest("[data-delw]");if(!b)return;var W=getDoc("weights",{e:[]});W.e=W.e.filter(function(r){return r[0]!==b.dataset.delw;});sput("weights",W);renderProgreso();});

/* ================= respaldo (app instalable) ================= */
function allDocs(){var out={};try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf("pvm:")===0){var kk=k.slice(4);if(/^(d-\d{4}-\d\d-\d\d|weights|best|last|shop|cfg|tanita)$/.test(kk)){var v=lsGet(kk);if(v)out[kk]=v;}}}}catch(e){}return out;}
function bkLast(){try{return +localStorage.getItem("pvmbk:last")||0;}catch(e){return 0;}}
function renderBackup(){if(view==="ajustes")renderAjustes();}
function renderBackupCard(){var el=$("pgbk");if(!el)return;
  var L=bkLast(),n=Object.keys(allDocs()).filter(function(k){return k.indexOf("d-")===0;}).length,old=!L||Date.now()-L>7*864e5;
  el.innerHTML='<div class="sec-h"><h3 style="font-size:1.05rem">Respaldo</h3><span class="r eyebrow">'+n+' días guardados</span></div><p class="small muted">Tus registros viven en este equipo. Guarda un respaldo cada semana (en Archivos o iCloud) por si cambias de celular o borras la app.</p>'+
    (old?'<p class="note">'+(L?'Tu último respaldo fue el '+new Date(L).getDate()+' '+MES3[new Date(L).getMonth()]+'. Ya toca otro.':'Todavía no tienes respaldo.')+'</p>':'<p class="small" style="color:var(--ok)">Último respaldo: '+new Date(L).getDate()+' '+MES3[new Date(L).getMonth()]+'</p>')+
    '<div class="gbtns"><button class="btn pri" type="button" data-bk="exp">Guardar respaldo</button><label class="btn ghost" style="cursor:pointer">Cargar respaldo<input type="file" accept=".json,application/json" id="bkin" hidden></label></div>'+'';}
function bkExport(){var D={app:"plan-volumen",v:1,at:new Date().toISOString(),docs:allDocs()},txt=JSON.stringify(D),nm="plan-volumen-respaldo-"+iso(TODAY)+".json";
  var done=function(){try{localStorage.setItem("pvmbk:last",String(Date.now()));}catch(e){}renderBackup();toast("Respaldo listo");};
  try{var f=new File([txt],nm,{type:"application/json"});if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:"Respaldo Plan de Volumen"}).then(done,function(){});return;}}catch(e){}
  var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt],{type:"application/json"}));a.download=nm;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},2000);done();}
function bkImport(file){var r=new FileReader();r.onload=function(){var D;try{D=JSON.parse(r.result);}catch(e){toast("Ese archivo no es un respaldo del plan");return;}
  if(!D||D.app!=="plan-volumen"||!D.docs){toast("Ese archivo no es un respaldo del plan");return;}
  var n=0;Object.keys(D.docs).forEach(function(k){if(!/^(d-\d{4}-\d\d-\d\d|weights|best|last|shop|cfg|tanita)$/.test(k))return;var rem=D.docs[k],loc=sget(k),m=mergeDocs(k,loc,rem);if(!m)return;S.cache[k]=m;lsSet(k,m);n++;});
  toast("Respaldo cargado: "+n+" registros");renderAll();};r.readAsText(file);}
document.addEventListener("click",function(e){var b=e.target.closest("[data-bk]");if(b&&b.dataset.bk==="exp")bkExport();});
document.addEventListener("change",function(e){if(e.target.id==="bkin"&&e.target.files[0]){bkImport(e.target.files[0]);e.target.value="";}});

/* ================= sincronizar entre equipos (app instalable) =================
   Tus registros se guardan en un gist secreto de tu GitHub. Cada equipo baja la copia, la junta con la suya (mergeDocs) y sube el resultado. */
var GH={busy:0,again:0,timer:null,err:"",dec:0,tok:"",fname:"plan-volumen-sync.json",fenc:"plan-volumen-datos.cifrado.json",desc:"Plan de Volumen · sincronización (no borrar)"};
/* la clave de GitHub vive en memoria; en la Mac se guarda en el Llavero (pvSecure), en el celular en el almacenamiento de la app */
function ghGet(k){if(k==="tok")return GH.tok;try{return localStorage.getItem("pvmgh:"+k)||"";}catch(e){return "";}}
function ghSet(k,v){
  if(k==="tok"){GH.tok=v||"";GH.keyP=null;GH.keyT="";
    /* primero en el equipo; si hay Llavero (app de Mac) se pasa ahí y se borra de aquí */
    try{if(v)localStorage.setItem("pvmgh:tok",v);else localStorage.removeItem("pvmgh:tok");}catch(e){}
    if(v&&window.pvSecure&&typeof window.pvSecure.set==="function")window.pvSecure.set(v).then(function(ok){if(ok&&GH.tok===v){try{localStorage.removeItem("pvmgh:tok");}catch(e){}}},function(){});
    else if(!v&&window.pvSecure&&typeof window.pvSecure.set==="function")window.pvSecure.set("").catch(function(){});
    return;}
  try{if(v)localStorage.setItem("pvmgh:"+k,v);else localStorage.removeItem("pvmgh:"+k);}catch(e){}}
function ghBoot(){
  var ls="";try{ls=localStorage.getItem("pvmgh:tok")||"";}catch(e){}
  GH.tok=ls;
  if(!(window.pvSecure&&typeof window.pvSecure.get==="function"))return Promise.resolve();
  return window.pvSecure.get().then(function(v){
    if(v){GH.tok=v;try{localStorage.removeItem("pvmgh:tok");}catch(e){}return;}
    if(ls)return window.pvSecure.set(ls).then(function(ok){if(ok){try{localStorage.removeItem("pvmgh:tok");}catch(e){}}});
  }).catch(function(){});
}
function ghOn(){return PWA&&!!GH.tok;}
function ghApi(path,method,body){
  if(!/^\/gists(\/[0-9a-f]{20,40})?(\?per_page=100)?$/.test(path))return Promise.reject(new Error("ruta"));
  return fetch("https://api.github.com"+path,{method:method||"GET",cache:"no-store",credentials:"omit",referrerPolicy:"no-referrer",headers:{"Authorization":"Bearer "+GH.tok,"Accept":"application/vnd.github+json","Content-Type":"application/json"},body:body?JSON.stringify(body):undefined})
    .then(function(r){if(!r.ok){var e=new Error("gh "+r.status);e.status=r.status;throw e;}return r.json();});
}
/* cifrado de tus datos en GitHub: AES-GCM 256 con una llave que sale de tu clave (PBKDF2, 310 000 vueltas).
   Sin tu clave nadie puede leerlos, y si alguien los altera, la app lo detecta y no los usa. */
var ENC={salt:"plan-volumen/sync/v1",it:310000};
function ghKey(){
  if(GH.keyP&&GH.keyT===GH.tok)return GH.keyP;
  var te=new TextEncoder(),tok=GH.tok;GH.keyT=tok;
  GH.keyP=crypto.subtle.importKey("raw",te.encode(tok),"PBKDF2",false,["deriveKey"]).then(function(base){
    return crypto.subtle.deriveKey({name:"PBKDF2",salt:te.encode(ENC.salt),iterations:ENC.it,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);});
  return GH.keyP;
}
function ghSeal(docs){
  var iv=crypto.getRandomValues(new Uint8Array(12)),pt=new TextEncoder().encode(JSON.stringify({app:"plan-volumen",v:1,at:new Date().toISOString(),docs:docs}));
  return ghKey().then(function(k){return crypto.subtle.encrypt({name:"AES-GCM",iv:iv,additionalData:new TextEncoder().encode("plan-volumen")},k,pt);})
    .then(function(ct){return JSON.stringify({app:"plan-volumen",enc:"aes-256-gcm",kdf:"pbkdf2-sha256",it:ENC.it,iv:b64u(iv),ct:b64u(ct)});});
}
function ghOpen(txt){
  var E;try{E=JSON.parse(txt);}catch(e){return Promise.reject({dec:1});}
  if(!E||E.app!=="plan-volumen"||E.enc!=="aes-256-gcm"||typeof E.iv!=="string"||typeof E.ct!=="string")return Promise.reject({dec:1});
  return ghKey().then(function(k){return crypto.subtle.decrypt({name:"AES-GCM",iv:unb64u(E.iv),additionalData:new TextEncoder().encode("plan-volumen")},k,unb64u(E.ct));})
    .then(function(pt){var D=JSON.parse(new TextDecoder().decode(pt));return D&&D.app==="plan-volumen"&&D.docs&&typeof D.docs==="object"?D.docs:{};},function(){throw {dec:1};});
}
function ghText(f){
  if(!f)return Promise.resolve(null);
  if(!f.truncated)return Promise.resolve(f.content||"");
  var u;try{u=new URL(f.raw_url);}catch(e){return Promise.resolve(null);}
  if(u.protocol!=="https:"||u.hostname!=="gist.githubusercontent.com")return Promise.resolve(null);
  return fetch(u.href,{cache:"no-store",credentials:"omit",referrerPolicy:"no-referrer"}).then(function(r){return r.ok?r.text():null;});
}
/* lee lo que hay en GitHub: el archivo cifrado y, si todavía existe, el viejo sin cifrar (se borra al guardar) */
function ghRead(g){
  var fs=g&&g.files||{};
  return Promise.all([ghText(fs[GH.fenc]),ghText(fs[GH.fname])]).then(function(r){
    var old={};if(r[1]){try{var D=JSON.parse(r[1]);if(D&&D.app==="plan-volumen"&&D.docs&&typeof D.docs==="object")old=D.docs;}catch(e){}}
    if(!r[0])return {docs:old,plain:!!fs[GH.fname],enc:false};
    return ghOpen(r[0]).then(function(docs){Object.keys(old).forEach(function(k){docs[k]=docs[k]?mergeDocs(k,docs[k],old[k]):old[k];});return {docs:docs,plain:!!fs[GH.fname],enc:true};});
  });
}
function ghFind(){
  var id=ghGet("id");
  if(id&&!/^[0-9a-f]{20,40}$/.test(id)){ghSet("id","");id="";}
  if(id)return ghApi("/gists/"+id).catch(function(e){if(e.status===404){ghSet("id","");return ghFind();}throw e;});
  return ghApi("/gists?per_page=100").then(function(list){
    var g=(list||[]).filter(function(x){return x&&x.files&&(x.files[GH.fenc]||x.files[GH.fname])&&/^[0-9a-f]{20,40}$/.test(x.id||"");})[0];
    if(g){ghSet("id",g.id);return ghApi("/gists/"+g.id);}
    return ghSeal(allDocs()).then(function(c){var files={};files[GH.fenc]={content:c};
      return ghApi("/gists","POST",{description:GH.desc,public:false,files:files});}).then(function(n){ghSet("id",n.id);return n;});
  });
}
function ghSoon(){if(!ghOn())return;clearTimeout(GH.timer);GH.timer=setTimeout(ghSync,2500);}
function ghSync(manual){
  if(!ghOn())return;
  if(GH.busy){GH.again=1;return;}
  GH.busy=1;setSync("busy");
  var G=null;
  var RD=null;
  ghFind().then(function(g){G=g;return ghRead(g);}).then(function(rd){RD=rd;var rem=rd.docs;
    var loc=allDocs(),keys={},changed=0,push=0,out={};
    Object.keys(S.cache).forEach(function(k){if(S.cache[k])loc[k]=S.cache[k];});
    Object.keys(loc).concat(Object.keys(rem)).forEach(function(k){keys[k]=1;});
    Object.keys(keys).forEach(function(k){
      if(!/^(d-\d{4}-\d\d-\d\d|weights|best|last|shop|cfg|tanita)$/.test(k))return;
      var l=loc[k],r=rem[k],m=mergeDocs(k,l||null,r||null);if(!m)return;out[k]=m;
      var ms=JSON.stringify(m);
      if(!l||ms!==JSON.stringify(l)){S.cache[k]=m;lsSet(k,m);changed=1;}
      if(!r||ms!==JSON.stringify(r))push=1;
    });
    var files={},av;
    if(G&&G.files&&G.files[AV.pfile]){av=JSON.stringify(avBuild());var ra=G.files[AV.file];if(!ra||ra.content!==av)files[AV.file]={content:av};}
    if(RD.plain)files[GH.fname]=null;
    var go=(push||!RD.enc||RD.plain)?ghSeal(out).then(function(c){files[GH.fenc]={content:c};}):Promise.resolve();
    return go.then(function(){
      if(!Object.keys(files).length)return changed;
      return ghApi("/gists/"+ghGet("id"),"PATCH",{files:files}).then(function(){return changed;});});
  }).then(function(changed){
    GH.busy=0;GH.err="";GH.dec=0;ghSet("last",String(Date.now()));setSync("on");
    if(changed){var a=document.activeElement;if(!(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)))renderAll();}
    else if(view==="ajustes")renderBackup();
    if(manual)toast("Sincronizado");
    if(GH.again){GH.again=0;ghSoon();}
  },function(e){
    GH.busy=0;setSync("local");
    GH.dec=0;
    if(e&&e.dec){GH.dec=1;GH.err="Tus datos en GitHub están cifrados con otra clave (o alguien los alteró), así que no los abrí ni los toqué. Si cambiaste tu clave, pega la anterior; si ya no la tienes, usa el botón de abajo para reemplazarlos con los de este equipo.";}
    else if(e&&(e.status===401||e.status===403)){GH.err="GitHub no aceptó tu clave. Crea una nueva (con permiso gist) y pégala otra vez.";}
    else GH.err="No hay conexión con GitHub. Lo que anotes se guarda aquí y se sube cuando vuelva el internet.";
    if(manual||e&&e.status)toast(GH.err);
    if(view==="ajustes")renderBackup();
  });
}
/* ================= avisos al celular =================
   La app arma tus avisos de los próximos 7 días y los guarda en el gist (avisos.json).
   Un proceso de GitHub (Actions, cada 10 min) los lee y te manda la notificación. */
var AV={file:"avisos.json",pfile:"avisos-push.json",secret:"AVISOS_GIST"};
function avBuild(){
  var out=[],now=Date.now(),W=(sget("weights")||{e:[]}).e||[];
  for(var i=0;i<7;i++){(function(d){
    var dd=sget(dk(d))||{m:{},s:{}},m=dd.m||{},hr=HRS[DAYS[d.getDay()].h],id=iso(d);
    var add=function(min,tag,t,b){var c=/^(des|col|com|pre|cen)$/.test(tag)?"meal":(tag==="batch"||tag==="prep")?"cocina":tag;if(!avCatOn(c))return;var x=+d+min*60000;if(x>now)out.push({at:x,tag:id+"-"+tag,t:t,b:b});};
    dayItems(d).forEach(function(x){
      if(x.type==="meal"&&!m[x.k]){var tt=itemTitle(d,x);add(x.s,x.k,mealName(d,x.k)+" · "+x.a,tt[0].replace(/^[^:]*:\s*/,"")+" · "+tt[1]);}
      else if(x.type==="cre"&&!m.cre)add(x.post?x.s:x.s-1,"cre","Creatina · 5 g",x.post?"Al terminar el entreno, en agua o en tu batido":"Con el desayuno");
      else if(x.type==="gym"&&!x.cl&&!doneSets(d)){var g=GDat(d)[x.k]||GD[x.k];add(x.s-30,"gym","En 30 min: "+g.t,"Entreno a las "+x.a+" · "+g.tm);}
      else if(x.type==="prep")add(x.s,"prep","Prep para el jueves","20 minutos antes de dormir");
      else if(x.type==="batch")add(x.s,"batch","Batch del Menú "+(weekMenu(d)+1),"90 minutos de cocina");
    });
    var des=mins(hr.des);
    if(!dd.med)add(des-15,"med","Medicamento de la mañana","Tómatelo antes del desayuno");
    if(wqDay(d)&&!W.some(function(r){return r[0]===id;}))add(des-25,"peso","Pésate hoy","En ayunas, después de ir al baño. Anótalo en Hoy");
  })(addD(TODAY,i));}
  out.sort(function(a,b){return a.at-b.at;});
  return {v:1,items:out};
}
function b64u(buf){var s="",b=new Uint8Array(buf);for(var i=0;i<b.length;i++)s+=String.fromCharCode(b[i]);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");}
function unb64u(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";var r=atob(s),o=new Uint8Array(r.length);for(var i=0;i<r.length;i++)o[i]=r.charCodeAt(i);return o;}
function avCan(){return "serviceWorker" in navigator&&"PushManager" in window&&"Notification" in window;}
function avStandalone(){return (window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone===true;}
function avOn(){return ghGet("av")==="1";}
function avEnable(){
  if(!ghOn()){toast("Primero conecta tu GitHub arriba");return;}
  Notification.requestPermission().then(function(p){
    if(p!=="granted"){toast("Sin permiso no te puedo mandar avisos. Actívalo en Ajustes → Notificaciones → Volumen");throw 0;}
    return ghFind();
  }).then(function(g){
    var f=g.files&&g.files[AV.pfile],P=null;try{P=f?JSON.parse(f.content):null;}catch(e){}
    var keys=P&&P.pub&&P.priv?Promise.resolve(P):crypto.subtle.generateKey({name:"ECDSA",namedCurve:"P-256"},true,["sign"]).then(function(kp){
      return Promise.all([crypto.subtle.exportKey("raw",kp.publicKey),crypto.subtle.exportKey("jwk",kp.privateKey)]).then(function(r){return {pub:b64u(r[0]),priv:r[1].d,subs:[]};});});
    return keys.then(function(P2){
      return navigator.serviceWorker.ready.then(function(reg){
        return reg.pushManager.getSubscription().then(function(old){
          var go=function(){return reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:unb64u(P2.pub)});};
          if(old){var ok=old.options&&old.options.applicationServerKey&&b64u(old.options.applicationServerKey)===P2.pub;if(ok)return old;return old.unsubscribe().then(go,go);}
          return go();
        });
      }).then(function(sub){
        var sj=sub.toJSON();P2.subs=(P2.subs||[]).filter(function(x){return x.endpoint!==sj.endpoint;}).concat([sj]).slice(-4);
        var files={};files[AV.pfile]={content:JSON.stringify(P2)};files[AV.file]={content:JSON.stringify(avBuild())};
        return ghApi("/gists/"+ghGet("id"),"PATCH",{files:files});
      });
    });
  }).then(function(){ghSet("av","1");renderBackup();toast("Avisos activados en este celular");},function(e){if(e!==0){toast("No se pudieron activar los avisos. Revisa tu internet e inténtalo otra vez");}renderBackup();});
}
function avCard(){
  var h='<div class="ghs gfirst">';
  var code='<p class="small muted">Código para el secreto <b>'+AV.secret+'</b> en GitHub:</p><div class="ghf"><input readonly value="'+ghGet("id")+'" aria-label="Código del gist" id="avid"><button class="btn ghost" type="button" data-av="copy">Copiar</button></div><p class="small"><a href="https://github.com/marcosreinah88-design/plan-volumen/settings/secrets/actions/new" target="_blank" rel="noopener">Abrir la página del secreto en GitHub</a>: en Name escribe '+AV.secret+', en Secret pega el código y toca Add secret.</p>';
  if(!ghGet("id"))code='';
  if(!avCan()||!avStandalone())return h+code+'<p class="small muted">Los avisos funcionan en el iPhone con la app instalada: en Safari toca Compartir → Agregar a pantalla de inicio y ábrela desde el ícono. Ahí aparece el botón para activarlos.</p></div>';
  if(!avOn())return h+'<p class="small muted">Te aviso tus comidas, la creatina, 30 min antes del gym, el medicamento y los días de pesarte. Si ya lo marcaste, no te llega.</p><div class="gbtns"><button class="btn pri" type="button" data-av="on">Activar avisos</button></div>'+code+'</div>';
  return h+'<p class="small" style="color:var(--ok)">Activados en este celular'+(Notification.permission!=="granted"?' (pero el permiso está apagado en Ajustes)':'')+'</p>'+
    '<p class="small muted">Si todavía no te llega ninguno, falta un paso que se hace una sola vez:</p>'+code+
    '<div class="gbtns"><button class="btn ghost" type="button" data-av="off">Apagar avisos aquí</button></div></div>';
}
document.addEventListener("click",function(e){var b=e.target.closest("[data-av]");if(!b)return;var a=b.dataset.av;
  if(a==="on")avEnable();
  else if(a==="copy"){var v=ghGet("id");(navigator.clipboard?navigator.clipboard.writeText(v):Promise.reject()).then(function(){toast("Código copiado");},function(){$("avid").select();toast("Selecciona y copia el código");});}
  else if(a==="off"){navigator.serviceWorker.ready.then(function(r){return r.pushManager.getSubscription();}).then(function(s){return s&&s.unsubscribe();}).catch(function(){}).then(function(){ghSet("av","");renderBackup();toast("Avisos apagados en este celular");});}});
function ghCard(){
  if(!ghGet("tok"))return '<div class="ghs gfirst"><p class="small muted">Para que lo que anotes en un equipo aparezca en el otro, conecta tu GitHub. Se hace una sola vez en cada equipo:</p>'+
    '<ol class="small"><li>Toca <a href="https://github.com/settings/tokens/new?scopes=gist&amp;description=Plan%20de%20Volumen" target="_blank" rel="noopener">Crear clave en GitHub</a> (ya trae marcado solo el permiso <b>gist</b>).</li><li>En <b>Expiration</b> elige <b>No expiration</b>, baja y toca <b>Generate token</b>.</li><li>Copia la clave (empieza con <b>ghp_</b>) y pégala aquí. Guárdala en Notas para pegarla también en el otro equipo.</li></ol>'+
    '<form class="ghf" id="ghf"><input id="ghtok" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ghp_…" aria-label="Clave de GitHub"><button class="btn pri" type="submit">Conectar</button></form></div>';
  var L=+ghGet("last")||0;
  return '<div class="ghs gfirst">'+(GH.err?'<p class="note">'+GH.err+'</p>':'<p class="small" style="color:var(--ok)">Conectado'+(L?' · última vez '+pad(new Date(L).getHours())+':'+pad(new Date(L).getMinutes()):'')+'</p>')+
    '<p class="small muted">Se sincroniza solo cada vez que anotas algo y al abrir la app. Tus datos viajan y se guardan en GitHub cifrados con tu clave.</p>'+(GH.dec?'<div class="gbtns"><button class="btn ghost" type="button" data-gh="reset">Reemplazar con los datos de este equipo</button></div>':'')+'<div class="gbtns"><button class="btn ghost" type="button" data-gh="now">Sincronizar ahora</button><button class="btn ghost" type="button" data-gh="off">Desconectar</button></div></div>';
}
document.addEventListener("submit",function(e){if(e.target.id!=="ghf")return;e.preventDefault();var v=($("ghtok").value||"").trim();
  if(!/^(ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{50,100})$/.test(v)){toast("Esa no parece una clave de GitHub (empieza con ghp_)");return;}
  $("ghtok").value="";ghSet("tok",v);ghSet("id","");GH.err="";GH.dec=0;renderBackup();ghSync(true);});
document.addEventListener("click",function(e){var b=e.target.closest("[data-gh]");if(!b)return;
  if(b.dataset.gh==="now")ghSync(true);
  else if(b.dataset.gh==="reset"){if(b.dataset.arm!=="1"){b.dataset.arm="1";b.textContent="¿Seguro? Lo de GitHub se reemplaza. Toca otra vez";return;}
    var id=ghGet("id");if(!id)return;ghSeal(allDocs()).then(function(c){var f={};f[GH.fenc]={content:c};f[GH.fname]=null;return ghApi("/gists/"+id,"PATCH",{files:f});}).then(function(){GH.dec=0;GH.err="";ghSync(true);},function(){toast("No se pudo. Revisa tu internet");});}
  else if(b.dataset.gh==="off"){ghSet("tok","");ghSet("id","");ghSet("last","");GH.err="";setSync("local");renderBackup();toast("Desconectado. Tus registros siguen en este equipo");}});
document.addEventListener("visibilitychange",function(){if(!document.hidden&&ghOn())ghSync();});
window.addEventListener("online",function(){if(ghOn())ghSync();});
setInterval(function(){if(!document.hidden&&ghOn())ghSync();},120000);

/* ================= GUÍA ================= */
function renderGuia(){
  var bi=blockInfo(TODAY);
  var blk=RIRW.map(function(r,i){return '<div class="'+(!bi.pre&&i===bi.wk?'cur':'')+'"><b>Sem '+(i+1)+'</b><span>'+r[0]+'</span><small>'+r[1]+'</small></div>';}).join("");
  var R9=ddiff(TODAY,CHG)>=0,rows=[["Bíceps",16,"Mar · Jue · "+(R9?"Sáb":"Vie"),14],["Tríceps",16,"Lun · Jue · "+(R9?"Sáb":"Vie"),12],["Deltoide lateral",9,"Lun · Jue · Vie",6],["Espalda",16,"Mar · Vie",0],["Pecho",14,"Lun · Vie",0],["Deltoide posterior",5,"Mar · Vie",10],["Femoral, glúteo y aductor",20,"Mié · Sáb",0],["Cuádriceps",R9?7:5,"Mié · Sáb",3],["Gemelos",7,"Mié · Sáb",0],["Abdomen",6,"Mié · Sáb",0]];
  var max=32,vol=rows.map(function(r){return '<tr><td><b>'+r[0]+'</b><small>'+r[2]+'</small></td><td class="n">'+r[1]+(r[3]?' <small>+'+r[3]+'</small>':'')+'</td><td class="bar"><div class="meter" role="img" aria-label="'+r[1]+' series directas"><i class="ind" style="width:'+((r[1]+r[3])/max*100)+'%"></i><i class="dir" style="width:'+(r[1]/max*100)+'%"></i></div></td></tr>';}).join("");
  var lca=(GD.mie.notes||[]).filter(function(n){return /LCA/.test(n)&&!/límites/.test(n);});
  var why=FR.why.replace("Todo el detalle está en Mi día y en Los números.","El detalle está en Hoy y en Comida › Números.");
  $("v-guia").innerHTML='<div class="sec-h"><h2>Guía</h2><span class="r eyebrow">'+(bi.pre?'':'Bloque '+bi.block+' · semana '+(bi.wk+1))+'</span></div>'+
    '<section class="card" style="display:grid;gap:10px"><h2 style="font-size:1.35rem">Bloques de 6 semanas</h2><div class="blk">'+blk+'</div><p class="small">Usa <b>doble progresión</b>: cuando completes el máximo de repeticiones en todas las series con buena técnica, sube el peso lo mínimo posible (2.5–5 %) y vuelve al mínimo del rango. La app te muestra lo que hiciste la última vez para que sepas qué superar.</p><p class="note info">Si los codos molestan, cambia barra por polea o mancuerna en ese ejercicio y quita 1 serie de brazo ese día. Si después de 2 bloques los brazos ya no progresan y recuperas bien, añade 1 serie al curl inclinado y 1 a la extensión sobre la cabeza.</p></section>'+
    '<section style="display:grid;gap:10px"><h2 style="font-size:1.35rem">Series por semana</h2><div class="tbl vol"><table><thead><tr><th>Músculo</th><th class="n">Series</th><th>Volumen</th></tr></thead><tbody>'+vol+'</tbody></table></div><p class="small muted">El número chico son series indirectas (por ejemplo, el bíceps trabaja en los remos). Brazos van a 16 directas porque son la prioridad. '+(R9?'El cuádriceps va en 7 series de extensión por la rodilla. Llegará a unas 10 cuando tu fisio apruebe la sentadilla en Smith o hack hasta 90° (3 series el miércoles).':'El cuádriceps queda bajo a propósito por la rodilla: cuando quites límites, sube la extensión a rango completo y suma sentadilla.')+'</p></section>'+
    '<section class="card lcap" id="lcap"><h2 style="font-size:1.35rem">Tu rodilla (LCA)</h2>'+lca.map(function(n){return '<p class="small">'+n+'</p>';}).join("")+'<p class="small"><b>Cómo ir quitando límites.</b> Es un esguince de grado 1 sin cirugía: cuando lleves 2–3 semanas así sin dolor, sin hinchazón y sin que la rodilla falle, avanza un paso.</p><ol><li>Extensión de cuádriceps de 90° a 45° (ahora).</li><li>Extensión de 90° a 20°.</li><li>Extensión en recorrido completo.</li><li>Sentadilla en Smith o hack con poco peso hasta 90° (3 series el miércoles).</li><li>Sentadilla búlgara con poco peso.</li></ol><p class="small muted">Un paso cada 1–2 semanas sin dolor, sin hinchazón y sin que la rodilla falle. Si algo vuelve, regresa al paso anterior y coméntalo con tu fisioterapeuta.</p></section>'+
    '<div class="guide-why" style="display:grid;gap:10px">'+why+'</div>'+
    '<details class="src-d"><summary>Fuentes de la rutina</summary>'+FR.gymsrc+'</details>'+
    '<details class="src-d"><summary>Fuentes de la dieta</summary>'+FR.dietsrc+'</details>';
}

/* ================= navegación ================= */
/* ================= AJUSTES ================= */
var APPV="dev";
var AVCAT=[["meal","Comidas","A la hora de cada comida"],["cre","Creatina","Al terminar el entreno (domingo: con el desayuno)"],["gym","Gym","30 minutos antes de entrenar"],["med","Medicamento","15 minutos antes del desayuno"],["peso","Pésate","Lunes, miércoles y viernes, 25 min antes del desayuno"],["cocina","Batch y prep","Domingo 12:00 y miércoles 21:30"]];
function avCatOn(c){var C=sget("cfg")||{};return !(C.avo&&C.avo[c]===false);}
function ajRow(h,t,body){return '<div class="card ajc" style="display:grid;gap:10px"><div class="sec-h"><h3 style="font-size:1.05rem">'+h+'</h3>'+(t?'<span class="r eyebrow">'+t+'</span>':'')+'</div>'+body+'</div>';}
function renderAjustes(){
  var C=sget("cfg")||{},th=(function(){try{return localStorage.getItem("pvm:theme")||"auto";}catch(e){return "auto";}})();
  var seg=function(attr,cur,opts){return '<div class="seg ajseg" role="group">'+opts.map(function(o){return '<button type="button" '+attr+'="'+o[0]+'" aria-pressed="'+(cur===o[0])+'">'+o[1]+'</button>';}).join("")+'</div>';};
  var h='';
  if(PWA){
    h+=ajRow("Sincronización",ghOn()?"Conectada":"Apagada",ghCard(true));
    h+=ajRow("Avisos",avOn()?"Activos aquí":"",avCard()+'<div class="ghs"><h4>Qué avisos quieres</h4><p class="small muted">Vale para todos tus equipos.</p><div class="avcats">'+AVCAT.map(function(c){var on=avCatOn(c[0]);return '<button type="button" class="avcat" data-avc="'+c[0]+'" aria-pressed="'+on+'"><span class="sw" aria-hidden="true"><i></i></span><span><b>'+c[1]+'</b><small>'+c[2]+'</small></span></button>';}).join("")+'</div></div>');
    h+=ajRow("IA para la Tanita",gemKey()?"Lista":"",gemKey()?'<p class="small muted">La clave de Gemini está guardada en este equipo. En Progreso → Cuerpo toca <b>Escanear hoja con IA</b> y sube la foto o el PDF de tu Tanita.</p><div class="gbtns"><button class="btn ghost" type="button" data-gem="off">Borrar clave</button></div>':gemKeyCard(false));
    h+='<div class="card" id="pgbk" style="display:grid;gap:10px"></div>';
  }
  h+=ajRow("Unidades y apariencia","",'<div class="ajl"><span><b>Peso corporal</b><small>Las cargas del gym siempre van en lb</small></span>'+seg("data-ajbw",C.bw==="lb"?"lb":"kg",[["kg","kg"],["lb","lb"]])+'</div>'+
    '<div class="ajl"><span><b>Tema</b><small>Automático sigue el de tu equipo</small></span>'+seg("data-ajth",th,[["auto","Auto"],["light","Claro"],["dark","Oscuro"]])+'</div>');
  var bi=blockInfo(TODAY);
  h+=ajRow("Tu plan","",'<ul class="ajp"><li><span>Calorías al día</span><b>'+fmt.format(KCAL)+' kcal</b></li><li><span>Proteína al día</span><b>'+PROT+' g</b></li><li><span>Bloque actual</span><b>'+(bi.pre?'Empieza el lunes 2 nov':'Bloque '+bi.block+' · semana '+(bi.wk+1)+' de 6')+'</b></li>'+
    ["lun","mar","mie","jue","vie","sab"].map(function(k){return '<li><span>Gym '+DAYS[KEYS.indexOf(k)].n.toLowerCase()+'</span><b>'+(GD[k]?GD[k].t:'')+' · '+GYMT[k]+'</b></li>';}).join("")+
    '<li><span>Primera revisión de peso</span><b>Domingo 22 nov</b></li></ul><p class="small muted">Para cambiar la rutina, la dieta o los horarios, pídemelo en el chat y se actualiza aquí sola.</p>');
  h+=ajRow("Bibliografía","",'<details class="src-d"><summary>Fuentes de la rutina</summary>'+FR.gymsrc+'</details><details class="src-d"><summary>Fuentes de la dieta</summary>'+FR.dietsrc+'</details>');
  h+=ajRow("Acerca de la app","",'<ul class="ajp"><li><span>Versión</span><b class="mono">'+APPV+'</b></li><li><span>Dónde se guardan tus datos</span><b>'+(PWA?(ghOn()?'En este equipo y en tu GitHub':'Solo en este equipo'):'En tu cuenta de Claude')+'</b></li></ul>'+
    (PWA?'<p class="small muted">La app se actualiza sola cada vez que la abres con internet. Si acabamos de cambiar algo y no lo ves, toca el botón.</p><div class="gbtns"><button class="btn ghost" type="button" data-aj="upd">Buscar actualización</button></div>':''));
  $("ajbody").innerHTML=h;
  if(PWA)renderBackupCard();
}
document.addEventListener("click",function(e){
  var t=e.target;
  var b=t.closest("[data-ajbw]");if(b){var C=sget("cfg")||{};C.bw=b.dataset.ajbw;sput("cfg",C);renderAjustes();toast("Peso corporal en "+C.bw);return;}
  b=t.closest("[data-ajth]");if(b){var v=b.dataset.ajth;try{if(v==="auto")localStorage.removeItem("pvm:theme");else localStorage.setItem("pvm:theme",v);}catch(er){}if(v==="auto")document.documentElement.removeAttribute("data-theme");else document.documentElement.setAttribute("data-theme",v);paintTheme();renderAjustes();return;}
  b=t.closest("[data-avc]");if(b){var C2=sget("cfg")||{};C2.avo=C2.avo||{};var c=b.dataset.avc;C2.avo[c]=!avCatOn(c);sput("cfg",C2);renderAjustes();return;}
  b=t.closest("[data-aj]");if(b&&b.dataset.aj==="upd"){toast("Buscando…");var fin=function(){location.reload();};if(navigator.serviceWorker&&navigator.serviceWorker.getRegistration){navigator.serviceWorker.getRegistration().then(function(r){return r&&r.update();}).then(function(){setTimeout(fin,900);},fin);}else fin();}
});
$("setbtn").addEventListener("click",function(){show(view==="ajustes"?"hoy":"ajustes");});
/* ===== medallas: premios por constancia (se calculan de lo que ya anotas; no se guarda nada nuevo en la nube) ===== */
var MDT=[["bro","Bronce"],["pla","Plata"],["oro","Oro"]];
ICON.mfire='<path d="M12 21c-3.6 0-6-2.4-6-5.6 0-3.4 2.6-5 3.4-8.4 1.6 1.2 2.4 2.6 2.4 4.4 1-.6 1.6-1.8 1.8-3.2 2.4 1.8 4.4 4.4 4.4 7.2 0 3.2-2.4 5.6-6 5.6Z"/>';
ICON.mstar='<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8Z"/>';
ICON.mcal='<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M9 15l2 2 4-4"/>';
ICON.mshield='<path d="M12 3.5l7.5 3v5.5c0 4.5-3.2 7.6-7.5 9-4.3-1.4-7.5-4.5-7.5-9V6.5Z"/><path d="M8.5 12.2l2.4 2.4 4.6-4.6"/>';
ICON.mflag='<path d="M5.5 21V4M5.5 4.5h11l-2.5 4 2.5 4h-11"/>';
ICON.mdrop='<path d="M12 3.5c3.2 4 6 7.4 6 10.6a6 6 0 0 1-12 0c0-3.2 2.8-6.6 6-10.6Z"/>';
ICON.mtrophy='<path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0Z"/><path d="M7.5 6H4.5a3 3 0 0 0 3 4M16.5 6h3a3 3 0 0 1-3 4M12 13.5V17M8.5 20.5h7M9.5 17h5v3.5h-5z"/>';
ICON.mstack='<path d="M4 17.5h16M6 13.5h12M8 9.5h8M10 5.5h4"/>';
ICON.mbody='<circle cx="12" cy="4.8" r="2"/><path d="M5 9.5h14M12 9.5V15M9 21l3-6 3 6"/>';
var MDG=[["gym","Gym"],["die","Dieta y hábitos"],["fue","Fuerza"],["cue","Cuerpo"]];
/* familia: [id, grupo, nombre, ícono, [bronce, plata, oro], unidad, qué cuenta] */
var MDF=[
  ["ses","gym","Sesiones","gym",[10,50,150],"sesiones","Días de gym con al menos la mitad de las series."],
  ["com","gym","Rutina completa","check",[5,25,75],"rutinas","Días en que marcaste todas las series de la rutina."],
  ["sem","gym","Semanas ganadas","mcal",[2,6,20],"semanas","Semanas en que cumpliste el modo que elegiste (completa, ocupada o supervivencia)."],
  ["dos","gym","Nunca faltar dos veces","mshield",[14,42,84],"días","Tiempo sin faltar a dos entrenos seguidos. Una falta suelta no rompe nada."],
  ["blq","gym","Bloque terminado","mflag",[1,2,4],"bloques","Bloques de 6 semanas con al menos 5 semanas ganadas."],
  ["die","die","Días de dieta","meal",[7,30,90],"días","Días con 4 de las 5 comidas marcadas."],
  ["rac","die","Racha en verde","mfire",[3,7,21],"días","Tu mejor racha de días seguidos con gym y dieta cumplidos."],
  ["per","die","Semana perfecta","mstar",[1,4,10],"semanas","Semanas con los 7 días en verde."],
  ["agu","die","Agua","mdrop",[7,30,90],"días","Días en que llegaste a 3 litros."],
  ["cre","die","Creatina","cre",[7,30,90],"días seguidos","Tu mejor racha de días seguidos con creatina."],
  ["rec","fue","Récords","mtrophy",[5,25,75],"récords","Veces que superaste tu mejor serie de un ejercicio (1RM estimado)."],
  ["vol","fue","Volumen","mstack",[250000,1000000,2500000],"lb","Peso × reps de todas tus series marcadas."],
  ["hor","fue","Horas de gym","prep",[10,50,150],"horas","Tiempo con el cronómetro de la sesión."],
  ["pes","cue","Pesadas","scale",[10,30,90],"pesadas","Veces que registraste tu peso."],
  ["tan","cue","Tanita","chart",[1,3,6],"mediciones","Mediciones de Tanita después de la del 4 jul."],
  ["mus","cue","Músculo ganado","mbody",[1,2,3],"kg","Masa muscular de tu última Tanita contra la del 4 jul (54.0 kg)."]
];
function mdStats(){
  var v={ses:0,com:0,sem:0,dos:0,blq:0,die:0,rac:0,per:0,agu:0,cre:0,rec:0,vol:0,hor:0,pes:0,tan:0,mus:0};
  var D=collectDays(),best={},min=0,cr=0,miss=0,run0=null;
  for(var d=day0(START);ddiff(d,TODAY)<=0;d=addD(d,1)){
    var st=dayStat(d),dd=sget(dk(d)),isT=st.isT;
    if(st.go)v.ses++;
    if(st.fo)v.die++;
    var tot=planTotal(d);if(tot>0&&doneSets(d)>=tot)v.com++;
    if(dd&&waterMl(dd)>=WGOAL)v.agu++;
    if(dd&&dd.m&&dd.m.cre){cr++;if(cr>v.cre)v.cre=cr;}else if(!isT)cr=0;
    if(dd&&dd.ss&&dd.se&&dd.se>dd.ss)min+=Math.min(300,(dd.se-dd.ss)/60000);
    /* nunca faltar dos veces: días de gym planeados; hoy solo cuenta si ya lo cumpliste */
    if(st.gd&&!(isT&&!st.go)){if(st.go){miss=0;if(!run0)run0=d;}else{miss++;if(miss>=2)run0=null;}}
    if(run0){var len=ddiff(d,run0)+1;if(len>v.dos)v.dos=len;}
  }
  v.rac=dstreaks().best;v.hor=Math.floor(min/60);
  /* récords y volumen, en el orden de los días */
  Object.keys(D).sort().forEach(function(dt){if(dt<iso(START)||dt>iso(TODAY))return;var s=D[dt].s||{};
    Object.keys(s).forEach(function(id){var e1=0;(s[id]||[]).forEach(function(r){if(!rowDone(r))return;var lb=+r[0]||0,rp=+r[1]||0;if(lb>0&&rp>0){v.vol+=lb*rp;e1=Math.max(e1,e1rm(lb,rp));}});
      if(e1>0){if(best[id]&&e1>best[id]+0.05)v.rec++;if(!best[id]||e1>best[id])best[id]=e1;}});});
  v.vol=Math.round(v.vol);
  /* semanas y bloques */
  var won=[];
  for(var m=mondayOf(START);ddiff(m,TODAY)<=0;m=addD(m,7)){var sun=addD(m,6),end=ddiff(sun,TODAY)>0?TODAY:sun,c=dcount(m,end),wm=modeOf(m),goal=wm==="full"?6:wm==="ocu"?4:2;
    var w=c.g>=goal;won.push(w);if(w)v.sem++;if(ddiff(sun,TODAY)<=0&&c.b===7)v.per++;}
  for(var b=0;b+6<=won.length;b+=6){var n=won.slice(b,b+6).filter(Boolean).length,bend=addD(START,(b+6)*7-1);if(n>=5&&ddiff(bend,TODAY)<=0)v.blq++;}
  /* cuerpo */
  v.pes=(getDoc("weights",{e:[]}).e||[]).length;
  var TL=tanList();v.tan=Math.max(0,TL.length-1);
  var lt=TL[TL.length-1];if(lt&&lt.d!==TAN0.d&&typeof lt.mm==="number")v.mus=Math.max(0,Math.round((lt.mm-TAN0.mm)*10)/10);
  return v;
}
var MD1={bloques:"bloque",semanas:"semana",mediciones:"medición"};
function mdU(f,n){return n===1&&MD1[f[5]]?MD1[f[5]]:f[5];}
function mdTier(f,val){var t=-1;f[4].forEach(function(x,i){if(val>=x)t=i;});return t;}
function mdNum(f,n){if(f[0]==="vol")return n>=1e6?fmt1.format(Math.round(n/1e5)/10)+" M":fmtI.format(Math.round(n/1000))+" mil";return f[0]==="mus"?fmt1.format(n):fmtI.format(n);}
function mdGet(k){try{var x=JSON.parse(localStorage.getItem("pvmmd:"+k)||"null");return x&&typeof x==="object"&&!Array.isArray(x)?x:null;}catch(e){return null;}}
function mdSet(k,o){try{localStorage.setItem("pvmmd:"+k,JSON.stringify(o));}catch(e){}}
function mdSVG(t,icon){var col=t<0?"var(--line2)":"var(--md-"+MDT[t][0]+")";
  return '<svg class="mdsvg" viewBox="0 0 48 56" aria-hidden="true"><path d="M15 2h7l4 14h-7z M26 2h7l-4 14h-7z" fill="'+(t<0?'var(--line)':'var(--md-rib)')+'"/>'+
    '<circle cx="24" cy="33" r="19" fill="'+col+'"/><circle cx="24" cy="33" r="15" fill="none" stroke="'+(t<0?'var(--surface)':'rgba(255,255,255,.45)')+'" stroke-width="1.5"/>'+
    '<g transform="translate(14 23) scale(.8333)" fill="none" stroke="'+(t<0?'var(--faint)':'#1B1F23')+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+ICON[icon]+'</g></svg>';}
function renderMedallas(){var el=$("pgmed");if(!el)return;collectDays();
  var v=mdStats(),nw=mdGet("new")||{},got=0,tot=MDF.length*3,h="";
  MDF.forEach(function(f){got+=mdTier(f,v[f[0]])+1;});
  h+='<div class="sec-h"><h3 style="font-size:1.05rem">Medallas</h3><span class="r eyebrow">'+got+' de '+tot+'</span></div>';
  h+='<div class="mdbar" role="progressbar" aria-label="Medallas ganadas" aria-valuemin="0" aria-valuemax="'+tot+'" aria-valuenow="'+got+'"><i style="width:'+pct(got,tot)+'%"></i></div>';
  h+='<p class="small muted">Cada medalla tiene bronce, plata y oro. Salen de lo que ya marcas en la app: series, comidas, agua, creatina, peso y Tanita.</p>';
  MDG.forEach(function(g){var fs=MDF.filter(function(f){return f[1]===g[0];});
    h+='<h4 class="mdg">'+g[1]+'</h4><div class="mdgrid">';
    fs.forEach(function(f){var val=v[f[0]],t=mdTier(f,val),nx=t<2?f[4][t+1]:null,isN=nw[f[0]]!=null;
      var lbl=t<0?'Sin ganar':MDT[t][1],pr=nx?Math.min(100,Math.round(val/nx*100)):100;
      h+='<div class="md'+(t<0?' off':'')+(isN?' nw':'')+'" role="group" aria-label="'+esc(f[2])+': '+lbl+', '+mdNum(f,val)+' '+f[5]+'">'+mdSVG(t,f[3])+
        '<div class="mdt"><b>'+esc(f[2])+(isN?' <em>nueva</em>':'')+'</b><span class="mdl'+(t<0?'':' '+MDT[t][0])+'">'+lbl+'</span>'+
        '<div class="mdp"><i style="width:'+pr+'%"></i></div><small>'+(nx?mdNum(f,val)+' de '+mdNum(f,nx)+' '+mdU(f,nx)+' para '+MDT[t+1][1].toLowerCase():'Completa · '+mdNum(f,val)+' '+f[5])+'</small>'+
        '<small class="mdd">'+f[6]+'</small><span class="mdpips" aria-hidden="true">'+[0,1,2].map(function(i){return '<i class="'+(i<=t?MDT[i][0]:'')+'"></i>';}).join("")+'</span></div></div>';});
    h+='</div>';});
  el.innerHTML=h;
  if(Object.keys(nw).length){mdSet("new",{});mdDot();}
}
function mdDot(){var b=document.querySelector('#pgseg [data-pg="med"]');if(b)b.classList.toggle("dot",!!Object.keys(mdGet("new")||{}).length);}
/* revisa si ganaste algo nuevo y avisa con un toast */
var mdT=0;
function mdSoon(){clearTimeout(mdT);mdT=setTimeout(mdCheck,1800);}
function mdCheck(){var v;try{v=mdStats();}catch(e){return;}
  var had=mdGet("got"),first=!had,got=had||{},nw=mdGet("new")||{},fresh=[];
  MDF.forEach(function(f){var t=mdTier(f,v[f[0]]),p=got[f[0]]!=null?got[f[0]]:-1;if(t>p){fresh.push([f,t]);nw[f[0]]=t;}got[f[0]]=Math.max(t,p);});
  mdSet("got",got);
  if(!fresh.length){mdDot();return;}
  mdSet("new",nw);mdDot();
  if(view==="progreso"&&pgSeg==="med"){renderMedallas();}
  if(first)toast("Ya tienes "+fresh.length+(fresh.length===1?" medalla":" medallas")+". Míralas en Progreso → Medallas");
  else if(fresh.length===1)toast("Medalla nueva: "+fresh[0][0][2]+" · "+MDT[fresh[0][1]][1].toLowerCase());
  else toast(fresh.length+" medallas nuevas. Míralas en Progreso → Medallas");
}
var R={hoy:renderHoy,entreno:renderEntreno,comida:renderComida,progreso:renderProgreso,guia:renderGuia,ajustes:renderAjustes};
/* animación de entrada: se pone la clase un momento y se quita, así lo que se vuelve a pintar después no se anima de nuevo */
function vin(el){if(!el)return;el.classList.remove("vin");void el.offsetWidth;el.classList.add("vin");clearTimeout(el._vt);el._vt=setTimeout(function(){el.classList.remove("vin");},700);}
function show(v){
  view=v;
  Object.keys(R).forEach(function(k){$("v-"+k).hidden=k!==v;});
  $("nav").querySelectorAll("button").forEach(function(b){if(b.dataset.v===v)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");});
  R[v]();window.scrollTo(0,0);vin($("v-"+v));
  if(v==="entreno"){var first=document.querySelector("#exlist .ex:not(.complete)");if(first&&doneSets(TODAY)>0)first.scrollIntoView({block:"center"});}
}
$("hero").addEventListener("click",function(e){
  if(e.target.closest("[data-mpick]")){mpick=!mpick;rpick=false;renderHero();return;}
  if(e.target.closest("[data-rpick]")){rpick=!rpick;mpick=false;renderHero();return;}
  var rb=e.target.closest("[data-rk]");if(rb){var nk=rb.dataset.rk;setRK(selDay,nk);rpick=false;if(ddiff(selDay,TODAY)<=0){wsel=nk;wtoday=false;wfor=sameDay(selDay,TODAY)?null:selDay;}renderAll();toast("Ese día queda como "+GD[nk].t.toLowerCase());return;}
  var b=e.target.closest("[data-mn]");if(!b)return;
  var d=selDay,dd=dayDoc(d),i=+b.dataset.mn;
  if(i===weekMenu(d))delete dd.mn;else dd.mn=i;dd._auth=Date.now();saveDay(d);mpick=false;renderHoy();
  toast(i===weekMenu(d)?"De vuelta al menú de la semana":"Ese día queda con el Menú "+(i+1));
});
$("nav").addEventListener("click",function(e){var b=e.target.closest("[data-v]");if(!b)return;if(b.dataset.v==="hoy"&&view==="hoy"){selDay=TODAY;}show(b.dataset.v);});
function renderAll(){sessAutoClose();R[view]();sessUI();}
$("blkpill").addEventListener("click",function(){show(sess().st==="on"?"entreno":"guia");});

/* tema */
function curTheme(){var a=document.documentElement.getAttribute("data-theme");if(a)return a;return window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}
function paintTheme(){$("theme").innerHTML=ic(curTheme()==="dark"?"sun":"moon");}
(function(){var t=null;try{t=localStorage.getItem("pvm:theme");}catch(e){}if(t)document.documentElement.setAttribute("data-theme",t);paintTheme();})();
$("theme").addEventListener("click",function(){var n=curTheme()==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",n);try{localStorage.setItem("pvm:theme",n);}catch(e){}paintTheme();});

/* reloj: el día cambia a medianoche y "lo que sigue" avanza solo */
setInterval(function(){
  var t=day0(new Date());
  if(+t!==+TODAY){newDay(t);return;}
  if(view==="hoy"&&sameDay(selDay,TODAY)){renderNext();var nw=document.querySelector("#tl .now .tm");if(nw){var n=nowMin();nw.textContent=pad(Math.floor(n/60))+":"+pad(n%60);}}
},30000);
document.addEventListener("visibilitychange",function(){if(document.hidden)return;var t=day0(new Date());if(+t!==+TODAY){newDay(t);}else if(view==="hoy")renderHoy();sessUI();if(TM.end&&$("timer").classList.contains("on")&&!$("timer").classList.contains("end"))tick();});

$("acct").addEventListener("click",function(e){
  var b=e.target.closest("[data-acct]");if(!b)return;var a=b.dataset.acct;
  var again=function(){acctSet("wait");connect();};
  if(a==="retry"){again();return;}
  window.claude.use("permissions").then(function(pm){
    if(!pm){again();return;}
    var p=a==="manage"?pm.manage():pm.request(["db","user"]);
    return Promise.resolve(p).then(again,function(){toast("Ábrelo desde el menú Permisos del plan");});
  }).catch(again);
});

/* arranque: si estabas a media sesión, abre Entreno */
setSync("local");
var lastSetAt=(function(){var dd=dayDoc(TODAY);return dd._t||0;})();
sessAutoClose();
var started=sess().st==="on"||(doneSets(TODAY)>0&&GD[TKEY]&&doneSets(TODAY)<planTotal(TODAY)&&(Date.now()-lastSetAt)<90*60000);
$("pgdias").addEventListener("mouseover",function(e){var c=e.target.closest(".dc[data-d]");if(c&&c!==dtipEl)dtipShow(c);});
$("pgdias").addEventListener("mouseleave",dtipHide);
$("pgdias").addEventListener("mouseout",function(e){if(dtipEl&&!(e.relatedTarget&&e.relatedTarget.closest&&e.relatedTarget.closest(".dc[data-d]")))dtipHide();});
$("pgdias").addEventListener("focusin",function(e){var c=e.target.closest(".dc[data-d]");if(c)dtipShow(c);});
$("pgdias").addEventListener("focusout",dtipHide);
window.addEventListener("scroll",dtipHide,{passive:true});
$("pgdias").addEventListener("click",function(e){var c=e.target.closest(".dc[data-d]");if(c){if(dtipEl===c)dtipHide();else dtipShow(c);return;}var b=e.target.closest("[data-ds]");if(!b)return;diasSeg=b.dataset.ds;try{localStorage.setItem("pvm:diasseg",diasSeg);}catch(er){}renderDias();});
if(modeOf(TODAY)==="sup")wsel="sup";if(dayRK(TODAY))wsel=dayRK(TODAY);
renderAll();show(started?"entreno":"hoy");
connect();
ghBoot().then(function(){if(ghOn())ghSync();if(view==="ajustes")renderAjustes();});
setTimeout(mdCheck,2500);
})();
