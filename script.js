'use strict';

const { stops, routes, sources } = TransitData;
const { findStops, resolveStop, createPlanner } = TransitPlanner;
const findTrips = createPlanner(routes);
const $ = (id) => document.getElementById(id);

const copy = {
  en: {
    brandSub: 'CHATTOGRAM BUS GUIDE', navPlan: 'Trip planner', navRoutes: 'Bus routes',
    city: 'CHATTOGRAM, BANGLADESH', title: 'Catch the right <em>bus.</em>',
    subtitle: 'Find where to board, where to get off, and where to change buses across Chattogram.',
    planTitle: 'Plan your trip', from: 'From', to: 'To', fromPlaceholder: 'Choose a starting stop',
    toPlaceholder: 'Choose a destination', swap: 'Swap stops', search: 'Find buses', examples: 'Try a trip',
    mapTitle: 'City route map', mapCaption: 'Schematic · positions are approximate', showAll: 'All routes',
    journeys: 'Trip options', initial: 'Choose two stops to see direct buses and trips with one change.',
    invalid: 'Choose a listed stop or type its full name.', same: 'Choose two different stops.',
    noResults: 'This guide has no trip with up to one change between these stops.',
    coverage: (routes, stops) => `${routes} routes · ${stops} landmarks`, share: 'Copy trip link',
    direct: 'Direct bus', change: (name) => `Change at ${name}`, route: (num) => `Route ${num}`,
    savedTrips: 'Saved trips', saveTrip: 'Save trip', removeTrip: 'Remove saved trip',
    saved: 'Trip saved on this device.', removed: 'Trip removed from this device.',
    saveError: 'This browser could not save the trip.', sourceDate: 'Route source',
    saveLimit: 'You have six saved trips. Remove one to save another.',
    toward: (num, name, kind) => `${kind === 'minibus' ? 'Minibus' : 'Bus'} ${num} toward ${name}`,
    board: (name) => `Board at ${name}`, exit: (name) => `Get off at ${name}`,
    stops: 'Landmarks along this leg', tripNote: 'Confirm service and boarding side at the stop.',
    routeFocus: 'Show on map', historical: 'Published route · current service unconfirmed',
    reported: 'Documented in September 2026 · current service unconfirmed',
    sourceTitle: 'Before you board', fareSource: 'Government fare notice ↗', report: 'Suggest a correction ↗',
    sourceBody: 'Confirm the direction, boarding point, and fare with the conductor. Routes come from published sources and are awaiting field verification. Live arrivals and stop-to-stop fares are unavailable.',
    project: 'Project on GitHub ↗', copied: 'Trip link copied.', copyFallback: 'Copy this trip link',
    river: 'KARNAPHULI RIVER',
  },
  bn: {
    brandSub: 'চট্টগ্রামের বাস গাইড', navPlan: 'যাত্রা পরিকল্পনা', navRoutes: 'বাস রুট',
    city: 'চট্টগ্রাম, বাংলাদেশ', title: 'খুঁজে নিন <em>সঠিক বাস।</em>',
    subtitle: 'চট্টগ্রামে কোথা থেকে বাসে উঠবেন, কোথায় নামবেন আর কোথায় বাস বদলাবেন, জেনে নিন।',
    planTitle: 'যাত্রার পরিকল্পনা', from: 'কোথা থেকে', to: 'কোথায়', fromPlaceholder: 'ওঠার স্টপ বেছে নিন',
    toPlaceholder: 'গন্তব্যের স্টপ বেছে নিন', swap: 'স্টপ অদলবদল করুন', search: 'বাস খুঁজুন', examples: 'উদাহরণ যাত্রা',
    mapTitle: 'শহরের রুট মানচিত্র', mapCaption: 'সরল মানচিত্র · অবস্থান আনুমানিক', showAll: 'সব রুট',
    journeys: 'যাত্রার বিকল্প', initial: 'সরাসরি বা একবার বাস বদলে যাওয়ার পথ দেখতে দুটি স্টপ বেছে নিন।',
    invalid: 'তালিকা থেকে স্টপ বাছুন বা পুরো নাম লিখুন।', same: 'দুটি আলাদা স্টপ বেছে নিন।',
    noResults: 'এই দুই স্টপের মধ্যে সরাসরি বা একবার বাস বদলে যাওয়ার পথ এই গাইডে পাওয়া যায়নি।',
    coverage: (routes, stops) => `${routes}টি রুট · ${stops}টি পরিচিত জায়গা`, share: 'যাত্রার লিংক কপি',
    direct: 'সরাসরি বাস', change: (name) => `${name} স্টপে বাস বদলান`, route: (num) => `${num} নম্বর রুট`,
    savedTrips: 'সেভ করা যাত্রা', saveTrip: 'যাত্রা সেভ করুন', removeTrip: 'সেভ করা যাত্রা সরান',
    saved: 'এই ডিভাইসে যাত্রাটি সেভ হয়েছে।', removed: 'এই ডিভাইস থেকে যাত্রাটি সরানো হয়েছে।',
    saveError: 'এই ব্রাউজারে যাত্রাটি সেভ করা যায়নি।', sourceDate: 'রুটের তথ্যসূত্র',
    saveLimit: 'ছয়টি যাত্রা সেভ করা আছে। নতুন যাত্রা সেভ করতে একটি সরান।',
    toward: (num, name, kind) => `${name} অভিমুখে ${num} নম্বর ${kind === 'minibus' ? 'মিনিবাস' : 'বাস'}`,
    board: (name) => `${name} থেকে উঠুন`, exit: (name) => `${name} স্টপে নামুন`,
    stops: 'এই পথে পরিচিত জায়গা', tripNote: 'বাস চলছে কি না এবং রাস্তার কোন পাশ থেকে উঠবেন, স্টপে জেনে নিন।',
    routeFocus: 'মানচিত্রে দেখুন', historical: 'প্রকাশিত রুট · এখন চলছে কি না নিশ্চিত নয়',
    reported: 'সেপ্টেম্বর ২০২৬-এ প্রকাশিত · এখন চলছে কি না নিশ্চিত নয়',
    sourceTitle: 'বাসে ওঠার আগে', fareSource: 'সরকারি ভাড়ার প্রজ্ঞাপন ↗', report: 'সংশোধনের পরামর্শ দিন ↗',
    sourceBody: 'বাসের দিক, ওঠার জায়গা ও ভাড়া কন্ডাক্টরের কাছে জেনে নিন। রুটগুলো প্রকাশিত তথ্য থেকে নেওয়া হয়েছে। সরেজমিন যাচাই, বাস আসার লাইভ তথ্য এবং স্টপভিত্তিক ভাড়া এখনো পাওয়া যায়নি।',
    project: 'GitHub-এ প্রকল্প ↗', copied: 'যাত্রার লিংক কপি হয়েছে।', copyFallback: 'যাত্রার লিংকটি কপি করুন',
    river: 'কর্ণফুলী নদী',
  },
};

