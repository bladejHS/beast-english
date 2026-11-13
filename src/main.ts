import './style.css';
import { TOPICS, topicById, topicItems, type GItem, type TopicId } from './data/grammar.ts';
import { DECKS, deckById, deckWords, WORDS, type DeckId, type Word } from './data/words.ts';
import { check, dictation, type Verdict } from './logic/check.ts';
import { buildSession, choices, first, minutes, rng, shuffle, wordStep, type Step } from './logic/session.ts';
import { deckStats, dueIds, grade, learned, LEARNED } from './logic/srs.ts';
import { addDays, dayKey, emptyDay, load, normalize, save, type State } from './logic/store.ts';
import { canSpeak, speak, stop } from './ui/speech.ts';

declare const __BUILD__: string;

type Tab = 'azi' | 'cuvinte' | 'asculta' | 'gram' | 'progres';
const TABS: Array<[Tab, string, string]> = [
  ['azi', 'Azi', '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'],
  ['cuvinte', 'Cuvinte', '<path class="f" d="M4 5h11v14H4z"/><path d="M15 7h5v12H9M7 9h5M7 12h5"/>'],
  ['asculta', 'Ascultă', '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><path class="f" d="M4 14h3.5v6H4zM16.5 14H20v6h-3.5z"/>'],
  ['gram', 'Gramatică', '<path d="M5 19l4.5-14h1L15 19M7 14h6"/><path class="f" d="M15.5 9.5h4v9.5h-4z"/>'],
  ['progres', 'Progres', '<path d="M3 20.5h18"/><path class="f" d="M5 14.5h3.6v6H5zM10.2 10.5h3.6v10h-3.6zM15.4 5.5H19v15h-3.6z"/>'],
];

let S: State = load();
let tab: Tab = 'azi';
let deckOpen: DeckId | null = null;
const app = document.getElementById('app')!;
const ov = document.getElementById('ov')!;
const toastEl = document.getElementById('toast')!;
const esc = (v: unknown) => String(v).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const today = () => dayKey();
const commit = () => { if (!save(S)) toast('Telefonul n-a lăsat salvarea. Verifică spațiul liber.'); };
let toastT = 0;
function toast(t: string) { toastEl.textContent = t; toastEl.classList.add('on'); clearTimeout(toastT); toastT = window.setTimeout(() => toastEl.classList.remove('on'), 2600); }
const say = (t: string, slow = false) => speak(t, S.voice, slow ? Math.max(0.6, S.rate - 0.25) : S.rate);
const spk = (t: string, label = 'Ascultă') => `<button class="spk" data-a="say" data-t="${esc(t)}" aria-label="${label}: ${esc(t)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg></button>`;
const day = () => (S.days[today()] ??= emptyDay());
/** Romanian counts: 1 cuvânt, 2–19 cuvinte, 20+ de cuvinte. */
const nr = (n: number, one: string, many: string) => (n === 1 ? `1 ${one}` : n % 100 >= 1 && n % 100 < 20 ? `${n} ${many}` : `${n} de ${many}`);

// ---------- numbers ----------
function streak(): number {
  const active = (d: string) => { const x = S.days[d]; return !!x && x.rev + x.neu + x.listen + x.gram > 0; };
  let d = active(today()) ? today() : addDays(today(), -1);
  let n = 0;
  while (active(d)) { n++; d = addDays(d, -1); }
  return n;
}
const accuracy = () => { const t = Object.values(S.days).reduce((a, x) => [a[0]! + x.ok, a[1]! + x.ok + x.bad], [0, 0]); return t[1] ? Math.round((100 * t[0]!) / t[1]!) : null; };

// ---------- screens ----------
const top = () => `<header class="top"><span class="brand"><img src="${import.meta.env.BASE_URL}ui/mark.svg" alt="" width="30" height="30">BEAST <b>ENGLISH</b></span></header>`;
const pageHead = (t: string, s: string) => `<div class="ph"><h1 class="ph-t"><span>${t}</span></h1><i class="ph-blade"></i><p class="ph-s">${s}</p></div>`;

