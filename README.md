# Beast English

A 7-a aplicație din seria Beast: engleza în fiecare zi, câte 15 minute, pentru un vorbitor de română.

Live: https://bladejhs.github.io/beast-english/

## Ce face

- **Sesiunea zilei**: cuvintele de repetat, câteva noi (5–20 pe zi, implicit 8), 4 dictări și 4 întrebări de gramatică.
- **Cuvinte**: 240 de cuvinte și expresii în 10 pachete (esențiale, conversație, prieteni falși, phrasal verbs, muncă și interviu, securitate și ordine, sport, urgențe, oraș, expresii). Repetiție spațiată Leitner: cutiile 1–6, la 1, 3, 7, 16, 35, 90 de zile; de la cutia 4 cuvântul e „învățat”. Un cuvânt e întâi recunoscut din patru, apoi scris, apoi auzit și scris.
- **Ascultă**: dictare (propoziția auzită, scrisă, verificată cuvânt cu cuvânt) și cuvinte doar auzite. Vocea e a telefonului (Web Speech API), britanică sau americană, cu trei viteze.
- **Gramatică**: 10 teme cu greșelile tipice ale românilor (present perfect / past simple, since / for, articole, make / do, say / tell, in / on / at, do / does, much / many, condiționale, viitor), câte o regulă scurtă și exemple cu explicație.
- **Progres**: cuvinte învățate, procent corect, zile la rând, ultimele 14 zile, setări și backup.

Datele stau doar pe telefon (`beast-english:v1`).

## Cod

Vite + TypeScript, fără framework, ca Beast Psihologic. `src/data/words.ts` și `src/data/grammar.ts` sunt conținutul (o linie per element), `src/logic/` regulile (srs, verificarea răspunsurilor, sesiunea) cu teste, `src/main.ts` ecranele.

```sh
npm ci
npm test
npm run dev
npm run build   # tsc, vite, apoi scripts/sw.mjs pentru offline
```

Identitatea: lupul Umbra cu ochi galbeni (`scripts/mark.mjs`, `npm run icons`), deschiderea Forge (`public/splash/forge.js`), designul Broadcast în galben (`#facc15`).
