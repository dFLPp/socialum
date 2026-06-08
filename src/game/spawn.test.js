import { describe, expect, it } from 'vitest';
import { createWordEnemy, getWordSpeed, moveWordTowardCenter } from './spawn.js';

const arena = { width: 800, height: 600 };
const level = {
  id: 1,
  fullCircleSpawns: false,
  baseSpeed: 50,
  damagePerWord: 1,
};

describe('word spawning', () => {
  it('creates an enemy on the arena edge', () => {
    const values = [0, 0.5];
    const enemy = createWordEnemy({
      level,
      text: 'casa',
      spawnOrder: 1,
      arena,
      rng: () => values.shift() ?? 0,
    });

    expect(enemy.x).toBeGreaterThan(arena.width / 2);
    expect(enemy.y).toBeCloseTo(arena.height / 2, 0);
  });

  it('moves words toward the center', () => {
    const enemy = { x: 700, y: 300, speed: 100, status: 'alive' };
    const moved = moveWordTowardCenter(enemy, arena, 1000);

    expect(moved.x).toBeLessThan(enemy.x);
    expect(moved.y).toBe(enemy.y);
  });

  it('slows down longer words', () => {
    expect(getWordSpeed('casa', 60)).toBeGreaterThan(getWordSpeed('extraordinario', 60));
  });
});
