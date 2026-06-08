import { getLevelBackground, getLevelMusic } from './assets.js';
import { buildDictionary } from './words.js';

export const FINAL_LEVEL_ID = 5;

export const LEVELS = [
  {
    id: 1,
    name: 'Fase 1: Provocações',
    description: 'Apague provocações curtas antes que elas encostem em você.',
    wordCount: 15,
    spawnIntervalMs: 920,
    initialSpawnDelayMs: 900,
    baseSpeed: 125,
    maxConcurrentWords: 3,
    lives: 3,
    damagePerWord: 1,
    fullCircleSpawns: false,
    shadedZones: true,
    dictionary: buildDictionary(1),
    musicSrc: getLevelMusic(1),
    backgroundSrc: getLevelBackground(1),
  },
  {
    id: 2,
    name: 'Fase 2: Insultos',
    description: 'Mais insultos aparecem, ainda curtos, mas com menos espaço.',
    wordCount: 18,
    spawnIntervalMs: 880,
    initialSpawnDelayMs: 700,
    baseSpeed: 135,
    maxConcurrentWords: 4,
    lives: 3,
    damagePerWord: 1,
    fullCircleSpawns: false,
    shadedZones: true,
    dictionary: buildDictionary(2),
    musicSrc: getLevelMusic(2),
    backgroundSrc: getLevelBackground(2),
  },
  {
    id: 3,
    name: 'Fase 3: Palavrões',
    description: 'O tom fica mais agressivo, com palavras ofensivas para apagar.',
    wordCount: 22,
    spawnIntervalMs: 840,
    initialSpawnDelayMs: 600,
    baseSpeed: 145,
    maxConcurrentWords: 4,
    lives: 3,
    damagePerWord: 1,
    fullCircleSpawns: false,
    shadedZones: true,
    dictionary: buildDictionary(3),
    musicSrc: getLevelMusic(3),
    backgroundSrc: getLevelBackground(3),
  },
  {
    id: 4,
    name: 'Fase 4: Ataques',
    description: 'Ataques pessoais entram em cena com ritmo mais apertado.',
    wordCount: 26,
    spawnIntervalMs: 800,
    initialSpawnDelayMs: 600,
    baseSpeed: 150,
    maxConcurrentWords: 5,
    lives: 3,
    damagePerWord: 1,
    fullCircleSpawns: true,
    shadedZones: false,
    dictionary: buildDictionary(4),
    musicSrc: getLevelMusic(4),
    backgroundSrc: getLevelBackground(4),
  },
  {
    id: 5,
    name: 'Fase 5: Espiral',
    description: 'Tudo vem de todos os lados. Escreva para cortar cada ataque.',
    wordCount: 30,
    spawnIntervalMs: 760,
    initialSpawnDelayMs: 550,
    baseSpeed: 155,
    maxConcurrentWords: 5,
    lives: 3,
    damagePerWord: 1,
    fullCircleSpawns: true,
    shadedZones: false,
    dictionary: buildDictionary(5),
    musicSrc: getLevelMusic(5),
    backgroundSrc: getLevelBackground(5),
  },
];

export function getLevelById(levelId) {
  return LEVELS.find((level) => level.id === Number(levelId)) || LEVELS[0];
}

export function getUnlockedLevelIds(progress) {
  const completed = new Set(progress.completedLevels || []);
  const nextLevel = Math.min(progress.nextLevel || 1, FINAL_LEVEL_ID);

  return LEVELS.filter((level) => completed.has(level.id) || level.id <= nextLevel).map(
    (level) => level.id
  );
}
