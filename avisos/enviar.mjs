// Manda los avisos del Plan de Volumen al celular.
// Lee avisos.json y avisos-push.json del gist secreto (su id viene del secreto AVISOS_GIST)
// y manda los que tocan desde la última corrida. El estado (último envío) se guarda en avisos/estado.json vía caché de Actions.
import webpush from 'web-push';
import fs from 'node:fs';
const GIST = (process.env.AVISOS_GIST || '').trim();
if (!GIST) { console.log('Falta el secreto AVISOS_GIST: no hay a quién mandar.'); process.exit(0); }
const EST = 'estado/avisos.json';
const now = Date.now();
let est = { last: now - 15 * 60000, sent: [] };
try { est = JSON.parse(fs.readFileSync(EST, 'utf8')); } catch {}
async function leer() {
  const h = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'plan-volumen-avisos' };
  let r = await fetch(`https://api.github.com/gists/${GIST}`, { headers: h });
  if (!r.ok && process.env.GH_TOKEN) r = await fetch(`https://api.github.com/gists/${GIST}`, { headers: { ...h, Authorization: `Bearer ${process.env.GH_TOKEN}` } });
  if (!r.ok) throw new Error('No pude leer el gist: ' + r.status);
  const g = await r.json();
  const file = async (n) => { const f = g.files[n]; if (!f) return null; const t = f.truncated ? await (await fetch(f.raw_url)).text() : f.content; return JSON.parse(t); };
  return { av: await file('avisos.json'), push: await file('avisos-push.json') };
}
const { av, push } = await leer();
if (!av || !push || !push.subs?.length) { console.log('Todavía no hay avisos activados.'); process.exit(0); }
const desde = Math.max(est.last, now - 45 * 60000);
const sent = new Set(est.sent || []);
const toca = (av.items || []).filter(x => x.at > desde - 60000 && x.at <= now + 60000 && !sent.has(x.tag));
console.log(`Revisé ${av.items?.length || 0} avisos; tocan ${toca.length}.`);
webpush.setVapidDetails('https://marcosreinah88-design.github.io/plan-volumen/', push.pub, push.priv);
for (const x of toca) {
  for (const sub of push.subs) {
    try { await webpush.sendNotification(sub, JSON.stringify({ t: x.t, b: x.b, tag: x.tag }), { TTL: 3600, urgency: 'high' }); console.log('Enviado:', x.tag); }
    catch (e) { console.log('Falló', x.tag, e.statusCode || e.message); }
  }
  sent.add(x.tag);
}
const keep = [...sent].filter(t => t >= new Date(now - 2 * 864e5).toISOString().slice(0, 10));
fs.mkdirSync('estado', { recursive: true });
fs.writeFileSync(EST, JSON.stringify({ last: now + 60000, sent: keep }));
