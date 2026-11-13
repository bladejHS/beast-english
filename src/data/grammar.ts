// Grammar drills for the mistakes Romanian speakers make most: one blank, three options, a one-line reason.
// One line per item: "sentence with ___ | option / option / option | index of the right one | why (Romanian)".

export type TopicId = 'perfect' | 'sincefor' | 'articole' | 'makedo' | 'saytell' | 'prep' | 'intrebari' | 'cantitati' | 'cond' | 'viitor';

export interface Topic { id: TopicId; name: string; rule: string }
export interface GItem { id: string; topic: TopicId; s: string; opts: string[]; a: number; why: string }

export const TOPICS: Topic[] = [
  { id: 'perfect', name: 'Present perfect sau past simple', rule: 'Moment terminat și precizat (yesterday, in 2020, ago): past simple. Fără moment, sau până acum: present perfect.' },
  { id: 'sincefor', name: 'Since, for, ago', rule: 'Since + punctul de pornire (2020, Monday). For + durata (three years). Ago = „în urmă”, cu past simple.' },
  { id: 'articole', name: 'A, an, the sau nimic', rule: 'A/an la prima mențiune și la meserii. The când e clar despre care e vorba. Nimic la plural și la nenumărabile în general.' },
  { id: 'makedo', name: 'Make sau do', rule: 'Make = creezi ceva (a mistake, a decision, money). Do = faci o activitate (homework, sport, your job).' },
  { id: 'saytell', name: 'Say sau tell', rule: 'Tell + cuiva (tell me). Say + ceva (say hello), sau say to someone.' },
  { id: 'prep', name: 'In, on, at', rule: 'At + oră și punct (at 6, at the door). On + zi și suprafață (on Monday, on the table). In + lună, an, spațiu închis (in May, in the car).' },
  { id: 'intrebari', name: 'Întrebări și do/does', rule: 'Întrebările la prezent au do/does înainte de subiect, iar verbul rămâne fără -s: Does he work?' },
  { id: 'cantitati', name: 'Much, many, a lot', rule: 'Many + plural numărabil. Much + nenumărabil (mai ales în negații și întrebări). A lot of merge la amândouă.' },
  { id: 'cond', name: 'Condiționalele', rule: 'If + prezent, will (real). If + trecut, would (imaginar). După if nu se pune will.' },
  { id: 'viitor', name: 'Viitorul', rule: 'Will = decizie pe loc, promisiune, predicție. Going to = plan deja făcut. Prezent continuu = aranjament fix.' },
];

