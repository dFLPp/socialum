import { useEffect, useRef } from 'react';
import { ASSETS } from './assets.js';
import { advanceFrame, buildRunSummary, createCompletionEffect, createInitialRuntimeState, resizeRuntimeState } from './gameLoop.js';
import { processTypedCharacter } from './input.js';
import { drawGame } from './renderer.js';
import { applyMistake, applyWordDestroyed } from './scoring.js';
import { useImage } from './useImage.js';

function syncCanvasSize(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(320, Math.floor(rect.width || window.innerWidth));
  const height = Math.max(360, Math.floor(rect.height || window.innerHeight));
  const pixelWidth = Math.floor(width * dpr);
  const pixelHeight = Math.floor(height * dpr);

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, arena: { width, height } };
}

export function GameCanvas({ level, audioManager, onExit, onFinish }) {
  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const stateRef = useRef(null);
  const frameRef = useRef(0);
  const finishRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  const imagesRef = useRef({});

  const background = useImage(level.backgroundSrc);
  const player = useImage(ASSETS.sprites.player);
  const wordHit = useImage(ASSETS.sprites.wordHit);
  const wordDestroy = useImage(ASSETS.sprites.wordDestroy);

  useEffect(() => {
    imagesRef.current = { background, player, wordHit, wordDestroy };
  }, [background, player, wordHit, wordDestroy]);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    let active = true;
    let lastFrameAt = performance.now();
    let finishTimeoutId = 0;
    finishRef.current = false;

    const synced = syncCanvasSize(canvas);
    stateRef.current = createInitialRuntimeState(level, synced.arena, lastFrameAt);
    inputRef.current?.focus();
    audioManager.playMusic(level.musicSrc);

    function handleKeyDown(event) {
      if (!active || event.repeat || !stateRef.current || stateRef.current.outcome !== 'playing') {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        onExit();
        return;
      }

      if (event.key.length !== 1) {
        return;
      }

      event.preventDefault();
      const now = performance.now();
      const result = processTypedCharacter(stateRef.current.enemies, event.key, now);
      let nextState = { ...stateRef.current, enemies: result.enemies };

      if (result.event.type === 'wrong-letter') {
        nextState = {
          ...nextState,
          scoreState: applyMistake(nextState.scoreState),
          message: `Letra errada: tente "${result.event.expected}"`,
          messageUntil: now + 850,
        };
        audioManager.playSfx(ASSETS.sfx.typeWrong, 0.65);
      }

      if (result.event.type === 'correct-letter') {
        nextState = {
          ...nextState,
          message: 'Letra certa',
          messageUntil: now + 360,
        };
        audioManager.playSfx(ASSETS.sfx.typeCorrect, 0.28);
      }

      if (result.event.type === 'word-completed') {
        const completedEnemy = nextState.enemies.find((enemy) => enemy.id === result.event.targetId);
        nextState = {
          ...nextState,
          scoreState: applyWordDestroyed(nextState.scoreState, completedEnemy),
          effects: [...nextState.effects, createCompletionEffect(completedEnemy, now)],
          message: `"${result.event.word}" eliminada`,
          messageUntil: now + 950,
        };
        audioManager.playSfx(ASSETS.sfx.wordDestroy, 0.75);
      }

      stateRef.current = nextState;
      inputRef.current.value = '';
    }

    function frame(now) {
      if (!active || !stateRef.current) {
        return;
      }

      const { ctx, arena } = syncCanvasSize(canvas);
      let runtimeState = resizeRuntimeState(stateRef.current, arena);
      const deltaMs = Math.min(60, now - lastFrameAt);
      lastFrameAt = now;

      const advanced = advanceFrame(runtimeState, level, deltaMs, now);
      runtimeState = advanced.state;

      for (const event of advanced.events) {
        if (event.type === 'player-damaged') {
          audioManager.playSfx(ASSETS.sfx.playerDamage, 0.8);
          runtimeState = {
            ...runtimeState,
            message: `Dano recebido: -${event.enemy.damage}`,
            messageUntil: now + 950,
          };
        }
      }

      stateRef.current = runtimeState;
      drawGame(ctx, runtimeState, level, imagesRef.current, now);

      if (runtimeState.outcome !== 'playing' && !finishRef.current) {
        finishRef.current = true;
        audioManager.stopMusic();
        audioManager.playSfx(
          runtimeState.outcome === 'won' ? ASSETS.sfx.levelComplete : ASSETS.music.defeat,
          0.8
        );
        const summary = buildRunSummary(runtimeState, level);
        finishTimeoutId = window.setTimeout(() => onFinishRef.current(summary), 650);
        return;
      }

      frameRef.current = window.requestAnimationFrame(frame);
    }

    window.addEventListener('keydown', handleKeyDown);
    frameRef.current = window.requestAnimationFrame(frame);

    return () => {
      active = false;
      window.cancelAnimationFrame(frameRef.current);
      window.clearTimeout(finishTimeoutId);
      window.removeEventListener('keydown', handleKeyDown);
      audioManager.stopMusic();
    };
  }, [audioManager, level, onExit]);

  return (
    <div className="gameplay-layout">
      <div className="canvas-wrap">
        <canvas
          ref={canvasRef}
          className="game-canvas"
          aria-label="Área do jogo. Digite a palavra destacada antes dela chegar ao centro."
          onClick={() => inputRef.current?.focus()}
        />
        <input
          ref={inputRef}
          className="typing-proxy"
          aria-label="Campo de digitação do jogo"
          autoCapitalize="none"
          autoComplete="off"
          spellCheck="false"
          onChange={(event) => {
            event.currentTarget.value = '';
          }}
        />
      </div>
    </div>
  );
}
