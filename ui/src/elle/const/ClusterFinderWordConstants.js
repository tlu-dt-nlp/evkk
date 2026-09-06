import { ClusterFinderRootNodePayloadKey } from './ClusterFinderConstants';

/**
 * Word type filters. See ClusterFinderConstants for the node format.
 *
 * Payload keys and values are written literally: they are a backend contract, so the
 * string that goes over the wire should be readable at the node that sends it. Label keys
 * are literal for the same reason — they must stay greppable against the translations.
 */

export const WordType = {
  ALL: 'ALL',
  VERB: 'V',
  SUBJECT: 'S',
  ADJECTIVE: 'A',
  PRONOUN: 'P',
  NUMERAL: 'N',
  ADVERB: 'D',
  ADPOSITION: 'K',
  CONJUNCTION: 'J',
  ABBREVIATION: 'Y',
  PUNCTUATION: 'Z'
};

// The only payload keys repeated across siblings, named so the verb's non-finite branch
// stays readable at the depth it sits.
const VK = 'VERB-subtypeVK[]';
const VK_PARTIC = 'VERB-subtypeVKPartic[]';
const VK_SUP = 'VERB-subtypeVKSup[]';

// Case, plural and perspective are the same groups wherever they appear, but their
// tooltips are worded per word type — hence the suffix rather than one shared key.
const withTooltips = (nodes, wordType) =>
  nodes.map((node) => ({ ...node, tooltipKey: `${node.labelKey}_${wordType}_tooltip` }));

const perspectiveTypeNodes = [
  { payloadValue: 'ps1', labelKey: 'cluster_finder_word_type_perspective_type_ps1' },
  { payloadValue: 'ps2', labelKey: 'cluster_finder_word_type_perspective_type_ps2' },
  { payloadValue: 'ps3', labelKey: 'cluster_finder_word_type_perspective_type_ps3' }
];

const pluralTypeNodes = [
  { payloadValue: 'sg', labelKey: 'cluster_finder_word_type_plural_type_single' },
  { payloadValue: 'pl', labelKey: 'cluster_finder_word_type_plural_type_multiple' }
];

const caseTypeNodes = [
  { payloadValue: 'nom', labelKey: 'cluster_finder_word_type_case_type_nom' },
  { payloadValue: 'gen', labelKey: 'cluster_finder_word_type_case_type_gen' },
  { payloadValue: 'part', labelKey: 'cluster_finder_word_type_case_type_part' },
  { payloadValue: 'adit', labelKey: 'cluster_finder_word_type_case_type_adit' },
  { payloadValue: 'ill', labelKey: 'cluster_finder_word_type_case_type_ill' },
  { payloadValue: 'in', labelKey: 'cluster_finder_word_type_case_type_in' },
  { payloadValue: 'el', labelKey: 'cluster_finder_word_type_case_type_el' },
  { payloadValue: 'all', labelKey: 'cluster_finder_word_type_case_type_all' },
  { payloadValue: 'ad', labelKey: 'cluster_finder_word_type_case_type_ad' },
  { payloadValue: 'abl', labelKey: 'cluster_finder_word_type_case_type_abl' },
  { payloadValue: 'tr', labelKey: 'cluster_finder_word_type_case_type_tr' },
  { payloadValue: 'term', labelKey: 'cluster_finder_word_type_case_type_term' },
  { payloadValue: 'ess', labelKey: 'cluster_finder_word_type_case_type_ess' },
  { payloadValue: 'abes', labelKey: 'cluster_finder_word_type_case_type_abes' },
  { payloadValue: 'kom', labelKey: 'cluster_finder_word_type_case_type_kom' }
];