const paths = {
  bus: '<rect x="5" y="3" width="14" height="16" rx="3"/><path d="M5 11h14M8 19v2m8-2v2M8 15h1m6 0h1"/>',
  pin: '<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  swap: '<path d="M8 20V4L4 8m4-4 4 4m4-4v16l4-4m-4 4-4-4"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  arrow: '<path d="M4 12h15m-5-5 5 5-5 5"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>',
  share: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8v.1"/>',
};

function preference(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
    return true;
  } catch {
    return null;
  }
}

const params = new URLSearchParams(location.search);
const storedLanguage = preference('chattala-language');
let language = [params.get('lang'), storedLanguage].find((value) => value === 'en' || value === 'bn')
  || (navigator.language.startsWith('bn') ? 'bn' : 'en');
let search = null;
let mapSelection = null;
const savedKey = 'chattala-saved-trips';
const maxSavedTrips = 6;
let savedTrips = [];
try {
  const current = preference(savedKey);
  const stored = JSON.parse(current ?? preference('bookmarkedRoutes'));
  if (Array.isArray(stored)) {
    for (const trip of stored) {
      if (savedTrips.length === maxSavedTrips) break;
      if (!trip) continue;
      const from = current === null && typeof trip.startLocation === 'string'
        ? resolveStop(stops, trip.startLocation)?.id : trip.from;
      const to = current === null && typeof trip.endLocation === 'string'
        ? resolveStop(stops, trip.endLocation)?.id : trip.to;
      if (!Object.hasOwn(stops, from) || !Object.hasOwn(stops, to) || from === to) continue;
      const pair = { from, to };
      if (!savedTrips.some((saved) => sameTrip(saved, pair))) savedTrips.push(pair);
    }
  }
} catch {
  // A damaged browser preference can be replaced on the next save.
}
const number = (value) => new Intl.NumberFormat(language).format(value);
const name = (id) => stops[id][language];
const t = (key) => copy[language][key];
const examples = [
  ['new-market', 'patenga'],
  ['oxygen', 'agrabad'],
  ['chawkbazar', 'bhatiari'],
];

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function makeCombobox(input, list) {
  let matches = [];
  let active = -1;
  function highlight(index) {
    active = index;
    [...list.children].forEach((option, i) => option.setAttribute('aria-selected', String(i === index)));
    if (index < 0) {
      input.removeAttribute('aria-activedescendant');
      return;
    }
    const option = list.children[index];
    input.setAttribute('aria-activedescendant', option.id);
    option.scrollIntoView({ block: 'nearest' });
  }

  function close() {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    highlight(-1);
  }

  function choose(stop) {
    input.value = name(stop.id);
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    $('search-error').hidden = true;
    clearTrip();
    close();
  }

  function show(query) {
    matches = findStops(stops, query, language).slice(0, 12);
    list.replaceChildren(...matches.map((stop, index) => {
      const option = element('div', '', 'suggestion');
      option.setAttribute('role', 'option');
      option.id = `${list.id}-${index}`;
      const alternate = language === 'en' ? 'bn' : 'en';
      const alternateName = element('small', stop[alternate]);
      alternateName.lang = alternate;
      option.append(element('span', name(stop.id)), alternateName);
      option.addEventListener('pointerdown', (event) => event.preventDefault());
      option.addEventListener('click', () => choose(stop));
      return option;
    }));
    list.hidden = matches.length === 0;
    input.setAttribute('aria-expanded', String(!list.hidden));
    highlight(-1);
  }

  input.addEventListener('input', () => {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    $('search-error').hidden = true;
    clearTrip();
    if (resolveStop(stops, input.value)) close();
    else show(input.value);
  });
  input.addEventListener('focus', () => {
    if (!resolveStop(stops, input.value)) show(input.value);
  });
  input.addEventListener('blur', close);
  input.addEventListener('keydown', (event) => {
    if (event.isComposing) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (list.hidden) show(input.value);
      if (!matches.length) return;
      const next = event.key === 'ArrowDown'
        ? (active + 1) % matches.length
        : (active <= 0 ? matches.length - 1 : active - 1);
      highlight(next);
    }
    if (event.key === 'Escape') close();
    if (event.key === 'Enter' && !list.hidden && active >= 0) {
      event.preventDefault();
      choose(matches[active]);
    }
  });

  return { input, close };
}

