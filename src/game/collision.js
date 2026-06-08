export function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function hasPlayerCollision(enemy, player) {
  if (enemy.status !== 'alive') {
    return false;
  }

  return distanceBetween(enemy, player) <= enemy.radius * 0.45 + player.radius;
}

export function collectCollisions(enemies, player) {
  return enemies.filter((enemy) => hasPlayerCollision(enemy, player));
}
