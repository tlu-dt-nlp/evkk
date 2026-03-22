/** Common START */

export const ClusterFinderType = {
  MORPHOLOGICAL: "MORPHOLOGICAL",
  SYNTACTIC: "SYNTACTIC",
  WORD_TYPE: "WORD_TYPE"
};

const OptionType = {
  CLAUSE_TYPE: "clauseType",
  WORD_TYPE: "wordType"
};

/**
 * @typedef {Object} VisibleWhen - Node visibility options
 * @property {string[]} [anyOf] - At least one same-level requestKey and/or requestValue must be present in selection
 * @property {string[]} [allOf] - All same-level requestKeys and/or requestValues must be present in selection
 */

/**
 * @typedef {Object} Option - Tree node
 * @property {string} [requestKey] - Request body key
 * @property {string} [requestValue] - Request body value
 * @property {string} translationKey - Label translation key (also used for `tooltipTranslationKey` if not provided: `${translationKey}_tooltip`)
 * @property {string} [tooltipTranslationKey] - Tooltip translation key
 * @property {boolean} [isHeader] - Disable radio/checkbox for current node
 * @property {boolean} [isRadio] - Use radio instead of checkbox for current node
 * @property {VisibleWhen} [visibleWhen] - {@link VisibleWhen}
 * @property {Option[]} [children] - Child nodes
 *
 * Note:
 * If both `requestKey` and `requestValue` are present on the same node, that `requestKey` is used for the `requestValue`.
 * Otherwise, the nearest parent `requestKey` is used for the `requestValue`.
 */

/** Common END */


/** Clause Type START */

export const ClauseType = {
  ALL: "ALL",
  PREDICATE: "F",
  BASIS: "@SUBJ",
  OBJECTIVE: "@OBJ",
  PEDICATE: "@PRD",
  ATTRIBUTE: "AT",
  ADVERBIAL: "@ADVL",
  CONJUNCTIVE_WORD: "@J",
  EXCLAMATION: "@B",
  QUANTIFIER_MODIFIER: "QM",
  ADPOSITION_APPURTENANT: "AP"
};

const ClauseTypeAdditionals = {
  _SELF: "clauseTypeAdditionals[]",
  PREDICATE: {
    FINITE: "@FMV",
    AUXILIARY_FINITE: "@FCV",
    NON_FINITE: "@IMV",
    AUXILIARY_NON_FINITE: "@ICV",
    NEGATION: "@NEG"
  },
  ATTRIBUTE: {
    NOUN_APPOSITIVE: "@NN>",
    NOUN_POSTPOSED: "@<NN",
    ADJECTIVE_APPOSITIVE: "@AN>",
    ADJECTIVE_POSTPOSED: "@<AN",
    ADVERB_APPOSITIVE: "@DN>",
    ADVERB_POSTPOSED: "@<DN",
    ADPOSITIONAL_PHRASE_APPOSITIVE: "@KN>",
    ADPOSITIONAL_PHRASE_POSTPOSED: "@<KN",
    PARTICIBLE_APPOSITIVE: "@VN>",
    PARTICIBLE_POSTPOSED: "@<VN",
    VERB_APPOSITIVE: "@INFN>",
    VERB_POSTPOSED: "@<INFN"
  },
  QUANTIFIER_MODIFIER: {
    APPOSITIVE: "@Q>",
    POSTPOSED: "@<Q"
  },
  ADPOSITION_APPURTENANT: {
    APPOSITIVE: "@P>",
    POSTPOSED: "@<P"
  }
};

