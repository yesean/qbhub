import { describe, it } from 'vitest';

import { parseAcceptableAnswers, parsePromptableAnswers } from './reader';

const acceptableAnswerlines = [
  {
    answerline:
      'parallel [accept parallel major or parallel minor; accept parallel modulation; accept modulating or moving to the parallel key; accept parallel fifths or parallel octaves; accept parallel motion or parallel movement or harmonic parallelism; prompt on P; prompt on altering, raising, or lowering the third scale degree until “third” is read by asking “what is the name of the relationship between the keys?”; prompt on modulating or moving between major and minor or into major or into minor by asking “what is the name of the relationship between the keys?”; prompt on changing keys or changing modes; prompt on mode or modal transformation until “Mode” is read]',
    answers: [
      'parallel',
      'parallel major',
      'parallel minor',
      'parallel modulation',
      'modulating',
      'moving to the parallel key',
      'parallel fifths',
      'parallel octaves',
      'parallel motion',
      'parallel movement',
      'harmonic parallelism',
      'lowering the third scale degree',
    ],
  },
  {
    answerline:
      'Kingdom of the Netherlands[or Koninkrijk der Nederlanden; accept Burgundian Netherlands or Bourgondische Nederlanden; accept Republic of the Seven United Netherlands or Republiek der Zeven Verenigde Nederlanden; accept the Republic of the Seven United Provinces or Republiek der Zeven Verenigde ProvinciÃ«n; accept Federated Dutch Provinces or Foederatae Belgii Provinciae or Dutch Federation or Belgica Foederata; accept Seventeen Provinces or Zeventien ProvinciÃ«n; prompt on "County of Holland" or "Graafshap Holland"; do not accept "Flanders" or "County of Flanders" or "Vlaanderen" or "Graafschap Vlaanderen" do not prompt on or accept "Belgium" or "Kingdom of Belgium"]',
    answers: [
      'kingdom of the netherlands',
      'koninkrijk der nederlanden',
      'burgundian netherlands',
      'bourgondische nederlanden',
      'republic of the seven united netherlands',
      'republiek der zeven verenigde nederlanden',
      'the republic of the seven united provinces',
      'republiek der zeven verenigde provincian',
      'federated dutch provinces',
      'foederatae belgii provinciae',
      'dutch federation',
      'belgica foederata',
      'seventeen provinces',
      'zeventien provincian',
    ],
  },
  { answerline: 'nitric oxide or no', answers: ['nitric oxide', 'no'] },
  {
    answerline:
      'convergence [or word forms such as convergent sequence; accept dominated convergence theorem or uniform convergence or pointwise convergence]',
    answers: [
      'convergence',
      'word forms such as convergent sequence',
      'dominated convergence theorem',
      'uniform convergence',
      'pointwise convergence',
    ],
  },
  {
    answerline:
      'Princes in the Tower [accept Edward V and Richard of Shrewsbury, Duke of York; accept any answer referring to the two princes possibly murdered by Richard III in the Tower of London] <LC>',
    answers: [
      'princes in the tower',
      'edward v and richard of shrewsbury',
      'any answer referring to the two princes possibly murdered by richard iii in the tower of london',
      'v and richard of shrewsbury',
      'any answer referring to the two princes possibly murdered by iii in the tower of london',
    ],
  },
  {
    answerline:
      'william [or william the conqueror; or william the bastard; or william i the bad; or william ii the good]',
    answers: [
      'william',
      'william the conqueror',
      'william the bastard',
      'william i the bad',
      'william ii the good',
    ],
  },
  {
    answerline:
      'John Dos Passos [or John Roderigo Dos Passos; do not accept or prompt on "Passos"]',
    answers: [
      'john dos passos',
      'john roderigo dos passos',
      'dos passos',
      'passos',
      'roderigo dos passos',
    ],
  },
  {
    answerline:
      'knowledge [do not prompt or accept "belief"; prompt on justified true belief]',
    answers: ['knowledge'],
  },
  {
    answerline:
      'pharmaceutical industry [or prescription drug industry; accept answers mentioning pharmaceuticals or prescription drugs or prescription medications such as drug companies or pharma; prompt on answers mentioning “healthcare” or “medical” or “pharmacies” or similar terms]',
    answers: [
      'pharmaceutical industry',
      'prescription drug industry',
      'answers mentioning pharmaceuticals',
      'prescription drugs',
      'prescription medications such as drug companies',
      'pharma',
    ],
  },
  {
    answerline: 'Linus <strong><u>Pauling</u></strong>',
    answers: ['pauling', 'linus pauling'],
  },
  {
    answerline:
      'non-Euclidean geometry [prompt on partial answers, prompt on hyperbolic geometry, prompt on elliptical geometry, prompt on geometry, prompt on quadrilateral and accept non-Euclidean quadrilateral until Beltrami , do NOT accept or prompt on Euclidean geometry ]',
    answers: ['noneuclidean geometry', 'noneuclidean quadrilateral'],
  },
];