const fields = [
  makeCombobox($('current-location'), $('from-options')),
  makeCombobox($('destination'), $('to-options')),
];

function setInputs(from, to) {
  fields.forEach(({ input, close }, index) => {
    input.value = name(index === 0 ? from : to);
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    close();
  });
}

function routeBadge(route) {
  const badge = element('span', number(route.id), 'route-badge');
  badge.style.setProperty('--route', route.color);
  return badge;
}

function stopList(ids) {
  const list = element('ol', '', 'route-stops');
  list.append(...ids.map((id) => element('li', name(id))));
  return list;
}

function sourceLink(source) {
  const link = element('a', `${source.name}${source.date ? ` · ${source.date}` : ''} ↗`);
  link.href = source.url;
  link.target = '_blank';
  link.rel = 'noopener';
  return link;
}

function renderDirectory() {
  $('coverage').textContent = t('coverage')(number(routes.length), number(Object.keys(stops).length));
  $('route-directory').replaceChildren(...routes.map((route) => {
    const details = element('details', '', 'route-card');
    const title = element('summary');
    title.append(routeBadge(route), document.createTextNode(` ${name(route.stops[0])} ↔ ${name(route.stops.at(-1))}`));
    const body = element('div', '', 'route-card-body');
    const focus = element('button', t('routeFocus'), 'map-link');
    focus.type = 'button';
    focus.addEventListener('click', () => {
      selectMap({ type: 'route', route });
      $('reset-map').focus({ preventScroll: true });
      $('map-title').scrollIntoView({ block: 'start' });
    });
    body.append(element('p', t(route.reportedOn ? 'reported' : 'historical')), stopList(route.stops),
      ...route.sources.map((key) => sourceLink(sources[key])), focus);
    details.append(title, body);
    return details;
  }));
}

