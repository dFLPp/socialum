import { describe, expect, it } from 'vitest';
import { DEFAULT_PROGRESS, PROGRESS_KEY, completeLevel, loadProgress, resetProgress } from './storage.js';

function createStorage() {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) || null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
}

describe('progress storage', () => {
  it('loads default progress when storage is empty', () => {
    expect(loadProgress(createStorage())).toEqual(DEFAULT_PROGRESS);
  });

  it('unlocks the next level when completing a level', () => {
    const storage = createStorage();
    const progress = completeLevel(DEFAULT_PROGRESS, 1, storage);

    expect(progress.completedLevels).toEqual([1]);
    expect(progress.nextLevel).toBe(2);
    expect(JSON.parse(storage.getItem(PROGRESS_KEY)).nextLevel).toBe(2);
  });

  it('counts how many times the final level was cleared', () => {
    const storage = createStorage();
    const progress = completeLevel({ completedLevels: [1, 2], nextLevel: 3, timesCleared: 0 }, 3, storage);

    expect(progress.completedLevels).toEqual([1, 2, 3]);
    expect(progress.timesCleared).toBe(1);
  });

  it('can reset progress', () => {
    const storage = createStorage();
    completeLevel(DEFAULT_PROGRESS, 1, storage);

    expect(resetProgress(storage)).toEqual(DEFAULT_PROGRESS);
    expect(storage.getItem(PROGRESS_KEY)).toBeNull();
  });
});
