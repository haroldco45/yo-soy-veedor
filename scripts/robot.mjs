// Robot de Yo Soy Veedor · Vibras Positivas HM
// Corre en GitHub Actions cada 30 minutos: trae del SECOP II (datos.gov.co) el resumen
// nacional de los contratos firmados en los últimos días, la lista de municipios y noticias.
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const API = 'https://www.datos.gov.co/resource/jbjy-vk9h.json';
const TOKEN = process.env.SOCRATA_APP_TOKEN || '';
const DIAS = 3;
const CAMPOS = ['id_contrato','referencia_del_contrato','nombre_entidad','departamento','ciudad','estado_contrato','objeto_del_contrato',
  'tipo_de_contrato','modalidad_de_contratacion','fecha_de_firma','fecha_de_inicio_del_contrato','fecha_de_fin_del_contrato',
  'proveedor_adjudicado','documento_proveedor','valor_del_contrato','valor_pagado','valor_facturado','valor_de_pago_adelantado',
  'dias_adicionados','origen_de_los_recursos','urlproceso'];

const num = v => { const n = parseFloat(String(v ?? '').replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : 0; };
const bogota = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(d);
async function getJSON(url) {
  const r = await fetch(url, { headers: TOKEN ? { 'X-App-Token': TOKEN } : {} });
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json();
}
async function readJSON(path, def) { try { return JSON.parse(await readFile(path, 'utf8')); } catch { return def; } }

async function resumenNacional() {
  const desde = bogota(new Date(Date.now() - DIAS * 864e5));
  let rows = [], off = 0;
  while (off < 60000) {
    const q = new URLSearchParams({ '$select': CAMPOS.join(','), '$where': `fecha_de_firma >= '${desde}T00:00:00'`, '$order': 'id_contrato', '$limit': '20000', '$offset': String(off) });
    const part = await getJSON(`${API}?${q}`);
    rows = rows.concat(part);
    if (part.length < 20000) break;
    off += 20000;
  }
  const total = rows.length;
  const valor = rows.reduce((s, r) => s + num(r.valor_del_contrato), 0);
  const directa = rows.filter(r => /directa/i.test(r.modalidad_de_contratacion || '')).length;
  const dep = {};
  rows.forEach(r => { const d = r.departamento || 'No definido'; (dep[d] ||= { d, n: 0, v: 0 }); dep[d].n++; dep[d].v += num(r.valor_del_contrato); });
  const top = rows.filter(r => num(r.valor_del_contrato) < 5e13)   // descarta errores de digitación absurdos
    .sort((a, b) => num(b.valor_del_contrato) - num(a.valor_del_contrato)).slice(0, 15);
  return {
    actualizado: new Date().toISOString(), desde, dias: DIAS, total, valor,
    pctDirecta: total ? Math.round(directa / total * 100) : 0,
    deptos: Object.values(dep).sort((a, b) => b.v - a.v).slice(0, 8),
    top
  };
}

async function municipios() {
  const desde = bogota(new Date(Date.now() - 365 * 864e5));
  const q = new URLSearchParams({ '$select': 'departamento,ciudad,count(id_contrato) as n', '$group': 'departamento,ciudad', '$where': `fecha_de_firma >= '${desde}T00:00:00'`, '$limit': '5000' });
  const rows = await getJSON(`${API}?${q}`);
  return rows.filter(r => r.departamento && r.ciudad && !/no definido/i.test(r.ciudad) && num(r.n) >= 3)
    .map(r => ({ d: r.departamento, c: r.ciudad, n: num(r.n) }))
    .sort((a, b) => a.d.localeCompare(b.d, 'es') || a.c.localeCompare(b.c, 'es'));
}

async function noticias() {
  const consultas = ['veeduría ciudadana contrato', 'Contraloría hallazgo fiscal contrato', 'Procuraduría contrato irregularidades', 'sobrecosto contrato alcaldía Colombia', 'SECOP contratación pública'];
  const vistos = new Set(), items = [];
  for (const q of consultas) {
    try {
      const r = await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(q + ' when:7d')}&hl=es-419&gl=CO&ceid=CO:es-419`);
      const xml = await r.text();
      for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
        const g = tag => (m[1].match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)) || [])[1] || '';
        const clean = s => s.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
        const titulo = clean(g('title')), link = clean(g('link'));
        const key = titulo.toLowerCase().slice(0, 70);
        if (!titulo || vistos.has(key)) continue;
        vistos.add(key);
        const f = new Date(clean(g('pubDate')));
        items.push({ titulo, link, fuente: clean(g('source')), fecha: isNaN(f) ? new Date().toISOString() : f.toISOString() });
      }
    } catch (e) { console.warn('Noticias:', e.message); }
  }
  return items.sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 20);
}

await mkdir('data', { recursive: true });
const t = new Date().toISOString();
const log = [];
try { const h = await resumenNacional(); await writeFile('data/hoy.json', JSON.stringify(h)); log.push(`${h.total} contratos en ${DIAS} días`); }
catch (e) { console.warn('Resumen nacional falló:', e.message); }
// la lista de municipios cambia poco: se renueva una vez al día
const prevMeta = await readJSON('data/meta.json', {});
if (!prevMeta.municipios || bogota(new Date(prevMeta.municipios)) !== bogota()) {
  try { const m = await municipios(); if (m.length > 100) { await writeFile('data/municipios.json', JSON.stringify(m)); prevMeta.municipios = t; log.push(`${m.length} municipios`); } }
  catch (e) { console.warn('Municipios falló:', e.message); }
}
const n = await noticias();
if (n.length) { await writeFile('data/noticias.json', JSON.stringify(n, null, 1)); log.push(`${n.length} noticias`); }
await writeFile('data/meta.json', JSON.stringify({ actualizado: t, municipios: prevMeta.municipios || null }, null, 1));
console.log('Listo:', log.join(', '));