function renderTrips() {
  const status = $('journey-status');
  const results = $('route-results');
  results.replaceChildren();
  $('trip-feedback').textContent = '';
  updateSaveButton();
  $('share').hidden = !search?.trips.length || !['http:', 'https:'].includes(location.protocol);
  if (!search) {
    status.textContent = t('initial');
    return;
  }
  const { from, to, trips } = search;
  status.textContent = `${name(from)} → ${name(to)}${trips.length ? '' : `. ${t('noResults')}`}`;
  trips.forEach((legs, index) => {
    const details = element('details', '', 'trip');
    const summary = element('summary');
    const badges = element('span', '', 'badges');
    badges.append(...legs.map(({ route }) => routeBadge(route)));
    summary.append(badges, element('strong', legs.length === 1 ? t('direct') : t('change')(name(legs[1].stops[0]))));
    const body = element('div', '', 'trip-body');
    for (const leg of legs) {
      const step = element('div', '', 'leg');
      step.style.setProperty('--route', leg.route.color);
      const landmarks = element('details');
      landmarks.append(element('summary', t('stops')), stopList(leg.stops));
      step.append(element('h3', t('toward')(number(leg.route.id), name(leg.toward), leg.route.kind)),
        element('p', `${t('board')(name(leg.stops[0]))} · ${t('exit')(name(leg.stops.at(-1)))}`), landmarks);
      const source = sourceLink(sources[leg.route.sources[0]]);
      source.prepend(`${t('sourceDate')} · `);
      step.append(source);
      body.append(step);
    }
    body.append(element('p', t('tripNote'), 'trip-note'));
    details.append(summary, body);
    details.open = index === 0;
    details.addEventListener('toggle', () => {
      if (details.open && details.isConnected) selectMap({ type: 'trip', legs });
    });
    results.append(details);
  });
}

function showTrip(from, to, scroll = false) {
  setInputs(from, to);
  $('search-error').hidden = true;
  search = { from, to, trips: findTrips(from, to).slice(0, 5) };
  renderTrips();
  selectMap(search.trips.length ? { type: 'trip', legs: search.trips[0] } : null);
  if (scroll && matchMedia('(max-width: 650px)').matches) $('journey').scrollIntoView({ block: 'start' });
}

function clearTrip() {
  if (!search) return;
  search = null;
  renderTrips();
  selectMap(null);
}

function showError(key, invalid) {
  const error = $('search-error');
  for (const { input } of fields) {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }
  error.textContent = t(key);
  error.hidden = false;
  for (const { input } of invalid) {
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', 'search-error');
  }
  invalid[0].input.focus();
  invalid[0].close();
}

$('route-search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const chosen = fields.map(({ input }) => resolveStop(stops, input.value));
  const invalid = fields.filter((field, index) => !chosen[index]);
  if (invalid.length) {
    showError('invalid', invalid);
    return;
  }
  const [from, to] = chosen;
  if (from.id === to.id) {
    showError('same', [fields[1]]);
    return;
  }
  showTrip(from.id, to.id, true);
});

$('swap').addEventListener('click', () => {
  const [from, to] = fields.map(({ input }) => input.value);
  const start = resolveStop(stops, to);
  const end = resolveStop(stops, from);
  if (start && end && start.id !== end.id && search) {
    showTrip(start.id, end.id);
    return;
  }
  fields[0].input.value = to;
  fields[1].input.value = from;
  for (const { input } of fields) {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }
  $('search-error').hidden = true;
});

$('share').addEventListener('click', async () => {
  if (!search) return;
  const url = new URL(location.href);
  url.hash = '';
  url.search = new URLSearchParams({ from: search.from, to: search.to, lang: language });
  try {
    await navigator.clipboard.writeText(url.href);
    $('trip-feedback').textContent = t('copied');
  } catch {
    window.prompt(t('copyFallback'), url.href);
  }
});

function sameTrip(first, second) {
  return first.from === second.from && first.to === second.to;
}

function updateSaveButton() {
  const button = $('save-trip');
  const isSaved = Boolean(search && savedTrips.some((trip) => sameTrip(trip, search)));
  button.hidden = !search?.trips.length && !isSaved;
  button.setAttribute('aria-pressed', String(isSaved));
  button.textContent = t(isSaved ? 'removeTrip' : 'saveTrip');
}

function renderSavedTrips() {
  $('saved-section').hidden = savedTrips.length === 0;
  $('saved-trips').replaceChildren(...savedTrips.map(({ from, to }) => {
    const button = element('button', `${name(from)} → ${name(to)}`);
    button.type = 'button';
    button.addEventListener('click', () => showTrip(from, to, true));
    return button;
  }));
}

