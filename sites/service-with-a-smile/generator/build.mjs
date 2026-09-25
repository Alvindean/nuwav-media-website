#!/usr/bin/env node
// Local SEO page generator for Service With A Smile.
//
//   node generator/build.mjs            build live pages into the site folder
//   node generator/build.mjs --preview  also build draft pages into generator/.preview (noindex)
//
// Content lives in generator/content/*.json. Pages are only published when their
// content file has "status": "live". The build fails if a quality check fails.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GEN = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(GEN, '..');
const PREVIEW = process.argv.includes('--preview');
const OUT = PREVIEW ? path.join(GEN, '.preview') : SITE;

const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const readDir = (d) => fs.readdirSync(path.join(GEN, d)).filter((f) => f.endsWith('.json')).sort()
  .map((f) => readJSON(path.join(GEN, d, f)));

const cfg = readJSON(path.join(GEN, 'site.config.json'));
const services = readJSON(path.join(GEN, 'content/services.json'));
const states = Object.fromEntries(readDir('content/states').map((s) => [s.slug, s]));
const allCities = readDir('content/cities');
const allServicePages = readDir('content/service-pages');

const isPublished = (x) => x.status === 'live' || PREVIEW;
const cities = allCities.filter(isPublished);
const cityBySlug = Object.fromEntries(allCities.map((c) => [c.slug, c]));
const servicePages = allServicePages.filter((p) => isPublished(p) && isPublished(cityBySlug[p.city]));

const P = cfg.PRIMARY_SERVICE;
const ST = states[cfg.STATE.slug];
const BASE = cfg.SITE_URL.replace(/\/$/, '');

// ---------- URL helpers ----------
const url = {
  root: () => `/${P.slug}/`,
  state: () => `/${P.slug}/${ST.slug}/`,
  city: (c) => `/${P.slug}/${ST.slug}/${c.slug}/`,
  servicePage: (sp) => `/${sp.service}-in-${sp.city}-${ST.abbr.toLowerCase()}/`,
};
const abs = (u) => BASE + u;

// ---------- tiny HTML helpers ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const paras = (arr) => arr.map((p) => `<p>${esc(p)}</p>`).join('');
const cards = (arr) => `<div class="grid">${arr.map((c) => `<div class="card"><h3>${esc(c.h)}</h3><p>${esc(c.p)}</p></div>`).join('')}</div>`;
const phoneIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
const callBtn = (cls = 'btn-dark', label = `Call ${cfg.PRIMARY_PHONE.display}`) =>
  `<a class="btn ${cls}" href="tel:${cfg.PRIMARY_PHONE.tel}">${phoneIcon}${esc(label)}</a>`;
const logo = '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d34fbf"/><stop offset=".5" stop-color="#9a86d8"/><stop offset="1" stop-color="#46c9d3"/></linearGradient></defs><circle cx="32" cy="32" r="30" fill="url(#lg)"/><path d="M18 36c4 8 24 8 28 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="23" cy="24" r="3.5" fill="#fff"/><circle cx="41" cy="24" r="3.5" fill="#fff"/></svg>';

const faqBlock = (faqs) => `<div class="faq">${faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>`;
const mapEmbed = (q, name) => `<iframe class="map" title="Map of ${esc(name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(q)}&amp;output=embed"></iframe>`;

const imgFor = (key, cls = 'svc-photo', eager = false) => {
  const im = services[key] && services[key].image;
  if (!im || !fs.existsSync(path.join(SITE, 'assets/img', im.file))) return '';
  return `<img class="${cls}" src="/assets/img/${im.file}" alt="${esc(im.alt)}" width="1200" height="800"${eager ? '' : ' loading="lazy"'} decoding="async">`;
};

const processSteps = (place) => [
  { h: 'Call Linda', p: `Tell her the date, the place in ${place} and roughly how many guests, or what your home needs. She answers her own phone.` },
  { h: 'Get a clear plan and price', p: 'Linda walks through what\'s included (setup, cleanup, dishes, trash, the venue\'s checklist) and gives you a price before anything is booked.' },
  { h: 'We show up and do the work', p: 'On the day, we arrive at the agreed time, set up or clean to plan, and check in with you as we go.' },
  { h: 'Final walkthrough', p: 'Before we leave, we walk the space with you or your venue contact so nothing is missed.' },
];
const processBlock = (place) => `<ol class="steps">${processSteps(place).map((s) => `<li><h3>${esc(s.h)}</h3><p>${esc(s.p)}</p></li>`).join('')}</ol>`;

