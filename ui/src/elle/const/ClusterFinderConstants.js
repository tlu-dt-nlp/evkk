/**
 * Filter node format, used by ClusterFinderWordConstants and
 * ClusterFinderClauseConstants. Read this before editing either of them.
 *
 * A node may have:
 *
 *   payloadKey   Key sent to the API. Optional: a node without one inherits the
 *                payloadKey of its nearest ancestor that has one.
 *   payloadValue Value sent to the API. A node with a payloadValue is selectable,
 *                and its id is `payloadKey:payloadValue`.
 *   labelKey     Translation key for the label. Required.
 *   tooltipKey   Translation key for the tooltip. Defaults to `labelKey_tooltip`,
 *                and no tooltip renders if that key does not exist.
 *   isCategory   Heading only — not selectable, and becomes a group in the UI.
 *   isRadio      Exclusive choice rather than a checkbox. Radio siblings form a
 *                mutually exclusive group, and choosing one clears the others.
 *   visibleWhen  { anyOf: [...ids] } and/or { allOf: [...ids] }. The node renders
 *                only while those ids are selected.
 *   children     Nested nodes.
 *
 * The analysis response is { clusters, separator }, where each cluster is
 * { frequency, markups, descriptions, usages }.
 */

export const ClusterFinderConfig = {
  MAX_USAGES_DISPLAY: 10
};

export const ClusterFinderTreeType = {
  MORPHOLOGICAL: 'morfological',
  SYNTACTIC: 'syntactic',
  WORD_TYPE: 'wordtype'
};

export const ClusterFinderSortingType = {
  BY_FREQUENCY: 'freq',
  BY_FIRST_WORD: 'fwrd',
  BY_SECOND_WORD: 'swrd',
  BY_THIRD_WORD: 'twrd',
  BY_FOURTH_WORD: 'fowrd',
  BY_FIFTH_WORD: 'fiwrd'
};

// The ordinal sorting values in enum order, minus BY_FREQUENCY. Index i corresponds to
// sorting by the (i + 1)th word, so the length is also the longest sequence the tool can
// offer: a sequence can only be as long as the sorting enum can address.
export const ordinalSortingValues = Object.values(ClusterFinderSortingType).filter(
  (value) => value !== ClusterFinderSortingType.BY_FREQUENCY
);

export const ClusterFinderRootNodePayloadKey = {
  CLAUSE_TYPE: 'clauseType',
  WORD_TYPE: 'wordType'
};

export const ClusterSearchFormInputType = {
  FREE_TEXT: 'FREE_TEXT',
  FILE_BASED_TEXT: 'FILE_BASED_TEXT'
};

export const ClusterSearchForm = {
  INPUT_TYPE: 'inputType',
  USER_TEXT: 'userText',
  FORM_ID: 'formId',
  FILE_NAME: 'fileName',
  ANALYSIS_LENGTH: 'analysisLength',
  MORFO_ANALYSIS: 'morfological',
  SYNTACTIC_ANALYSIS: 'syntactic',
  INCLUDE_PUNCTUATION: 'punctuation',
  WORDTYPE_ANALYSIS: 'wordtype',
  PARTIAL_FILTERS: 'partialFilters',
  SORTING_TYPE: 'sorting',
  WORD_TYPE: 'wordType',
  CLAUSE_TYPE: 'clauseType'
};
