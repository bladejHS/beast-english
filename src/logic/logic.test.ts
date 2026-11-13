import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GRAMMAR, TOPICS } from '../data/grammar.ts';
import { DECKS, WORDS } from '../data/words.ts';
import { check, dictation, norm } from './check.ts';
import { buildSession, choices, first, rng } from './session.ts';
import { dueIds, grade, learned } from './srs.ts';
import { fresh, normalize } from './store.ts';

test('the word bank: every deck full, ids unique, nothing empty', () => {
  for (const d of DECKS) assert.ok(WORDS.filter((w) => w.deck === d.id).length >= 20, d.id);
  assert.equal(new Set(WORDS.map((w) => w.id)).size, WORDS.length);
  for (const w of WORDS) assert.ok(w.en && w.ro, w.id);
});

test('grammar: three options, the answer among them, a reason for each', () => {
  for (const t of TOPICS) assert.ok(GRAMMAR.some((g) => g.topic === t.id), t.id);
  for (const g of GRAMMAR) {
    assert.equal(g.opts.length, 3, g.id);
    assert.ok(g.a >= 0 && g.a < 3 && g.why, g.id);
    assert.ok(g.s.includes('___'), g.id);
  }
});

test('typed answers: forgiving on form, strict on meaning', () => {
  assert.equal(check('Give up', 'give up'), 'ok');
  assert.equal(check('to give up', 'give up'), 'ok');
  assert.equal(check('a renunta', 'a renunța'), 'ok');
  assert.equal(check('se calma', 'a se calma'), 'ok');
  assert.equal(check('a afla', 'a afla / a descoperi'), 'ok');
  assert.equal(check('descoperi', 'a afla / a descoperi'), 'ok');
  assert.equal(check('surveilance', 'surveillance'), 'close');
  assert.equal(check('take', 'make'), 'no');
  assert.equal(check('', 'need'), 'no');
  assert.equal(norm("How's it going?"), "how's it going");
});

test('dictation marks each word heard right, in order', () => {
  const d = dictation('drop weapon', 'Drop the weapon!');
  assert.deepEqual(d.words.map((x) => x.ok), [true, false, true]);
  assert.equal(Math.round(d.score * 100), 67);
  assert.equal(dictation('Drop the weapon', 'Drop the weapon!').score, 1);
  assert.equal(dictation('', 'Drop the weapon!').score, 0);
});

test('spaced repetition: right climbs and waits longer, wrong goes back to tomorrow', () => {
  const t = '2026-11-13';
  const c1 = grade(undefined, true, t);
  assert.deepEqual([c1.b, c1.due], [1, '2026-11-14']);
  const c2 = grade(c1, true, '2026-11-14');
  assert.deepEqual([c2.b, c2.due], [2, '2026-11-17']);
  const c3 = grade(c2, false, '2026-11-17');
  assert.deepEqual([c3.b, c3.due, c3.lapses], [1, '2026-11-18', 1]);
  const s = fresh();
  s.cards = { a: { b: 2, due: '2026-11-10', seen: 2, lapses: 0 }, b: { b: 1, due: '2026-11-13', seen: 1, lapses: 0 }, c: { b: 5, due: '2026-12-01', seen: 5, lapses: 0 } };
  assert.deepEqual(dueIds(s, t), ['a', 'b']);
  assert.equal(learned(s), 1);
});

test('the session: reviews, new words introduced then asked, dictation, grammar', () => {
  const s = fresh();
  const p = buildSession(s, '2026-11-13', 1);
  assert.equal(p.neu, 8);
  assert.equal(p.steps.filter((x) => x.k === 'new').length, 8);
  assert.equal(p.steps.filter((x) => x.k === 'dict').length, 4);
  assert.equal(p.steps.filter((x) => x.k === 'gram').length, 4);
  // new words come in the deck order, each followed by its question
  assert.equal(p.steps[0]!.k, 'new');
  assert.equal(p.steps[1]!.k, 'pick');
  // a day's new words are not given twice
  s.days['2026-11-13'] = { rev: 0, neu: 8, ok: 0, bad: 0, listen: 0, gram: 0, sec: 0 };
  assert.equal(buildSession(s, '2026-11-13', 1).neu, 0);
});

test('four different meanings, the right one included', () => {
  const w = WORDS.find((x) => x.en === 'give up')!;
  const o = choices(w, rng(3));
  assert.equal(o.length, 4);
  assert.equal(new Set(o).size, 4);
  assert.ok(o.includes(first(w.ro)));
});

test('a damaged or old backup still loads', () => {
  const s = normalize({ cards: { x: { b: 2, due: '2026-11-01' }, y: 'bad' }, newPerDay: 99, voice: 'fr' });
  assert.deepEqual(Object.keys(s.cards), ['x']);
  assert.equal(s.newPerDay, 30);
  assert.equal(s.voice, 'en-GB');
});
