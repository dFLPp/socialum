import { describe, expect, it } from 'vitest';
import { getActiveTarget, processTypedCharacter } from './input.js';

const enemies = [
  { id: 'newer', text: 'banana', typedCount: 0, spawnOrder: 2, status: 'alive' },
  { id: 'older', text: 'casa', typedCount: 0, spawnOrder: 1, status: 'alive' },
];

describe('typing input', () => {
  it('targets the oldest alive word first', () => {
    expect(getActiveTarget(enemies).id).toBe('older');
  });

  it('advances a correct letter on the oldest word', () => {
    const result = processTypedCharacter(enemies, 'c', 100);

    expect(result.event.type).toBe('correct-letter');
    expect(result.enemies.find((enemy) => enemy.id === 'older').typedCount).toBe(1);
    expect(result.enemies.find((enemy) => enemy.id === 'newer').typedCount).toBe(0);
  });

  it('marks the target as destroying when the word is complete', () => {
    let current = [{ ...enemies[1] }];

    for (const letter of 'casa') {
      current = processTypedCharacter(current, letter, 100).enemies;
    }

    expect(current[0].typedCount).toBe(4);
    expect(current[0].status).toBe('destroying');
  });

  it('accepts spaces in short phrases', () => {
    let current = [{ id: 'phrase', text: 'sem tab', typedCount: 0, spawnOrder: 1, status: 'alive' }];

    for (const letter of 'sem tab') {
      current = processTypedCharacter(current, letter, 100).enemies;
    }

    expect(current[0].typedCount).toBe(7);
    expect(current[0].status).toBe('destroying');
  });

  it('reports wrong letters without advancing progress', () => {
    const result = processTypedCharacter(enemies, 'x', 100);

    expect(result.event.type).toBe('wrong-letter');
    expect(result.enemies.find((enemy) => enemy.id === 'older').typedCount).toBe(0);
  });
});
