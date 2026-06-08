export const WORD_SETS = {
  taunts: [
    'fat',
    'ugly',
    'dumb',
    'weak',
    'slow',
    'lazy',
    'gross',
    'weird',
    'loser',
    'lame',
    'fool',
    'fake',
    'trash',
    'nerd',
    'creep',
    'sick',
    'bad',
    'mean',
    'cold',
  ],
  insults: [
    'ugly',
    'idiot',
    'stupid',
    'moron',
    'dummy',
    'jerk',
    'brat',
    'clown',
    'toxic',
    'shame',
    'alone',
    'wrong',
    'awful',
    'vile',
    'nasty',
    'freak',
    'bore',
    'snake',
    'liar',
    'fraud',
    'gross',
    'loser',
    'trash',
    'creep',
  ],
  profanity: [
    'bitch',
    'shit',
    'crap',
    'damn',
    'ass',
    'asshole',
    'screw',
    'hell',
    'piss',
    'sucks',
    'hate',
    'toxic',
    'filth',
    'scum',
    'rotten',
    'dirt',
    'gross',
    'trash',
    'freak',
    'idiot',
    'moron',
    'jerk',
    'liar',
    'fake',
  ],
  attacks: [
    'worthless',
    'useless',
    'failure',
    'pathetic',
    'hateful',
    'horrible',
    'terrible',
    'garbage',
    'monster',
    'villain',
    'reject',
    'broken',
    'coward',
    'bitter',
    'poison',
    'burden',
    'nobody',
    'stupid',
    'ugly',
    'loser',
    'trash',
    'toxic',
    'shame',
    'freak',
  ],
  spiral: [
    'worthless',
    'pathetic',
    'garbage',
    'failure',
    'useless',
    'horrible',
    'terrible',
    'monster',
    'bitch',
    'asshole',
    'toxic',
    'idiot',
    'moron',
    'stupid',
    'loser',
    'ugly',
    'gross',
    'trash',
    'creep',
    'freak',
    'liar',
    'fake',
    'shame',
    'hate',
    'scum',
    'filth',
    'rotten',
    'reject',
    'broken',
    'coward',
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
