// The word bank: ten decks for a Romanian speaker going from A2 to B2, chosen for use, not for exams.
// One line per word: "English | română | an example sentence". Alternatives on either side are split with " / ":
// any of them counts as a right answer when typed. Ids are made from the deck and the English, so editing a
// translation keeps the progress; changing the English starts that word over.

export type DeckId = 'baza' | 'conv' | 'phrasal' | 'falsi' | 'munca' | 'secur' | 'sport' | 'urgente' | 'oras' | 'expresii';

export interface Deck { id: DeckId; name: string; what: string; level: string }

export interface Word { id: string; deck: DeckId; en: string; ro: string; ex: string }

export const DECKS: Deck[] = [
  { id: 'baza', name: 'Esențiale', what: 'Verbele și cuvintele care apar peste tot.', level: 'A2' },
  { id: 'conv', name: 'Conversație', what: 'Ce spui ca să pornești, să ții și să închei o discuție.', level: 'A2–B1' },
  { id: 'falsi', name: 'Prieteni falși', what: 'Cuvinte care seamănă cu româna, dar înseamnă altceva.', level: 'B1' },
  { id: 'phrasal', name: 'Phrasal verbs', what: 'Verbul + o particulă, cum vorbesc nativii.', level: 'B1' },
  { id: 'munca', name: 'Muncă și interviu', what: 'Cum vorbești despre tine, experiență și obiective.', level: 'B1' },
  { id: 'secur', name: 'Securitate și ordine', what: 'Vocabularul de poliție, pază și intervenție.', level: 'B1–B2' },
  { id: 'sport', name: 'Sport și sănătate', what: 'Antrenament, corp, recuperare.', level: 'A2–B1' },
  { id: 'urgente', name: 'Urgențe și prim ajutor', what: 'Ce spui și ce înțelegi când contează.', level: 'B1' },
  { id: 'oras', name: 'Oraș și drum', what: 'Direcții, transport, cazare.', level: 'A2' },
  { id: 'expresii', name: 'Expresii', what: 'Idiomuri des folosite, cu sensul lor real.', level: 'B2' },
];

