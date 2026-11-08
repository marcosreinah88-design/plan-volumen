// Manda los avisos del Plan de Volumen al celular.
// Lee avisos.json y avisos-push.json del gist secreto (su id viene del secreto AVISOS_GIST)
// y manda los que tocan desde la última corrida. El estado se guarda en estado/ vía la caché de Actions.
// El repo es público y sus registros también: aquí solo se imprimen conteos, nunca horarios, textos ni direcciones.
import webpush from 'web-push';
import fs from 'node:fs';
const GIST = (process.env.AVISOS_GIST || '').trim();
if (!/^[0-9a-f]{20,40}$/.test(GIST)) { console.log('Sin secreto AVISOS_GIST válido: nada que mandar.'); process.exit(0); }
const EST = 'estado/avisos.json';
const now = Date.now();
let est = { last: now - 15 * 60000, sent: [] };
try { const e = JSON.parse(fs.readFileSync(EST, 'utf8')); if (typeof e.last === 'number' && Array.isArray(e.sent)) est = e; } catch {}
const txt = (s, n) => String(s ?? '').replace(/[\u0000-\u001f<>]/g, '').slice(0, n);
async function leer() {
  const h = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'plan-volumen-avisos' };
  let r = await fetch(`https://api.github.com/gists/${GIST}`, { headers: h });
  // si GitHub limita las consultas sin cuenta (IPs compartidas), reintenta con el token de solo lectura del propio workflow
  if (!r.ok && process.env.GH_TOKEN) r = await fetch(`https://api.github.com/gists/${GIST}`, { headers: { ...h, Authorization: `Bearer ${process.env.GH_TOKEN}` } });
  if (!r.ok) throw new Error('gist ' + r.status);
  const g = await r.json();
  const file = async (n) => {
    const f = g.files?.[n]; if (!f) return null;
    let t = f.content;
    if (f.truncated) { const u = new URL(f.raw_url); if (u.protocol !== 'https:' || u.hostname !== 'gist.githubusercontent.com') return null; t = await (await fetch(u)).text(); }
    if (t.length > 2_000_000) return null;
    return JSON.parse(t);
  };
  return { av: await file('avisos.json'), push: await file('avisos-push.json') };
}
let av, push;
try { ({ av, push } = await leer()); } catch (e) { console.log('No pude leer los avisos (' + (e.message || 'error') + ').'); process.exit(0); }
const subs = (push?.subs || []).filter(s => { try { const u = new URL(s.endpoint); return u.protocol === 'https:' && /(^|\.)push\.apple\.com$|(^|\.)googleapis\.com$|(^|\.)mozilla\.com$|(^|\.)notify\.windows\.com$/.test(u.hostname) && s.keys?.p256dh && s.keys?.auth; } catch { return false; } }).slice(0, 4);
if (!av || !push || !subs.length || typeof push.pub !== 'string' || typeof push.priv !== 'string') { console.log('Todavía no hay avisos activados.'); process.exit(0); }
const desde = Math.max(est.last, now - 45 * 60000);
const sent = new Set(est.sent || []);
const items = Array.isArray(av.items) ? av.items.slice(0, 500) : [];
const toca = items.filter(x => x && typeof x.at === 'number' && typeof x.tag === 'string' && x.at > desde - 60000 && x.at <= now + 60000 && !sent.has(x.tag)).slice(0, 10);
webpush.setVapidDetails('https://marcosreinah88-design.github.io/plan-volumen/', push.pub, push.priv);
let ok = 0, fail = 0;
for (const x of toca) {
  for (const sub of subs) {
    try { await webpush.sendNotification(sub, JSON.stringify({ t: txt(x.t, 80), b: txt(x.b, 200), tag: txt(x.tag, 40) }), { TTL: 3600, urgency: 'high' }); ok++; }
    catch (e) { fail++; console.log('Un envío falló (código ' + (e.statusCode || '?') + ').'); }
  }
  sent.add(x.tag);
}
console.log(`Avisos revisados: ${items.length}; enviados: ${ok}; fallidos: ${fail}.`);
const keep = [...sent].filter(t => t >= new Date(now - 2 * 864e5).toISOString().slice(0, 10)).slice(-300);
fs.mkdirSync('estado', { recursive: true });
fs.writeFileSync(EST, JSON.stringify({ last: now + 60000, sent: keep }));