$('save-trip').addEventListener('click', () => {
  if (!search) return;
  const current = { from: search.from, to: search.to };
  const remaining = savedTrips.filter((trip) => !sameTrip(trip, current));
  const removing = remaining.length !== savedTrips.length;
  if (!removing && savedTrips.length >= maxSavedTrips) {
    $('trip-feedback').textContent = t('saveLimit');
    return;
  }
  const next = removing ? remaining : [current, ...remaining];
  if (!preference(savedKey, JSON.stringify(next))) {
    $('trip-feedback').textContent = t('saveError');
    return;
  }
  savedTrips = next;
  updateSaveButton();
  renderSavedTrips();
  $('trip-feedback').textContent = t(removing ? 'removed' : 'saved');
});

function translate() {
  document.documentElement.lang = language;
  $('language').textContent = language === 'en' ? 'বাংলা' : 'English';
  $('language').lang = language === 'en' ? 'bn' : 'en';
  for (const node of document.querySelectorAll('[data-text]')) {
    if (node.id === 'page-title') node.innerHTML = t(node.dataset.text);
    else node.textContent = t(node.dataset.text);
  }
  for (const node of document.querySelectorAll('[data-placeholder]')) node.placeholder = t(node.dataset.placeholder);
  for (const node of document.querySelectorAll('[data-label]')) node.setAttribute('aria-label', t(node.dataset.label));
  $('examples').replaceChildren(...examples.map(([from, to]) => {
    const chip = element('button', `${name(from)} → ${name(to)}`);
    chip.type = 'button';
    chip.addEventListener('click', () => showTrip(from, to, true));
    return chip;
  }));
  renderDirectory();
  renderSavedTrips();
  renderTrips();
  renderLegend();
  drawMap();
}

$('language').addEventListener('click', () => {
  const values = fields.map(({ input }) => resolveStop(stops, input.value));
  language = language === 'en' ? 'bn' : 'en';
  preference('chattala-language', language);
  fields.forEach(({ input, close }, i) => {
    if (values[i]) input.value = name(values[i].id);
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    close();
  });
  $('search-error').hidden = true;
  translate();
});

function renderLegend() {
  $('map-legend').replaceChildren(...routes.map((route) => {
    const button = element('button', '', 'legend-item');
    button.type = 'button';
    button.dataset.route = route.id;
    button.style.setProperty('--route', route.color);
    button.setAttribute('aria-label', t('route')(number(route.id)));
    button.append(element('span', '', 'legend-dot'), document.createTextNode(number(route.id)));
    button.addEventListener('click', () => {
      const selected = mapSelection?.type === 'route' && mapSelection.route.id === route.id;
      selectMap(selected ? null : { type: 'route', route });
    });
    return button;
  }));
  updateLegend();
}

function updateLegend() {
  const active = mapSelection?.type === 'trip' ? mapSelection.legs.map(({ route }) => route.id)
    : mapSelection?.type === 'route' ? [mapSelection.route.id] : [];
  for (const item of $('map-legend').children) {
    item.setAttribute('aria-pressed', String(active.includes(item.dataset.route)));
  }
}

function selectMap(selection) {
  mapSelection = selection;
  updateLegend();
  drawMap();
}

$('reset-map').addEventListener('click', () => selectMap(null));

