export const BASE_WORD_POINTS = 100;

export function createScoreState(level) {
  return {
    lives: level.lives,
    score: 0,
    resolvedWords: 0,
    damagedWords: 0,
    mistakes: 0,
    startedAt: 0,
  };
}

export function scoreForWord(enemy, startedAt = 0) {
  const elapsedSeconds = Math.max(0, Math.round(((enemy.createdAt || 0) - startedAt) / 1000));
  return BASE_WORD_POINTS + enemy.text.length * 8 + Math.max(0, 80 - elapsedSeconds);
}

export function applyWordDestroyed(scoreState, enemy) {
  return {
    ...scoreState,
    score: scoreState.score + scoreForWord(enemy, scoreState.startedAt),
    resolvedWords: scoreState.resolvedWords + 1,
  };
}

export function applyPlayerDamage(scoreState, enemy) {
  return {
    ...scoreState,
    lives: Math.max(0, scoreState.lives - enemy.damage),
    damagedWords: scoreState.damagedWords + 1,
  };
}

export function applyMistake(scoreState) {
  return {
    ...scoreState,
    mistakes: scoreState.mistakes + 1,
  };
}

export function getLevelOutcome(scoreState, spawnedWords, totalWords) {
  if (scoreState.lives <= 0) {
    return 'lost';
  }

  if (spawnedWords >= totalWords && scoreState.resolvedWords + scoreState.damagedWords >= totalWords) {
    return 'won';
  }

  return 'playing';
}
