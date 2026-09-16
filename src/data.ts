import { shuffle } from "./game";
import { artwork } from "./artwork";
export type ObjectId =
  | "eiffel"
  | "pyramid"
  | "liberty"
  | "clock"
  | "rocket"
  | "airbus"
  | "titanic"
  | "pitch"
  | "whale"
  | "trex"
  | "bus"
  | "giraffe"
  | "elephant"
  | "hoop";
export type GameObject = {
  id: ObjectId;
  name: string;
  label: string;
  size: number;
  width: number;
  height: number;
  axis: "x" | "y";
  note: string;
  source: string;
  illustration?: {
    src: string;
    imageWidth: number;
    imageHeight: number;
    crop: [number, number, number, number];
  };
};
export const objects: Record<ObjectId, GameObject> = {
  eiffel: {
    id: "eiffel",
    name: "Эйфелева башня",
    label: "Париж, Франция",
    size: 330,
    width: 126,
    height: 330,
    axis: "y",
    note: "Высота вместе с антенной — 330 м.",
    source: "https://www.toureiffel.paris/en/the-monument/key-figures",
  },
  pyramid: {
    id: "pyramid",
    name: "Пирамида Хеопса",
    label: "Первоначальная высота",
    size: 146.6,
    width: 230.3,
    height: 146.6,
    axis: "y",
    note: "Сравниваем первоначальную высоту пирамиды — 146,6 м. Сегодня она ниже: вершина и часть облицовки утрачены.",
    source: "https://www.si.edu/spotlight/ancient-egypt/pyramid",
  },
  liberty: {
    id: "liberty",
    name: "Статуя Свободы",
    label: "Вместе с пьедесталом",
    size: 93,
    width: 32,
    height: 93,
    axis: "y",
    note: "93 м — от земли до факела, вместе с пьедесталом. Сама статуя заметно ниже.",
    source: "https://www.nps.gov/places/000/statue-front.htm",
  },
  clock: {
    id: "clock",
    name: "Биг-Бен",
    label: "Башня Елизаветы, Лондон",
    size: 96,
    width: 16,
    height: 96,
    axis: "y",
    note: "Сравниваем башню Елизаветы высотой 96 м. Биг-Бен — название её большого колокола.",
    source:
      "https://www.parliament.uk/about/living-heritage/building/palace/big-ben/facts-figures/",
  },
  rocket: {
    id: "rocket",
    name: "Ракета «Фалькон-9»",
    label: "С головным обтекателем",
    size: 70,
    width: 5.2,
    height: 70,
    axis: "y",
    note: "Высота ракеты в конфигурации со стандартным головным обтекателем — 70 м.",
    source:
      "https://www.spacex.com/assets/media/falcon-users-guide-2025-05-09.pdf",
  },
  airbus: {
    id: "airbus",
    name: "Аэробус А380",
    label: "Вид сбоку · от носа до хвоста",
    size: 72.7,
    width: 72.7,
    height: 24.1,
    axis: "x",
    note: "Длина двухпалубного А380 — 72,7 м. Здесь сравнивается длина, а не размах крыльев.",
    source:
      "https://www.airbus.com/sites/g/files/jlcbta136/files/2021-10/EN-Airbus-A380-Facts-and-Figures_0.pdf",
  },
  titanic: {
    id: "titanic",
    name: "«Титаник»",
    label: "От носа до кормы",
    size: 269,
    width: 269,
    height: 53.3,
    axis: "x",
    note: "Длина лайнера — около 269 м. Это больше двух с половиной футбольных полей.",
    source:
      "https://www.ireland.com/en/magazine/long-reads/belfasts-titanic-legacy/",
  },
  pitch: {
    id: "pitch",
    name: "Футбольное поле",
    label: "Рекомендуемый размер ФИФА",
    size: 105,
    width: 105,
    height: 68,
    axis: "x",
    note: "Берём поле 105 × 68 м — размер, рекомендованный ФИФА. Сравниваем длинную сторону.",
    source:
      "https://publications.fifa.com/es/football-stadiums-guidelines/technical-guideline/stadium-guidelines/pitch-dimensions-and-surrounding-areas/",
  },
  whale: {
    id: "whale",
    name: "Синий кит",
    label: "Крупный взрослый · от головы до хвоста",
    size: 30,
    ...artwork.whale,
    axis: "x",
    note: "Здесь сравниваем крупного синего кита длиной 30 м. Размеры зависят от популяции: антарктические киты могут быть ещё длиннее.",
    source: "https://www.fisheries.noaa.gov/species/blue-whale",
  },
  trex: {
    id: "trex",
    name: "Тираннозавр",
    label: "Взрослый · от носа до кончика хвоста",
    size: 12,
    ...artwork.trex,
    axis: "x",
    note: "Взрослый тираннозавр — около 12 м от носа до кончика хвоста. Это оценка по ископаемым остаткам, а не размер каждого динозавра.",
    source: "https://www.nhm.ac.uk/discover/dino-directory/tyrannosaurus.html",
  },
  bus: {
    id: "bus",
    name: "Лондонский автобус",
    label: "Классический Routemaster RM · длина",
    size: 8.38,
    ...artwork.bus,
    axis: "x",
    note: "Короткий классический Routemaster RM имеет длину 27 футов 6 дюймов — примерно 8,38 м. Более длинный RML здесь не используется.",
    source: "https://routemaster.org.uk/pages/history-51-RMF",
  },
  giraffe: {
    id: "giraffe",
    name: "Жираф",
    label: "Взрослый самец · до верхушки рожек",
    size: 5,
    ...artwork.giraffe,
    axis: "y",
    note: "Для сравнения взят взрослый самец высотой 5 м. Это пример: самцы жирафов могут достигать примерно 5,5 м.",
    source: "https://animals.sandiegozoo.org/animals/giraffe",
  },
  elephant: {
    id: "elephant",
    name: "Африканский слон",
    label: "Взрослый самец · высота в плечах",
    size: 3.2,
    ...artwork.elephant,
    axis: "y",
    note: "Сравниваем самца высотой 3,2 м в плечах. Это верхняя граница среднего диапазона 3–3,2 м, приведённого зоопарком Сан-Диего.",
    source: "https://animals.sandiegozoo.org/animals/elephant",
  },
  hoop: {
    id: "hoop",
    name: "Баскетбольное кольцо",
    label: "От пола до верхнего края кольца",
    size: 3.05,
    ...artwork.hoop,
    axis: "y",
    note: "Верхний край баскетбольного кольца находится на высоте 3,05 м. Сравниваем именно кольцо: щит и опора выше него.",
    source:
      "https://assets.fiba.basketball/image/upload/documents-corporate-fiba-official-rules-2024-official-basketball-rules-and-basketball-equipment.pdf",
  },
};
export type Pair = {
  id: string;
  reference: ObjectId;
  target: ObjectId;
  title: string;
};
export const pairs: Pair[] = [
  {
    id: "ny-london",
    reference: "liberty",
    target: "clock",
    title: "Биг-Бен рядом со Статуей Свободы",
  },
  {
    id: "plane-pitch",
    reference: "airbus",
    target: "pitch",
    title: "Поле рядом с самолётом",
  },
  {
    id: "paris-egypt",
    reference: "eiffel",
    target: "pyramid",
    title: "Париж и Древний Египет",
  },
  {
    id: "paris-ny",
    reference: "eiffel",
    target: "liberty",
    title: "Два символа, один масштаб",
  },
  {
    id: "paris-space",
    reference: "eiffel",
    target: "rocket",
    title: "Башня и ракета",
  },
  {
    id: "london-ny",
    reference: "clock",
    target: "liberty",
    title: "Лондон встречает Нью-Йорк",
  },
  {
    id: "london-space",
    reference: "clock",
    target: "rocket",
    title: "Ракета рядом с Биг-Беном",
  },
  {
    id: "egypt-space",
    reference: "pyramid",
    target: "rocket",
    title: "Ракета у пирамиды",
  },
  {
    id: "egypt-london",
    reference: "pyramid",
    target: "clock",
    title: "Камень и часы",
  },
  {
    id: "ship-plane",
    reference: "titanic",
    target: "airbus",
    title: "Гиганты моря и неба",
  },
  {
    id: "ship-pitch",
    reference: "titanic",
    target: "pitch",
    title: "Футбол на палубе",
  },
  {
    id: "pitch-plane",
    reference: "pitch",
    target: "airbus",
    title: "Самолёт на футбольном поле",
  },
  {
    id: "plane-whale",
    reference: "airbus",
    target: "whale",
    title: "Кит рядом с авиалайнером",
  },
  {
    id: "whale-trex",
    reference: "whale",
    target: "trex",
    title: "Хищник рядом с китом",
  },
  {
    id: "whale-bus",
    reference: "whale",
    target: "bus",
    title: "Сколько автобусов в одном ките?",
  },
  {
    id: "bus-trex",
    reference: "bus",
    target: "trex",
    title: "Тираннозавр на автобусной остановке",
  },
  {
    id: "pitch-whale",
    reference: "pitch",
    target: "whale",
    title: "Кит на футбольном поле",
  },
  {
    id: "giraffe-elephant",
    reference: "giraffe",
    target: "elephant",
    title: "Слон рядом с жирафом",
  },
  {
    id: "elephant-giraffe",
    reference: "elephant",
    target: "giraffe",
    title: "Кто выше в саванне?",
  },
  {
    id: "giraffe-hoop",
    reference: "giraffe",
    target: "hoop",
    title: "Жираф на баскетбольной площадке",
  },
  {
    id: "elephant-hoop",
    reference: "elephant",
    target: "hoop",
    title: "Слон и баскетбольное кольцо",
  },
  {
    id: "hoop-elephant",
    reference: "hoop",
    target: "elephant",
    title: "Слон под кольцом",
  },
];

export function chooseRounds(): Pair[] {
  const chosen: Pair[] = [];
  for (const [axis, count] of [
    ["y", 3],
    ["x", 2],
  ] as const) {
    const candidates = shuffle(
      pairs.filter((p) => objects[p.reference].axis === axis),
    );
    let selected = 0;
    for (const p of candidates) {
      if (chosen.some((c) => c.target === p.target)) continue;
      chosen.push(p);
      if (++selected === count) break;
    }
  }
  return shuffle(chosen);
}
