const TWO_PI = Math.PI * 2;
const EASY_SPAWN_ARCS = [
  [-Math.PI * 0.08, Math.PI * 0.08],
  [Math.PI * 0.92, Math.PI * 1.08],
  [Math.PI * 0.18, Math.PI * 0.36],
  [Math.PI * 1.64, Math.PI * 1.82],
];
export const WORD_FONT_FAMILIES = [
  '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace',
  'Georgia, "Times New Roman", serif',
  '"Trebuchet MS", "Gill Sans", sans-serif',
  '"Courier New", Courier, monospace',
  'Verdana, Geneva, sans-serif',
];

export function getWordComplexity(word) {
  const length = word.length;
  if (length <= 5) {
    return 0;
  }

  if (length <= 9) {
    return 1;
  }

  return 2;
}

export function chooseSpawnAngle(rng = Math.random, fullCircle = false) {
  if (fullCircle) {
    return rng() * TWO_PI;
  }

  const arc = EASY_SPAWN_ARCS[Math.floor(rng() * EASY_SPAWN_ARCS.length)] || EASY_SPAWN_ARCS[0];
  return arc[0] + rng() * (arc[1] - arc[0]);
}

export function getSpawnPoint(arena, radialAngle) {
  const centerX = arena.width / 2;
  const centerY = arena.height / 2;
  const radius = Math.hypot(arena.width, arena.height) / 2 + 120;

  return {
    x: centerX + Math.cos(radialAngle) * radius,
    y: centerY + Math.sin(radialAngle) * radius,
  };
}

export function getWordSpeed(word, baseSpeed) {
  const complexity = getWordComplexity(word);
  const longWordPenalty = Math.max(0, word.length - 5) * 16;
  const oversizedPenalty = Math.max(0, word.length - 10) * 9;
  return Math.max(42, baseSpeed - complexity * 14 - longWordPenalty - oversizedPenalty);
}

function chooseWordFontFamily(rng) {
  const index = Math.floor(rng() * WORD_FONT_FAMILIES.length);
  return WORD_FONT_FAMILIES[index] || WORD_FONT_FAMILIES[0];
}

function normalizeReadableRotation(angle) {
  let nextAngle = angle;

  while (nextAngle > Math.PI / 2) {
    nextAngle -= Math.PI;
  }

  while (nextAngle < -Math.PI / 2) {
    nextAngle += Math.PI;
  }

  return nextAngle;
}

export function createWordEnemy({ level, text, spawnOrder, arena, now = 0, rng = Math.random }) {
  const radialAngle = chooseSpawnAngle(rng, level.fullCircleSpawns);
  const point = getSpawnPoint(arena, radialAngle);
  const speed = getWordSpeed(text, level.baseSpeed);
  const complexity = getWordComplexity(text);
  const fontScale = level.wordFontScale || 1;
  const fontSize = Math.max(20, Math.round((26 + complexity * 2) * fontScale));
  const travelAngle = radialAngle + Math.PI;
  const tiltDirection = rng() < 0.5 ? -1 : 1;
  const rotationTilt = tiltDirection * (0.28 + rng() * 0.22);

  return {
    id: `${spawnOrder}-${text}-${Math.round(now)}`,
    text,
    typedCount: 0,
    spawnOrder,
    x: point.x,
    y: point.y,
    radialAngle,
    rotation: normalizeReadableRotation(travelAngle + rotationTilt),
    speed,
    damage: level.damagePerWord + (complexity === 2 && level.id === 3 ? 1 : 0),
    fontSize,
    fontFamily: chooseWordFontFamily(rng),
    radius: Math.max(20, (24 + text.length * 4.8) * fontScale),
    status: 'alive',
    enteredViewport: false,
    createdAt: now,
    feedbackUntil: 0,
  };
}

export function moveWordTowardCenter(enemy, arena, deltaMs) {
  if (enemy.status !== 'alive') {
    return enemy;
  }

  const centerX = arena.width / 2;
  const centerY = arena.height / 2;
  const dx = centerX - enemy.x;
  const dy = centerY - enemy.y;
  const distance = Math.hypot(dx, dy) || 1;
  const frameDistance = enemy.speed * (deltaMs / 1000);

  return {
    ...enemy,
    x: enemy.x + (dx / distance) * frameDistance,
    y: enemy.y + (dy / distance) * frameDistance,
  };
}

export function pickNextWord(dictionary, usedWords, rng = Math.random) {
  const available = dictionary.filter((word) => !usedWords.has(word));
  const source = available.length > 0 ? available : dictionary;
  const index = Math.floor(rng() * source.length);
  return source[index] || 'palavra';
}