/** @type {Option[]} */
export const syntacticClauseTypeOptions = [
  {
    requestKey: OptionType.CLAUSE_TYPE,
    translationKey: "cluster_finder_clause_type",
    isHeader: true,
    children: [
      {
        requestValue: ClauseType.ALL,
        translationKey: "cluster_finder_clause_type_all",
        isRadio: true
      },
      {
        requestValue: ClauseType.PREDICATE,
        translationKey: "cluster_finder_clause_type_predicate",
        isRadio: true,
        children: [
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.PREDICATE.FINITE,
            translationKey: "cluster_finder_clause_type_predicate_finite"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.PREDICATE.AUXILIARY_FINITE,
            translationKey: "cluster_finder_clause_type_predicate_auxiliary_finite"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.PREDICATE.NON_FINITE,
            translationKey: "cluster_finder_clause_type_predicate_non_finite"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.PREDICATE.AUXILIARY_NON_FINITE,
            translationKey: "cluster_finder_clause_type_predicate_auxiliary_non_finite"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.PREDICATE.NEGATION,
            translationKey: "cluster_finder_clause_type_predicate_negation"
          }
        ]
      },
      {
        requestValue: ClauseType.BASIS,
        translationKey: "cluster_finder_clause_type_basis",
        isRadio: true
      },
      {
        requestValue: ClauseType.OBJECTIVE,
        translationKey: "cluster_finder_clause_type_objective",
        isRadio: true
      },
      {
        requestValue: ClauseType.PEDICATE,
        translationKey: "cluster_finder_clause_type_pedicate",
        isRadio: true
      },
      {
        requestValue: ClauseType.ATTRIBUTE,
        translationKey: "cluster_finder_clause_type_attribute",
        isRadio: true,
        children: [
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.ATTRIBUTE.NOUN_APPOSITIVE,
            translationKey: "cluster_finder_clause_type_attribute_noun_appositive"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.ATTRIBUTE.NOUN_POSTPOSED,
            translationKey: "cluster_finder_clause_type_attribute_noun_postposed"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.ATTRIBUTE.ADJECTIVE_APPOSITIVE,
            translationKey: "cluster_finder_clause_type_attribute_adjective_appositive"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.ATTRIBUTE.ADJECTIVE_POSTPOSED,
            translationKey: "cluster_finder_clause_type_attribute_adjective_postposed"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.ATTRIBUTE.ADVERB_APPOSITIVE,
            translationKey: "cluster_finder_clause_type_attribute_adverb_appositive"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.ATTRIBUTE.ADVERB_POSTPOSED,
            translationKey: "cluster_finder_clause_type_attribute_adverb_postposed"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.ATTRIBUTE.ADPOSITIONAL_PHRASE_APPOSITIVE,
            translationKey: "cluster_finder_clause_type_attribute_adpositional_phrase_appositive"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.ATTRIBUTE.ADPOSITIONAL_PHRASE_POSTPOSED,
            translationKey: "cluster_finder_clause_type_attribute_adpositional_phrase_postposed"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.ATTRIBUTE.PARTICIBLE_APPOSITIVE,
            translationKey: "cluster_finder_clause_type_attribute_particible_appositive"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.ATTRIBUTE.PARTICIBLE_POSTPOSED,
            translationKey: "cluster_finder_clause_type_attribute_particible_postposed"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.ATTRIBUTE.VERB_APPOSITIVE,
            translationKey: "cluster_finder_clause_type_attribute_verb_appositive"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.ATTRIBUTE.VERB_POSTPOSED,
            translationKey: "cluster_finder_clause_type_attribute_verb_postposed"
          }
        ]
      },
      {
        requestValue: ClauseType.ADVERBIAL,
        translationKey: "cluster_finder_clause_type_adverbial",
        isRadio: true
      },
      {
        requestValue: ClauseType.CONJUNCTIVE_WORD,
        translationKey: "cluster_finder_clause_type_conjunctive_word",
        isRadio: true
      },
      {
        requestValue: ClauseType.EXCLAMATION,
        translationKey: "cluster_finder_clause_type_exclamation",
        isRadio: true
      },
      {
        requestValue: ClauseType.QUANTIFIER_MODIFIER,
        translationKey: "cluster_finder_clause_type_quantifier_modifier",
        isRadio: true,
        children: [
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.QUANTIFIER_MODIFIER.APPOSITIVE,
            translationKey: "cluster_finder_clause_type_quantifier_modifier_appositive"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.QUANTIFIER_MODIFIER.POSTPOSED,
            translationKey: "cluster_finder_clause_type_quantifier_modifier_postposed"
          }
        ]
      },
      {
        requestValue: ClauseType.ADPOSITION_APPURTENANT,
        translationKey: "cluster_finder_clause_type_adposition_appurtenant",
        isRadio: true,
        children: [
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.ADPOSITION_APPURTENANT.APPOSITIVE,
            translationKey: "cluster_finder_clause_type_adposition_appurtenant_appositive"
          },
          {
            requestKey: ClauseTypeAdditionals._SELF,
            requestValue: ClauseTypeAdditionals.ADPOSITION_APPURTENANT.POSTPOSED,
            translationKey: "cluster_finder_clause_type_adposition_appurtenant_postposed"
          }
        ]
      }
    ]
  }
];

/** Clause Type END */


/** Word Type START */

export const WordType = {
  ALL: "ALL",
  VERB: "V",
  SUBJECT: "S",
  ADJECTIVE: "A",
  PRONOUN: "P",
  NUMERAL: "N",
  ADVERB: "D",
  ADPOSITION: "K",
  CONJUNCTION: "J",
  ABBREVIATION: "Y",
  PUNCTUATION: "Z"
};

const WordTypeRequestKeyPrefix = {
  ALL: "ALL",
  VERB: "VERB",
  SUBJECT: "SUBJECT",
  ADJECTIVE: "ADJECTIVE",
  PRONOUN: "PRONOUN",
  NUMERAL: "NUMERAL",
  ADVERB: "ADVERB",
  ADPOSITION: "ADPOSITION",
  CONJUNCTION: "CONJUNCTION",
  ABBREVIATION: "ABBREVIATION",
  PUNCTUATION: "PUNCTUATION"
};

