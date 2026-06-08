import { FINAL_LEVEL_ID } from './levels.js';

export const PROGRESS_KEY = 'wordSiegeProgress:v1';

export const DEFAULT_PROGRESS = {
  completedLevels: [],
  nextLevel: 1,
  timesCleared: 0,
};

function cleanProgress(value) {
  if (!value || typeof value !== 'object') {
    return { ...DEFAULT_PROGRESS };
  }

  const completedLevels = Array.isArray(value.completedLevels)
    ? [...new Set(value.completedLevels.map(Number))].filter(
        (levelId) => levelId >= 1 && levelId <= FINAL_LEVEL_ID
      )
    : [];
  const maxCompleted = completedLevels.length > 0 ? Math.max(...completedLevels) : 0;
  const nextLevel = Math.min(FINAL_LEVEL_ID, Math.max(Number(value.nextLevel) || 1, maxCompleted + 1));
  const timesCleared = Math.max(0, Number(value.timesCleared) || 0);

  return { completedLevels, nextLevel, timesCleared };
}

export function loadProgress(storage = window.localStorage) {
  try {
    const raw = storage.getItem(PROGRESS_KEY);
    return raw ? cleanProgress(JSON.parse(raw)) : { ...DEFAULT_PROGRESS };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress, storage = window.localStorage) {
  const clean = cleanProgress(progress);
  try {
    storage.setItem(PROGRESS_KEY, JSON.stringify(clean));
  } catch {
    return clean;
  }

  return clean;
}

export function completeLevel(progress, levelId, storage = window.localStorage) {
  const clean = cleanProgress(progress);
  const completedLevels = [...new Set([...clean.completedLevels, Number(levelId)])].sort((a, b) => a - b);
  const nextLevel = Math.min(FINAL_LEVEL_ID, Math.max(clean.nextLevel, Number(levelId) + 1));
  const timesCleared = Number(levelId) === FINAL_LEVEL_ID ? clean.timesCleared + 1 : clean.timesCleared;

  return saveProgress({ completedLevels, nextLevel, timesCleared }, storage);
}

export function resetProgress(storage = window.localStorage) {
  try {
    storage.removeItem(PROGRESS_KEY);
  } catch {
    // Keep default progress if storage is unavailable.
  }

  return { ...DEFAULT_PROGRESS };
}
