// The day's session: the words that are due, a few new ones, then listening and grammar, about 15 minutes.
// Each step says how it is asked. A word's question gets harder as it climbs the boxes: first recognised from four
// (English → Romanian), then typed (Romanian → English), and from box 3 heard and typed, with no text on screen.
import { GRAMMAR, type GItem } from '../data/grammar.ts';
import { WORDS, wordById, type Word } from '../data/words.ts';
import { dueIds, freshWords } from './srs.ts';
import type { State } from './store.ts';

export type Step =
  | { k: 'new'; w: Word }
  | { k: 'pick'; w: Word; opts: string[] }
  | { k: 'type'; w: Word }
  | { k: 'hear'; w: Word }
  | { k: 'dict'; text: string; ro: string }
  | { k: 'gram'; g: GItem };

/** A small seeded generator, so a session can be rebuilt the same way in tests. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(xs: T[], r: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; }
  return a;
}

/** Four Romanian meanings: the right one and three from the same deck (other decks when it is short). */
export function choices(w: Word, r: () => number): string[] {
  const same = WORDS.filter((x) => x.deck === w.deck && x.id !== w.id);
  const pool = same.length >= 3 ? same : WORDS.filter((x) => x.id !== w.id);
  const wrong = shuffle(pool, r).map((x) => first(x.ro)).filter((x, i, a) => x !== first(w.ro) && a.indexOf(x) === i).slice(0, 3);
  return shuffle([first(w.ro), ...wrong], r);
}

/** The first of the alternatives, the one shown as the meaning. */
export const first = (s: string): string => s.split(' / ')[0]!.trim();

/** How a word is asked at its box. */
export function wordStep(w: Word, box: number, r: () => number): Step {
  if (box <= 1) return { k: 'pick', w, opts: choices(w, r) };
  if (box === 2) return { k: 'type', w };
  return r() < 0.5 ? { k: 'hear', w } : { k: 'type', w };
}

export interface Plan { steps: Step[]; due: number; neu: number }

/** Today's steps. Reviews first (capped, so a missed week doesn't bury you), then new words, each introduced and
 *  asked at once, then four dictations from words already met and four grammar items, the weakest first. */
export function buildSession(s: State, today: string, seed: number, opt: { maxDue?: number } = {}): Plan {
  const r = rng(seed);
  const due = dueIds(s, today).slice(0, opt.maxDue ?? 40).map((id) => wordById(id)).filter((w): w is Word => !!w);
  const doneNew = s.days[today]?.neu ?? 0;
  const neu = freshWords(s).slice(0, Math.max(0, s.newPerDay - doneNew));
  const steps: Step[] = [];
  for (const w of shuffle(due, r)) steps.push(wordStep(w, s.cards[w.id]!.b, r));
  for (const w of neu) steps.push({ k: 'new', w }, { k: 'pick', w, opts: choices(w, r) });
  const met = WORDS.filter((w) => s.cards[w.id] && w.ex);
  const pool = met.length >= 4 ? met : WORDS.filter((w) => w.ex && w.deck === (s.decks[0] ?? 'baza'));
  for (const w of shuffle(pool, r).slice(0, 4)) steps.push({ k: 'dict', text: w.ex, ro: w.ro });
  for (const g of weakest(s, 4, r)) steps.push({ k: 'gram', g });
  return { steps, due: due.length, neu: neu.length };
}

/** Grammar items never answered or answered wrong most, a little shuffled. */
export function weakest(s: State, n: number, r: () => number): GItem[] {
  const score = (g: GItem) => { const x = s.gram[g.id]; return x ? x.ok - 2 * x.bad : -1; };
  return shuffle(GRAMMAR, r).sort((a, b) => score(a) - score(b)).slice(0, n);
}

/** About how long a plan takes, in minutes. */
export const minutes = (p: Plan): number => Math.max(1, Math.round(p.steps.reduce((t, x) => t + (x.k === 'dict' ? 40 : x.k === 'new' ? 15 : x.k === 'gram' ? 20 : 12), 0) / 60));