function azi() {
  const p = buildSession(S, today(), 1);
  const d = S.days[today()];
  const doneToday = !!d && d.rev + d.neu > 0 && p.due === 0 && p.neu === 0;
  const st = streak();
  return `${top()}
  <section class="hero">
    <p class="kick">Engleza de azi</p>
    <h1 class="ms-t"><span>${doneToday ? 'Gata pe azi' : 'Hai la treabă'}</span></h1>
    <div class="stats3"><div><b>${p.due}</b><span>de repetat</span></div><div><b>${p.neu}</b><span>noi</span></div><div><b>~${minutes(p)}</b><span>minute</span></div><div><b>${st}</b><span>${st === 1 ? 'zi la rând' : 'zile la rând'}</span></div></div>
    <button class="cta" data-a="today"><span class="cta-ic">▶</span><span class="cta-l"><small>${doneToday ? 'Încă o rundă' : 'Începe'}</small><b>Sesiunea zilei</b></span></button>
  </section>
  <ul class="tlist">
    <li class="tr"><div class="tr-t"><span class="lbl">Cuvinte</span><b>${p.due} repetări, ${p.neu} noi</b><small>Le recunoști, apoi le scrii, apoi le auzi. Ce greșești revine mâine.</small></div></li>
    <li class="tr"><div class="tr-t"><span class="lbl">Ascultare</span><b>4 dictări</b><small>Auzi o propoziție și o scrii.</small></div></li>
    <li class="tr"><div class="tr-t"><span class="lbl">Gramatică</span><b>4 întrebări</b><small>Greșelile pe care le fac românii, cele mai slabe ale tale primele.</small></div></li>
  </ul>
  ${canSpeak() ? '<p class="hint">Pune căștile sau dă sonorul mai tare: aplicația vorbește. Vocile mai bune le descarci din iPhone: Configurări → Accesibilitate → Conținut vorbit → Voci → Engleză.</p>' : '<p class="hint">Browserul ăsta nu are voce. Ascultarea și dictarea nu merg aici; deschide aplicația în Safari pe iPhone.</p>'}`;
}

function cuvinte() {
  if (deckOpen) return deckView(deckOpen);
  return `${top()}${pageHead('Cuvinte', `${nr(WORDS.length, 'cuvânt', 'cuvinte')} și expresii în ${DECKS.length} pachete. Cuvintele noi vin din pachetele bifate, în ordinea lor.`)}
  <ul class="tlist">${DECKS.map((d) => {
    const st = deckStats(S, d.id);
    const on = S.decks.includes(d.id);
    return `<li class="tr deck ${on ? '' : 'off'}"><button class="tr-t" data-a="deck" data-k="${d.id}"><span class="lbl">${d.level} · ${st.learned}/${st.total} învățate</span><b>${esc(d.name)}</b><small>${esc(d.what)}</small><i class="bar"><i style="width:${(100 * st.seen) / st.total}%"></i><i class="lrn" style="width:${(100 * st.learned) / st.total}%"></i></i></button>
    <button class="tog" data-a="toggle" data-k="${d.id}" aria-pressed="${on}" aria-label="${on ? 'Scoate din sesiune' : 'Pune în sesiune'}: ${esc(d.name)}">${on ? '✓' : '+'}</button></li>`;
  }).join('')}</ul>
  <p class="hint">Bara deschisă: cuvinte văzute. Cea plină: învățate, adică știute și după o săptămână sau mai mult.</p>`;
}

function deckView(id: DeckId) {
  const d = deckById(id);
  const ws = deckWords(id);
  return `${top()}<button class="back" data-a="deck-close">← Pachete</button>${pageHead(d.name, esc(d.what))}
  <div class="btn-row"><button class="btn" data-a="practice" data-k="${id}">Exersează pachetul</button></div>
  <ul class="words">${ws.map((w) => {
    const c = S.cards[w.id];
    const lvl = c ? (c.b >= LEARNED ? 'Învățat' : `Cutia ${c.b}`) : 'Nou';
    return `<li>${spk(w.en)}<div><b>${esc(w.en)}</b><span>${esc(w.ro)}</span>${w.ex ? `<em>${esc(w.ex)}</em>` : ''}</div><small class="${c && c.b >= LEARNED ? 'lrn' : ''}">${lvl}</small></li>`;
  }).join('')}</ul>`;
}

