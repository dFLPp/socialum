export function createAudioManager() {
  const music = new Audio();
  music.loop = true;
  music.volume = 0.45;
  const unlocked = { current: false };

  function markUnlocked() {
    unlocked.current = true;
  }

  async function playMusic(src) {
    if (!src || !unlocked.current) {
      return;
    }

    if (music.src !== new URL(src, window.location.href).href) {
      music.src = src;
    }

    try {
      await music.play();
    } catch {
      // Browsers can block audio until the next user gesture.
    }
  }

  function stopMusic() {
    music.pause();
    music.currentTime = 0;
  }

  function playSfx(src, volume = 0.7) {
    if (!src || !unlocked.current) {
      return;
    }

    const sound = new Audio(src);
    sound.volume = volume;
    sound.play().catch(() => {});
  }

  return { markUnlocked, playMusic, stopMusic, playSfx };
}
