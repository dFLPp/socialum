export const WORD_SETS = {
  taunts: [
    'sem tab',
    'sem ctrl',
    'sem ide',
    'sem bot',
    'bugou',
    'travou',
    'lentao',
    'errou',
    'falhou',
    'perdido',
    'sem cola',
    'maozinha',
    'digita',
    'cadencia',
    'linha',
    'syntax',
    'atalho',
    'cursor',
    'prompt',
  ],
  insults: [
    'nao sei',
    'sem lupa',
    'sem chat',
    'sem agente',
    'sem copilot',
    'autocomplete',
    'cola total',
    'prompt ruim',
    'erro bobo',
    'merge ruim',
    'teste falha',
    'build cai',
    'loop preso',
    'lint grita',
    'git medo',
    'branch suja',
    'diff cego',
    'commit seco',
    'log falso',
    'stack vazio',
    'debug lento',
    'copiou',
    'colou',
    'nao leu',
  ],
  profanity: [
    'sem stack',
    'sem docs',
    'sem agente',
    'sem roteiro',
    'sem snippet',
    'ia sumiu',
    'tab falhou',
    'ghost text',
    'prompt vago',
    'bug eterno',
    'teste zero',
    'refaz tudo',
    'merge quebra',
    'deploy cai',
    'css torto',
    'hook ruim',
    'estado sujo',
    'api muda',
    'cache mente',
    'erro volta',
    'token some',
    'json quebra',
    'regex ri',
    'vim assusta',
  ],
  attacks: [
    'sem copiloto',
    'sem terminal',
    'sem contexto',
    'sem memoria',
    'sem plano',
    'sem teste',
    'sem review',
    'sem typing',
    'cursor caiu',
    'agente bugou',
    'modelo errou',
    'diff gigante',
    'pr travado',
    'ci vermelho',
    'build demora',
    'token caro',
    'prompt longo',
    'branch velha',
    'bug oculto',
    'tela quebra',
    'cache sujo',
    'teste fraco',
    'log demais',
    'deploy lento',
  ],
  spiral: [
    'sem copilot',
    'sem agente',
    'sem cursor',
    'sem chat',
    'sem tab',
    'nao sei',
    'prompt ruim',
    'teste falha',
    'build cai',
    'merge quebra',
    'ci vermelho',
    'deploy cai',
    'cache mente',
    'bug eterno',
    'diff gigante',
    'pr travado',
    'token caro',
    'json quebra',
    'regex ri',
    'vim assusta',
    'lint grita',
    'branch suja',
    'debug lento',
    'api muda',
    'estado sujo',
    'loop preso',
    'erro volta',
    'tab falhou',
    'modelo errou',
    'refaz tudo',
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