function asculta() {
  return `${top()}${pageHead('Ascultă', 'Urechea se antrenează separat de vocabular: auzi, scrii, compari.')}
  <ul class="tlist">
    <li class="tr"><div class="tr-t"><span class="lbl">10 propoziții · ~7 min</span><b>Dictare</b><small>Auzi propoziția și o scrii. Vezi cuvânt cu cuvânt ce ai prins.</small></div><button class="go" data-a="dict" aria-label="Start dictare">▶</button></li>
    <li class="tr"><div class="tr-t"><span class="lbl">12 cuvinte · ~3 min</span><b>Cuvinte auzite</b><small>Doar sunetul, fără text: scrii cuvântul în engleză.</small></div><button class="go" data-a="hearing" aria-label="Start cuvinte auzite">▶</button></li>
  </ul>
  <h2 class="sec">Vocea</h2>
  <section class="card">
    <div class="field"><span>Accent</span><div class="chips">${[['en-GB', 'Britanic'], ['en-US', 'American']].map(([v, l]) => `<button class="chip" aria-pressed="${S.voice === v}" data-a="voice" data-k="${v}">${l}</button>`).join('')}</div></div>
    <div class="field"><span>Viteză</span><div class="chips">${[[0.75, 'Rar'], [0.9, 'Normal'], [1.05, 'Natural']].map(([v, l]) => `<button class="chip" aria-pressed="${S.rate === v}" data-a="rate" data-k="${v}">${l}</button>`).join('')}</div></div>
    <button class="btn ghost" data-a="say" data-t="Hi! This is how I sound. Is the speed right for you?">Probează vocea</button>
  </section>`;
}

function gram() {
  return `${top()}${pageHead('Gramatică', 'Doar ce greșesc românii cel mai des. Câte o regulă scurtă, apoi exemple.')}
  <ul class="tlist">${TOPICS.map((t) => {
    const items = topicItems(t.id);
    const r = items.reduce((a, g) => { const x = S.gram[g.id]; return x ? [a[0]! + x.ok, a[1]! + x.ok + x.bad] : a; }, [0, 0]);
    return `<li class="tr"><div class="tr-t"><span class="lbl">${items.length} întrebări${r[1] ? ` · ${Math.round((100 * r[0]!) / r[1]!)}% corect` : ''}</span><b>${esc(t.name)}</b><small>${esc(t.rule)}</small></div><button class="go" data-a="topic" data-k="${t.id}" aria-label="Start ${esc(t.name)}">▶</button></li>`;
  }).join('')}</ul>`;
}

function progres() {
  const seen = Object.keys(S.cards).length;
  const lrn = learned(S);
  const acc = accuracy();
  const last = Array.from({ length: 14 }, (_, i) => addDays(today(), i - 13));
  const vals = last.map((d) => { const x = S.days[d]; return x ? x.rev + x.neu + x.listen + x.gram : 0; });
  const max = Math.max(10, ...vals);
  return `${top()}${pageHead('Progres', `${nr(seen, 'cuvânt întâlnit', 'cuvinte întâlnite')} din ${WORDS.length}. Comparat doar cu tine.`)}
  <div class="stats3 big"><div><b>${lrn}</b><span>învățate</span></div><div><b>${seen - lrn}</b><span>în lucru</span></div><div><b>${acc == null ? '—' : `${acc}%`}</b><span>corecte</span></div><div><b>${streak()}</b><span>zile la rând</span></div></div>
  <h2 class="sec">Ultimele 14 zile</h2>
  <div class="days">${last.map((d, i) => `<i class="${d === today() ? 'now' : ''}" style="--h:${(vals[i]! / max).toFixed(3)}" title="${d}: ${vals[i]}"><b></b><span>${Number(d.slice(8))}</span></i>`).join('')}</div>
  <p class="hint">Exerciții pe zi: repetări, cuvinte noi, dictări și gramatică.</p>
  <h2 class="sec">Setări</h2>
  <section class="card">
    <div class="field"><span>Cuvinte noi pe zi</span><div class="chips">${[5, 8, 12, 20].map((n) => `<button class="chip" aria-pressed="${S.newPerDay === n}" data-a="newper" data-k="${n}">${n}</button>`).join('')}</div></div>
    <div class="field"><span>Animația de deschidere</span><div class="chips">${[['auto', 'Automat'], ['full', 'Mereu'], ['short', 'Scurt'], ['off', 'Oprit']].map(([v, l]) => `<button class="chip" aria-pressed="${S.opening === v}" data-a="opening" data-k="${v}">${l}</button>`).join('')}</div></div>
    <p class="hint">Datele stau doar pe acest telefon. Descarcă un backup din când în când.</p>
    <div class="btn-row"><button class="btn ghost" data-a="backup">Descarcă backup</button><label class="btn ghost">Încarcă backup<input type="file" id="restore" accept="application/json" hidden></label></div>
    <p class="hint">Versiunea ${esc(__BUILD__)}.</p>
  </section>`;
}

