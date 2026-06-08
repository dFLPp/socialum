export const WORD_SETS = {
  easy: [
    'casa',
    'sol',
    'rio',
    'lua',
    'bola',
    'porta',
    'pato',
    'livro',
    'vento',
    'fogo',
    'terra',
    'nuvem',
    'flor',
    'mapa',
    'janela',
    'banana',
    'abacaxi',
    'gato',
    'verde',
  ],
  medium: [
    'chuva',
    'folha',
    'pedra',
    'norte',
    'caderno',
    'trilho',
    'brisa',
    'mundo',
    'luzir',
    'canto',
    'risco',
    'navio',
    'campo',
    'tarde',
    'pedal',
    'ninho',
    'prato',
    'linha',
    'coral',
    'fruta',
    'cobre',
    'pista',
    'sinal',
    'forma',
  ],
  hard: [
    'alvo',
    'bravo',
    'calma',
    'dente',
    'eixo',
    'fenda',
    'grade',
    'haste',
    'ilha',
    'jogo',
    'karma',
    'lento',
    'manto',
    'noite',
    'olho',
    'pulso',
    'queda',
    'ritmo',
    'sombra',
    'tinta',
    'urso',
    'vazio',
    'xale',
    'zebra',
    'astro',
    'bloco',
    'claro',
    'drama',
    'etapa',
    'firme',
  ],
};

export function buildDictionary(levelId) {
  if (levelId === 1) {
    return WORD_SETS.easy;
  }

  if (levelId === 2) {
    return [...WORD_SETS.easy, ...WORD_SETS.medium];
  }

  return [...WORD_SETS.easy, ...WORD_SETS.medium, ...WORD_SETS.hard].filter(
    (word) => word.length <= 7
  );
}