const WordTypeSubtypes = {
  _SELF: "-subtype[]",
  VERB: {
    MAIN: "main",
    AUX: "aux",
    MOD: "mod"
  },
  SUBJECT: {
    GENERAL: "com",
    REAL: "prop"
  },
  ADJECTIVE: {
    A: "a",
    G: "g"
  },
  PRONOUN: {
    PERS: "pers",
    REFL: "refl",
    REC: "rec",
    POS: "pos",
    DEM: "dem",
    INTER_REL: "inter rel",
    DET: "det",
    INDEF: "indef"
  },
  NUMERAL: {
    CARD: "card",
    ORD: "ord",
    DIGIT: "digit",
    ROMAN: "roman"
  },
  ADPOSITION: {
    POST: "post",
    PREP: "sub"
  },
  CONJUNCTION: {
    COORD: "coord",
    SUB: "sub"
  },
  PUNCTUATION: {
    FULL_STOP: "Fst",
    COMMA: "Com",
    EXCLAMATION_MARK: "Exc",
    QUESTION_MARK: "Int",
    DASH: "Dsh",
    COLON: "Col",
    SEMICOLON: "Scl",
    OPENING_BRACKET: "Opr",
    CLOSING_BRACKET: "Cpr",
    QUOTE: "Quo"
  }
};

const WordTypeFiniteTypes = {
  _SELF: "-finitetype[]",
  P: "VP",
  K: "VK"
};

const WordTypeFiniteTypeSubtypes = {
  K: {
    _SELF: "-subtypeVK[]",
    INF: "inf",
    GER: "get",
    PARTIC: "partic",
    SUP: "sup"
  }
};

const WordTypeFiniteTypeSubtypeAdditionals = {
  K: {
    PARTIC: {
      _SELF: "-subtypeVKPartic[]",
      PAST_PS: "past ps",
      PAST_IMPS: "past imps"
    },
    SUP: {
      _SELF: "-subtypeVKSup[]",
      PS_ILL: "ps ill",
      PS_IN: "ps in",
      PS_EL: "ps el",
      PS_TR: "ps tr",
      PS_AB: "ps ab",
      IMPS: "imps"
    }
  }
};

const WordTypeSpeechTypes = {
  _SELF: "-speechtype[]",
  AFFIRMATIVE: "indic",
  CONDITIONAL: "cond",
  IMPERATIVE: "imp",
  QUOTING: "quot"
};

const WordTypeSpeechSubtypes = {
  _SELF: "-speechsubtype[]",
  AFFIRMATIVE: "af",
  NEGATIVE: "neg"
};

const WordTypeTimeTypes = {
  _SELF: "-timetype[]",
  PRESENT: "pres",
  IMPF: "impf",
  PAST: "past"
};

const WordTypeVoiceTypes = {
  _SELF: "-voicetype[]",
  PS: "ps",
  IMPS: "imps"
};

const WordTypePerspectiveTypes = {
  _SELF: "-perspectivetype[]",
  PS1: "ps1",
  PS2: "ps2",
  PS3: "ps3"
};

const WordTypePluralTypes = {
  _SELF: "-pluralType[]",
  SINGLE: "sg",
  MULTIPLE: "pl"
};

const WordTypeCaseTypes = {
  _SELF: "-casetype[]",
  NOM: "nom",
  GEN: "gen",
  PART: "part",
  ADIT: "adit",
  ILL: "ill",
  IN: "in",
  EL: "el",
  ALL: "all",
  AD: "ad",
  ABL: "abl",
  TR: "tr",
  TERM: "term",
  ESS: "ess",
  ABES: "abes",
  KOM: "kom"
};

const WordTypeStepTypes = {
  _SELF: "-stepType[]",
  POS: "pos",
  COMP: "comp",
  SUPER: "super"
};

/** @type {Option[]} */
const perspectiveTypeOptions = [
  {
    requestValue: WordTypePerspectiveTypes.PS1,
    translationKey: "cluster_finder_word_type_perspective_type_ps1"
  },
  {
    requestValue: WordTypePerspectiveTypes.PS2,
    translationKey: "cluster_finder_word_type_perspective_type_ps2"
  },
  {
    requestValue: WordTypePerspectiveTypes.PS3,
    translationKey: "cluster_finder_word_type_perspective_type_ps3"
  }
];

/** @type {Option[]} */
const pluralTypeOptions = [
  {
    requestValue: WordTypePluralTypes.SINGLE,
    translationKey: "cluster_finder_word_type_plural_type_single"
  },
  {
    requestValue: WordTypePluralTypes.MULTIPLE,
    translationKey: "cluster_finder_word_type_plural_type_multiple"
  }
];

