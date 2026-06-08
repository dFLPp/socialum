import { EFFECT_LIFETIME_MS, PLAYER_RADIUS } from './gameLoop.js';
import { getActiveTarget } from './input.js';

const CANVAS_COLORS = {
  paper: '#050505',
  grid: '#1f1f1f',
  ink: '#f4efe2',
  muted: 'rgba(244, 239, 226, 0.58)',
  typed: '#8be7a7',
  red: '#ff706b',
  playerFace: '#050505',
};

function drawCoverImage(ctx, image, width, height) {
  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let x = 0;
  let y = 0;

  if (imageRatio > canvasRatio) {
    drawWidth = height * imageRatio;
    x = (width - drawWidth) / 2;
  } else {
    drawHeight = width / imageRatio;
    y = (height - drawHeight) / 2;
  }

  ctx.drawImage(image, x, y, drawWidth, drawHeight);
}

function drawFallbackBackground(ctx, level, width, height) {
  ctx.fillStyle = CANVAS_COLORS.paper;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = level.id === 3 ? 0.5 : 0.34;
  ctx.strokeStyle = CANVAS_COLORS.grid;
  ctx.lineWidth = 1;
  for (let y = 64 + level.id * 8; y < height; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPlayer(ctx, state, playerImage, now) {
  const { x, y } = state.player;
  const radius = PLAYER_RADIUS;
  const damaged = state.effects.some(
    (effect) => effect.type === 'hit' && now - effect.createdAt < 260
  );

  ctx.save();
  ctx.shadowColor = damaged ? 'rgba(255, 112, 107, 0.34)' : 'transparent';
  ctx.shadowBlur = damaged ? 18 : 0;

  if (playerImage) {
    ctx.drawImage(playerImage, x - radius, y - radius, radius * 2, radius * 2);
  } else {
    const size = radius * 2;
    ctx.fillStyle = damaged ? CANVAS_COLORS.red : CANVAS_COLORS.ink;
    ctx.fillRect(x - radius, y - radius, size, size);

    ctx.strokeStyle = damaged ? CANVAS_COLORS.red : CANVAS_COLORS.ink;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - radius - 0.5, y - radius - 0.5, size + 1, size + 1);

    ctx.fillStyle = CANVAS_COLORS.playerFace;
    ctx.beginPath();
    ctx.arc(x, y - 7, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = CANVAS_COLORS.playerFace;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 12, y + 14);
    ctx.lineTo(x + 12, y + 14);
    ctx.stroke();
  }

  drawHearts(ctx, x, y + radius + 18, state.scoreState.lives, 3);
  ctx.restore();
}

function drawHearts(ctx, x, y, lives, totalLives) {
  ctx.save();
  ctx.font = '650 17px "IBM Plex Mono", "SFMono-Regular", Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let index = 0; index < totalLives; index += 1) {
    const heartX = x + (index - 1) * 19;
    ctx.lineWidth = 2;
    ctx.strokeStyle = CANVAS_COLORS.paper;
    ctx.strokeText('♥', heartX, y);
    ctx.fillStyle = index < lives ? CANVAS_COLORS.ink : 'rgba(244, 239, 226, 0.35)';
    ctx.fillText('♥', heartX, y);
  }

  ctx.restore();
}

function drawEnemyWord(ctx, enemy, isTarget, now) {
  const typed = enemy.text.slice(0, enemy.typedCount);
  const remaining = enemy.text.slice(enemy.typedCount);
  const isWrong = enemy.feedbackUntil && now < enemy.feedbackUntil;
  const alpha = enemy.status === 'alive' ? 1 : 0.42;

  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  ctx.rotate(enemy.rotation || 0);
  ctx.globalAlpha = alpha;
  const fontFamily = enemy.fontFamily || '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace';
  ctx.font = `650 ${enemy.fontSize}px ${fontFamily}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.lineWidth = 3;
  ctx.strokeStyle = CANVAS_COLORS.paper;

  const typedWidth = ctx.measureText(typed).width;
  const remainingWidth = ctx.measureText(remaining).width;
  const startX = -(typedWidth + remainingWidth) / 2;

  ctx.strokeText(typed, startX, 0);
  ctx.fillStyle = CANVAS_COLORS.typed;
  ctx.fillText(typed, startX, 0);

  ctx.strokeText(remaining, startX + typedWidth, 0);
  ctx.fillStyle = isWrong ? CANVAS_COLORS.red : isTarget ? CANVAS_COLORS.ink : CANVAS_COLORS.muted;
  ctx.fillText(remaining, startX + typedWidth, 0);

  ctx.font = '650 11px "IBM Plex Mono", "SFMono-Regular", Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = isTarget ? CANVAS_COLORS.ink : 'rgba(244, 239, 226, 0.38)';
  ctx.strokeText(String(enemy.spawnOrder), 0, enemy.fontSize + 12);
  ctx.fillText(String(enemy.spawnOrder), 0, enemy.fontSize + 12);
  ctx.restore();
}

function drawEffects(ctx, state, now, images) {
  for (const effect of state.effects) {
    const progress = Math.min(1, (now - effect.createdAt) / EFFECT_LIFETIME_MS);
    const radius = effect.type === 'destroy' ? 20 + progress * 48 : 16 + progress * 30;
    const image = effect.type === 'destroy' ? images.wordDestroy : images.wordHit;

    ctx.save();
    ctx.globalAlpha = 1 - progress;
    if (image) {
      ctx.drawImage(image, effect.x - radius, effect.y - radius, radius * 2, radius * 2);
    } else {
      ctx.strokeStyle = effect.type === 'destroy' ? CANVAS_COLORS.typed : CANVAS_COLORS.red;
      ctx.lineWidth = effect.type === 'destroy' ? 2 : 3;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

export function drawGame(ctx, state, level, images, now) {
  const { width, height } = state.arena;
  ctx.clearRect(0, 0, width, height);

  if (images.background) {
    drawCoverImage(ctx, images.background, width, height);
  } else {
    drawFallbackBackground(ctx, level, width, height);
  }

  const target = getActiveTarget(state.enemies);

  for (const enemy of state.enemies) {
    drawEnemyWord(ctx, enemy, target?.id === enemy.id, now);
  }

  drawEffects(ctx, state, now, images);
  drawPlayer(ctx, state, images.player, now);
}
