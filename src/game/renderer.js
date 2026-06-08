import { EFFECT_LIFETIME_MS, PLAYER_RADIUS } from './gameLoop.js';
import { getActiveTarget } from './input.js';

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
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, Math.max(width, height));
  gradient.addColorStop(0, level.id === 3 ? '#111014' : '#0d0d0d');
  gradient.addColorStop(1, '#030303');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.045;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  for (let y = 36; y < height; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y + level.id * 4);
    ctx.lineTo(width, y - 10);
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
  ctx.shadowColor = damaged ? 'rgba(255, 90, 90, 0.48)' : 'rgba(88, 169, 255, 0.25)';
  ctx.shadowBlur = damaged ? 26 : 18;

  if (playerImage) {
    ctx.drawImage(playerImage, x - radius, y - radius, radius * 2, radius * 2);
  } else {
    ctx.fillStyle = '#f2f2ed';
    ctx.strokeStyle = damaged ? '#ff5a5a' : '#ececea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let index = 0; index < 8; index += 1) {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / 8;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (index === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = damaged ? '#ff5a5a' : '#171717';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = damaged ? '#ff5a5a' : '#171717';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 12, y + 12);
    ctx.lineTo(x + 12, y + 12);
    ctx.stroke();
  }

  drawHearts(ctx, x, y + radius + 18, state.scoreState.lives, 3);
  ctx.restore();
}

function drawHearts(ctx, x, y, lives, totalLives) {
  ctx.save();
  ctx.font = '700 20px ui-sans-serif, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let index = 0; index < totalLives; index += 1) {
    const heartX = x + (index - 1) * 19;
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#050505';
    ctx.strokeText('♥', heartX, y);
    ctx.fillStyle = index < lives ? '#5bb2ff' : '#f1f1f1';
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
  ctx.font = `760 ${enemy.fontSize}px ui-sans-serif, system-ui, sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.lineWidth = 4;
  ctx.strokeStyle = isWrong ? '#ff5a5a' : 'rgba(0, 0, 0, 0.78)';

  const typedWidth = ctx.measureText(typed).width;
  const remainingWidth = ctx.measureText(remaining).width;
  const startX = -(typedWidth + remainingWidth) / 2;

  ctx.strokeText(typed, startX, 0);
  ctx.fillStyle = '#66d98f';
  ctx.fillText(typed, startX, 0);

  ctx.strokeText(remaining, startX + typedWidth, 0);
  ctx.fillStyle = isWrong ? '#ff7474' : isTarget ? '#ffffff' : 'rgba(255, 255, 255, 0.82)';
  ctx.fillText(remaining, startX + typedWidth, 0);

  ctx.font = '760 12px ui-sans-serif, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = isTarget ? '#ffffff' : 'rgba(244, 244, 244, 0.72)';
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
      ctx.strokeStyle = effect.type === 'destroy' ? '#69d68f' : '#ff4f4f';
      ctx.lineWidth = effect.type === 'destroy' ? 3 : 5;
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