/** @type {Option[]} */
const caseTypeOptions = [
  {
    requestValue: WordTypeCaseTypes.NOM,
    translationKey: "cluster_finder_word_type_case_type_nom"
  },
  {
    requestValue: WordTypeCaseTypes.GEN,
    translationKey: "cluster_finder_word_type_case_type_gen"
  },
  {
    requestValue: WordTypeCaseTypes.PART,
    translationKey: "cluster_finder_word_type_case_type_part"
  },
  {
    requestValue: WordTypeCaseTypes.ADIT,
    translationKey: "cluster_finder_word_type_case_type_adit"
  },
  {
    requestValue: WordTypeCaseTypes.ILL,
    translationKey: "cluster_finder_word_type_case_type_ill"
  },
  {
    requestValue: WordTypeCaseTypes.IN,
    translationKey: "cluster_finder_word_type_case_type_in"
  },
  {
    requestValue: WordTypeCaseTypes.EL,
    translationKey: "cluster_finder_word_type_case_type_el"
  },
  {
    requestValue: WordTypeCaseTypes.ALL,
    translationKey: "cluster_finder_word_type_case_type_all"
  },
  {
    requestValue: WordTypeCaseTypes.AD,
    translationKey: "cluster_finder_word_type_case_type_ad"
  },
  {
    requestValue: WordTypeCaseTypes.ABL,
    translationKey: "cluster_finder_word_type_case_type_abl"
  },
  {
    requestValue: WordTypeCaseTypes.TR,
    translationKey: "cluster_finder_word_type_case_type_tr"
  },
  {
    requestValue: WordTypeCaseTypes.TERM,
    translationKey: "cluster_finder_word_type_case_type_term"
  },
  {
    requestValue: WordTypeCaseTypes.ESS,
    translationKey: "cluster_finder_word_type_case_type_ess"
  },
  {
    requestValue: WordTypeCaseTypes.ABES,
    translationKey: "cluster_finder_word_type_case_type_abes"
  },
  {
    requestValue: WordTypeCaseTypes.KOM,
    translationKey: "cluster_finder_word_type_case_type_kom"
  }
];

/** @type {Option[]} */
export const wordTypeOptions = [
  {
    requestKey: OptionType.WORD_TYPE,
    translationKey: "cluster_finder_word_type_capitalized",
    isHeader: true,
    children: [
      {
        requestValue: WordType.ALL,
        translationKey: "cluster_finder_word_type_all",
        isRadio: true
      },
      {
        requestValue: WordType.VERB,
        translationKey: "cluster_finder_word_type_verb",
        isRadio: true
      },
      {
        requestValue: WordType.SUBJECT,
        translationKey: "cluster_finder_word_type_subject",
        isRadio: true
      },
      {
        requestValue: WordType.ADJECTIVE,
        translationKey: "cluster_finder_word_type_adjective",
        isRadio: true
      },
      {
        requestValue: WordType.PRONOUN,
        translationKey: "cluster_finder_word_type_pronoun",
        isRadio: true
      },
      {
        requestValue: WordType.NUMERAL,
        translationKey: "cluster_finder_word_type_numeral",
        isRadio: true
      },
      {
        requestValue: WordType.ADVERB,
        translationKey: "cluster_finder_word_type_adverb",
        isRadio: true
      },
      {
        requestValue: WordType.ADPOSITION,
        translationKey: "cluster_finder_word_type_adposition",
        isRadio: true
      },
      {
        requestValue: WordType.CONJUNCTION,
        translationKey: "cluster_finder_word_type_conjunction",
        isRadio: true
      },
      {
        requestValue: WordType.ABBREVIATION,
        translationKey: "cluster_finder_word_type_abbreviation",
        isRadio: true
      },
      {
        requestValue: WordType.PUNCTUATION,
        translationKey: "cluster_finder_word_type_punctuation",
        isRadio: true
      }
    ]
  }
];

