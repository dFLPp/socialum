import { getLevelBackground, getLevelMusic } from './assets.js';
import { buildDictionary } from './words.js';

export const FINAL_LEVEL_ID = 3;

export const LEVELS = [
  {
    id: 1,
    name: 'Fase 1: Primeira onda',
    description: 'Palavras curtas, laterais e com bastante tempo para reagir.',
    wordCount: 15,
    spawnIntervalMs: 850,
    initialSpawnDelayMs: 900,
    baseSpeed: 150,
    maxConcurrentWords: 4,
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
    name: 'Fase 2: Rotas cruzadas',
    description: 'Mais palavras curtas, ângulos variados e ritmo controlado.',
    wordCount: 20,
    spawnIntervalMs: 820,
    initialSpawnDelayMs: 700,
    baseSpeed: 150,
    maxConcurrentWords: 5,
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
    name: 'Fase 3: Cerco total',
    description: 'Ataques em 360 graus com palavras curtas e muita variedade.',
    wordCount: 28,
    spawnIntervalMs: 900,
    initialSpawnDelayMs: 600,
    baseSpeed: 145,
    maxConcurrentWords: 5,
    lives: 3,
    damagePerWord: 1,
    fullCircleSpawns: true,
    shadedZones: false,
    dictionary: buildDictionary(3),
    musicSrc: getLevelMusic(3),
    backgroundSrc: getLevelBackground(3),
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
