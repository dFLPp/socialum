export const WORD_SETS = {
  taunts: [
    'idiota',
    'burro',
    'anta',
    'lerdo',
    'tapado',
    'otario',
    'babaca',
    'trouxa',
    'palhaco',
    'frouxo',
    'covarde',
    'ridiculo',
    'fracote',
    'chato',
    'mala',
    'inutil',
    'zero',
    'loser',
    'sem nocao',
  ],
  insults: [
    'imbecil',
    'babacao',
    'vacilao',
    'arrogante',
    'insuportavel',
    'patetico',
    'fracassado',
    'vergonha',
    'verme',
    'nojento',
    'traste',
    'escroto',
    'falso',
    'podre',
    'miseravel',
    'sem valor',
    'lixo humano',
    'zero a zero',
    'sem talento',
    'cala boca',
    'some daqui',
    'nao presta',
    'que lixo',
    'voce fede',
  ],
  profanity: [
    'bosta',
    'merda',
    'porra',
    'fdp',
    'cuzao',
    'otaria',
    'vadia',
    'praga',
    'nojo',
    'puta raiva',
    'merda pura',
    'bosta seca',
    'vai se ferrar',
    'vai tomar',
    'filho da puta',
    'que porcaria',
    'coisa ruim',
    'alma podre',
    'boca suja',
    'cara de pau',
    'sem vergonha',
    'pessimo',
    'horrivel',
    'asqueroso',
  ],
  attacks: [
    'ninguem liga',
    'voce e piada',
    'some logo',
    'desiste ja',
    'fica quieto',
    'nao serve',
    'sem futuro',
    'que vergonha',
    'voce falha',
    'voce perdeu',
    'voce e fraco',
    'que desastre',
    'tudo errado',
    'so atrapalha',
    'nao entende',
    'que derrota',
    'pior de todos',
    'calado rende',
    'voce estraga',
    'sai daqui',
    'ninguem quer',
    'todo errado',
    'caso perdido',
    'voce afunda',
  ],
  spiral: [
    'idiota',
    'burro',
    'babaca',
    'otario',
    'imbecil',
    'trouxa',
    'escroto',
    'verme',
    'bosta',
    'merda',
    'porra',
    'fdp',
    'cuzao',
    'vadia',
    'fracassado',
    'lixo humano',
    'sem valor',
    'sem futuro',
    'some daqui',
    'cala boca',
    'nao presta',
    'vai tomar',
    'vai se ferrar',
    'filho da puta',
    'ninguem liga',
    'voce falha',
    'voce perdeu',
    'que vergonha',
    'pior de todos',
    'caso perdido',
  ],
};

function uniqueWords(words) {
  return [...new Set(words)];
}

export function buildDictionary(levelId) {
  if (levelId === 1) {
    return WORD_SETS.taunts;
  }

  if (levelId === 2) {
    return uniqueWords([...WORD_SETS.taunts, ...WORD_SETS.insults]);
  }

  if (levelId === 3) {
    return uniqueWords([...WORD_SETS.insults, ...WORD_SETS.profanity]);
  }

  if (levelId === 4) {
    return uniqueWords([...WORD_SETS.profanity, ...WORD_SETS.attacks]);
  }

  return uniqueWords([...WORD_SETS.taunts, ...WORD_SETS.profanity, ...WORD_SETS.attacks, ...WORD_SETS.spiral]);
}