/** @type {Option[]} */
export const morphologicalWordTypeOptions = [
  {
    requestKey: OptionType.WORD_TYPE,
    translationKey: "cluster_finder_word_type_capitalized",
    isHeader: true,
    children: [
      {
        requestValue: WordType.ALL,
        translationKey: "cluster_finder_word_type_all",
        isRadio: true
      },
      {
        requestValue: WordType.VERB,
        translationKey: "cluster_finder_word_type_verb",
        isRadio: true,
        children: [
          {
            requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeSubtypes._SELF,
            translationKey: "cluster_finder_word_type_verb_subtype",
            isHeader: true,
            children: [
              {
                requestValue: WordTypeSubtypes.VERB.MAIN,
                translationKey: "cluster_finder_word_type_verb_subtype_main"
              },
              {
                requestValue: WordTypeSubtypes.VERB.AUX,
                translationKey: "cluster_finder_word_type_verb_subtype_aux"
              },
              {
                requestValue: WordTypeSubtypes.VERB.MOD,
                translationKey: "cluster_finder_word_type_verb_subtype_mod"
              }
            ]
          },
          {
            requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeFiniteTypes._SELF,
            translationKey: "cluster_finder_word_type_verb_finite_type",
            isHeader: true,
            children: [
              {
                requestValue: WordTypeFiniteTypes.P,
                translationKey: "cluster_finder_word_type_finite_type_p",
                isRadio: true,
                children: [
                  {
                    requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeSpeechTypes._SELF,
                    translationKey: "cluster_finder_word_type_verb_speech_type",
                    isHeader: true,
                    children: [
                      {
                        requestValue: WordTypeSpeechTypes.AFFIRMATIVE,
                        translationKey: "cluster_finder_word_type_speech_type_affirmative"
                      },
                      {
                        requestValue: WordTypeSpeechTypes.CONDITIONAL,
                        translationKey: "cluster_finder_word_type_speech_type_conditional"
                      },
                      {
                        requestValue: WordTypeSpeechTypes.IMPERATIVE,
                        translationKey: "cluster_finder_word_type_speech_type_imperative"
                      },
                      {
                        requestValue: WordTypeSpeechTypes.QUOTING,
                        translationKey: "cluster_finder_word_type_speech_type_quoting"
                      }
                    ]
                  },
                  {
                    requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeTimeTypes._SELF,
                    translationKey: "cluster_finder_word_type_verb_time_type",
                    isHeader: true,
                    children: [
                      {
                        requestValue: WordTypeTimeTypes.PRESENT,
                        translationKey: "cluster_finder_word_type_time_type_present"
                      },
                      {
                        requestValue: WordTypeTimeTypes.IMPF,
                        translationKey: "cluster_finder_word_type_time_type_impf"
                      },
                      {
                        requestValue: WordTypeTimeTypes.PAST,
                        translationKey: "cluster_finder_word_type_time_type_past"
                      }
                    ]
                  },
                  {
                    requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeVoiceTypes._SELF,
                    translationKey: "cluster_finder_word_type_verb_voice_type",
                    isHeader: true,
                    children: [
                      {
                        requestValue: WordTypeVoiceTypes.PS,
                        translationKey: "cluster_finder_word_type_voice_type_ps"
                      },
                      {
                        requestValue: WordTypeVoiceTypes.IMPS,
                        translationKey: "cluster_finder_word_type_voice_type_imps"
                      }
                    ]
                  },
                  {
                    requestKey: WordTypeRequestKeyPrefix.VERB + WordTypePerspectiveTypes._SELF,
                    translationKey: "cluster_finder_word_type_perspective_type",
                    isHeader: true,
                    children: perspectiveTypeOptions.map((o) => ({
                      ...o,
                      tooltipTranslationKey: `${o.translationKey}_verb_tooltip`
                    }))
                  },
                  {
                    requestKey: WordTypeRequestKeyPrefix.VERB + WordTypePluralTypes._SELF,
                    translationKey: "cluster_finder_word_type_plural_type",
                    isHeader: true,
                    children: pluralTypeOptions.map((o) => ({
                      ...o,
                      tooltipTranslationKey: `${o.translationKey}_verb_tooltip`
                    }))
                  },
                  {
                    requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeSpeechSubtypes._SELF,
                    translationKey: "cluster_finder_word_type_verb_speech_subtype",
                    isHeader: true,
                    children: [
                      {
                        requestValue: WordTypeSpeechSubtypes.AFFIRMATIVE,
                        translationKey: "cluster_finder_word_type_speech_subtype_affirmative"
                      },
                      {
                        requestValue: WordTypeSpeechSubtypes.NEGATIVE,
                        translationKey: "cluster_finder_word_type_speech_subtype_negative"
                      }
                    ]
                  }
                ]
              },
              {
                requestValue: WordTypeFiniteTypes.K,
                translationKey: "cluster_finder_word_type_finite_type_k",
                isRadio: true,
                children: [
                  {
                    requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeFiniteTypeSubtypes.K._SELF,
                    requestValue: WordTypeFiniteTypeSubtypes.K.INF,
                    translationKey: "cluster_finder_word_type_finite_type_k_inf"
                  },
                  {
                    requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeFiniteTypeSubtypes.K._SELF,
                    requestValue: WordTypeFiniteTypeSubtypes.K.GER,
                    translationKey: "cluster_finder_word_type_finite_type_k_ger"
                  },
                  {
                    requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeFiniteTypeSubtypes.K._SELF,
                    requestValue: WordTypeFiniteTypeSubtypes.K.PARTIC,
                    translationKey: "cluster_finder_word_type_finite_type_k_partic",
                    children: [
                      {
                        requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.PARTIC._SELF,
                        requestValue: WordTypeFiniteTypeSubtypeAdditionals.K.PARTIC.PAST_PS,
                        translationKey: "cluster_finder_word_type_finite_type_k_partic_past_ps"
                      },
                      {
                        requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.PARTIC._SELF,
                        requestValue: WordTypeFiniteTypeSubtypeAdditionals.K.PARTIC.PAST_IMPS,
                        translationKey: "cluster_finder_word_type_finite_type_k_partic_past_imps"
                      }
                    ]
                  },
                  {
                    requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeFiniteTypeSubtypes.K._SELF,
                    requestValue: WordTypeFiniteTypeSubtypes.K.SUP,
                    translationKey: "cluster_finder_word_type_finite_type_k_sup",
                    children: [
                      {
                        requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.SUP._SELF,
                        requestValue: WordTypeFiniteTypeSubtypeAdditionals.K.SUP.PS_ILL,
                        translationKey: "cluster_finder_word_type_finite_type_k_sup_ps_ill"
                      },
                      {
                        requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.SUP._SELF,
                        requestValue: WordTypeFiniteTypeSubtypeAdditionals.K.SUP.PS_IN,
                        translationKey: "cluster_finder_word_type_finite_type_k_sup_ps_in"
                      },
                      {
                        requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.SUP._SELF,
                        requestValue: WordTypeFiniteTypeSubtypeAdditionals.K.SUP.PS_EL,
                        translationKey: "cluster_finder_word_type_finite_type_k_sup_ps_el"
                      },
                      {
                        requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.SUP._SELF,
                        requestValue: WordTypeFiniteTypeSubtypeAdditionals.K.SUP.PS_TR,
                        translationKey: "cluster_finder_word_type_finite_type_k_sup_ps_tr"
                      },
                      {
                        requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.SUP._SELF,
                        requestValue: WordTypeFiniteTypeSubtypeAdditionals.K.SUP.PS_AB,
                        translationKey: "cluster_finder_word_type_finite_type_k_sup_ps_ab"
                      },
                      {
                        requestKey: WordTypeRequestKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.SUP._SELF,
                        requestValue: WordTypeFiniteTypeSubtypeAdditionals.K.SUP.IMPS,
                        translationKey: "cluster_finder_word_type_finite_type_k_sup_imps"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        requestValue: WordType.SUBJECT,
        translationKey: "cluster_finder_word_type_subject",
        isRadio: true,
        children: [
          {
            requestKey: WordTypeRequestKeyPrefix.SUBJECT + WordTypeSubtypes._SELF,
            translationKey: "cluster_finder_word_type_subject_subtype",
            isHeader: true,
            children: [
              {
                requestValue: WordTypeSubtypes.SUBJECT.GENERAL,
                translationKey: "cluster_finder_word_type_subject_subtype_general"
              },
              {
                requestValue: WordTypeSubtypes.SUBJECT.REAL,
                translationKey: "cluster_finder_word_type_subject_subtype_real"
              }
            ]
          },
          {
            requestKey: WordTypeRequestKeyPrefix.SUBJECT + WordTypePluralTypes._SELF,
            translationKey: "cluster_finder_word_type_plural_type",
            isHeader: true,
            children: pluralTypeOptions.map((o) => ({
              ...o,
              tooltipTranslationKey: `${o.translationKey}_subject_tooltip`
            }))
          },
          {
            requestKey: WordTypeRequestKeyPrefix.SUBJECT + WordTypeCaseTypes._SELF,
            translationKey: "cluster_finder_word_type_case_type",
            isHeader: true,
            children: caseTypeOptions.map((o) => ({
              ...o,
              tooltipTranslationKey: `${o.translationKey}_subject_tooltip`
            }))
          }
        ]
      },
      {
        requestValue: WordType.ADJECTIVE,
        translationKey: "cluster_finder_word_type_adjective",
        isRadio: true,
        children: [
          {
            requestKey: WordTypeRequestKeyPrefix.ADJECTIVE + WordTypeSubtypes._SELF,
            translationKey: "cluster_finder_word_type_adjective_subtype",
            isHeader: true,
            children: [
              {
                requestValue: WordTypeSubtypes.ADJECTIVE.A,
                translationKey: "cluster_finder_word_type_adjective_subtype_a",
                isRadio: true,
                children: [
                  {
                    requestKey: WordTypeRequestKeyPrefix.ADJECTIVE + WordTypeStepTypes._SELF,
                    translationKey: "cluster_finder_word_type_step_type",
                    isHeader: true,
                    children: [
                      {
                        requestValue: WordTypeStepTypes.POS,
                        translationKey: "cluster_finder_word_type_step_type_pos"
                      },
                      {
                        requestValue: WordTypeStepTypes.COMP,
                        translationKey: "cluster_finder_word_type_step_type_comp"
                      },
                      {
                        requestValue: WordTypeStepTypes.SUPER,
                        translationKey: "cluster_finder_word_type_step_type_super"
                      }
                    ]
                  },
                  {
                    requestKey: WordTypeRequestKeyPrefix.ADJECTIVE + WordTypePluralTypes._SELF,
                    translationKey: "cluster_finder_word_type_plural_type",
                    isHeader: true,
                    children: pluralTypeOptions.map((o) => ({
                      ...o,
                      tooltipTranslationKey: `${o.translationKey}_adjective_tooltip`
                    }))
                  },
                  {
                    requestKey: WordTypeRequestKeyPrefix.ADJECTIVE + WordTypeCaseTypes._SELF,
                    translationKey: "cluster_finder_word_type_case_type",
                    isHeader: true,
                    children: caseTypeOptions.map((o) => ({
                      ...o,
                      tooltipTranslationKey: `${o.translationKey}_adjective_tooltip`
                    }))
                  }
                ]
              },
              {
                requestValue: WordTypeSubtypes.ADJECTIVE.G,
                translationKey: "cluster_finder_word_type_adjective_subtype_g",
                isRadio: true
              }
            ]
          }
        ]
      },
      {
        requestValue: WordType.PRONOUN,
        translationKey: "cluster_finder_word_type_pronoun",
        isRadio: true,
        children: [
          {
            requestKey: WordTypeRequestKeyPrefix.PRONOUN + WordTypeSubtypes._SELF,
            translationKey: "cluster_finder_word_type_pronoun_subtype",
            isHeader: true,
            children: [
              {
                requestValue: WordTypeSubtypes.PRONOUN.PERS,
                translationKey: "cluster_finder_word_type_pronoun_subtype_pers",
                children: [
                  {
                    requestKey: WordTypeRequestKeyPrefix.PRONOUN + WordTypePerspectiveTypes._SELF,
                    translationKey: "cluster_finder_word_type_perspective_type",
                    isHeader: true,
                    children: perspectiveTypeOptions.map((o) => ({
                      ...o,
                      tooltipTranslationKey: `${o.translationKey}_pronoun_tooltip`
                    }))
                  }
                ]
              },
              {
                requestValue: WordTypeSubtypes.PRONOUN.REFL,
                translationKey: "cluster_finder_word_type_pronoun_subtype_refl"
              },
              {
                requestValue: WordTypeSubtypes.PRONOUN.REC,
                translationKey: "cluster_finder_word_type_pronoun_subtype_rec"
              },
              {
                requestValue: WordTypeSubtypes.PRONOUN.POS,
                translationKey: "cluster_finder_word_type_pronoun_subtype_pos"
              },
              {
                requestValue: WordTypeSubtypes.PRONOUN.DEM,
                translationKey: "cluster_finder_word_type_pronoun_subtype_dem"
              },
              {
                requestValue: WordTypeSubtypes.PRONOUN.INTER_REL,
                translationKey: "cluster_finder_word_type_pronoun_subtype_inter_rel"
              },
              {
                requestValue: WordTypeSubtypes.PRONOUN.DET,
                translationKey: "cluster_finder_word_type_pronoun_subtype_det"
              },
              {
                requestValue: WordTypeSubtypes.PRONOUN.INDEF,
                translationKey: "cluster_finder_word_type_pronoun_subtype_indef"
              }
            ]
          },
          {
            requestKey: WordTypeRequestKeyPrefix.PRONOUN + WordTypePluralTypes._SELF,
            translationKey: "cluster_finder_word_type_plural_type",
            isHeader: true,
            children: pluralTypeOptions.map((o) => ({
              ...o,
              tooltipTranslationKey: `${o.translationKey}_pronoun_tooltip`
            }))
          },
          {
            requestKey: WordTypeRequestKeyPrefix.PRONOUN + WordTypeCaseTypes._SELF,
            translationKey: "cluster_finder_word_type_case_type",
            isHeader: true,
            children: caseTypeOptions.map((o) => ({
              ...o,
              tooltipTranslationKey: `${o.translationKey}_pronoun_tooltip`
            }))
          }
        ]
      },
      {
        requestValue: WordType.NUMERAL,
        translationKey: "cluster_finder_word_type_numeral",
        isRadio: true,
        children: [
          {
            requestKey: WordTypeRequestKeyPrefix.NUMERAL + WordTypeSubtypes._SELF,
            translationKey: "cluster_finder_word_type_numeral_subtype",
            isHeader: true,
            children: [
              {
                requestValue: WordTypeSubtypes.NUMERAL.CARD,
                translationKey: "cluster_finder_word_type_numeral_subtype_card"
              },
              {
                requestValue: WordTypeSubtypes.NUMERAL.ORD,
                translationKey: "cluster_finder_word_type_numeral_subtype_ord"
              },
              {
                requestValue: WordTypeSubtypes.NUMERAL.DIGIT,
                translationKey: "cluster_finder_word_type_numeral_subtype_digit"
              },
              {
                requestValue: WordTypeSubtypes.NUMERAL.ROMAN,
                translationKey: "cluster_finder_word_type_numeral_subtype_roman"
              }
            ]
          },
          {
            requestKey: WordTypeRequestKeyPrefix.NUMERAL + WordTypePluralTypes._SELF,
            translationKey: "cluster_finder_word_type_plural_type",
            isHeader: true,
            visibleWhen: {
              anyOf: [WordTypeSubtypes.NUMERAL.CARD, WordTypeSubtypes.NUMERAL.ORD]
            },
            children: pluralTypeOptions.map((o) => ({
              ...o,
              tooltipTranslationKey: `${o.translationKey}_numeral_tooltip`
            }))
          },
          {
            requestKey: WordTypeRequestKeyPrefix.NUMERAL + WordTypeCaseTypes._SELF,
            translationKey: "cluster_finder_word_type_case_type",
            isHeader: true,
            visibleWhen: {
              anyOf: [WordTypeSubtypes.NUMERAL.CARD, WordTypeSubtypes.NUMERAL.ORD]
            },
            children: caseTypeOptions.map((o) => ({
              ...o,
              tooltipTranslationKey: `${o.translationKey}_numeral_tooltip`
            }))
          }
        ]
      },
      {
        requestValue: WordType.ADVERB,
        translationKey: "cluster_finder_word_type_adverb",
        isRadio: true
      },
      {
        requestValue: WordType.ADPOSITION,
        translationKey: "cluster_finder_word_type_adposition",
        isRadio: true,
        children: [
          {
            requestKey: WordTypeRequestKeyPrefix.ADPOSITION + WordTypeSubtypes._SELF,
            translationKey: "cluster_finder_word_type_adposition_subtype",
            isHeader: true,
            children: [
              {
                requestValue: WordTypeSubtypes.ADPOSITION.POST,
                translationKey: "cluster_finder_word_type_adposition_subtype_post"
              },
              {
                requestValue: WordTypeSubtypes.ADPOSITION.PREP,
                translationKey: "cluster_finder_word_type_adposition_subtype_prep"
              }
            ]
          }
        ]
      },
      {
        requestValue: WordType.CONJUNCTION,
        translationKey: "cluster_finder_word_type_conjunction",
        isRadio: true,
        children: [
          {
            requestKey: WordTypeRequestKeyPrefix.CONJUNCTION + WordTypeSubtypes._SELF,
            translationKey: "cluster_finder_word_type_conjunction_subtype",
            isHeader: true,
            children: [
              {
                requestValue: WordTypeSubtypes.CONJUNCTION.COORD,
                translationKey: "cluster_finder_word_type_conjunction_subtype_coord"
              },
              {
                requestValue: WordTypeSubtypes.CONJUNCTION.SUB,
                translationKey: "cluster_finder_word_type_conjunction_subtype_sub"
              }
            ]
          }
        ]
      },
      {
        requestValue: WordType.ABBREVIATION,
        translationKey: "cluster_finder_word_type_abbreviation",
        isRadio: true
      },
      {
        requestValue: WordType.PUNCTUATION,
        translationKey: "cluster_finder_word_type_punctuation",
        isRadio: true,
        children: [
          {
            requestKey: WordTypeRequestKeyPrefix.PUNCTUATION + WordTypeSubtypes._SELF,
            translationKey: "cluster_finder_word_type_punctuation_subtype",
            isHeader: true,
            children: [
              {
                requestValue: WordTypeSubtypes.PUNCTUATION.FULL_STOP,
                translationKey: "cluster_finder_word_type_punctuation_subtype_full_stop"
              },
              {
                requestValue: WordTypeSubtypes.PUNCTUATION.COMMA,
                translationKey: "cluster_finder_word_type_punctuation_subtype_comma"
              },
              {
                requestValue: WordTypeSubtypes.PUNCTUATION.EXCLAMATION_MARK,
                translationKey: "cluster_finder_word_type_punctuation_subtype_exclamation_mark"
              },
              {
                requestValue: WordTypeSubtypes.PUNCTUATION.QUESTION_MARK,
                translationKey: "cluster_finder_word_type_punctuation_subtype_question_mark"
              },
              {
                requestValue: WordTypeSubtypes.PUNCTUATION.DASH,
                translationKey: "cluster_finder_word_type_punctuation_subtype_dash"
              },
              {
                requestValue: WordTypeSubtypes.PUNCTUATION.COLON,
                translationKey: "cluster_finder_word_type_punctuation_subtype_colon"
              },
              {
                requestValue: WordTypeSubtypes.PUNCTUATION.SEMICOLON,
                translationKey: "cluster_finder_word_type_punctuation_subtype_semicolon"
              },
              {
                requestValue: WordTypeSubtypes.PUNCTUATION.OPENING_BRACKET,
                translationKey: "cluster_finder_word_type_punctuation_subtype_opening_bracket"
              },
              {
                requestValue: WordTypeSubtypes.PUNCTUATION.CLOSING_BRACKET,
                translationKey: "cluster_finder_word_type_punctuation_subtype_closing_bracket"
              },
              {
                requestValue: WordTypeSubtypes.PUNCTUATION.QUOTE,
                translationKey: "cluster_finder_word_type_punctuation_subtype_quote"
              }
            ]
          }
        ]
      }
    ]
  }
];

/** Word Type END */
