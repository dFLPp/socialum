import { describe, expect, it } from 'vitest';
import { buildDictionary } from './words.js';

describe('level dictionaries', () => {
  it('keeps the final level readable with short words', () => {
    const dictionary = buildDictionary(3);
    const longestWord = dictionary.reduce((longest, word) =>
      word.length > longest.length ? word : longest
    );

    expect(longestWord.length).toBeLessThanOrEqual(7);
    expect(dictionary.filter((word) => word.length >= 4 && word.length <= 5).length).toBeGreaterThan(20);
  });
});
