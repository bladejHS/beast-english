// Checking typed answers fairly: case, punctuation, diacritics and a leading "to/a/an/the" don't matter, any
// alternative counts ("a / b"), and a one-letter slip on a longer word is "almost", shown but counted right.

export type Verdict = 'ok' | 'close' | 'no';

export function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[’`]/g, "'").replace(/\([^)]*\)/g, ' ').replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ').trim().replace(/^(?:(?:to|a se|an|the|a|se) )+/, '');
}

/** The accepted answers of a field like "a renunța / a se da bătut". */
export const options = (target: string): string[] => target.split(/\s*\/\s*|\s*;\s*/).map(norm).filter(Boolean);

export function lev(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n]!;
}

export function check(answer: string, target: string): Verdict {
  const a = norm(answer);
  if (!a) return 'no';
  let best: Verdict = 'no';
  for (const t of options(target)) {
    if (a === t) return 'ok';
    const room = t.length >= 10 ? 2 : t.length >= 5 ? 1 : 0;
    if (room && lev(a, t) <= room) best = 'close';
  }
  return best;
}

/** Word by word, what was heard right in a dictation: the longest common run, in order. */
export function dictation(answer: string, target: string): { words: Array<{ w: string; ok: boolean }>; score: number } {
  const tw = target.split(/\s+/).filter(Boolean);
  // word by word, so the articles stay: they are part of what was said
  const word = (w: string) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’`]/g, "'").replace(/[^a-z0-9']+/g, '');
  const tn = tw.map(word);
  const an = answer.split(/\s+/).map(word).filter(Boolean);
  const m = tn.length, n = an.length;
  const L = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) L[i]![j] = tn[i] === an[j] || (tn[i]!.length >= 5 && lev(tn[i]!, an[j]!) <= 1) ? L[i + 1]![j + 1]! + 1 : Math.max(L[i + 1]![j]!, L[i]![j + 1]!);
  const ok = new Array<boolean>(m).fill(false);
  for (let i = 0, j = 0; i < m && j < n;) {
    if (tn[i] === an[j] || (tn[i]!.length >= 5 && lev(tn[i]!, an[j]!) <= 1)) { ok[i] = true; i++; j++; }
    else if (L[i + 1]![j]! >= L[i]![j + 1]!) i++;
    else j++;
  }
  const words = tw.map((w, i) => ({ w, ok: ok[i]! }));
  return { words, score: m ? ok.filter(Boolean).length / m : 0 };
}
