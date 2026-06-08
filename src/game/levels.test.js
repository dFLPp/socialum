import { describe, expect, it } from 'vitest';
import { FINAL_LEVEL_ID, LEVELS } from './levels.js';

describe('level configuration', () => {
  it('defines five increasingly difficult levels', () => {
    expect(FINAL_LEVEL_ID).toBe(5);
    expect(LEVELS.map((level) => level.id)).toEqual([1, 2, 3, 4, 5]);
    expect(LEVELS[0].baseSpeed).toBeLessThan(LEVELS[4].baseSpeed);
    expect(LEVELS[0].wordCount).toBeLessThan(LEVELS[4].wordCount);
  });
});
