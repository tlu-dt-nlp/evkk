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
} from '../../correction/const/Constants';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';

export const tabValueMap = {
  CORRECTOR: 'correctorTab',
  PROFICIENCY_LEVEL: 'proficiencyLevelTab',
  COMPLEXITY: 'complexityTab',
  VOCABULARY: 'vocabularyTab'
};

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

export const ComplexityToggleButtons = [
  {
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
  }
];

export const IconBarActionButtons = [
  { Icon: UndoIcon, action: 'undo' },
  { Icon: RedoIcon, action: 'redo' }
];

export const ToggleButtonCategories = {
  [tabValueMap.VOCABULARY]: VocabularyToggleButtons,
  [tabValueMap.COMPLEXITY]: ComplexityToggleButtons,
  [tabValueMap.CORRECTOR]: CorrectionAndTextLevelToggleButtons,
  [tabValueMap.PROFICIENCY_LEVEL]: CorrectionAndTextLevelToggleButtons
};
