import { describe, expect, it } from 'vitest';
import { splitMobilePromptText, tuneLevelForArena } from './mobile.js';

const level = {
  id: 2,
  baseSpeed: 140,
  spawnIntervalMs: 800,
  initialSpawnDelayMs: 600,
  maxConcurrentWords: 4,
};

describe('mobile gameplay tuning', () => {
  it('keeps desktop arenas unchanged', () => {
    expect(tuneLevelForArena(level, { width: 1024, height: 768 })).toBe(level);
  });

  it('slows down and spaces out words on phone-sized arenas', () => {
    const tuned = tuneLevelForArena(level, { width: 390, height: 540 });

    expect(tuned).not.toBe(level);
    expect(tuned.baseSpeed).toBeLessThan(level.baseSpeed);
    expect(tuned.spawnIntervalMs).toBeGreaterThan(level.spawnIntervalMs);
    expect(tuned.initialSpawnDelayMs).toBeGreaterThan(level.initialSpawnDelayMs);
    expect(tuned.maxConcurrentWords).toBeLessThanOrEqual(2);
    expect(tuned.wordFontScale).toBeLessThan(1);
  });

  it('marks spaces explicitly in multi-word prompts', () => {
    expect(splitMobilePromptText('vai tomar')).toEqual([
      { text: 'vai', isSpace: false },
      { text: 'espaco', isSpace: true },
      { text: 'tomar', isSpace: false },
    ]);
  });
});