const ctaBand = (place) => `<div class="cta-band"><div><h2>Talk to Linda about your ${esc(place)} event</h2><p>Calm, friendly and no pressure. Just a straight answer about your date.</p></div>${callBtn('btn-light', 'Speak With Linda Today')}</div>`;

// ---------- schema ----------
const businessNode = () => ({
  '@type': 'HouseCleaningService',
  '@id': `${BASE}/#business`,
  name: cfg.BUSINESS_NAME,
  url: `${BASE}/`,
  image: abs(cfg.OWNER.photo),
  telephone: cfg.PRIMARY_PHONE.tel,
  email: cfg.EMAIL,
  founder: { '@type': 'Person', name: cfg.OWNER.name, jobTitle: cfg.OWNER.title },
  address: { '@type': 'PostalAddress', addressLocality: cfg.ADDRESS.locality, addressRegion: cfg.ADDRESS.region, postalCode: cfg.ADDRESS.postalCode, addressCountry: cfg.ADDRESS.country },
  areaServed: cities.map((c) => ({ '@type': 'City', name: `${c.name}, ${ST.abbr}` })),
});
const breadcrumbNode = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: abs(t.url) })),
});
const serviceNode = (name, area, pageUrl) => ({
  '@type': 'Service', name, serviceType: name, url: abs(pageUrl),
  provider: { '@id': `${BASE}/#business` },
  areaServed: area,
});
const faqNode = (faqs) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