/** The plain word type list, used when morphological analysis is off. */
export const wordTypeNodes = [
  {
    payloadKey: ClusterFinderRootNodePayloadKey.WORD_TYPE,
    labelKey: 'cluster_finder_word_type_capitalized',
    isCategory: true,
    children: [
      { payloadValue: WordType.ALL, labelKey: 'cluster_finder_word_type_all', isRadio: true },
      { payloadValue: WordType.VERB, labelKey: 'cluster_finder_word_type_verb', isRadio: true },
      { payloadValue: WordType.SUBJECT, labelKey: 'cluster_finder_word_type_subject', isRadio: true },
      { payloadValue: WordType.ADJECTIVE, labelKey: 'cluster_finder_word_type_adjective', isRadio: true },
      { payloadValue: WordType.PRONOUN, labelKey: 'cluster_finder_word_type_pronoun', isRadio: true },
      { payloadValue: WordType.NUMERAL, labelKey: 'cluster_finder_word_type_numeral', isRadio: true },
      { payloadValue: WordType.ADVERB, labelKey: 'cluster_finder_word_type_adverb', isRadio: true },
      { payloadValue: WordType.ADPOSITION, labelKey: 'cluster_finder_word_type_adposition', isRadio: true },
      { payloadValue: WordType.CONJUNCTION, labelKey: 'cluster_finder_word_type_conjunction', isRadio: true },
      { payloadValue: WordType.ABBREVIATION, labelKey: 'cluster_finder_word_type_abbreviation', isRadio: true },
      { payloadValue: WordType.PUNCTUATION, labelKey: 'cluster_finder_word_type_punctuation', isRadio: true }
    ]
  }
];

