// Spaced repetition, Leitner style: a word climbs one box each time it is right and waits longer before it comes
// back; a miss sends it back to box 1, due tomorrow. Box 4 and up count as learned (seen right after a week or more).
import { WORDS, type DeckId, type Word } from '../data/words.ts';
import { addDays, type Card, type State } from './store.ts';

/** Days to wait after a right answer, by the box the word lands in. */
export const WAIT = [0, 1, 3, 7, 16, 35, 90];
export const TOP = WAIT.length - 1;
export const LEARNED = 4;

export function grade(c: Card | undefined, right: boolean, today: string): Card {
  if (!c) return { b: 1, due: addDays(today, 1), seen: 1, lapses: right ? 0 : 1 };
  if (!right) return { b: 1, due: addDays(today, 1), seen: c.seen + 1, lapses: c.lapses + 1 };
  const b = Math.min(TOP, c.b + 1);
  return { b, due: addDays(today, WAIT[b]!), seen: c.seen + 1, lapses: c.lapses };
}

/** Words due today or earlier, the most overdue first. */
export function dueIds(s: State, today: string): string[] {
  return Object.entries(s.cards).filter(([, c]) => c.due <= today).sort((a, b) => (a[1].due < b[1].due ? -1 : a[1].due > b[1].due ? 1 : a[1].b - b[1].b)).map(([id]) => id);
}

/** Words never seen, from the chosen decks in their order. */
export function freshWords(s: State, decks: DeckId[] = s.decks): Word[] {
  return decks.flatMap((d) => WORDS.filter((w) => w.deck === d && !s.cards[w.id]));
}

export const learned = (s: State): number => Object.values(s.cards).filter((c) => c.b >= LEARNED).length;
export const deckStats = (s: State, d: DeckId) => {
  const ws = WORDS.filter((w) => w.deck === d);
  return { total: ws.length, seen: ws.filter((w) => s.cards[w.id]).length, learned: ws.filter((w) => (s.cards[w.id]?.b ?? 0) >= LEARNED).length };
};