// ---------- shared header (also written into the homepage) ----------
const NAV = [
  { key: 'services', label: 'Services', href: url.root() },
  { key: 'areas', label: 'Service Areas', href: url.state() },
  { key: 'about', label: 'About Linda', href: '/#about' },
  { key: 'how', label: 'How It Works', href: '/#how' },
  { key: 'contact', label: 'Contact', href: '/#contact' },
];
function headerHTML(active) {
  return `<header class="site-header"><div class="hdr">
  <a class="hdr-logo" href="/" aria-label="${esc(cfg.BUSINESS_NAME)} home">${logo}<span class="hdr-name">${esc(cfg.BUSINESS_NAME)}<span>${esc(cfg.ADDRESS.locality)}, ${esc(cfg.ADDRESS.region)}</span></span></a>
  <nav aria-label="Main"><ul class="hdr-links">${NAV.map((n) => `<li><a href="${n.href}"${n.key === active ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('')}</ul></nav>
  <a class="hdr-call" href="tel:${cfg.PRIMARY_PHONE.tel}">${phoneIcon}${esc(cfg.PRIMARY_PHONE.display)}</a>
  <details class="hdr-menu"><summary aria-label="Open menu"><span aria-hidden="true"></span>Menu</summary>
    <ul>${NAV.map((n) => `<li><a href="${n.href}"${n.key === active ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('')}<li><a class="hdr-menu-call" href="tel:${cfg.PRIMARY_PHONE.tel}">Call ${esc(cfg.PRIMARY_PHONE.display)}</a></li></ul>
  </details>
</div></header>`;
}

// ---------- page shell ----------
function page({ urlPath, title, description, trail, hero, jump, body, schema, noindex, activeNav }) {
  const crumbs = `<nav class="crumbs wrap" aria-label="Breadcrumb"><ol>${trail.map((t, i) => i === trail.length - 1
    ? `<li><span aria-current="page">${esc(t.name)}</span></li>`
    : `<li><a href="${t.url}">${esc(t.name)}</a></li>`).join('')}</ol></nav>`;
  const graph = { '@context': 'https://schema.org', '@graph': [businessNode(), breadcrumbNode(trail), ...schema] };
  const liveCities = cities.map((c) => `<li><a href="${url.city(c)}">${esc(c.name)}</a></li>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${abs(urlPath)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">\n' : ''}<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(urlPath)}">
<meta property="og:image" content="${abs(cfg.OWNER.photo)}">
<meta name="theme-color" content="#b44fc8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Nunito:wght@400;700;800&family=Lilita+One&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/header.css">
<link rel="stylesheet" href="/assets/site.css">
<script type="application/ld+json">${JSON.stringify(graph)}</script>
</head>
<body>
${headerHTML(activeNav)}
${crumbs}
<main>
<section class="hero"><div class="wrap">
  <div>
    <h1>${esc(hero.h1)}</h1>
    <p class="sub">${esc(hero.sub)}</p>
    <div class="hero-cta">${callBtn('btn-dark', 'Call Now for a Clear Quote')}<small>Talk directly with the owner, Linda</small></div>
    <ul class="badges"><li>${esc(cfg.YEARS_EXPERIENCE)} years experience</li><li>Owner-led</li><li>Based in ${esc(cfg.ADDRESS.neighborhood)}, ${esc(cfg.ADDRESS.locality)}</li></ul>
  </div>
  <figure class="owner-card"><img src="${cfg.OWNER.photo}" alt="${esc(cfg.OWNER.name)}, ${esc(cfg.OWNER.title)}" width="492" height="696"><strong>${esc(cfg.OWNER.name)}</strong><span>${esc(cfg.OWNER.title)}</span></figure>
</div></section>
<nav class="jump" aria-label="On this page"><ul class="wrap">${jump.map(([id, label]) => `<li><a href="#${id}">${esc(label)}</a></li>`).join('')}</ul></nav>
${body}
</main>
<footer><div class="wrap cols">
  <div><h3>${esc(cfg.BUSINESS_NAME)}</h3><p>${esc(cfg.OWNER.name)}, ${esc(cfg.OWNER.title)}<br>${esc(cfg.ADDRESS.neighborhood)}, ${esc(cfg.ADDRESS.locality)}, ${esc(cfg.ADDRESS.region)} ${esc(cfg.ADDRESS.postalCode)}</p><p><a href="tel:${cfg.PRIMARY_PHONE.tel}">${esc(cfg.PRIMARY_PHONE.display)}</a> · <a href="mailto:${cfg.EMAIL}">${esc(cfg.EMAIL)}</a></p></div>
  <div><h3>Service areas</h3><ul>${liveCities}</ul></div>
  <div><h3>Services</h3><ul><li><a href="${url.root()}">${esc(P.name)}</a></li>${servicePages.map((sp) => `<li><a href="${url.servicePage(sp)}">${esc(services[sp.service].name)} in ${esc(cityBySlug[sp.city].name)}</a></li>`).join('')}</ul></div>
</div></footer>
<div class="callbar">${callBtn('btn-dark', 'Call Now')}<a class="btn btn-light" href="mailto:${cfg.EMAIL}">Email Linda</a></div>
</body>
</html>
`;
}

// ---------- page builders ----------
const pages = [];
const add = (p) => pages.push(p);
const home = { name: 'Home', url: '/' };
const rootCrumb = { name: P.name, url: url.root() };
const stateCrumb = { name: ST.name, url: url.state() };

// 1. Root authority page
{
  const s = services[P.slug];
  add({
    urlPath: url.root(), kind: 'root', activeNav: 'services',
    title: `${s.title} | ${cfg.BUSINESS_NAME}`,
    description: s.metaDescription,
    trail: [home, rootCrumb],
    hero: { h1: s.title, sub: s.lead },
    jump: [['what', 'What we do'], ['who', 'Who we help'], ['why', 'Why families trust us'], ['areas', 'Service areas']],
    schema: [serviceNode(s.name, { '@type': 'State', name: ST.name }, url.root())],
    body: `
<section class="block" id="what"><div class="wrap"><p class="eyebrow">What we do</p><h2>Setup, cleanup and housekeeping, done by the owner</h2><div class="lead">${paras(s.whatWeDo)}</div>
<div class="grid">${cfg.SECONDARY_SERVICES.map((k) => {
  const x = services[k];
  const sp = servicePages.find((p) => p.service === k && p.city === cfg.HOME_CITY);
  const inner = `${imgFor(k, 'card-photo')}<h3>${esc(x.name)}${sp ? ' →' : ''}</h3><p>${esc(x.blurb)}</p>`;
  return sp ? `<a class="card" href="${url.servicePage(sp)}">${inner}</a>` : `<div class="card">${inner}</div>`;
}).join('')}</div></div></section>
<section class="block alt" id="who"><div class="wrap"><p class="eyebrow">Who we help</p><h2>Who calls us</h2>${cards(s.whoWeHelp)}</div></section>
<section class="block" id="why"><div class="wrap"><p class="eyebrow">Why families trust us</p><h2>Experience you can talk to</h2><ul class="checks">${s.whyTrusted.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>${ctaBand(cfg.ADDRESS.locality)}</div></section>
<section class="block alt" id="areas"><div class="wrap"><p class="eyebrow">Service areas</p><h2>Where we work</h2><p class="lead">We serve the ${esc(ST.name)} communities below. Pick yours to see local details, common questions and how booking works there.</p>
<div class="grid"><a class="card" href="${url.state()}"><h3>${esc(ST.name)} →</h3><p>All the cities we serve in ${esc(ST.name)}.</p></a>${cities.map((c) => `<a class="card" href="${url.city(c)}"><h3>${esc(c.name)}, ${esc(ST.abbr)} →</h3><p>${esc(c.county)}</p></a>`).join('')}</div></div></section>`,
  });
}

// 2. State hub
{
  add({
    urlPath: url.state(), kind: 'state', activeNav: 'areas',
    title: `${P.name} in ${ST.name} | ${cfg.BUSINESS_NAME}`,
    description: ST.metaDescription,
    trail: [home, rootCrumb, stateCrumb],
    hero: { h1: `${P.name} in ${ST.name}`, sub: `Owner-led event setup, cleanup and housekeeping across the Sacramento region, from our home base in ${cfg.ADDRESS.neighborhood}.` },
    jump: [['overview', 'Overview'], ['cities', 'Cities we serve'], ['hire', 'Before you hire'], ['map', 'Service area map']],
    schema: [serviceNode(P.name, { '@type': 'State', name: ST.name }, url.state())],
    body: `
<section class="block" id="overview"><div class="wrap"><p class="eyebrow">Overview</p><h2>Event help across the Sacramento region</h2><div class="lead">${paras(ST.overview)}</div></div></section>
<section class="block alt" id="cities"><div class="wrap"><p class="eyebrow">Cities we serve</p><h2>Choose your city</h2>
<div class="grid">${cities.map((c) => `<a class="card" href="${url.city(c)}"><h3>${esc(c.name)} →</h3><p>${esc(c.county)}. ${esc(c.sub.split('. ')[0])}.</p></a>`).join('')}</div>
<p class="muted" style="margin-top:1.2rem">${esc(ST.regionNote)}</p>${ctaBand(ST.name)}</div></section>
<section class="block" id="hire"><div class="wrap"><p class="eyebrow">Before you hire anyone</p><h2>Three things worth checking</h2>${cards(ST.beforeYouHire)}</div></section>
<section class="block alt" id="map"><div class="wrap"><p class="eyebrow">Service area map</p><h2>Based in ${esc(cfg.ADDRESS.neighborhood)}, ${esc(cfg.ADDRESS.locality)}</h2>${mapEmbed(`${cfg.ADDRESS.locality}, ${ST.abbr}`, 'the Sacramento region')}</div></section>`,
  });
}

// 3. City money pages
for (const c of cities) {
  const nearby = (c.nearby || []).map((s) => cityBySlug[s]).filter((n) => n && isPublished(n));
  const localServices = servicePages.filter((sp) => sp.city === c.slug);
  add({
    urlPath: url.city(c), kind: 'city', city: c, activeNav: 'areas',
    title: `${P.name} in ${c.name}, ${ST.abbr} | ${cfg.BUSINESS_NAME}`,
    description: c.metaDescription,
    trail: [home, rootCrumb, stateCrumb, { name: c.name, url: url.city(c) }],
    hero: { h1: `${P.name} in ${c.name}, ${ST.abbr}`, sub: c.sub },
    jump: [['local', `${c.name} events`], ['help', 'How we help'], ['process', 'How it works'], ['faq', 'FAQs'], ['area', 'Service area']],
    schema: [serviceNode(`${P.name} in ${c.name}`, { '@type': 'City', name: `${c.name}, ${ST.abbr}` }, url.city(c)), faqNode(c.faqs)],
    noindex: c.status !== 'live',
    body: `
<section class="block" id="local"><div class="wrap"><p class="eyebrow">${esc(c.name)}, ${esc(c.county)}</p><h2>Hosting in ${esc(c.name)}: what to plan for</h2><div class="lead">${paras(c.localContext)}</div>${cards(c.localProblems)}</div></section>
<section class="block alt" id="help"><div class="wrap"><p class="eyebrow">Real jobs, real help</p><h2>How we help ${esc(c.name)} hosts</h2>${cards(c.scenarios)}<p class="lead" style="margin-top:1.4rem">${esc(c.demand)}</p>
${localServices.length ? `<div class="grid">${localServices.map((sp) => `<a class="card" href="${url.servicePage(sp)}">${imgFor(sp.service, 'card-photo')}<h3>${esc(services[sp.service].name)} in ${esc(c.name)} →</h3><p>${esc(services[sp.service].blurb)}</p></a>`).join('')}</div>` : ''}</div></section>
<section class="block" id="process"><div class="wrap"><p class="eyebrow">How it works</p><h2>From first call to final walkthrough</h2>${processBlock(c.name)}${ctaBand(c.name)}</div></section>
<section class="block alt" id="faq"><div class="wrap"><p class="eyebrow">Questions</p><h2>${esc(c.name)} FAQs</h2>${faqBlock(c.faqs)}</div></section>
<section class="block" id="area"><div class="wrap"><p class="eyebrow">Service area</p><h2>Where we work in and around ${esc(c.name)}</h2><ul class="chips">${c.neighborhoods.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>${mapEmbed(c.map, c.name)}
${nearby.length ? `<h3 style="margin-top:1.6rem">Nearby cities we serve</h3><div class="grid">${nearby.map((n) => `<a class="card" href="${url.city(n)}"><h3>${esc(n.name)} →</h3><p>${esc(n.county)}</p></a>`).join('')}</div>` : ''}</div></section>`,
  });
}

// 4. Service-in-city pages
for (const sp of servicePages) {
  const c = cityBySlug[sp.city];
  const svc = services[sp.service];
  add({
    urlPath: url.servicePage(sp), kind: 'service', city: c, activeNav: 'services',
    title: `${sp.h1.replace(`, ${ST.abbr}`, '')} | ${cfg.BUSINESS_NAME}`,
    description: sp.metaDescription,
    trail: [home, rootCrumb, stateCrumb, { name: c.name, url: url.city(c) }, { name: svc.name, url: url.servicePage(sp) }],
    hero: { h1: sp.h1, sub: sp.sub },
    jump: [['about', 'About this service'], ['included', 'What\'s included'], ['examples', 'Examples'], ['process', 'How it works'], ['faq', 'FAQs']],
    schema: [serviceNode(`${svc.name} in ${c.name}`, { '@type': 'City', name: `${c.name}, ${ST.abbr}` }, url.servicePage(sp)), faqNode(sp.faqs)],
    noindex: sp.status !== 'live' || c.status !== 'live',
    body: `
<section class="block" id="about"><div class="wrap"><p class="eyebrow">${esc(svc.name)} · ${esc(c.name)}</p><h2>${esc(svc.name)} from someone who's done it for ${esc(cfg.YEARS_EXPERIENCE)} years</h2>${imgFor(sp.service)}<div class="lead">${paras(sp.intro)}</div></div></section>
<section class="block alt" id="included"><div class="wrap"><p class="eyebrow">What's included</p><h2>What we can take off your plate</h2><ul class="checks">${sp.included.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div></section>
<section class="block" id="examples"><div class="wrap"><p class="eyebrow">Examples</p><h2>Typical ${esc(svc.name.toLowerCase())} jobs in ${esc(c.name)}</h2>${cards(sp.scenarios)}</div></section>
<section class="block alt" id="process"><div class="wrap"><p class="eyebrow">How it works</p><h2>Booking is one phone call</h2>${processBlock(c.name)}${ctaBand(c.name)}</div></section>
<section class="block" id="faq"><div class="wrap"><p class="eyebrow">Questions</p><h2>${esc(svc.name)} FAQs</h2>${faqBlock(sp.faqs)}
<p class="muted" style="margin-top:1.4rem">More about working in ${esc(c.name)}: <a href="${url.city(c)}">${esc(P.name)} in ${esc(c.name)}</a>.</p></div></section>
<section class="block alt" id="more"><div class="wrap"><p class="eyebrow">Other services</p><h2>More ways we help in ${esc(c.name)}</h2><div class="grid">${servicePages.filter((o) => o.city === c.slug && o !== sp).map((o) => `<a class="card" href="${url.servicePage(o)}">${imgFor(o.service, 'card-photo')}<h3>${esc(services[o.service].name)} →</h3><p>${esc(services[o.service].blurb)}</p></a>`).join('')}</div></div></section>`,
  });
}

// ---------- quality gate ----------
const errors = [];
const textOf = (html) => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
const shingles = (t, n = 5) => { const w = t.toLowerCase().split(/\W+/).filter(Boolean); const s = new Set(); for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(' ')); return s; };
const jaccard = (a, b) => { let inter = 0; for (const x of a) if (b.has(x)) inter++; return inter / (a.size + b.size - inter || 1); };

for (const p of pages) {
  const html = page(p);
  p.html = html;
  p.bodyText = textOf(p.body);
  const words = p.bodyText.split(' ').length;
  if (p.title.length > 70) errors.push(`${p.urlPath}: title is ${p.title.length} chars (max 70)`);
  if (p.description.length < 70 || p.description.length > 165) errors.push(`${p.urlPath}: meta description is ${p.description.length} chars (70–165)`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) errors.push(`${p.urlPath}: must have exactly one <h1>`);
  const minWords = { root: 300, state: 250, city: 700, service: 450 }[p.kind];
  if (words < minWords) errors.push(`${p.urlPath}: only ${words} words of body content (min ${minWords}), which is thin`);
  if (p.kind === 'city' && p.city.faqs.length < 3) errors.push(`${p.urlPath}: needs at least 3 local FAQs`);
}
// Doorway / duplication check: every city page (drafts included) must be substantially unique.
const cityChecks = [...pages.filter((p) => p.kind === 'city')];
if (!PREVIEW) {
  // also check drafts even though they aren't published
  for (const c of allCities.filter((x) => x.status !== 'live')) {
    cityChecks.push({ urlPath: `(draft) ${c.slug}`, bodyText: textOf(paras(c.localContext) + cards(c.localProblems) + cards(c.scenarios) + faqBlock(c.faqs) + c.demand) });
  }
}
for (let i = 0; i < cityChecks.length; i++) for (let j = i + 1; j < cityChecks.length; j++) {
  const sim = jaccard(shingles(cityChecks[i].bodyText), shingles(cityChecks[j].bodyText));
  // The shared "How it works" steps are intentional; 0.25 leaves room for them but catches name-swapped copies.
  if (sim > 0.25) errors.push(`${cityChecks[i].urlPath} vs ${cityChecks[j].urlPath}: ${(sim * 100).toFixed(0)}% overlap, so rewrite one to be locally specific`);
}
if (errors.length) { console.error('Quality check failed:\n - ' + errors.join('\n - ')); process.exit(1); }

// ---------- write ----------
const manifestPath = path.join(OUT, '.generated.json');
const oldTopDirs = new Set();
if (fs.existsSync(manifestPath)) {
  for (const rel of readJSON(manifestPath)) {
    fs.rmSync(path.join(OUT, rel), { force: true });
    if (rel.includes(path.sep)) oldTopDirs.add(rel.split(path.sep).filter(Boolean)[0]);
  }
}
const written = [];
const write = (rel, content) => { rel = rel.replace(/^[\/]+/, ''); const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); written.push(rel); };

for (const p of pages) write(path.join(p.urlPath, 'index.html'), p.html);

const indexable = ['/', ...pages.filter((p) => !p.noindex).map((p) => p.urlPath)];
const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((u) => `  <url><loc>${abs(u)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`);
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(manifestPath, JSON.stringify(written, null, 2) + '\n');

// clean up empty dirs left from removed pages
const prune = (d) => { if (!fs.existsSync(d) || !fs.statSync(d).isDirectory()) return; for (const e of fs.readdirSync(d)) prune(path.join(d, e)); if (d !== OUT && fs.readdirSync(d).length === 0) fs.rmdirSync(d); };
for (const d of oldTopDirs) prune(path.join(OUT, d));


// Keep the homepage header identical to every other page.
{
  const homePath = path.join(SITE, 'index.html');
  const home = fs.readFileSync(homePath, 'utf8');
  const START = '<!-- site-header:start -->', END = '<!-- site-header:end -->';
  if (!home.includes(START) || !home.includes(END)) { console.error('index.html is missing the site-header markers'); process.exit(1); }
  const next = home.slice(0, home.indexOf(START) + START.length) + '\n  ' + headerHTML(null) + '\n  ' + home.slice(home.indexOf(END));
  if (!PREVIEW && next !== home) fs.writeFileSync(homePath, next);
}

const drafts = allCities.filter((c) => c.status !== 'live');
console.log(`Built ${pages.length} pages${PREVIEW ? ' (preview, drafts included, noindex)' : ''} into ${path.relative(process.cwd(), OUT) || '.'}`);
for (const p of pages) console.log(`  ${p.noindex ? '[draft] ' : ''}${p.urlPath}  (${p.bodyText.split(' ').length} words)`);
if (!PREVIEW && drafts.length) console.log(`Drafts not published: ${drafts.map((c) => c.name).join(', ')}. Set "status": "live" once confirmed.`);
