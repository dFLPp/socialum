import { collectCollisions } from './collision.js';
import { applyPlayerDamage, createScoreState, getLevelOutcome } from './scoring.js';
import { createWordEnemy, moveWordTowardCenter, pickNextWord } from './spawn.js';

export const PLAYER_RADIUS = 28;
export const EFFECT_LIFETIME_MS = 520;
export const REMOVAL_DELAY_MS = 430;

function isEnemyVisibleInViewport(enemy, arena) {
  const margin = enemy.radius || 40;
  return (
    enemy.x >= -margin &&
    enemy.x <= arena.width + margin &&
    enemy.y >= -margin &&
    enemy.y <= arena.height + margin
  );
}

export function createInitialRuntimeState(level, arena, now = 0) {
  return {
    arena,
    player: {
      x: arena.width / 2,
      y: arena.height / 2,
      radius: PLAYER_RADIUS,
    },
    enemies: [],
    effects: [],
    scoreState: { ...createScoreState(level), startedAt: now },
    spawnedWords: 0,
    usedWords: new Set(),
    nextSpawnAt: now + level.initialSpawnDelayMs,
    outcome: 'playing',
    finishedAt: null,
    message: 'Prepare-se',
    messageUntil: now + 1400,
  };
}

export function resizeRuntimeState(state, arena) {
  return {
    ...state,
    arena,
    player: {
      ...state.player,
      x: arena.width / 2,
      y: arena.height / 2,
    },
  };
}

export function spawnWordIfNeeded(state, level, now, rng = Math.random) {
  if (state.spawnedWords >= level.wordCount) {
    return state;
  }

  if (state.enemies.filter((enemy) => enemy.status === 'alive').length >= level.maxConcurrentWords) {
    return state;
  }

  if (now < state.nextSpawnAt) {
    return state;
  }

  if (state.spawnedWords > 0) {
    const lastSpawnedEnemy = state.enemies.find((enemy) => enemy.spawnOrder === state.spawnedWords);
    if (lastSpawnedEnemy && !lastSpawnedEnemy.enteredViewport) {
      return state;
    }
  }

  const text = pickNextWord(level.dictionary, state.usedWords, rng);
  const usedWords = new Set(state.usedWords);
  usedWords.add(text);
  const nextSpawnOrder = state.spawnedWords + 1;
  const enemy = createWordEnemy({
    level,
    text,
    spawnOrder: nextSpawnOrder,
    arena: state.arena,
    now,
    rng,
  });

  return {
    ...state,
    enemies: [...state.enemies, enemy],
    spawnedWords: nextSpawnOrder,
    usedWords,
    nextSpawnAt: now + level.spawnIntervalMs,
    message: `Palavra ${nextSpawnOrder}/${level.wordCount}`,
    messageUntil: now + 900,
  };
}

function removeExpiredEntities(state, now) {
  return {
    ...state,
    enemies: state.enemies.filter((enemy) => {
      if (enemy.status === 'alive') {
        return true;
      }

      const endedAt = enemy.destroyedAt || enemy.hitAt || now;
      return now - endedAt < REMOVAL_DELAY_MS;
    }),
    effects: state.effects.filter((effect) => now - effect.createdAt < EFFECT_LIFETIME_MS),
  };
}

export function advanceFrame(state, level, deltaMs, now, rng = Math.random) {
  if (state.outcome !== 'playing') {
    return { state, events: [] };
  }

  let nextState = spawnWordIfNeeded(state, level, now, rng);
  const events = [];
  let scoreState = nextState.scoreState;
  let effects = nextState.effects;
  let enemies = nextState.enemies.map((enemy) => {
    const movedEnemy = moveWordTowardCenter(enemy, nextState.arena, deltaMs);
    return movedEnemy.enteredViewport || isEnemyVisibleInViewport(movedEnemy, nextState.arena)
      ? { ...movedEnemy, enteredViewport: true }
      : movedEnemy;
  });

  const collisions = collectCollisions(enemies, nextState.player);

  if (collisions.length > 0) {
    const collisionIds = new Set(collisions.map((enemy) => enemy.id));
    for (const enemy of collisions) {
      scoreState = applyPlayerDamage(scoreState, enemy);
      effects = [
        ...effects,
        { id: `hit-${enemy.id}-${now}`, type: 'hit', x: enemy.x, y: enemy.y, createdAt: now },
      ];
      events.push({ type: 'player-damaged', enemy });
    }

    enemies = enemies.map((enemy) =>
      collisionIds.has(enemy.id) ? { ...enemy, status: 'hit', hitAt: now } : enemy
    );
  }

  nextState = removeExpiredEntities({ ...nextState, enemies, effects, scoreState }, now);

  const outcome = getLevelOutcome(nextState.scoreState, nextState.spawnedWords, level.wordCount);
  if (outcome !== 'playing') {
    nextState = { ...nextState, outcome, finishedAt: now };
    events.push({ type: 'level-finished', outcome });
  }

  return { state: nextState, events };
}

export function createCompletionEffect(enemy, now) {
  return {
    id: `destroy-${enemy.id}-${now}`,
    type: 'destroy',
    x: enemy.x,
    y: enemy.y,
    createdAt: now,
  };
}

export function buildRunSummary(state, level) {
  return {
    levelId: level.id,
    levelName: level.name,
    outcome: state.outcome,
    score: state.scoreState.score,
    lives: state.scoreState.lives,
    resolvedWords: state.scoreState.resolvedWords,
    damagedWords: state.scoreState.damagedWords,
    mistakes: state.scoreState.mistakes,
    totalWords: level.wordCount,
  };
}
