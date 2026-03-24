import { ClusterFinderRootNodePayloadKey } from "./ClusterFinderConstants";

const WordType = {
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

const WordTypePayloadKeyPrefix = {
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

/** @type {import("./ClusterFinderConstants").ClusterFinderTreeNode[]} */
const perspectiveTypeNodes = [
  {
    payloadValue: WordTypePerspectiveTypes.PS1,
    labelKey: "cluster_finder_word_type_perspective_type_ps1"
  },
  {
    payloadValue: WordTypePerspectiveTypes.PS2,
    labelKey: "cluster_finder_word_type_perspective_type_ps2"
  },
  {
    payloadValue: WordTypePerspectiveTypes.PS3,
    labelKey: "cluster_finder_word_type_perspective_type_ps3"
  }
];

/** @type {import("./ClusterFinderConstants").ClusterFinderTreeNode[]} */
const pluralTypeNodes = [
  {
    payloadValue: WordTypePluralTypes.SINGLE,
    labelKey: "cluster_finder_word_type_plural_type_single"
  },
  {
    payloadValue: WordTypePluralTypes.MULTIPLE,
    labelKey: "cluster_finder_word_type_plural_type_multiple"
  }
];

/** @type {import("./ClusterFinderConstants").ClusterFinderTreeNode[]} */
const caseTypeNodes = [
  {
    payloadValue: WordTypeCaseTypes.NOM,
    labelKey: "cluster_finder_word_type_case_type_nom"
  },
  {
    payloadValue: WordTypeCaseTypes.GEN,
    labelKey: "cluster_finder_word_type_case_type_gen"
  },
  {
    payloadValue: WordTypeCaseTypes.PART,
    labelKey: "cluster_finder_word_type_case_type_part"
  },
  {
    payloadValue: WordTypeCaseTypes.ADIT,
    labelKey: "cluster_finder_word_type_case_type_adit"
  },
  {
    payloadValue: WordTypeCaseTypes.ILL,
    labelKey: "cluster_finder_word_type_case_type_ill"
  },
  {
    payloadValue: WordTypeCaseTypes.IN,
    labelKey: "cluster_finder_word_type_case_type_in"
  },
  {
    payloadValue: WordTypeCaseTypes.EL,
    labelKey: "cluster_finder_word_type_case_type_el"
  },
  {
    payloadValue: WordTypeCaseTypes.ALL,
    labelKey: "cluster_finder_word_type_case_type_all"
  },
  {
    payloadValue: WordTypeCaseTypes.AD,
    labelKey: "cluster_finder_word_type_case_type_ad"
  },
  {
    payloadValue: WordTypeCaseTypes.ABL,
    labelKey: "cluster_finder_word_type_case_type_abl"
  },
  {
    payloadValue: WordTypeCaseTypes.TR,
    labelKey: "cluster_finder_word_type_case_type_tr"
  },
  {
    payloadValue: WordTypeCaseTypes.TERM,
    labelKey: "cluster_finder_word_type_case_type_term"
  },
  {
    payloadValue: WordTypeCaseTypes.ESS,
    labelKey: "cluster_finder_word_type_case_type_ess"
  },
  {
    payloadValue: WordTypeCaseTypes.ABES,
    labelKey: "cluster_finder_word_type_case_type_abes"
  },
  {
    payloadValue: WordTypeCaseTypes.KOM,
    labelKey: "cluster_finder_word_type_case_type_kom"
  }
];

/** @type {import("./ClusterFinderConstants").ClusterFinderTreeNode[]} */
export const wordTypeNodes = [
  {
    payloadKey: ClusterFinderRootNodePayloadKey.WORD_TYPE,
    labelKey: "cluster_finder_word_type_capitalized",
    isCategory: true,
    children: [
      {
        payloadValue: WordType.ALL,
        labelKey: "cluster_finder_word_type_all",
        isRadio: true
      },
      {
        payloadValue: WordType.VERB,
        labelKey: "cluster_finder_word_type_verb",
        isRadio: true
      },
      {
        payloadValue: WordType.SUBJECT,
        labelKey: "cluster_finder_word_type_subject",
        isRadio: true
      },
      {
        payloadValue: WordType.ADJECTIVE,
        labelKey: "cluster_finder_word_type_adjective",
        isRadio: true
      },
      {
        payloadValue: WordType.PRONOUN,
        labelKey: "cluster_finder_word_type_pronoun",
        isRadio: true
      },
      {
        payloadValue: WordType.NUMERAL,
        labelKey: "cluster_finder_word_type_numeral",
        isRadio: true
      },
      {
        payloadValue: WordType.ADVERB,
        labelKey: "cluster_finder_word_type_adverb",
        isRadio: true
      },
      {
        payloadValue: WordType.ADPOSITION,
        labelKey: "cluster_finder_word_type_adposition",
        isRadio: true
      },
      {
        payloadValue: WordType.CONJUNCTION,
        labelKey: "cluster_finder_word_type_conjunction",
        isRadio: true
      },
      {
        payloadValue: WordType.ABBREVIATION,
        labelKey: "cluster_finder_word_type_abbreviation",
        isRadio: true
      },
      {
        payloadValue: WordType.PUNCTUATION,
        labelKey: "cluster_finder_word_type_punctuation",
        isRadio: true
      }
    ]
  }
];

/** @type {import("./ClusterFinderConstants").ClusterFinderTreeNode[]} */
export const morphologicalWordTypeNodes = [
  {
    payloadKey: ClusterFinderRootNodePayloadKey.WORD_TYPE,
    labelKey: "cluster_finder_word_type_capitalized",
    isCategory: true,
    children: [
      {
        payloadValue: WordType.ALL,
        labelKey: "cluster_finder_word_type_all",
        isRadio: true
      },
      {
        payloadValue: WordType.VERB,
        labelKey: "cluster_finder_word_type_verb",
        isRadio: true,
        children: [
          {
            payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeSubtypes._SELF,
            labelKey: "cluster_finder_word_type_verb_subtype",
            isCategory: true,
            children: [
              {
                payloadValue: WordTypeSubtypes.VERB.MAIN,
                labelKey: "cluster_finder_word_type_verb_subtype_main"
              },
              {
                payloadValue: WordTypeSubtypes.VERB.AUX,
                labelKey: "cluster_finder_word_type_verb_subtype_aux"
              },
              {
                payloadValue: WordTypeSubtypes.VERB.MOD,
                labelKey: "cluster_finder_word_type_verb_subtype_mod"
              }
            ]
          },
          {
            payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeFiniteTypes._SELF,
            labelKey: "cluster_finder_word_type_verb_finite_type",
            isCategory: true,
            children: [
              {
                payloadValue: WordTypeFiniteTypes.P,
                labelKey: "cluster_finder_word_type_finite_type_p",
                isRadio: true,
                children: [
                  {
                    payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeSpeechTypes._SELF,
                    labelKey: "cluster_finder_word_type_verb_speech_type",
                    isCategory: true,
                    children: [
                      {
                        payloadValue: WordTypeSpeechTypes.AFFIRMATIVE,
                        labelKey: "cluster_finder_word_type_speech_type_affirmative"
                      },
                      {
                        payloadValue: WordTypeSpeechTypes.CONDITIONAL,
                        labelKey: "cluster_finder_word_type_speech_type_conditional"
                      },
                      {
                        payloadValue: WordTypeSpeechTypes.IMPERATIVE,
                        labelKey: "cluster_finder_word_type_speech_type_imperative"
                      },
                      {
                        payloadValue: WordTypeSpeechTypes.QUOTING,
                        labelKey: "cluster_finder_word_type_speech_type_quoting"
                      }
                    ]
                  },
                  {
                    payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeTimeTypes._SELF,
                    labelKey: "cluster_finder_word_type_verb_time_type",
                    isCategory: true,
                    children: [
                      {
                        payloadValue: WordTypeTimeTypes.PRESENT,
                        labelKey: "cluster_finder_word_type_time_type_present"
                      },
                      {
                        payloadValue: WordTypeTimeTypes.IMPF,
                        labelKey: "cluster_finder_word_type_time_type_impf"
                      },
                      {
                        payloadValue: WordTypeTimeTypes.PAST,
                        labelKey: "cluster_finder_word_type_time_type_past"
                      }
                    ]
                  },
                  {
                    payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeVoiceTypes._SELF,
                    labelKey: "cluster_finder_word_type_verb_voice_type",
                    isCategory: true,
                    children: [
                      {
                        payloadValue: WordTypeVoiceTypes.PS,
                        labelKey: "cluster_finder_word_type_voice_type_ps"
                      },
                      {
                        payloadValue: WordTypeVoiceTypes.IMPS,
                        labelKey: "cluster_finder_word_type_voice_type_imps"
                      }
                    ]
                  },
                  {
                    payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypePerspectiveTypes._SELF,
                    labelKey: "cluster_finder_word_type_perspective_type",
                    isCategory: true,
                    children: perspectiveTypeNodes.map((node) => ({
                      ...node,
                      tooltipKey: `${node.labelKey}_verb_tooltip`
                    }))
                  },
                  {
                    payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypePluralTypes._SELF,
                    labelKey: "cluster_finder_word_type_plural_type",
                    isCategory: true,
                    children: pluralTypeNodes.map((node) => ({
                      ...node,
                      tooltipKey: `${node.labelKey}_verb_tooltip`
                    }))
                  },
                  {
                    payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeSpeechSubtypes._SELF,
                    labelKey: "cluster_finder_word_type_verb_speech_subtype",
                    isCategory: true,
                    children: [
                      {
                        payloadValue: WordTypeSpeechSubtypes.AFFIRMATIVE,
                        labelKey: "cluster_finder_word_type_speech_subtype_affirmative"
                      },
                      {
                        payloadValue: WordTypeSpeechSubtypes.NEGATIVE,
                        labelKey: "cluster_finder_word_type_speech_subtype_negative"
                      }
                    ]
                  }
                ]
              },
              {
                payloadValue: WordTypeFiniteTypes.K,
                labelKey: "cluster_finder_word_type_finite_type_k",
                isRadio: true,
                children: [
                  {
                    payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeFiniteTypeSubtypes.K._SELF,
                    payloadValue: WordTypeFiniteTypeSubtypes.K.INF,
                    labelKey: "cluster_finder_word_type_finite_type_k_inf"
                  },
                  {
                    payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeFiniteTypeSubtypes.K._SELF,
                    payloadValue: WordTypeFiniteTypeSubtypes.K.GER,
                    labelKey: "cluster_finder_word_type_finite_type_k_ger"
                  },
                  {
                    payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeFiniteTypeSubtypes.K._SELF,
                    payloadValue: WordTypeFiniteTypeSubtypes.K.PARTIC,
                    labelKey: "cluster_finder_word_type_finite_type_k_partic",
                    children: [
                      {
                        payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.PARTIC._SELF,
                        payloadValue: WordTypeFiniteTypeSubtypeAdditionals.K.PARTIC.PAST_PS,
                        labelKey: "cluster_finder_word_type_finite_type_k_partic_past_ps"
                      },
                      {
                        payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.PARTIC._SELF,
                        payloadValue: WordTypeFiniteTypeSubtypeAdditionals.K.PARTIC.PAST_IMPS,
                        labelKey: "cluster_finder_word_type_finite_type_k_partic_past_imps"
                      }
                    ]
                  },
                  {
                    payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeFiniteTypeSubtypes.K._SELF,
                    payloadValue: WordTypeFiniteTypeSubtypes.K.SUP,
                    labelKey: "cluster_finder_word_type_finite_type_k_sup",
                    children: [
                      {
                        payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.SUP._SELF,
                        payloadValue: WordTypeFiniteTypeSubtypeAdditionals.K.SUP.PS_ILL,
                        labelKey: "cluster_finder_word_type_finite_type_k_sup_ps_ill"
                      },
                      {
                        payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.SUP._SELF,
                        payloadValue: WordTypeFiniteTypeSubtypeAdditionals.K.SUP.PS_IN,
                        labelKey: "cluster_finder_word_type_finite_type_k_sup_ps_in"
                      },
                      {
                        payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.SUP._SELF,
                        payloadValue: WordTypeFiniteTypeSubtypeAdditionals.K.SUP.PS_EL,
                        labelKey: "cluster_finder_word_type_finite_type_k_sup_ps_el"
                      },
                      {
                        payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.SUP._SELF,
                        payloadValue: WordTypeFiniteTypeSubtypeAdditionals.K.SUP.PS_TR,
                        labelKey: "cluster_finder_word_type_finite_type_k_sup_ps_tr"
                      },
                      {
                        payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.SUP._SELF,
                        payloadValue: WordTypeFiniteTypeSubtypeAdditionals.K.SUP.PS_AB,
                        labelKey: "cluster_finder_word_type_finite_type_k_sup_ps_ab"
                      },
                      {
                        payloadKey: WordTypePayloadKeyPrefix.VERB + WordTypeFiniteTypeSubtypeAdditionals.K.SUP._SELF,
                        payloadValue: WordTypeFiniteTypeSubtypeAdditionals.K.SUP.IMPS,
                        labelKey: "cluster_finder_word_type_finite_type_k_sup_imps"
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
        payloadValue: WordType.SUBJECT,
        labelKey: "cluster_finder_word_type_subject",
        isRadio: true,
        children: [
          {
            payloadKey: WordTypePayloadKeyPrefix.SUBJECT + WordTypeSubtypes._SELF,
            labelKey: "cluster_finder_word_type_subject_subtype",
            isCategory: true,
            children: [
              {
                payloadValue: WordTypeSubtypes.SUBJECT.GENERAL,
                labelKey: "cluster_finder_word_type_subject_subtype_general"
              },
              {
                payloadValue: WordTypeSubtypes.SUBJECT.REAL,
                labelKey: "cluster_finder_word_type_subject_subtype_real"
              }
            ]
          },
          {
            payloadKey: WordTypePayloadKeyPrefix.SUBJECT + WordTypePluralTypes._SELF,
            labelKey: "cluster_finder_word_type_plural_type",
            isCategory: true,
            children: pluralTypeNodes.map((node) => ({
              ...node,
              tooltipKey: `${node.labelKey}_subject_tooltip`
            }))
          },
          {
            payloadKey: WordTypePayloadKeyPrefix.SUBJECT + WordTypeCaseTypes._SELF,
            labelKey: "cluster_finder_word_type_case_type",
            isCategory: true,
            children: caseTypeNodes.map((node) => ({
              ...node,
              tooltipKey: `${node.labelKey}_subject_tooltip`
            }))
          }
        ]
      },
      {
        payloadValue: WordType.ADJECTIVE,
        labelKey: "cluster_finder_word_type_adjective",
        isRadio: true,
        children: [
          {
            payloadKey: WordTypePayloadKeyPrefix.ADJECTIVE + WordTypeSubtypes._SELF,
            labelKey: "cluster_finder_word_type_adjective_subtype",
            isCategory: true,
            children: [
              {
                payloadValue: WordTypeSubtypes.ADJECTIVE.A,
                labelKey: "cluster_finder_word_type_adjective_subtype_a",
                isRadio: true,
                children: [
                  {
                    payloadKey: WordTypePayloadKeyPrefix.ADJECTIVE + WordTypeStepTypes._SELF,
                    labelKey: "cluster_finder_word_type_step_type",
                    isCategory: true,
                    children: [
                      {
                        payloadValue: WordTypeStepTypes.POS,
                        labelKey: "cluster_finder_word_type_step_type_pos"
                      },
                      {
                        payloadValue: WordTypeStepTypes.COMP,
                        labelKey: "cluster_finder_word_type_step_type_comp"
                      },
                      {
                        payloadValue: WordTypeStepTypes.SUPER,
                        labelKey: "cluster_finder_word_type_step_type_super"
                      }
                    ]
                  },
                  {
                    payloadKey: WordTypePayloadKeyPrefix.ADJECTIVE + WordTypePluralTypes._SELF,
                    labelKey: "cluster_finder_word_type_plural_type",
                    isCategory: true,
                    children: pluralTypeNodes.map((node) => ({
                      ...node,
                      tooltipKey: `${node.labelKey}_adjective_tooltip`
                    }))
                  },
                  {
                    payloadKey: WordTypePayloadKeyPrefix.ADJECTIVE + WordTypeCaseTypes._SELF,
                    labelKey: "cluster_finder_word_type_case_type",
                    isCategory: true,
                    children: caseTypeNodes.map((node) => ({
                      ...node,
                      tooltipKey: `${node.labelKey}_adjective_tooltip`
                    }))
                  }
                ]
              },
              {
                payloadValue: WordTypeSubtypes.ADJECTIVE.G,
                labelKey: "cluster_finder_word_type_adjective_subtype_g",
                isRadio: true
              }
            ]
          }
        ]
      },
      {
        payloadValue: WordType.PRONOUN,
        labelKey: "cluster_finder_word_type_pronoun",
        isRadio: true,
        children: [
          {
            payloadKey: WordTypePayloadKeyPrefix.PRONOUN + WordTypeSubtypes._SELF,
            labelKey: "cluster_finder_word_type_pronoun_subtype",
            isCategory: true,
            children: [
              {
                payloadValue: WordTypeSubtypes.PRONOUN.PERS,
                labelKey: "cluster_finder_word_type_pronoun_subtype_pers",
                children: [
                  {
                    payloadKey: WordTypePayloadKeyPrefix.PRONOUN + WordTypePerspectiveTypes._SELF,
                    labelKey: "cluster_finder_word_type_perspective_type",
                    isCategory: true,
                    children: perspectiveTypeNodes.map((node) => ({
                      ...node,
                      tooltipKey: `${node.labelKey}_pronoun_tooltip`
                    }))
                  }
                ]
              },
              {
                payloadValue: WordTypeSubtypes.PRONOUN.REFL,
                labelKey: "cluster_finder_word_type_pronoun_subtype_refl"
              },
              {
                payloadValue: WordTypeSubtypes.PRONOUN.REC,
                labelKey: "cluster_finder_word_type_pronoun_subtype_rec"
              },
              {
                payloadValue: WordTypeSubtypes.PRONOUN.POS,
                labelKey: "cluster_finder_word_type_pronoun_subtype_pos"
              },
              {
                payloadValue: WordTypeSubtypes.PRONOUN.DEM,
                labelKey: "cluster_finder_word_type_pronoun_subtype_dem"
              },
              {
                payloadValue: WordTypeSubtypes.PRONOUN.INTER_REL,
                labelKey: "cluster_finder_word_type_pronoun_subtype_inter_rel"
              },
              {
                payloadValue: WordTypeSubtypes.PRONOUN.DET,
                labelKey: "cluster_finder_word_type_pronoun_subtype_det"
              },
              {
                payloadValue: WordTypeSubtypes.PRONOUN.INDEF,
                labelKey: "cluster_finder_word_type_pronoun_subtype_indef"
              }
            ]
          },
          {
            payloadKey: WordTypePayloadKeyPrefix.PRONOUN + WordTypePluralTypes._SELF,
            labelKey: "cluster_finder_word_type_plural_type",
            isCategory: true,
            children: pluralTypeNodes.map((node) => ({
              ...node,
              tooltipKey: `${node.labelKey}_pronoun_tooltip`
            }))
          },
          {
            payloadKey: WordTypePayloadKeyPrefix.PRONOUN + WordTypeCaseTypes._SELF,
            labelKey: "cluster_finder_word_type_case_type",
            isCategory: true,
            children: caseTypeNodes.map((node) => ({
              ...node,
              tooltipKey: `${node.labelKey}_pronoun_tooltip`
            }))
          }
        ]
      },
      {
        payloadValue: WordType.NUMERAL,
        labelKey: "cluster_finder_word_type_numeral",
        isRadio: true,
        children: [
          {
            payloadKey: WordTypePayloadKeyPrefix.NUMERAL + WordTypeSubtypes._SELF,
            labelKey: "cluster_finder_word_type_numeral_subtype",
            isCategory: true,
            children: [
              {
                payloadValue: WordTypeSubtypes.NUMERAL.CARD,
                labelKey: "cluster_finder_word_type_numeral_subtype_card"
              },
              {
                payloadValue: WordTypeSubtypes.NUMERAL.ORD,
                labelKey: "cluster_finder_word_type_numeral_subtype_ord"
              },
              {
                payloadValue: WordTypeSubtypes.NUMERAL.DIGIT,
                labelKey: "cluster_finder_word_type_numeral_subtype_digit"
              },
              {
                payloadValue: WordTypeSubtypes.NUMERAL.ROMAN,
                labelKey: "cluster_finder_word_type_numeral_subtype_roman"
              }
            ]
          },
          {
            payloadKey: WordTypePayloadKeyPrefix.NUMERAL + WordTypePluralTypes._SELF,
            labelKey: "cluster_finder_word_type_plural_type",
            isCategory: true,
            visibleWhen: {
              anyOf: [
                WordTypePayloadKeyPrefix.NUMERAL + WordTypeSubtypes._SELF + ":" + WordTypeSubtypes.NUMERAL.CARD,
                WordTypePayloadKeyPrefix.NUMERAL + WordTypeSubtypes._SELF + ":" + WordTypeSubtypes.NUMERAL.ORD
              ]
            },
            children: pluralTypeNodes.map((node) => ({
              ...node,
              tooltipKey: `${node.labelKey}_numeral_tooltip`
            }))
          },
          {
            payloadKey: WordTypePayloadKeyPrefix.NUMERAL + WordTypeCaseTypes._SELF,
            labelKey: "cluster_finder_word_type_case_type",
            isCategory: true,
            visibleWhen: {
              anyOf: [
                WordTypePayloadKeyPrefix.NUMERAL + WordTypeSubtypes._SELF + ":" + WordTypeSubtypes.NUMERAL.CARD,
                WordTypePayloadKeyPrefix.NUMERAL + WordTypeSubtypes._SELF + ":" + WordTypeSubtypes.NUMERAL.ORD
              ]
            },
            children: caseTypeNodes.map((node) => ({
              ...node,
              tooltipKey: `${node.labelKey}_numeral_tooltip`
            }))
          }
        ]
      },
      {
        payloadValue: WordType.ADVERB,
        labelKey: "cluster_finder_word_type_adverb",
        isRadio: true
      },
      {
        payloadValue: WordType.ADPOSITION,
        labelKey: "cluster_finder_word_type_adposition",
        isRadio: true,
        children: [
          {
            payloadKey: WordTypePayloadKeyPrefix.ADPOSITION + WordTypeSubtypes._SELF,
            labelKey: "cluster_finder_word_type_adposition_subtype",
            isCategory: true,
            children: [
              {
                payloadValue: WordTypeSubtypes.ADPOSITION.POST,
                labelKey: "cluster_finder_word_type_adposition_subtype_post"
              },
              {
                payloadValue: WordTypeSubtypes.ADPOSITION.PREP,
                labelKey: "cluster_finder_word_type_adposition_subtype_prep"
              }
            ]
          }
        ]
      },
      {
        payloadValue: WordType.CONJUNCTION,
        labelKey: "cluster_finder_word_type_conjunction",
        isRadio: true,
        children: [
          {
            payloadKey: WordTypePayloadKeyPrefix.CONJUNCTION + WordTypeSubtypes._SELF,
            labelKey: "cluster_finder_word_type_conjunction_subtype",
            isCategory: true,
            children: [
              {
                payloadValue: WordTypeSubtypes.CONJUNCTION.COORD,
                labelKey: "cluster_finder_word_type_conjunction_subtype_coord"
              },
              {
                payloadValue: WordTypeSubtypes.CONJUNCTION.SUB,
                labelKey: "cluster_finder_word_type_conjunction_subtype_sub"
              }
            ]
          }
        ]
      },
      {
        payloadValue: WordType.ABBREVIATION,
        labelKey: "cluster_finder_word_type_abbreviation",
        isRadio: true
      },
      {
        payloadValue: WordType.PUNCTUATION,
        labelKey: "cluster_finder_word_type_punctuation",
        isRadio: true,
        children: [
          {
            payloadKey: WordTypePayloadKeyPrefix.PUNCTUATION + WordTypeSubtypes._SELF,
            labelKey: "cluster_finder_word_type_punctuation_subtype",
            isCategory: true,
            children: [
              {
                payloadValue: WordTypeSubtypes.PUNCTUATION.FULL_STOP,
                labelKey: "cluster_finder_word_type_punctuation_subtype_full_stop"
              },
              {
                payloadValue: WordTypeSubtypes.PUNCTUATION.COMMA,
                labelKey: "cluster_finder_word_type_punctuation_subtype_comma"
              },
              {
                payloadValue: WordTypeSubtypes.PUNCTUATION.EXCLAMATION_MARK,
                labelKey: "cluster_finder_word_type_punctuation_subtype_exclamation_mark"
              },
              {
                payloadValue: WordTypeSubtypes.PUNCTUATION.QUESTION_MARK,
                labelKey: "cluster_finder_word_type_punctuation_subtype_question_mark"
              },
              {
                payloadValue: WordTypeSubtypes.PUNCTUATION.DASH,
                labelKey: "cluster_finder_word_type_punctuation_subtype_dash"
              },
              {
                payloadValue: WordTypeSubtypes.PUNCTUATION.COLON,
                labelKey: "cluster_finder_word_type_punctuation_subtype_colon"
              },
              {
                payloadValue: WordTypeSubtypes.PUNCTUATION.SEMICOLON,
                labelKey: "cluster_finder_word_type_punctuation_subtype_semicolon"
              },
              {
                payloadValue: WordTypeSubtypes.PUNCTUATION.OPENING_BRACKET,
                labelKey: "cluster_finder_word_type_punctuation_subtype_opening_bracket"
              },
              {
                payloadValue: WordTypeSubtypes.PUNCTUATION.CLOSING_BRACKET,
                labelKey: "cluster_finder_word_type_punctuation_subtype_closing_bracket"
              },
              {
                payloadValue: WordTypeSubtypes.PUNCTUATION.QUOTE,
                labelKey: "cluster_finder_word_type_punctuation_subtype_quote"
              }
            ]
          }
        ]
      }
    ]
  }
];
