import { describe, expect, it } from 'vitest';
import { buildDictionary } from './words.js';

describe('level dictionaries', () => {
  it('builds offensive word dictionaries for five levels', () => {
    expect(buildDictionary(1)).toContain('idiota');
    expect(buildDictionary(2)).toContain('imbecil');
    expect(buildDictionary(3)).toContain('vadia');
    expect(buildDictionary(4)).toContain('voce falha');
    expect(buildDictionary(5)).toContain('filho da puta');
  });

  it('includes short offensive phrases to cut before impact', () => {
    const dictionary = buildDictionary(5);
    const phrases = dictionary.filter((word) => word.includes(' '));

    expect(phrases.length).toBeGreaterThan(15);
    expect(Math.max(...phrases.map((word) => word.length))).toBeLessThanOrEqual(13);
  });

  it('keeps the final level readable with short words', () => {
    const dictionary = buildDictionary(5);
    const longestWord = dictionary.reduce((longest, word) =>
      word.length > longest.length ? word : longest
    );

    expect(longestWord.length).toBeLessThanOrEqual(13);
    expect(dictionary.filter((word) => word.length <= 9).length).toBeGreaterThan(30);
  });
});
