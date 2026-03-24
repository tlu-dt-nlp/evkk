import { ClusterFinderRootNodePayloadKey } from "./ClusterFinderConstants";

const ClauseType = {
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

/** @type {import("./ClusterFinderConstants").ClusterFinderTreeNode[]} */
export const syntacticClauseTypeNodes = [
  {
    payloadKey: ClusterFinderRootNodePayloadKey.CLAUSE_TYPE,
    labelKey: "cluster_finder_clause_type",
    isCategory: true,
    children: [
      {
        payloadValue: ClauseType.ALL,
        labelKey: "cluster_finder_clause_type_all",
        isRadio: true
      },
      {
        payloadValue: ClauseType.PREDICATE,
        labelKey: "cluster_finder_clause_type_predicate",
        isRadio: true,
        children: [
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.PREDICATE.FINITE,
            labelKey: "cluster_finder_clause_type_predicate_finite"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.PREDICATE.AUXILIARY_FINITE,
            labelKey: "cluster_finder_clause_type_predicate_auxiliary_finite"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.PREDICATE.NON_FINITE,
            labelKey: "cluster_finder_clause_type_predicate_non_finite"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.PREDICATE.AUXILIARY_NON_FINITE,
            labelKey: "cluster_finder_clause_type_predicate_auxiliary_non_finite"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.PREDICATE.NEGATION,
            labelKey: "cluster_finder_clause_type_predicate_negation"
          }
        ]
      },
      {
        payloadValue: ClauseType.BASIS,
        labelKey: "cluster_finder_clause_type_basis",
        isRadio: true
      },
      {
        payloadValue: ClauseType.OBJECTIVE,
        labelKey: "cluster_finder_clause_type_objective",
        isRadio: true
      },
      {
        payloadValue: ClauseType.PEDICATE,
        labelKey: "cluster_finder_clause_type_pedicate",
        isRadio: true
      },
      {
        payloadValue: ClauseType.ATTRIBUTE,
        labelKey: "cluster_finder_clause_type_attribute",
        isRadio: true,
        children: [
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.ATTRIBUTE.NOUN_APPOSITIVE,
            labelKey: "cluster_finder_clause_type_attribute_noun_appositive"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.ATTRIBUTE.NOUN_POSTPOSED,
            labelKey: "cluster_finder_clause_type_attribute_noun_postposed"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.ATTRIBUTE.ADJECTIVE_APPOSITIVE,
            labelKey: "cluster_finder_clause_type_attribute_adjective_appositive"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.ATTRIBUTE.ADJECTIVE_POSTPOSED,
            labelKey: "cluster_finder_clause_type_attribute_adjective_postposed"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.ATTRIBUTE.ADVERB_APPOSITIVE,
            labelKey: "cluster_finder_clause_type_attribute_adverb_appositive"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.ATTRIBUTE.ADVERB_POSTPOSED,
            labelKey: "cluster_finder_clause_type_attribute_adverb_postposed"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.ATTRIBUTE.ADPOSITIONAL_PHRASE_APPOSITIVE,
            labelKey: "cluster_finder_clause_type_attribute_adpositional_phrase_appositive"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.ATTRIBUTE.ADPOSITIONAL_PHRASE_POSTPOSED,
            labelKey: "cluster_finder_clause_type_attribute_adpositional_phrase_postposed"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.ATTRIBUTE.PARTICIBLE_APPOSITIVE,
            labelKey: "cluster_finder_clause_type_attribute_particible_appositive"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.ATTRIBUTE.PARTICIBLE_POSTPOSED,
            labelKey: "cluster_finder_clause_type_attribute_particible_postposed"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.ATTRIBUTE.VERB_APPOSITIVE,
            labelKey: "cluster_finder_clause_type_attribute_verb_appositive"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.ATTRIBUTE.VERB_POSTPOSED,
            labelKey: "cluster_finder_clause_type_attribute_verb_postposed"
          }
        ]
      },
      {
        payloadValue: ClauseType.ADVERBIAL,
        labelKey: "cluster_finder_clause_type_adverbial",
        isRadio: true
      },
      {
        payloadValue: ClauseType.CONJUNCTIVE_WORD,
        labelKey: "cluster_finder_clause_type_conjunctive_word",
        isRadio: true
      },
      {
        payloadValue: ClauseType.EXCLAMATION,
        labelKey: "cluster_finder_clause_type_exclamation",
        isRadio: true
      },
      {
        payloadValue: ClauseType.QUANTIFIER_MODIFIER,
        labelKey: "cluster_finder_clause_type_quantifier_modifier",
        isRadio: true,
        children: [
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.QUANTIFIER_MODIFIER.APPOSITIVE,
            labelKey: "cluster_finder_clause_type_quantifier_modifier_appositive"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.QUANTIFIER_MODIFIER.POSTPOSED,
            labelKey: "cluster_finder_clause_type_quantifier_modifier_postposed"
          }
        ]
      },
      {
        payloadValue: ClauseType.ADPOSITION_APPURTENANT,
        labelKey: "cluster_finder_clause_type_adposition_appurtenant",
        isRadio: true,
        children: [
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.ADPOSITION_APPURTENANT.APPOSITIVE,
            labelKey: "cluster_finder_clause_type_adposition_appurtenant_appositive"
          },
          {
            payloadKey: ClauseTypeAdditionals._SELF,
            payloadValue: ClauseTypeAdditionals.ADPOSITION_APPURTENANT.POSTPOSED,
            labelKey: "cluster_finder_clause_type_adposition_appurtenant_postposed"
          }
        ]
      }
    ]
  }
];
