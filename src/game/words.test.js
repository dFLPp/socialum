import { describe, expect, it } from 'vitest';
import { buildDictionary } from './words.js';

describe('level dictionaries', () => {
  it('builds thematic hostile word dictionaries for five levels', () => {
    expect(buildDictionary(1)).toContain('fat');
    expect(buildDictionary(2)).toContain('ugly');
    expect(buildDictionary(3)).toContain('bitch');
    expect(buildDictionary(4)).toContain('trash');
    expect(buildDictionary(5)).toContain('worthless');
  });

  it('keeps the final level readable with short words', () => {
    const dictionary = buildDictionary(5);
    const longestWord = dictionary.reduce((longest, word) =>
      word.length > longest.length ? word : longest
    );

    expect(longestWord.length).toBeLessThanOrEqual(9);
    expect(dictionary.filter((word) => word.length >= 4 && word.length <= 5).length).toBeGreaterThan(20);
  });
});
