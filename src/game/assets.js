const baseUrl = import.meta.env.BASE_URL || './';

function publicAsset(path) {
  return `${baseUrl}${path}`;
}

export const ASSETS = {
  sprites: {
    player: publicAsset('assets/sprites/player.png'),
    wordHit: publicAsset('assets/sprites/word-hit.png'),
    wordDestroy: publicAsset('assets/sprites/word-destroy.png'),
    backgroundLevel1: publicAsset('assets/sprites/background-level-1.png'),
    backgroundLevel2: publicAsset('assets/sprites/background-level-2.png'),
    backgroundLevel3: publicAsset('assets/sprites/background-level-3.png'),
  },
  music: {
    level1: publicAsset('assets/music/level-1.mp3'),
    level2: publicAsset('assets/music/level-2.mp3'),
    level3: publicAsset('assets/music/level-3.mp3'),
    victory: publicAsset('assets/music/victory.mp3'),
    defeat: publicAsset('assets/music/defeat.mp3'),
  },
  sfx: {
    typeCorrect: publicAsset('assets/sfx/type-correct.wav'),
    typeWrong: publicAsset('assets/sfx/type-wrong.wav'),
    wordDestroy: publicAsset('assets/sfx/word-destroy.wav'),
    playerDamage: publicAsset('assets/sfx/player-damage.wav'),
    levelComplete: publicAsset('assets/sfx/level-complete.wav'),
  },
  fonts: {
    game: publicAsset('assets/fonts/game-font.woff2'),
  },
};

export function getLevelBackground(levelId) {
  return ASSETS.sprites[`backgroundLevel${levelId}`] || ASSETS.sprites.backgroundLevel1;
}

export function getLevelMusic(levelId) {
  return ASSETS.music[`level${levelId}`] || ASSETS.music.level1;
}
