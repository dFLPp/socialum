import { describe, expect, it } from 'vitest';
import {
  applyMistake,
  applyPlayerDamage,
  applyWordDestroyed,
  createScoreState,
  getLevelOutcome,
} from './scoring.js';

const level = { lives: 3 };
const enemy = { text: 'banana', damage: 1, createdAt: 0 };

describe('scoring', () => {
  it('tracks destroyed words and score', () => {
    const next = applyWordDestroyed(createScoreState(level), enemy);

    expect(next.resolvedWords).toBe(1);
    expect(next.score).toBeGreaterThan(100);
  });

  it('tracks damage and loss condition', () => {
    let score = createScoreState(level);
    score = applyPlayerDamage(score, { ...enemy, damage: 3 });

    expect(score.lives).toBe(0);
    expect(getLevelOutcome(score, 1, 1)).toBe('lost');
  });

  it('wins when every spawned word was resolved or damaged', () => {
    const score = { ...createScoreState(level), resolvedWords: 2, damagedWords: 1 };

    expect(getLevelOutcome(score, 3, 3)).toBe('won');
  });

  it('counts mistakes', () => {
    expect(applyMistake(createScoreState(level)).mistakes).toBe(1);
  });
});
