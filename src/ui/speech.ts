// The phone's own voices (Web Speech API): no audio files, works offline once the voice is on the phone.
// iPhone has good British and American voices (Settings → Accessibility → Spoken Content → Voices for more).

let voices: SpeechSynthesisVoice[] = [];
const synth = (): SpeechSynthesis | null => ('speechSynthesis' in window ? window.speechSynthesis : null);

function refresh() { voices = synth()?.getVoices() ?? []; }
refresh();
synth()?.addEventListener?.('voiceschanged', refresh);

export const canSpeak = (): boolean => !!synth();

/** The best voice for the accent: an enhanced/premium one when the phone has it, then any of that accent, then any English. */
export function pickVoice(lang: 'en-GB' | 'en-US'): SpeechSynthesisVoice | undefined {
  if (!voices.length) refresh();
  const of = voices.filter((v) => v.lang.replace('_', '-').startsWith(lang));
  const rank = (v: SpeechSynthesisVoice) => (/premium|enhanced|natural|neural/i.test(v.name) ? 0 : v.localService ? 1 : 2);
  return of.sort((a, b) => rank(a) - rank(b))[0] ?? voices.find((v) => v.lang.startsWith('en'));
}

/** Says the text; resolves when it is done (or at once when the phone has no voice). */
export function speak(text: string, lang: 'en-GB' | 'en-US', rate: number): Promise<void> {
  const s = synth();
  if (!s || !text) return Promise.resolve();
  s.cancel();
  return new Promise((res) => {
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(lang);
    if (v) u.voice = v;
    u.lang = v?.lang ?? lang;
    u.rate = rate;
    u.onend = () => res();
    u.onerror = () => res();
    s.speak(u);
    // a voice that never reports its end must not hang the screen
    setTimeout(res, 1500 + text.length * 120);
  });
}

export const stop = (): void => synth()?.cancel();