describe('Parsing acceptable answers', () => {
  acceptableAnswerlines.forEach(({ answerline, answers }) => {
    it('testing answerline', ({ expect }) => {
      const correctAnswers = parseAcceptableAnswers(answerline);
      expect(correctAnswers).toEqual(answers);
    });
  });
});

const promptableAnswerlines = [
  {
    answerline:
      'Sicilian Expedition [accept answers involving Athens\'s naval voyage to Sicily for military purposes; prompt on Siege of Syracuse before "Syracuse" is read; prompt on Peloponnesian War before "Segesta" is read]',
    answers: ['siege of syracuse', 'peloponnesian war'],
  },
  {
    answerline:
      'parallel [accept parallel major or parallel minor; accept parallel modulation; accept modulating or moving to the parallel key; accept parallel fifths or parallel octaves; accept parallel motion or parallel movement or harmonic parallelism; prompt on P; prompt on altering, raising, or lowering the third scale degree until “third” is read by asking “what is the name of the relationship between the keys?”; prompt on modulating or moving between major and minor or into major or into minor by asking “what is the name of the relationship between the keys?”; prompt on changing keys or changing modes; prompt on mode or modal transformation until “Mode” is read]',
    answers: [
      'p',
      'altering',
      'modulating',
      'moving between major and minor',
      'into major',
      'into minor by asking what is the name of the relationship between the keys?',
      'changing keys',
      'changing modes',
      'mode',
      'modal transformation',
    ],
  },
  {
    answerline:
      'Kingdom of the Netherlands[or Koninkrijk der Nederlanden; accept Burgundian Netherlands or Bourgondische Nederlanden; accept Republic of the Seven United Netherlands or Republiek der Zeven Verenigde Nederlanden; accept the Republic of the Seven United Provinces or Republiek der Zeven Verenigde ProvinciÃ«n; accept Federated Dutch Provinces or Foederatae Belgii Provinciae or Dutch Federation or Belgica Foederata; accept Seventeen Provinces or Zeventien ProvinciÃ«n; prompt on "County of Holland" or "Graafshap Holland"; do not accept "Flanders" or "County of Flanders" or "Vlaanderen" or "Graafschap Vlaanderen" do not prompt on or accept "Belgium" or "Kingdom of Belgium"]',
    answers: ['county of holland', 'graafshap holland'],
  },
  {
    answerline:
      'chiral resolution [or optical resolution or kinetic resolution; or chiral derivatization or derivatizing chiral compounds; or descriptions like separating chiral compounds or mixtures; or determining enantiomeric excess or determining optical purity; or determining absolute configuration; or analysis of enantiomers or analysis of diastereomers or analysis of chiral mixtures; accept separating stereoisomers or enantiomers or diastereomers before the end of the tossup, and prompt after; prompt on resolution or separation or equivalents; prompt on performing NMR or HPLC or chromatography by asking what is the goal of that experiment?]',
    answers: [
      'resolution',
      'separation',
      'equivalents',
      'performing nmr',
      'hplc',
      'chromatography by asking what is the goal of that experiment?',
    ],
  },
  {
    answerline:
      'the Federal Reserve Board of Governors raising interest rates [accept obvious equivalents like rate hikes in place of “raising the interest rate”; accept the Federal Open Market Committee or the FOMC in place of “Fed”; prompt on partial answers; accept the federal funds rate or the discount rate in place of “interest rate”; prompt on decreasing the money supply or decreasing M0 or decreasing M1 or decreasing M2 or contractionary monetary policy or tightening monetary policy and obvious equivalents; prompt on answers like combating inflation before “inflation” is mentioned; prompt on open market operations]',
    answers: [
      'partial answers',
      'decreasing the money supply',
      'decreasing m0',
      'decreasing m1',
      'decreasing m2',
      'contractionary monetary policy',
      'tightening monetary policy and obvious equivalents',
      'answers like combating inflation',
      'open market operations',
    ],
  },
  {
    answerline:
      'English Conquest of Delaware [accept logical equivalents that include "English" and "Delaware", such as "English Taking Delaware from the Dutch"; accept "English Conquest of New Amstel" or logical equivalents; accept "English Conquest of New Castle" or logical equivalents; accept "Robert Carr\'s Conquest of Delaware" before "Carr" is said; accept "Destruction of Plockhoy\'s Settlement" or "Destruction of Zwannendael" before "Plockhoy" is said;  prompt on "Dutch Loss of Delaware" or logically equivalent answers; prompt on "English Conquest of New Netherland" and logical equivalents until "New Amsterdam" is said; prompt on "English Conquest of New Sweden" or logical equivalents; do not prompt on or accept "English Conquest of New York" or "English Conquest of New Amsterdam"]',
    answers: [
      'dutch loss of delaware',
      'logically equivalent answers',
      'english conquest of new netherland and logical equivalents',
      'english conquest of new sweden',
      'logical equivalents',
    ],
  },
  { answerline: 'entropy [prompt on ent or e]', answers: ['ent', 'e'] },
  {
    answerline:
      'reunification of Germany [accept word forms and obvious equivalents that mention "unifying East Germany and West Germany"; or deutsche einheit; or deutsche Wiedervereinigung; or herstellung der Einheit Deutschlands; accept the dissolution of East Germany or word forms or obvious equivalents; prompt on anything mentioning "fall of the Berlin Wall" or the "opening of the Brandenburg Gate" before mentioned; prompt on anything mentioning "fall of the Iron Curtain" or "Soviet withdrawal from East Germany"; prompt on "die Wende"; accept "German Democratic Republic" or "Deutsche Demokratische Republik" or "DDR" for "East Germany" anywhere; accept "Federal Republic of Germany" or "Bundesrepublik Deutschland" or "BRD" for "West Germany" anywhere]',
    answers: [
      'anything mentioning fall of the berlin wall',
      'the opening of the brandenburg gate',
      'anything mentioning fall of the iron curtain',
      'soviet withdrawal from east germany',
      'die wende',
    ],
  },
  {
    answerline:
      'security vulnerabilities [or exploits or security bugs or security holes; accept zero-days until read; prompt on bugs, issues, weaknesses, defects, flaws, anomalies, threats, attacks, cyberattacks, breaches, or hacks by asking “what general impact do they have?” and accept answers like “weakens security” or “vulnerable to attack”; prompt on specific types of bugs, such as software bugs or buffer over-read or memory leaks, by asking “can you be less specific?”; do not accept or prompt on “glitches” or “viruses” or “malware” or “data breaches”]',
    answers: ['bugs', 'specific types of bugs'],
  },
  {
    answerline:
      'denial of the Armenian Genocide [or equivalents saying that Turkey does not acknowledge that Armenian Genocide really happened; accept answers like Turkey not calling the Armenian Genocide a genocide; answers must include the phrase Armenian Genocide and that its veracity is being denied; prompt on simply genocide denialism; do not accept or prompt on Holocaust denial; do not accept or prompt on answers from Turkish ultranationalists like "lies about the Armenian incident" or whatever]',
    answers: ['simply genocide denialism'],
  },
  {
    answerline:
      'pharmaceutical industry [or prescription drug industry; accept answers mentioning pharmaceuticals or prescription drugs or prescription medications such as drug companies or pharma; prompt on answers mentioning “healthcare” or “medical” or “pharmacies” or similar terms]',
    answers: [
      'answers mentioning healthcare',
      'medical',
      'pharmacies',
      'similar terms',
    ],
  },
  {
    answerline:
      'non-Euclidean geometry [prompt on partial answers, prompt on hyperbolic geometry, prompt on elliptical geometry, prompt on geometry, prompt on quadrilateral and accept non-Euclidean quadrilateral until Beltrami , do NOT accept or prompt on Euclidean geometry ]',
    answers: [
      'partial answers',
      'hyperbolic geometry',
      'elliptical geometry',
      'geometry',
      'quadrilateral and',
    ],
  },
];

describe('Parsing promptable answers', () => {
  promptableAnswerlines.forEach(({ answerline, answers }) => {
    it('testing answerline', ({ expect }) => {
      const promptableAnswers = parsePromptableAnswers(answerline);
      expect(promptableAnswers).toEqual(answers);
    });
  });
});