function render() {
  const views: Record<Tab, () => string> = { azi, cuvinte, asculta, gram, progres };
  app.innerHTML = views[tab]();
  document.querySelectorAll<HTMLElement>('#nav [data-tab]').forEach((b) => b.toggleAttribute('aria-current', b.dataset['tab'] === tab));
  (document.getElementById('nav') as HTMLElement).style.setProperty('--i', String(TABS.findIndex(([t]) => t === tab)));
  document.getElementById('restore')?.addEventListener('change', (ev) => void restore((ev.target as HTMLInputElement).files?.[0]));
}

function nav() {
  const n = document.getElementById('nav')!;
  n.innerHTML = `<i class="nav-plate" aria-hidden="true"></i><i class="nav-blade" aria-hidden="true"></i>${TABS.map(([t, l, i]) => `<button class="nav-b" data-tab="${t}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${i}</svg>${l}</button>`).join('')}`;
}

// ---------- a run: a list of steps played one by one ----------
interface Run { title: string; steps: Step[]; i: number; ok: number; bad: number; again: Set<string>; start: number; answered: boolean; verdict: Verdict | null; picked: number; note: string }
let run: Run | null = null;

function openRun(title: string, steps: Step[]) {
  if (!steps.length) { toast('Nimic de exersat aici încă.'); return; }
  run = { title, steps, i: 0, ok: 0, bad: 0, again: new Set(), start: Date.now(), answered: false, verdict: null, picked: -1, note: '' };
  ov.classList.add('on');
  show();
}

const frame = (body: string) => {
  const r = run!;
  return `<div class="pl"><div class="pl-bar"><button class="x" data-a="close" aria-label="Închide">×</button><span>${esc(r.title)}</span><span class="cnt">${Math.min(r.i + 1, r.steps.length)}/${r.steps.length}</span></div>
  <div class="tbar"><i style="transform:scaleX(${(r.i / r.steps.length).toFixed(3)})"></i></div>
  <div class="pl-body"><div class="pl-wrap">${body}</div></div></div>`;
};

function show() {
  const r = run!;
  const st = r.steps[r.i];
  if (!st) return finish();
  r.answered = false; r.verdict = null; r.picked = -1; r.note = '';
  ov.innerHTML = frame(stepHtml(st));
  autoplay(st);
  (ov.querySelector('input, textarea') as HTMLInputElement | null)?.focus();
}

function autoplay(st: Step) {
  if (st.k === 'new' || st.k === 'pick') void say(st.w.en);
  if (st.k === 'hear') void say(st.w.en);
  if (st.k === 'dict') void say(st.text);
}

