const MOBILE_ARENA_WIDTH = 720;
const PHONE_ARENA_WIDTH = 480;

export function isMobileArena(arena) {
  return arena.width <= MOBILE_ARENA_WIDTH;
}

export function tuneLevelForArena(level, arena) {
  if (!isMobileArena(arena)) {
    return level;
  }

  const isPhone = arena.width <= PHONE_ARENA_WIDTH;
  const speedScale = isPhone ? 0.56 : 0.68;
  const spawnScale = isPhone ? 1.75 : 1.45;

  return {
    ...level,
    baseSpeed: Math.round(level.baseSpeed * speedScale),
    spawnIntervalMs: Math.round(level.spawnIntervalMs * spawnScale),
    initialSpawnDelayMs: Math.round(level.initialSpawnDelayMs * 1.25 + 300),
    maxConcurrentWords: Math.min(level.maxConcurrentWords, isPhone ? 2 : 3),
    wordFontScale: isPhone ? 0.78 : 0.86,
  };
}

export function splitMobilePromptText(value) {
  return value.split(/( )/).filter(Boolean).map((part) => ({
    text: part === ' ' ? 'espaco' : part,
    isSpace: part === ' ',
  }));
}