const RAW: Record<TopicId, string> = {
  perfect: `
I ___ to London last year. | have been / went / have gone | 1 | „Last year” e un moment terminat: past simple.
I ___ him since Monday. | didn't see / haven't seen / don't see | 1 | Since + punct de pornire: present perfect.
___ you ever ___ sushi? | Did / eat ; Have / eaten ; Do / eat | 1 | „Ever” = vreodată în viață, fără moment: present perfect.
She ___ her keys. She can't get in. | lost / has lost / loses | 1 | Rezultatul se vede acum: present perfect.
We ___ the match two days ago. | have won / won / win | 1 | „Ago” cere past simple.
I ___ my homework yet. | didn't finish / haven't finished / don't finish | 1 | „Yet” în negații merge cu present perfect.
When ___ you ___ here? | have / arrived ; did / arrive ; do / arrive | 1 | „When” întreabă de un moment: past simple.
He ___ in the army for ten years, then he retired. | has served / served / serves | 1 | Perioadă încheiată în trecut: past simple.
`,
  sincefor: `
I've lived here ___ 2019. | for / since / ago | 1 | 2019 e punctul de pornire: since.
I've lived here ___ five years. | for / since / ago | 0 | Cinci ani e o durată: for.
I moved here five years ___. | for / since / ago | 2 | „Ago” = în urmă, după durată.
We've been waiting ___ an hour. | for / since / ago | 0 | O oră e o durată: for.
She hasn't called ___ last week. | for / since / ago | 1 | Last week e punctul de pornire: since.
How long ___ you known him? | do / have / are | 1 | „How long” până acum: present perfect.
`,
  articole: `
He is ___ police officer. | a / the / — | 0 | Meseriile primesc a/an.
I need ___ advice. | an / the / — | 2 | „Advice” e nenumărabil: fără a/an.
Can you close ___ door, please? | a / the / — | 1 | E clar despre care ușă: the.
___ life is short. | A / The / — | 2 | Viața în general: fără articol.
I saw ___ accident on the highway. | a / an / the | 1 | Accident începe cu sunet de vocală: an.
She's ___ honest person. | a / an / the | 1 | „Honest” se pronunță fără h: an.
He goes to ___ gym every day. | a / the / — | 1 | „The gym” = sala lui obișnuită.
I like ___ dogs. | the / a / — | 2 | Câinii în general, la plural: fără articol.
`,
  makedo: `
I ___ a mistake. | did / made / took | 1 | Mistake merge cu make.
Let's ___ a decision now. | do / make / have | 1 | Decision merge cu make (în engleza britanică și take), niciodată cu do.
I ___ my homework every evening. | do / make / have | 0 | Homework merge cu do.
He ___ a lot of money. | does / makes / wins | 1 | Money merge cu make.
Can you ___ me a favour? | make / do / give | 1 | A favour merge cu do.
I ___ sport three times a week. | make / do / go | 1 | „Do sport” (iar cu sportul anume: play football, go running).
Don't ___ noise, the baby is sleeping. | do / make / have | 1 | Noise merge cu make.
`,
  saytell: `
He ___ me the truth. | said / told / spoke | 1 | Tell + cuiva.
She ___ hello and left. | told / said / talked | 1 | Say + ceva.
Can you ___ me the time? | say / tell / speak | 1 | Tell + cuiva + ceva.
What did he ___ to you? | tell / say / talk | 1 | Say to someone.
___ me what happened. | Say / Tell / Speak | 1 | Tell + cuiva.
`,
  prep: `
The meeting is ___ 9 o'clock. | in / on / at | 2 | Ora exactă: at.
I was born ___ May. | in / on / at | 0 | Luna: in.
See you ___ Monday. | in / on / at | 1 | Ziua: on.
He's waiting ___ the door. | in / on / at | 2 | Un punct anume: at.
Your phone is ___ the table. | in / on / at | 1 | Pe o suprafață: on.
I'll call you ___ the morning. | in / on / at | 0 | Părțile zilei: in the morning (dar at night).
She's ___ the car. | in / on / at | 0 | Spațiu închis: in.
I'm ___ work right now. | in / on / at | 2 | At work, at home, at school.
`,
  intrebari: `
___ he work on Saturdays? | Do / Does / Is | 1 | He/she/it: does.
Where ___ you live? | do / does / are | 0 | You: do.
Does she ___ English? | speaks / speak / speaking | 1 | După does, verbul e fără -s.
What time ___ the train leave? | do / does / is | 1 | The train = it: does.
He ___ like coffee. | don't / doesn't / isn't | 1 | Negația la he: doesn't.
She ___ every morning. | run / runs / is run | 1 | La prezent simplu, he/she/it primește -s.
`,
  cantitati: `
How ___ people were there? | much / many / lot | 1 | People e plural numărabil: many.
How ___ water do you drink? | much / many / few | 0 | Water e nenumărabil: much.
I don't have ___ time. | many / much / few | 1 | Time e nenumărabil: much.
There are ___ cars outside. | much / a lot of / a little | 1 | „A lot of” merge cu orice, mai ales în afirmații.
We have ___ problems. | a little / a few / much | 1 | Problems e numărabil: a few.
I need ___ sugar. | a few / a little / many | 1 | Sugar e nenumărabil: a little.
`,
  cond: `
If it rains, we ___ inside. | train / will train / would train | 1 | Situație reală: if + prezent, will.
If I ___ more time, I would read more. | have / had / will have | 1 | Imaginar: if + trecut, would.
If you ___ the button, the door opens. | press / will press / pressed | 0 | Adevăr general: prezent în ambele părți.
I'll call you if I ___ late. | will be / am / would be | 1 | După if nu se pune will.
If I were you, I ___ that. | won't do / wouldn't do / don't do | 1 | „If I were you” cere would.
`,
  viitor: `
The phone is ringing. I ___ it. | 'll get / 'm going to get / get | 0 | Decizie luată pe loc: will.
I ___ join the army next year, I've already applied. | will / am going to / would | 1 | Plan deja făcut: going to.
Look at those clouds. It ___ rain. | will / is going to / would | 1 | Semne vizibile acum: going to.
I ___ the dentist tomorrow at ten. | see / am seeing / would see | 1 | Aranjament fix, cu oră: prezent continuu.
I promise I ___ tell anyone. | won't / am not going to / don't | 0 | Promisiune: will.
`,
};

export const GRAMMAR: GItem[] = (Object.keys(RAW) as TopicId[]).flatMap((topic) =>
  RAW[topic].trim().split('\n').map((line, i) => {
    const [s = '', opts = '', a = '0', why = ''] = line.split('|').map((x) => x.trim());
    // two-blank items list their options as "a / b ; c / d ; …", single blanks as "a / b / c"
    const list = opts.includes(';') ? opts.split(';').map((o) => o.trim().replace(' / ', ' … ')) : opts.split(' / ').map((o) => o.trim());
    return { id: `${topic}:${i}`, topic, s, opts: list, a: Number(a), why };
  }),
);

export const topicItems = (t: TopicId): GItem[] => GRAMMAR.filter((g) => g.topic === t);
export const topicById = (t: TopicId): Topic => TOPICS.find((x) => x.id === t) ?? TOPICS[0]!;