function stepHtml(st: Step): string {
  const r = run!;
  const next = r.answered ? `<button class="btn" data-a="next">${r.i + 1 >= r.steps.length ? 'Gata' : 'Mai departe'}</button>` : '';
  switch (st.k) {
    case 'new':
      return `<p class="lbl">Cuvânt nou · ${esc(deckById(st.w.deck).name)}</p>
      <div class="word">${spk(st.w.en)}<b>${esc(st.w.en)}</b></div><p class="mean">${esc(st.w.ro)}</p>
      ${st.w.ex ? `<div class="ex">${spk(st.w.ex, 'Ascultă propoziția')}<p>${esc(st.w.ex)}</p></div>` : ''}
      <button class="btn" data-a="seen">Am reținut</button>`;
    case 'pick':
      return `<p class="lbl">Ce înseamnă?</p><div class="word">${spk(st.w.en)}<b>${esc(st.w.en)}</b></div>
      <div class="opts">${st.opts.map((o, i) => `<button data-a="pick" data-k="${i}" class="${r.answered ? (o === first(st.w.ro) ? 'ok' : i === r.picked ? 'no' : '') : ''}" ${r.answered ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>
      ${r.answered && st.w.ex ? `<div class="ex">${spk(st.w.ex, 'Ascultă propoziția')}<p>${esc(st.w.ex)}</p></div>` : ''}${next}`;
    case 'type':
    case 'hear': {
      const head = st.k === 'type'
        ? `<p class="lbl">Scrie în engleză</p><p class="ask">${esc(st.w.ro)}</p>`
        : `<p class="lbl">Scrie ce auzi</p><div class="ear"><button class="btn ghost" data-a="say" data-t="${esc(st.w.en)}">▶ Ascultă</button><button class="btn ghost" data-a="slow" data-t="${esc(st.w.en)}">Rar</button></div>`;
      return `${head}
      <input class="ans ${r.verdict ?? ''}" id="ans" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" lang="en" ${r.answered ? 'disabled' : ''} placeholder="în engleză">
      ${r.answered ? verdictHtml(r.verdict!, st.w) : `<div class="btn-row"><button class="btn ghost" data-a="dunno">Nu știu</button><button class="btn" data-a="check">Verifică</button></div>`}${next}`;
    }
    case 'dict':
      return `<p class="lbl">Dictare · scrie propoziția</p><div class="ear"><button class="btn ghost" data-a="say" data-t="${esc(st.text)}">▶ Ascultă</button><button class="btn ghost" data-a="slow" data-t="${esc(st.text)}">Rar</button></div>
      <textarea class="ans" id="ans" rows="3" autocomplete="off" autocapitalize="sentences" autocorrect="off" spellcheck="false" lang="en" ${r.answered ? 'disabled' : ''}></textarea>
      ${r.answered ? r.note : '<button class="btn" data-a="check">Verifică</button>'}${next}`;
    case 'gram':
      return `<p class="lbl">${esc(topicById(st.g.topic).name)}</p><p class="gq">${esc(st.g.s).replace('___', '<u>&nbsp;___&nbsp;</u>')}</p>
      <div class="opts">${st.g.opts.map((o, i) => `<button data-a="gpick" data-k="${i}" class="${r.answered ? (i === st.g.a ? 'ok' : i === r.picked ? 'no' : '') : ''}" ${r.answered ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>
      ${r.answered ? `<div class="why"><b>${r.picked === st.g.a ? 'Corect' : 'Greșit'}</b><p>${esc(st.g.why)}</p></div>` : ''}${next}`;
  }
}

function verdictHtml(v: Verdict, w: Word) {
  const t = v === 'ok' ? 'Corect' : v === 'close' ? 'Aproape: atenție la scris' : 'Greșit';
  return `<div class="why ${v}"><b>${t}</b><div class="word sm">${spk(w.en)}<b>${esc(w.en)}</b></div><p>${esc(w.ro)}</p>${w.ex ? `<p class="dim">${esc(w.ex)}</p>` : ''}</div>`;
}

/** A word answered: the box moves, a miss comes back once at the end of this run. */
function scoreWord(w: Word, right: boolean) {
  const r = run!;
  // the second try of a word missed in this run is practice only: its box already went back to 1
  if (r.again.has(w.id)) { if (right) r.ok++; else r.bad++; return; }
  const d = day();
  if (S.cards[w.id]) d.rev++; else d.neu++;
  S.cards[w.id] = grade(S.cards[w.id], right, today());
  if (right) { d.ok++; r.ok++; } else { d.bad++; r.bad++; r.again.add(w.id); r.steps.push({ k: 'pick', w, opts: choices(w, rng(Date.now())) }); }
  commit();
}

function answerTyped(giveUp = false) {
  const r = run!;
  const st = r.steps[r.i]!;
  const val = (document.getElementById('ans') as HTMLInputElement | null)?.value ?? '';
  if (st.k === 'type' || st.k === 'hear') {
    if (!giveUp && !val.trim()) return;
    r.verdict = giveUp ? 'no' : check(val, st.w.en);
    r.answered = true;
    scoreWord(st.w, r.verdict !== 'no');
    ov.innerHTML = frame(stepHtml(st));
    (document.getElementById('ans') as HTMLInputElement).value = val;
    void say(st.w.en);
  } else if (st.k === 'dict') {
    if (!val.trim()) return;
    const d = dictation(val, st.text);
    r.answered = true;
    r.note = `<div class="why ${d.score >= 0.9 ? 'ok' : d.score >= 0.6 ? 'close' : 'no'}"><b>${Math.round(d.score * 100)}% prins</b><p class="dw">${d.words.map((x) => `<span class="${x.ok ? 'h' : 'm'}">${esc(x.w)}</span>`).join(' ')}</p></div>`;
    const dd = day(); dd.listen++; if (d.score >= 0.9) { dd.ok++; r.ok++; } else { dd.bad++; r.bad++; }
    commit();
    ov.innerHTML = frame(stepHtml(st));
    (document.getElementById('ans') as HTMLTextAreaElement).value = val;
  }
}

function finish() {
  const r = run!;
  const d = day(); d.sec += Math.round((Date.now() - r.start) / 1000); commit();
  const tot = r.ok + r.bad;
  ov.innerHTML = `<div class="pl"><div class="pl-bar"><button class="x" data-a="close" aria-label="Închide">×</button><span>${esc(r.title)}</span><i></i></div>
  <div class="pl-body"><div class="pl-wrap"><p class="lbl">Gata</p><div class="res"><b>${tot ? Math.round((100 * r.ok) / tot) : 100}%</b><span>corect</span></div>
  <ul class="lines"><li>${r.ok} din ${tot} răspunsuri bune.</li><li>${nr(learned(S), 'cuvânt învățat', 'cuvinte învățate')} în total, ${nr(dueIds(S, addDays(today(), 1)).length, 'cuvânt', 'cuvinte')} de repetat mâine.</li>${r.again.size ? `<li>${r.again.size} ${r.again.size === 1 ? 'cuvânt greșit revine' : 'cuvinte greșite revin'} mâine.</li>` : ''}</ul>
  <button class="btn" data-a="close">Închide</button></div></div></div>`;
  run = null;
}

function close() {
  stop();
  if (run) { const d = day(); d.sec += Math.round((Date.now() - run.start) / 1000); commit(); }
  run = null;
  ov.classList.remove('on'); ov.innerHTML = '';
  render();
}

// ---------- the runs ----------
const sessionRun = () => { const p = buildSession(S, today(), Date.now() & 0xffff); if (!p.steps.length) { toast('Nimic de făcut azi: bifează un pachet în Cuvinte.'); return; } openRun('Sesiunea zilei', p.steps); };
function practiceDeck(id: DeckId) {
  const r = rng(Date.now() & 0xffff);
  const ws = shuffle(deckWords(id), r);
  const met = ws.filter((w) => S.cards[w.id]).slice(0, 8);
  const neu = ws.filter((w) => !S.cards[w.id]).slice(0, Math.max(0, 10 - met.length));
  openRun(deckById(id).name, [...met.map((w) => wordStep(w, S.cards[w.id]!.b, r)), ...neu.flatMap((w): Step[] => [{ k: 'new', w }, { k: 'pick', w, opts: choices(w, r) }])]);
}
function dictRun() {
  const r = rng(Date.now() & 0xffff);
  const met = WORDS.filter((w) => w.ex && S.cards[w.id]);
  const pool = met.length >= 10 ? met : WORDS.filter((w) => w.ex);
  openRun('Dictare', shuffle(pool, r).slice(0, 10).map((w): Step => ({ k: 'dict', text: w.ex, ro: w.ro })));
}
function hearRun() {
  const r = rng(Date.now() & 0xffff);
  const met = WORDS.filter((w) => S.cards[w.id]);
  const pool = met.length >= 12 ? met : WORDS.filter((w) => S.decks.includes(w.deck));
  openRun('Cuvinte auzite', shuffle(pool, r).slice(0, 12).map((w): Step => ({ k: 'hear', w })));
}
function topicRun(t: TopicId) {
  const r = rng(Date.now() & 0xffff);
  const items: GItem[] = shuffle(topicItems(t), r);
  openRun(topicById(t).name, items.map((g): Step => ({ k: 'gram', g })));
  ov.querySelector('.pl-wrap')?.insertAdjacentHTML('afterbegin', `<div class="rule"><b>Regula</b><p>${esc(topicById(t).rule)}</p></div>`);
}

// ---------- backup ----------
function backup() {
  const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = `beast-english-${today()}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
async function restore(f?: File) {
  if (!f) return;
  try {
    const next = normalize(JSON.parse(await f.text()));
    if (!Object.keys(next.cards).length && Object.keys(S.cards).length) { toast('Fișierul nu are cuvinte. Nu am schimbat nimic.'); return; }
    S = next; commit(); render(); toast(`Am încărcat ${nr(Object.keys(S.cards).length, 'cuvânt', 'cuvinte')}.`);
  } catch { toast('Fișierul nu e un backup Beast English.'); }
}

// ---------- events ----------
document.addEventListener('click', (ev) => {
  const el = (ev.target as HTMLElement).closest<HTMLElement>('[data-a], [data-tab]');
  if (!el) return;
  if (el.dataset['tab']) { tab = el.dataset['tab'] as Tab; deckOpen = null; render(); scrollTo(0, 0); return; }
  const a = el.dataset['a'], k = el.dataset['k'] ?? '';
  const st = run?.steps[run.i];
  switch (a) {
    case 'say': void say(el.dataset['t'] ?? ''); break;
    case 'slow': void say(el.dataset['t'] ?? '', true); break;
    case 'today': sessionRun(); break;
    case 'deck': deckOpen = k as DeckId; render(); scrollTo(0, 0); break;
    case 'deck-close': deckOpen = null; render(); break;
    case 'toggle': {
      const id = k as DeckId;
      S.decks = S.decks.includes(id) ? S.decks.filter((d) => d !== id) : [...S.decks, id];
      commit(); render(); toast(S.decks.includes(id) ? 'Pachetul intră în sesiunea zilei.' : 'Pachetul nu mai dă cuvinte noi. Repetările continuă.');
      break;
    }
    case 'practice': practiceDeck(k as DeckId); break;
    case 'dict': dictRun(); break;
    case 'hearing': hearRun(); break;
    case 'topic': topicRun(k as TopicId); break;
    case 'voice': S.voice = k === 'en-US' ? 'en-US' : 'en-GB'; commit(); render(); void say('Hello, this is my voice.'); break;
    case 'rate': S.rate = Number(k); commit(); render(); void say('Is this speed right for you?'); break;
    case 'newper': S.newPerDay = Number(k); commit(); render(); break;
    case 'opening': S.opening = k; commit(); render(); break;
    case 'backup': backup(); break;
    case 'close': close(); break;
    case 'next': if (run) { run.i++; show(); } break;
    case 'seen': if (run) { run.i++; show(); } break;
    case 'pick':
      if (run && st?.k === 'pick' && !run.answered) {
        run.picked = Number(k); run.answered = true;
        scoreWord(st.w, st.opts[run.picked] === first(st.w.ro));
        ov.innerHTML = frame(stepHtml(st));
      }
      break;
    case 'gpick':
      if (run && st?.k === 'gram' && !run.answered) {
        run.picked = Number(k); run.answered = true;
        const right = run.picked === st.g.a;
        const g = (S.gram[st.g.id] ??= { ok: 0, bad: 0 });
        if (right) { g.ok++; run.ok++; day().ok++; } else { g.bad++; run.bad++; day().bad++; }
        day().gram++; commit();
        ov.innerHTML = frame(stepHtml(st));
      }
      break;
    case 'check': answerTyped(); break;
    case 'dunno': answerTyped(true); break;
  }
});
document.addEventListener('keydown', (ev) => {
  if (ev.key !== 'Enter' || !run) return;
  const t = ev.target as HTMLElement;
  if (t.id === 'ans' && !run.answered && !(t.tagName === 'TEXTAREA' && ev.shiftKey)) { ev.preventDefault(); answerTyped(); }
  else if (run.answered) { ev.preventDefault(); run.i++; show(); }
});

nav();
render();
if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