/** The same list, each word type opening its morphological categories. */
export const morphologicalWordTypeNodes = [
  {
    payloadKey: ClusterFinderRootNodePayloadKey.WORD_TYPE,
    labelKey: 'cluster_finder_word_type_capitalized',
    isCategory: true,
    children: [
      { payloadValue: WordType.ALL, labelKey: 'cluster_finder_word_type_all', isRadio: true },

      {
        payloadValue: WordType.VERB,
        labelKey: 'cluster_finder_word_type_verb',
        isRadio: true,
        children: [
          {
            payloadKey: 'VERB-subtype[]',
            labelKey: 'cluster_finder_word_type_verb_subtype',
            isCategory: true,
            children: [
              { payloadValue: 'main', labelKey: 'cluster_finder_word_type_verb_subtype_main' },
              { payloadValue: 'aux', labelKey: 'cluster_finder_word_type_verb_subtype_aux' },
              { payloadValue: 'mod', labelKey: 'cluster_finder_word_type_verb_subtype_mod' }
            ]
          },
          {
            payloadKey: 'VERB-finitetype[]',
            labelKey: 'cluster_finder_word_type_verb_finite_type',
            isCategory: true,
            children: [
              {
                payloadValue: 'VP',
                labelKey: 'cluster_finder_word_type_finite_type_p',
                isRadio: true,
                children: [
                  {
                    payloadKey: 'VERB-speechtype[]',
                    labelKey: 'cluster_finder_word_type_verb_speech_type',
                    isCategory: true,
                    children: [
                      { payloadValue: 'indic', labelKey: 'cluster_finder_word_type_speech_type_affirmative' },
                      { payloadValue: 'cond', labelKey: 'cluster_finder_word_type_speech_type_conditional' },
                      { payloadValue: 'imp', labelKey: 'cluster_finder_word_type_speech_type_imperative' },
                      { payloadValue: 'quot', labelKey: 'cluster_finder_word_type_speech_type_quoting' }
                    ]
                  },
                  {
                    payloadKey: 'VERB-timetype[]',
                    labelKey: 'cluster_finder_word_type_verb_time_type',
                    isCategory: true,
                    children: [
                      { payloadValue: 'pres', labelKey: 'cluster_finder_word_type_time_type_present' },
                      { payloadValue: 'impf', labelKey: 'cluster_finder_word_type_time_type_impf' },
                      { payloadValue: 'past', labelKey: 'cluster_finder_word_type_time_type_past' }
                    ]
                  },
                  {
                    payloadKey: 'VERB-voicetype[]',
                    labelKey: 'cluster_finder_word_type_verb_voice_type',
                    isCategory: true,
                    children: [
                      { payloadValue: 'ps', labelKey: 'cluster_finder_word_type_voice_type_ps' },
                      { payloadValue: 'imps', labelKey: 'cluster_finder_word_type_voice_type_imps' }
                    ]
                  },
                  {
                    payloadKey: 'VERB-perspectivetype[]',
                    labelKey: 'cluster_finder_word_type_perspective_type',
                    isCategory: true,
                    children: withTooltips(perspectiveTypeNodes, 'verb')
                  },
                  {
                    payloadKey: 'VERB-pluralType[]',
                    labelKey: 'cluster_finder_word_type_plural_type',
                    isCategory: true,
                    children: withTooltips(pluralTypeNodes, 'verb')
                  },
                  {
                    payloadKey: 'VERB-speechsubtype[]',
                    labelKey: 'cluster_finder_word_type_verb_speech_subtype',
                    isCategory: true,
                    children: [
                      { payloadValue: 'af', labelKey: 'cluster_finder_word_type_speech_subtype_affirmative' },
                      { payloadValue: 'neg', labelKey: 'cluster_finder_word_type_speech_subtype_negative' }
                    ]
                  }
                ]
              },
              {
                payloadValue: 'VK',
                labelKey: 'cluster_finder_word_type_finite_type_k',
                isRadio: true,
                // Each of these carries its own payloadKey: they are children of a choice
                // rather than a category, so there is no ancestor to inherit one from.
                children: [
                  { payloadKey: VK, payloadValue: 'inf',
                    labelKey: 'cluster_finder_word_type_finite_type_k_inf' },
                  // 'get', not 'ger' — this is the value the backend expects.
                  { payloadKey: VK, payloadValue: 'get',
                    labelKey: 'cluster_finder_word_type_finite_type_k_ger' },
                  {
                    payloadKey: VK, payloadValue: 'partic',
                    labelKey: 'cluster_finder_word_type_finite_type_k_partic',
                    children: [
                      { payloadKey: VK_PARTIC, payloadValue: 'past ps',
                        labelKey: 'cluster_finder_word_type_finite_type_k_partic_past_ps' },
                      { payloadKey: VK_PARTIC, payloadValue: 'past imps',
                        labelKey: 'cluster_finder_word_type_finite_type_k_partic_past_imps' }
                    ]
                  },
                  {
                    payloadKey: VK, payloadValue: 'sup',
                    labelKey: 'cluster_finder_word_type_finite_type_k_sup',
                    children: [
                      { payloadKey: VK_SUP, payloadValue: 'ps ill',
                        labelKey: 'cluster_finder_word_type_finite_type_k_sup_ps_ill' },
                      { payloadKey: VK_SUP, payloadValue: 'ps in',
                        labelKey: 'cluster_finder_word_type_finite_type_k_sup_ps_in' },
                      { payloadKey: VK_SUP, payloadValue: 'ps el',
                        labelKey: 'cluster_finder_word_type_finite_type_k_sup_ps_el' },
                      { payloadKey: VK_SUP, payloadValue: 'ps tr',
                        labelKey: 'cluster_finder_word_type_finite_type_k_sup_ps_tr' },
                      { payloadKey: VK_SUP, payloadValue: 'ps ab',
                        labelKey: 'cluster_finder_word_type_finite_type_k_sup_ps_ab' },
                      { payloadKey: VK_SUP, payloadValue: 'imps',
                        labelKey: 'cluster_finder_word_type_finite_type_k_sup_imps' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },

      {
        payloadValue: WordType.SUBJECT,
        labelKey: 'cluster_finder_word_type_subject',
        isRadio: true,
        children: [
          {
            payloadKey: 'SUBJECT-subtype[]',
            labelKey: 'cluster_finder_word_type_subject_subtype',
            isCategory: true,
            children: [
              { payloadValue: 'com', labelKey: 'cluster_finder_word_type_subject_subtype_general' },
              { payloadValue: 'prop', labelKey: 'cluster_finder_word_type_subject_subtype_real' }
            ]
          },
          {
            payloadKey: 'SUBJECT-pluralType[]',
            labelKey: 'cluster_finder_word_type_plural_type',
            isCategory: true,
            children: withTooltips(pluralTypeNodes, 'subject')
          },
          {
            payloadKey: 'SUBJECT-casetype[]',
            labelKey: 'cluster_finder_word_type_case_type',
            isCategory: true,
            children: withTooltips(caseTypeNodes, 'subject')
          }
        ]
      },

      {
        payloadValue: WordType.ADJECTIVE,
        labelKey: 'cluster_finder_word_type_adjective',
        isRadio: true,
        children: [
          {
            payloadKey: 'ADJECTIVE-subtype[]',
            labelKey: 'cluster_finder_word_type_adjective_subtype',
            isCategory: true,
            children: [
              {
                payloadValue: 'a',
                labelKey: 'cluster_finder_word_type_adjective_subtype_a',
                isRadio: true,
                children: [
                  {
                    payloadKey: 'ADJECTIVE-stepType[]',
                    labelKey: 'cluster_finder_word_type_step_type',
                    isCategory: true,
                    children: [
                      { payloadValue: 'pos', labelKey: 'cluster_finder_word_type_step_type_pos' },
                      { payloadValue: 'comp', labelKey: 'cluster_finder_word_type_step_type_comp' },
                      { payloadValue: 'super', labelKey: 'cluster_finder_word_type_step_type_super' }
                    ]
                  },
                  {
                    payloadKey: 'ADJECTIVE-pluralType[]',
                    labelKey: 'cluster_finder_word_type_plural_type',
                    isCategory: true,
                    children: withTooltips(pluralTypeNodes, 'adjective')
                  },
                  {
                    payloadKey: 'ADJECTIVE-casetype[]',
                    labelKey: 'cluster_finder_word_type_case_type',
                    isCategory: true,
                    children: withTooltips(caseTypeNodes, 'adjective')
                  }
                ]
              },
              { payloadValue: 'g', labelKey: 'cluster_finder_word_type_adjective_subtype_g', isRadio: true }
            ]
          }
        ]
      },

      {
        payloadValue: WordType.PRONOUN,
        labelKey: 'cluster_finder_word_type_pronoun',
        isRadio: true,
        children: [
          {
            payloadKey: 'PRONOUN-subtype[]',
            labelKey: 'cluster_finder_word_type_pronoun_subtype',
            isCategory: true,
            children: [
              {
                payloadValue: 'pers',
                labelKey: 'cluster_finder_word_type_pronoun_subtype_pers',
                children: [
                  {
                    payloadKey: 'PRONOUN-perspectivetype[]',
                    labelKey: 'cluster_finder_word_type_perspective_type',
                    isCategory: true,
                    children: withTooltips(perspectiveTypeNodes, 'pronoun')
                  }
                ]
              },
              { payloadValue: 'refl', labelKey: 'cluster_finder_word_type_pronoun_subtype_refl' },
              { payloadValue: 'rec', labelKey: 'cluster_finder_word_type_pronoun_subtype_rec' },
              { payloadValue: 'pos', labelKey: 'cluster_finder_word_type_pronoun_subtype_pos' },
              { payloadValue: 'dem', labelKey: 'cluster_finder_word_type_pronoun_subtype_dem' },
              { payloadValue: 'inter rel', labelKey: 'cluster_finder_word_type_pronoun_subtype_inter_rel' },
              { payloadValue: 'det', labelKey: 'cluster_finder_word_type_pronoun_subtype_det' },
              { payloadValue: 'indef', labelKey: 'cluster_finder_word_type_pronoun_subtype_indef' }
            ]
          },
          {
            payloadKey: 'PRONOUN-pluralType[]',
            labelKey: 'cluster_finder_word_type_plural_type',
            isCategory: true,
            children: withTooltips(pluralTypeNodes, 'pronoun')
          },
          {
            payloadKey: 'PRONOUN-casetype[]',
            labelKey: 'cluster_finder_word_type_case_type',
            isCategory: true,
            children: withTooltips(caseTypeNodes, 'pronoun')
          }
        ]
      },

      {
        payloadValue: WordType.NUMERAL,
        labelKey: 'cluster_finder_word_type_numeral',
        isRadio: true,
        children: [
          {
            payloadKey: 'NUMERAL-subtype[]',
            labelKey: 'cluster_finder_word_type_numeral_subtype',
            isCategory: true,
            children: [
              { payloadValue: 'card', labelKey: 'cluster_finder_word_type_numeral_subtype_card' },
              { payloadValue: 'ord', labelKey: 'cluster_finder_word_type_numeral_subtype_ord' },
              { payloadValue: 'digit', labelKey: 'cluster_finder_word_type_numeral_subtype_digit' },
              { payloadValue: 'roman', labelKey: 'cluster_finder_word_type_numeral_subtype_roman' }
            ]
          },
          {
            // Digits and roman numerals do not inflect, so these two only apply to the
            // spelled-out subtypes.
            payloadKey: 'NUMERAL-pluralType[]',
            labelKey: 'cluster_finder_word_type_plural_type',
            isCategory: true,
            visibleWhen: { anyOf: ['NUMERAL-subtype[]:card', 'NUMERAL-subtype[]:ord'] },
            children: withTooltips(pluralTypeNodes, 'numeral')
          },
          {
            payloadKey: 'NUMERAL-casetype[]',
            labelKey: 'cluster_finder_word_type_case_type',
            isCategory: true,
            visibleWhen: { anyOf: ['NUMERAL-subtype[]:card', 'NUMERAL-subtype[]:ord'] },
            children: withTooltips(caseTypeNodes, 'numeral')
          }
        ]
      },

      { payloadValue: WordType.ADVERB, labelKey: 'cluster_finder_word_type_adverb', isRadio: true },

      {
        payloadValue: WordType.ADPOSITION,
        labelKey: 'cluster_finder_word_type_adposition',
        isRadio: true,
        children: [
          {
            payloadKey: 'ADPOSITION-subtype[]',
            labelKey: 'cluster_finder_word_type_adposition_subtype',
            isCategory: true,
            children: [
              { payloadValue: 'post', labelKey: 'cluster_finder_word_type_adposition_subtype_post' },
              { payloadValue: 'sub', labelKey: 'cluster_finder_word_type_adposition_subtype_prep' }
            ]
          }
        ]
      },

      {
        payloadValue: WordType.CONJUNCTION,
        labelKey: 'cluster_finder_word_type_conjunction',
        isRadio: true,
        children: [
          {
            payloadKey: 'CONJUNCTION-subtype[]',
            labelKey: 'cluster_finder_word_type_conjunction_subtype',
            isCategory: true,
            children: [
              { payloadValue: 'coord', labelKey: 'cluster_finder_word_type_conjunction_subtype_coord' },
              { payloadValue: 'sub', labelKey: 'cluster_finder_word_type_conjunction_subtype_sub' }
            ]
          }
        ]
      },

      { payloadValue: WordType.ABBREVIATION, labelKey: 'cluster_finder_word_type_abbreviation', isRadio: true },

      {
        payloadValue: WordType.PUNCTUATION,
        labelKey: 'cluster_finder_word_type_punctuation',
        isRadio: true,
        children: [
          {
            payloadKey: 'PUNCTUATION-subtype[]',
            labelKey: 'cluster_finder_word_type_punctuation_subtype',
            isCategory: true,
            children: [
              { payloadValue: 'Fst', labelKey: 'cluster_finder_word_type_punctuation_subtype_full_stop' },
              { payloadValue: 'Com', labelKey: 'cluster_finder_word_type_punctuation_subtype_comma' },
              { payloadValue: 'Exc', labelKey: 'cluster_finder_word_type_punctuation_subtype_exclamation_mark' },
              { payloadValue: 'Int', labelKey: 'cluster_finder_word_type_punctuation_subtype_question_mark' },
              { payloadValue: 'Dsh', labelKey: 'cluster_finder_word_type_punctuation_subtype_dash' },
              { payloadValue: 'Col', labelKey: 'cluster_finder_word_type_punctuation_subtype_colon' },
              { payloadValue: 'Scl', labelKey: 'cluster_finder_word_type_punctuation_subtype_semicolon' },
              { payloadValue: 'Opr', labelKey: 'cluster_finder_word_type_punctuation_subtype_opening_bracket' },
              { payloadValue: 'Cpr', labelKey: 'cluster_finder_word_type_punctuation_subtype_closing_bracket' },
              { payloadValue: 'Quo', labelKey: 'cluster_finder_word_type_punctuation_subtype_quote' }
            ]
          }
        ]
      }
    ]
  }
];
