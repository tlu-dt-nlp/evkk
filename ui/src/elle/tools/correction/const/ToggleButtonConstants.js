import {
  ABSTRACT_WORDS,
  CONTENT_WORDS,
  GRAMMARCHECKER,
  LONG_SENTENCE,
  LONG_WORD,
  NOUNS,
  SPELLCHECKER,
  UNCOMMON_WORDS,
  WORD_REPETITION
} from './Constants';

export const VocabularyToggleButtons = [
  {
    title: 'corrector_vocabulary_word_repetitions_tooltip',
    value: WORD_REPETITION,
    text: 'corrector_vocabulary_word_repetitions'
  },
  {
    title: 'corrector_vocabulary_low_frequency_words_tooltip',
    value: UNCOMMON_WORDS,
    text: 'corrector_vocabulary_low_frequency_words'
  },
  {
    title: 'corrector_vocabulary_abstract_words_tooltip',
    value: ABSTRACT_WORDS,
    text: 'corrector_vocabulary_abstract_words'
  },
  {
    title: 'corrector_vocabulary_content_words_tooltip',
    value: CONTENT_WORDS,
    text: 'corrector_vocabulary_content_words'
  }
];

export const ComplexityToggleButtons = [{
  title: 'corrector_long_phrases_tooltip',
  value: LONG_SENTENCE,
  text: 'corrector_complexity_long_sentences'
},
  {
    title: 'corrector_long_words_tooltip',
    value: LONG_WORD,
    text: 'corrector_complexity_long_words'
  },
  {
    title: 'corrector_nouns_tooltip',
    value: NOUNS,
    text: 'corrector_complexity_nouns'
  }
];

export const CorrectionAndTextLevelToggleButtons = [
  {
    title: 'corrector_spelling_errors_tooltip',
    value: SPELLCHECKER,
    text: 'corrector_proficiency_level_spelling'
  },
  {
    title: 'corrector_grammar_errors_tooltip',
    value: GRAMMARCHECKER,
    text: 'corrector_proficiency_level_grammar'
  }];