const RAW: Record<DeckId, string> = {
  baza: `
need | a avea nevoie de | I need more time to finish this.
try | a încerca | Try again, but slower.
choose | a alege | You have to choose one.
explain | a explica | Can you explain it again?
understand | a înțelege | I don't understand the question.
remember | a-și aminti | I can't remember his name.
forget | a uita | Don't forget your keys.
improve | a îmbunătăți / a se îmbunătăți | My English is improving every week.
achieve | a realiza / a atinge | She achieved her goal in six months.
avoid | a evita | Avoid the main road at night.
allow | a permite | Phones are not allowed in the exam.
require | a necesita / a cere | The job requires good physical condition.
provide | a oferi / a furniza | The company provides training.
reach | a ajunge la / a atinge | We reached the border at noon.
keep | a păstra / a ține | Keep your hands where I can see them.
warn | a avertiza | I warned him twice.
enough | destul / suficient | We don't have enough water.
almost | aproape | I'm almost ready.
already | deja | I've already eaten.
still | încă | Are you still at work?
yet | încă (în negații) / deja (în întrebări) | I haven't finished yet.
however | totuși / cu toate acestea | The plan is good. However, it's expensive.
although | deși | Although it was late, we kept working.
instead | în schimb / în loc | Let's walk instead.
`,
  conv: `
how's it going | ce mai faci / cum merge | Hey, how's it going?
nice to meet you | îmi pare bine de cunoștință | Nice to meet you, I'm Andrei.
what do you do | cu ce te ocupi | So, what do you do?
could you repeat that | poți repeta | Sorry, could you repeat that?
I didn't catch that | n-am prins / n-am înțeles | I didn't catch that, the line is bad.
what do you mean | ce vrei să spui | What do you mean by "soon"?
I see | înțeleg | I see, that makes sense.
fair enough | corect / are sens | Fair enough, let's do it your way.
it depends | depinde | It depends on the weather.
to be honest | sincer să fiu | To be honest, I don't like it.
by the way | apropo | By the way, did you call him?
anyway | oricum / în fine | Anyway, let's get back to work.
no worries | nicio problemă | No worries, it happens.
I'm afraid | mă tem că / din păcate | I'm afraid we're closed.
would you mind | te-ar deranja | Would you mind closing the door?
sounds good | sună bine | Tomorrow at six? Sounds good.
I'm not sure | nu sunt sigur | I'm not sure it's a good idea.
let me think | stai să mă gândesc | Let me think about it.
that's right | exact / așa e | That's right, it was Monday.
excuse me | scuzați-mă / pardon | Excuse me, is this seat free?
take care | ai grijă de tine | See you next week. Take care!
catch up | a ne vedea și povesti | We should catch up soon.
make sense | a avea sens | Does that make sense?
see you around | ne mai vedem | Thanks for everything, see you around.
`,
  falsi: `
actually | de fapt | Actually, I'm from Constanța.
eventually | până la urmă / în cele din urmă | Eventually, he told the truth.
sensible | rezonabil / cu cap | That's a sensible decision.
sensitive | sensibil | My teeth are sensitive to cold.
library | bibliotecă | I study at the library.
bookstore | librărie | The bookstore on the corner sells maps.
agenda | ordinea de zi | What's on the agenda for the meeting?
diary | agendă / jurnal | Write the date in your diary.
argument | ceartă | They had an argument about money.
fabric | material textil | This fabric dries fast.
factory | fabrică | He works in a car factory.
pretend | a se preface | He pretended to be asleep.
claim | a pretinde / a susține | She claims she saw the driver.
gymnasium | sală de sport | The gymnasium opens at seven.
lecture | prelegere / curs | The lecture lasts two hours.
reading | lectură / citit | Reading every day helps.
mark | notă (la școală) / semn | I got a good mark on the test.
note | bilet / notiță | I left a note on the table.
camera | aparat foto | My camera has a big lens.
room | cameră | Our room is on the second floor.
preservative | conservant | This bread has no preservatives.
condom | prezervativ | —
sympathetic | înțelegător / compătimitor | She was very sympathetic when I was sick.
nice | drăguț / simpatic | He's a nice guy.
`,
  phrasal: `
give up | a renunța | Don't give up now.
find out | a afla | I found out the truth yesterday.
look for | a căuta | I'm looking for my phone.
look after | a avea grijă de | Who looks after your dog?
get up | a se trezi / a se ridica | I get up at six every day.
turn up | a apărea / a da mai tare | He turned up late again.
turn down | a refuza / a da mai încet | They turned down my offer.
carry on | a continua | Carry on, I'm listening.
set up | a organiza / a instala | We set up a checkpoint on the bridge.
put off | a amâna | Don't put off the training.
come across | a da peste | I came across an old photo.
run out of | a rămâne fără | We ran out of fuel.
get over | a-și reveni după | It took weeks to get over the injury.
break down | a se strica / a ceda | The car broke down on the highway.
back up | a sprijini / a face backup | Back me up if I'm wrong.
calm down | a se calma | Calm down and tell me what happened.
show up | a se prezenta / a apărea | Only half the team showed up.
take over | a prelua | The night shift takes over at ten.
pick up | a ridica / a lua pe cineva | I'll pick you up at the station.
work out | a face sport / a rezolva | I work out five times a week.
check in | a se înregistra | Check in at the front desk.
fill in | a completa (un formular) | Fill in this form, please.
point out | a semnala / a arăta | He pointed out a mistake.
deal with | a se ocupa de / a face față | I'll deal with it.
`,
  munca: `
experience | experiență | I have three years of experience.
skills | abilități / competențe | What skills can you bring to the team?
strength | punct forte / forță | My main strength is discipline.
weakness | punct slab | One weakness is that I'm impatient.
goal | obiectiv / țintă | My goal is to join a special unit.
reliable | de încredere | I'm reliable: I'm always on time.
under pressure | sub presiune | I stay calm under pressure.
teamwork | lucru în echipă | Teamwork matters more than talent here.
responsibility | responsabilitate | It was my responsibility to check the gear.
deadline | termen limită | The deadline is Friday.
shift | tură | I work the night shift.
apply for | a aplica pentru | I'm applying for this position.
position | post / poziție | The position requires a driving licence.
hire | a angaja | They hired two new officers.
salary | salariu | The salary is paid monthly.
training | instruire / antrenament | The training lasts six months.
background | parcurs / trecut profesional | Tell me about your background.
motivated | motivat | I'm highly motivated to learn.
commitment | angajament / dedicare | This job needs total commitment.
improve myself | a mă perfecționa | I always try to improve myself.
handle | a gestiona / a face față | How do you handle stress?
feedback | părere / evaluare | I asked my coach for feedback.
achievement | realizare | My biggest achievement was finishing the course.
fit | potrivit / a se potrivi | I think I'm a good fit for this role.
`,
  secur: `
threat | amenințare | The threat level was raised.
suspect | suspect | The suspect ran into the building.
witness | martor | We need a witness statement.
evidence | probe / dovezi | Don't touch the evidence.
arrest | a aresta / arestare | Police arrested two men.
search | a percheziționa / percheziție | They searched the car.
surveillance | supraveghere | The house was under surveillance.
hostage | ostatic | Three hostages were released.
weapon | armă | Drop the weapon!
bomb disposal | deminare / pirotehnie | The bomb disposal team arrived.
backup | întăriri | Request backup now.
perimeter | perimetru | Secure the perimeter.
checkpoint | punct de control | Stop at the checkpoint.
clearance | autorizare / acces | You need security clearance.
intelligence | informații (serviciu de) | The operation was based on intelligence.
undercover | sub acoperire | He worked undercover for two years.
emergency services | serviciile de urgență | Call the emergency services.
crowd | mulțime | The crowd moved toward the gate.
injured | rănit | Two people are injured.
escape | a evada / a scăpa | The driver tried to escape.
surrender | a se preda | The gunman surrendered after an hour.
on duty | în serviciu / de serviciu | Who's on duty tonight?
stand by | a fi în așteptare / pregătit | Stand by for further orders.
copy that | recepționat / am înțeles | Copy that, moving in.
`,
  sport: `
workout | antrenament | Today's workout is short but hard.
warm up | a se încălzi / încălzire | Always warm up before sprinting.
stretch | a se întinde / întindere | Stretch after the session.
set | serie | Do three sets of ten.
rep | repetare | Two more reps!
rest | pauză / odihnă | Rest for ninety seconds.
weight | greutate | Add weight next week.
lose weight | a slăbi | I want to lose weight without losing muscle.
muscle | mușchi | Protein helps you keep muscle.
injury | accidentare | A knee injury stopped him.
sore | febril / dureros (după efort) | My legs are sore after yesterday.
endurance | rezistență | Running builds endurance.
strength | forță | Strength training twice a week.
heart rate | puls | Keep your heart rate in zone two.
breathe | a respira | Breathe out as you push.
pull-up | tracțiune | I can do eight pull-ups.
push-up | flotare | Twenty push-ups, go.
squat | genuflexiune | Squats hurt my knees.
jump rope | coardă / a sări coarda | Jump rope for three minutes.
recover | a se recupera | Sleep helps you recover.
sleep | somn / a dormi | I need eight hours of sleep.
shape | formă (fizică) | I'm in good shape.
tired | obosit | I'm too tired to train today.
progress | progres | Track your progress every week.
`,
  urgente: `
help | ajutor | Help! Somebody call an ambulance!
call an ambulance | sună la ambulanță | Call an ambulance, he's not breathing.
bleeding | sângerare / sângerează | Press hard to stop the bleeding.
pressure | presiune / apăsare | Apply pressure to the wound.
tourniquet | garou | Put a tourniquet above the wound.
unconscious | inconștient | The driver is unconscious.
breathing | respiră / respirație | Is he breathing?
CPR | resuscitare | Start CPR: thirty compressions.
broken | rupt / fracturat | I think my arm is broken.
burn | arsură / a arde | Cool the burn with water for twenty minutes.
allergic | alergic | I'm allergic to penicillin.
dizzy | amețit | I feel dizzy.
pain | durere | Where is the pain?
hurt | a durea / rănit | My back hurts.
fire | incendiu / foc | Fire! Get out of the building!
smoke | fum | Stay low, under the smoke.
exit | ieșire | Where's the nearest exit?
safe | în siguranță | You're safe now.
stay calm | păstrează-ți calmul | Stay calm, help is coming.
don't move | nu te mișca | Don't move, you may have a neck injury.
accident | accident | There's been an accident on the bridge.
address | adresă | What's your address?
lost | pierdut / rătăcit | I'm lost, can you help me?
police station | secție de poliție | Where's the police station?
`,
  oras: `
straight ahead | drept înainte | Go straight ahead for two blocks.
turn left | fă la stânga | Turn left at the lights.
turn right | fă la dreapta | Turn right after the bank.
next to | lângă | The pharmacy is next to the bakery.
opposite | vizavi / în fața | The hotel is opposite the station.
corner | colț | Meet me at the corner.
crossroads | intersecție | Stop at the crossroads.
traffic lights | semafor | Wait at the traffic lights.
far | departe | Is it far from here?
nearby | în apropiere | Is there a gas station nearby?
ticket | bilet | One ticket to London, please.
return ticket | bilet dus-întors | A return ticket, please.
platform | peron | The train leaves from platform four.
delay | întârziere | There's a thirty-minute delay.
booking | rezervare | I have a booking for two nights.
check out | a elibera camera | Check out is at eleven.
luggage | bagaje | Leave your luggage here.
receipt | bon / chitanță | Can I have a receipt?
change | rest / mărunt | Keep the change.
cash | numerar | Do you take cash?
how much | cât costă | How much is it?
get off | a coborî (din mijloc de transport) | Get off at the next stop.
rush hour | oră de vârf | Avoid driving at rush hour.
map | hartă | Can you show me on the map?
`,
  expresii: `
break the ice | a sparge gheața | He told a joke to break the ice.
piece of cake | floare la ureche | The test was a piece of cake.
hit the gym | a merge la sală | I hit the gym after work.
on the same page | pe aceeași lungime de undă | Let's make sure we're on the same page.
cut corners | a lucra superficial / a tăia din pași | Don't cut corners on safety.
the bottom line | concluzia / esențialul | The bottom line is we need more people.
get the hang of | a prinde mișcarea | You'll get the hang of it.
keep an eye on | a fi cu ochii pe | Keep an eye on the door.
hang in there | rezistă / ține-te tare | Hang in there, it gets easier.
under the weather | puțin bolnav / indispus | I'm a bit under the weather today.
call it a day | a încheia pe azi | It's late, let's call it a day.
no pain, no gain | fără efort, nu e rezultat | No pain, no gain.
a long shot | o șansă mică | It's a long shot, but let's try.
in the long run | pe termen lung | In the long run, consistency wins.
better safe than sorry | mai bine prevenit decât vindecat | Take the vest. Better safe than sorry.
easier said than done | ușor de zis, greu de făcut | Losing twenty kilos is easier said than done.
on the spot | pe loc | They hired him on the spot.
step up | a face un pas înainte / a-și asuma | Someone has to step up and lead.
the last straw | picătura care umple paharul | Being late again was the last straw.
by heart | pe de rost | Learn these phrases by heart.
face the music | a-și asuma consecințele | He made a mistake and now he has to face the music.
go the extra mile | a face mai mult decât trebuie | She always goes the extra mile.
once in a blue moon | o dată la o mie de ani | I eat sweets once in a blue moon.
it's up to you | depinde de tine / tu decizi | It's up to you.
`,
};

const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const WORDS: Word[] = (Object.keys(RAW) as DeckId[]).flatMap((deck) =>
  RAW[deck].trim().split('\n').map((line) => {
    const [en = '', ro = '', ex = ''] = line.split('|').map((x) => x.trim());
    return { id: `${deck}:${slug(en)}`, deck, en, ro, ex: ex === '—' ? '' : ex };
  }),
);

export const deckWords = (d: DeckId): Word[] => WORDS.filter((w) => w.deck === d);
export const wordById = (id: string): Word | undefined => WORDS.find((w) => w.id === id);
export const deckById = (id: DeckId): Deck => DECKS.find((d) => d.id === id) ?? DECKS[0]!;
