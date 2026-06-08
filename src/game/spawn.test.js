import { describe, expect, it } from 'vitest';
import { WORD_FONT_FAMILIES, createWordEnemy, getWordSpeed, moveWordTowardCenter } from './spawn.js';

const arena = { width: 800, height: 600 };
const level = {
  id: 1,
  fullCircleSpawns: false,
  baseSpeed: 50,
  damagePerWord: 1,
};

describe('word spawning', () => {
  function createRng(values) {
    return () => values.shift() ?? 0;
  }

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

  it('assigns different font variants to spawned words', () => {
    const firstEnemy = createWordEnemy({
      level,
      text: 'casa',
      spawnOrder: 1,
      arena,
      rng: createRng([0, 0.5, 0.25, 0.25, 0]),
    });
    const secondEnemy = createWordEnemy({
      level,
      text: 'caderno',
      spawnOrder: 2,
      arena,
      rng: createRng([0, 0.5, 0.25, 0.25, 0.99]),
    });

    expect(WORD_FONT_FAMILIES).toContain(firstEnemy.fontFamily);
    expect(WORD_FONT_FAMILIES).toContain(secondEnemy.fontFamily);
    expect(firstEnemy.fontFamily).not.toBe(secondEnemy.fontFamily);
  });
});
