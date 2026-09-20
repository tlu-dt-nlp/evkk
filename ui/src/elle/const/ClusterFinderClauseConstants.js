import { ClusterFinderRootNodePayloadKey } from './ClusterFinderConstants';

export const ClauseType = {
  ALL: 'ALL',
  PREDICATE: 'F',
  BASIS: '@SUBJ',
  OBJECTIVE: '@OBJ',
  PEDICATE: '@PRD',
  ATTRIBUTE: 'AT',
  ADVERBIAL: '@ADVL',
  CONJUNCTIVE_WORD: '@J',
  EXCLAMATION: '@B',
  QUANTIFIER_MODIFIER: 'QM',
  ADPOSITION_APPURTENANT: 'AP'
};

// Refinement checkboxes all post under this one key, hence the shared constant.
const ADDITIONALS = 'clauseTypeAdditionals[]';

export const syntacticClauseTypeNodes = [
  {
    payloadKey: ClusterFinderRootNodePayloadKey.CLAUSE_TYPE,
    labelKey: 'cluster_finder_clause_type',
    isCategory: true,
    children: [
      { payloadValue: ClauseType.ALL, labelKey: 'cluster_finder_clause_type_all', isRadio: true },
      {
        payloadValue: ClauseType.PREDICATE,
        labelKey: 'cluster_finder_clause_type_predicate',
        isRadio: true,
        children: [
          { payloadKey: ADDITIONALS, payloadValue: '@FMV', labelKey: 'cluster_finder_clause_type_predicate_finite' },
          { payloadKey: ADDITIONALS, payloadValue: '@FCV', labelKey: 'cluster_finder_clause_type_predicate_auxiliary_finite' },
          { payloadKey: ADDITIONALS, payloadValue: '@IMV', labelKey: 'cluster_finder_clause_type_predicate_non_finite' },
          { payloadKey: ADDITIONALS, payloadValue: '@ICV', labelKey: 'cluster_finder_clause_type_predicate_auxiliary_non_finite' },
          { payloadKey: ADDITIONALS, payloadValue: '@NEG', labelKey: 'cluster_finder_clause_type_predicate_negation' }
        ]
      },
      { payloadValue: ClauseType.BASIS, labelKey: 'cluster_finder_clause_type_basis', isRadio: true },
      { payloadValue: ClauseType.OBJECTIVE, labelKey: 'cluster_finder_clause_type_objective', isRadio: true },
      { payloadValue: ClauseType.PEDICATE, labelKey: 'cluster_finder_clause_type_pedicate', isRadio: true },
      {
        payloadValue: ClauseType.ATTRIBUTE,
        labelKey: 'cluster_finder_clause_type_attribute',
        isRadio: true,
        children: [
          { payloadKey: ADDITIONALS, payloadValue: '@NN>', labelKey: 'cluster_finder_clause_type_attribute_noun_appositive' },
          { payloadKey: ADDITIONALS, payloadValue: '@<NN', labelKey: 'cluster_finder_clause_type_attribute_noun_postposed' },
          { payloadKey: ADDITIONALS, payloadValue: '@AN>', labelKey: 'cluster_finder_clause_type_attribute_adjective_appositive' },
          { payloadKey: ADDITIONALS, payloadValue: '@<AN', labelKey: 'cluster_finder_clause_type_attribute_adjective_postposed' },
          { payloadKey: ADDITIONALS, payloadValue: '@DN>', labelKey: 'cluster_finder_clause_type_attribute_adverb_appositive' },
          { payloadKey: ADDITIONALS, payloadValue: '@<DN', labelKey: 'cluster_finder_clause_type_attribute_adverb_postposed' },
          { payloadKey: ADDITIONALS, payloadValue: '@KN>', labelKey: 'cluster_finder_clause_type_attribute_adpositional_phrase_appositive' },
          { payloadKey: ADDITIONALS, payloadValue: '@<KN', labelKey: 'cluster_finder_clause_type_attribute_adpositional_phrase_postposed' },
          { payloadKey: ADDITIONALS, payloadValue: '@VN>', labelKey: 'cluster_finder_clause_type_attribute_particible_appositive' },
          { payloadKey: ADDITIONALS, payloadValue: '@<VN', labelKey: 'cluster_finder_clause_type_attribute_particible_postposed' },
          { payloadKey: ADDITIONALS, payloadValue: '@INFN>', labelKey: 'cluster_finder_clause_type_attribute_verb_appositive' },
          { payloadKey: ADDITIONALS, payloadValue: '@<INFN', labelKey: 'cluster_finder_clause_type_attribute_verb_postposed' }
        ]
      },
      { payloadValue: ClauseType.ADVERBIAL, labelKey: 'cluster_finder_clause_type_adverbial', isRadio: true },
      { payloadValue: ClauseType.CONJUNCTIVE_WORD, labelKey: 'cluster_finder_clause_type_conjunctive_word', isRadio: true },
      { payloadValue: ClauseType.EXCLAMATION, labelKey: 'cluster_finder_clause_type_exclamation', isRadio: true },
      {
        payloadValue: ClauseType.QUANTIFIER_MODIFIER,
        labelKey: 'cluster_finder_clause_type_quantifier_modifier',
        isRadio: true,
        children: [
          { payloadKey: ADDITIONALS, payloadValue: '@Q>', labelKey: 'cluster_finder_clause_type_quantifier_modifier_appositive' },
          { payloadKey: ADDITIONALS, payloadValue: '@<Q', labelKey: 'cluster_finder_clause_type_quantifier_modifier_postposed' }
        ]
      },
      {
        payloadValue: ClauseType.ADPOSITION_APPURTENANT,
        labelKey: 'cluster_finder_clause_type_adposition_appurtenant',
        isRadio: true,
        children: [
          { payloadKey: ADDITIONALS, payloadValue: '@P>', labelKey: 'cluster_finder_clause_type_adposition_appurtenant_appositive' },
          { payloadKey: ADDITIONALS, payloadValue: '@<P', labelKey: 'cluster_finder_clause_type_adposition_appurtenant_postposed' }
        ]
      }
    ]
  }
];