function drawMap() {
  const canvas = $('map-canvas');
  const { width, height } = canvas.getBoundingClientRect();
  if (!width || !height) return;
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  const sx = width / 700;
  const sy = height / 440;
  const textScale = Math.max(.79, Math.min(1.06, sx));
  const point = ([x, y]) => [x * sx, y * sy];

  function trace(points) {
    ctx.beginPath();
    points.forEach((coord, index) => {
      if (index) ctx.lineTo(...point(coord));
      else ctx.moveTo(...point(coord));
    });
  }

  function fill(points, color) {
    trace(points);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function stroke(points, color, weight) {
    trace(points);
    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  ctx.fillStyle = '#f4efe2';
  ctx.fillRect(0, 0, width, height);
  fill([[0, 0], [85, 0], [80, 70], [75, 138], [69, 194], [47, 244], [36, 321], [19, 380], [9, 440], [0, 440]], '#d8e9e5');
  fill([[0, 440], [27, 405], [89, 394], [134, 379], [204, 362], [273, 363], [329, 373], [404, 361], [454, 327], [483, 287], [531, 262], [596, 245], [623, 197], [641, 148], [667, 119], [700, 120], [700, 156], [682, 155], [658, 191], [638, 242], [607, 270], [546, 284], [497, 308], [466, 350], [419, 391], [337, 401], [261, 392], [197, 393], [128, 417], [68, 430], [49, 440]], '#bdded9');
  fill([[88, 0], [144, 0], [133, 68], [109, 109], [79, 124]], '#e2e9d6');
  fill([[250, 45], [324, 14], [375, 29], [390, 66], [353, 96], [301, 82]], '#e2e9d6');
  fill([[510, 0], [583, 0], [567, 71], [529, 98], [503, 64]], '#e2e9d6');
  ctx.fillStyle = '#c2bcab';
  for (let x = 18; x < 700; x += 17) {
    for (let y = 12; y < 440; y += 17) ctx.fillRect(x * sx, y * sy, 1, 1);
  }

  const lines = mapSelection?.type === 'trip' ? mapSelection.legs
    : mapSelection?.type === 'route' ? [{ route: mapSelection.route, stops: mapSelection.route.stops }] : [];
  const coords = (ids) => ids.map((id) => [stops[id].x, stops[id].y]);
  routes.forEach((route) => stroke(coords(route.stops), lines.length ? '#c7c3b7' : route.color, lines.length ? 1.6 : 2.8));
  lines.forEach((line) => {
    stroke(coords(line.stops), '#fffdf9', 7);
    stroke(coords(line.stops), line.route.color, 4.2);
  });
  const activeStops = new Set(lines.flatMap((line) => line.stops));
  const endpoints = new Set(lines.flatMap((line) => [line.stops[0], line.stops.at(-1)]));
  for (const stop of Object.values(stops)) {
    const featured = endpoints.has(stop.id);
    const [x, y] = point([stop.x, stop.y]);
    ctx.beginPath();
    ctx.arc(x, y, featured ? 5 : 2.4, 0, Math.PI * 2);
    ctx.fillStyle = '#fffdf9';
    ctx.fill();
    ctx.lineWidth = featured ? 2.5 : 1.15;
    ctx.strokeStyle = !lines.length || activeStops.has(stop.id) ? '#2e5b52' : '#b8b3a6';
    ctx.stroke();
  }

  function label(id, x, y, align = 'left', text = name(id)) {
    ctx.font = `700 ${13 * textScale}px "Segoe UI", "Nirmala UI", sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#253d38';
    ctx.strokeStyle = '#f4efe2';
    ctx.lineWidth = 3;
    ctx.strokeText(text, ...point([x, y]));
    ctx.fillText(text, ...point([x, y]));
  }

  label('bhatiari', 142, 23, 'right');
  label('oxygen', 453, 84);
  label('muradpur', 464, 126);
  label('bahaddarhat', 535, 182);
  label('new-market', 329, 308);
  if (width > 500) label('agrabad', 208, 252, 'right');
  else label('agrabad', 208, 254, 'right', language === 'bn' ? 'আগ্রাবাদ' : 'Agrabad');
  label('epz', 138, 339);
  label('patenga', 49, 400);
  if (width > 500) {
    label('gec', 336, 112);
    label('kalurghat', 632, 91);
  }
  ctx.fillStyle = '#366d64';
  ctx.textAlign = 'center';
  ctx.font = `600 ${11 * textScale}px "Segoe UI", "Nirmala UI", sans-serif`;
  ctx.fillText(t('river'), ...point([461, 410]));
}

for (const node of document.querySelectorAll('[data-icon]')) {
  node.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[node.dataset.icon]}</svg>`;
}
$('fare-source').href = sources.fare.url;
$('feedback').href = 'https://github.com/pial-paul/Chattogram-Transport-System/issues/new?title=Chattogram%20bus%20route%20correction&body=Route%20number%3A%0AStop%20or%20direction%3A%0AWhat%20changed%3A%0ADate%20observed%3A%0ASource%20or%20photo%20if%20available%3A';
const from = params.get('from');
const to = params.get('to');
translate();
if (Object.hasOwn(stops, from) && Object.hasOwn(stops, to) && from !== to) showTrip(from, to);

if ('ResizeObserver' in window) new ResizeObserver(drawMap).observe($('map-canvas').parentElement);
else window.addEventListener('resize', drawMap);

if ('serviceWorker' in navigator && ['http:', 'https:'].includes(location.protocol)) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
