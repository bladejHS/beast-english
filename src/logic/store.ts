/* Everything the app keeps, on the phone only (localStorage), as in the other Beast apps. */
import type { DeckId } from '../data/words.ts';

/** One word's place in the spaced repetition: box 1–6, the day it is due, and how often it was missed. */
export interface Card { b: number; due: string; seen: number; lapses: number }

/** What was done on one day. */
export interface Day { rev: number; neu: number; ok: number; bad: number; listen: number; gram: number; sec: number }

export interface State {
  v: 1;
  cards: Record<string, Card>;
  days: Record<string, Day>;
  /** Grammar items answered: right and wrong counts. */
  gram: Record<string, { ok: number; bad: number }>;
  /** The decks new words come from, in order. */
  decks: DeckId[];
  newPerDay: number;
  /** The voice's accent and speed. */
  voice: 'en-GB' | 'en-US';
  rate: number;
  /** Opening: 'auto' (first run and new versions), 'full', 'short', 'off'. */
  opening: string;
}

export const KEY = 'beast-english:v1';
export const DEFAULT_DECKS: DeckId[] = ['baza', 'conv', 'falsi', 'sport', 'phrasal'];
export const fresh = (): State => ({ v: 1, cards: {}, days: {}, gram: {}, decks: [...DEFAULT_DECKS], newPerDay: 8, voice: 'en-GB', rate: 0.9, opening: 'auto' });
export const emptyDay = (): Day => ({ rev: 0, neu: 0, ok: 0, bad: 0, listen: 0, gram: 0, sec: 0 });

const isObj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);

export function normalize(raw: unknown): State {
  const b = fresh();
  if (!isObj(raw)) return b;
  const cards: Record<string, Card> = {};
  if (isObj(raw.cards)) for (const [k, c] of Object.entries(raw.cards)) if (isObj(c) && typeof c.b === 'number' && typeof c.due === 'string') cards[k] = { b: c.b, due: c.due, seen: Number(c.seen) || 0, lapses: Number(c.lapses) || 0 };
  const days: Record<string, Day> = {};
  if (isObj(raw.days)) for (const [k, d] of Object.entries(raw.days)) if (isObj(d)) days[k] = { ...emptyDay(), ...(d as Partial<Day>) };
  return {
    v: 1,
    cards,
    days,
    gram: isObj(raw.gram) ? (raw.gram as State['gram']) : {},
    decks: Array.isArray(raw.decks) && raw.decks.length ? (raw.decks.filter((d) => typeof d === 'string') as DeckId[]) : b.decks,
    newPerDay: typeof raw.newPerDay === 'number' ? Math.max(0, Math.min(30, raw.newPerDay)) : b.newPerDay,
    voice: raw.voice === 'en-US' ? 'en-US' : 'en-GB',
    rate: typeof raw.rate === 'number' ? Math.max(0.6, Math.min(1.2, raw.rate)) : b.rate,
    opening: typeof raw.opening === 'string' ? raw.opening : b.opening,
  };
}

export function load(): State {
  try { return normalize(JSON.parse(localStorage.getItem(KEY) ?? 'null')); } catch { return fresh(); }
}
export function save(s: State): boolean {
  try { localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch { return false; }
}

export const dayKey = (d = new Date()): string => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T12:00:00`);
  d.setDate(d.getDate() + n);
  return dayKey(d);
}
