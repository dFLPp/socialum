export function normalizeCharacter(value) {
  return value
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function getActiveTarget(enemies) {
  return enemies
    .filter((enemy) => enemy.status === 'alive')
    .sort((a, b) => a.spawnOrder - b.spawnOrder)[0];
}

export function processTypedCharacter(enemies, key, now = 0) {
  if (!key || key.length !== 1) {
    return { enemies, event: { type: 'ignored' } };
  }

  const target = getActiveTarget(enemies);
  if (!target) {
    return { enemies, event: { type: 'no-target' } };
  }

  const expected = normalizeCharacter(target.text[target.typedCount]);
  const received = normalizeCharacter(key);

  if (expected !== received) {
    return {
      enemies: enemies.map((enemy) =>
        enemy.id === target.id ? { ...enemy, feedbackUntil: now + 180 } : enemy
      ),
      event: { type: 'wrong-letter', targetId: target.id, expected, received },
    };
  }

  const nextTypedCount = target.typedCount + 1;
  const completed = nextTypedCount >= target.text.length;
  const nextStatus = completed ? 'destroying' : 'alive';

  return {
    enemies: enemies.map((enemy) =>
      enemy.id === target.id
        ? {
            ...enemy,
            typedCount: nextTypedCount,
            status: nextStatus,
            destroyedAt: completed ? now : enemy.destroyedAt,
          }
        : enemy
    ),
    event: completed
      ? { type: 'word-completed', targetId: target.id, word: target.text }
      : { type: 'correct-letter', targetId: target.id, typedCount: nextTypedCount },
  };
}
