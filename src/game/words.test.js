import { describe, expect, it } from 'vitest';
import { buildDictionary } from './words.js';

describe('level dictionaries', () => {
  it('builds thematic hostile word dictionaries for five levels', () => {
    expect(buildDictionary(1)).toContain('sem tab');
    expect(buildDictionary(2)).toContain('sem copilot');
    expect(buildDictionary(3)).toContain('tab falhou');
    expect(buildDictionary(4)).toContain('sem agente');
    expect(buildDictionary(5)).toContain('ci vermelho');
  });

  it('includes balanced short phrases about coding without agentic tools', () => {
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
