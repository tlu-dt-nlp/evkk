/**
 * @typedef {Object} SelectionRequirement
 * @property {string[]} [anyOf] - Node is visible if ANY of these `${payloadKey}:${payloadValue}` pairs (ids) are selected.
 * @property {string[]} [allOf] - Node is visible if ALL of these `${payloadKey}:${payloadValue}` pairs (ids) are selected.
 */

/**
 * @typedef {Object} ClusterFinderTreeNode
 * @property {string} [payloadKey] - Key for the API request.
 * @property {string} [payloadValue] - Value for the API request.
 * @property {string} labelKey - Translation key for the label.
 * @property {string} [tooltipKey] - Translation key for the tooltip. Defaults to `${labelKey}_tooltip`.
 * @property {boolean} [isCategory] - If true, this node is a label/header and cannot be selected. Defaults to `false`.
 * @property {boolean} [isRadio] - If true, this node uses a radio instead of a checkbox. Defaults to `false`.
 * @property {SelectionRequirement} [visibleWhen] - Conditional visibility.
 * @property {ClusterFinderTreeNode[]} [children] - Child nodes.
 *
 * @description
 * Inheritance: Nodes use their own `payloadKey` if present. If missing, they inherit the `payloadKey` from the nearest ancestor.
 */

export const ClusterFinderTreeType = {
  MORPHOLOGICAL: "MORPHOLOGICAL",
  SYNTACTIC: "SYNTACTIC",
  WORD_TYPE: "WORD_TYPE"
};

export const ClusterFinderSortingType = {
  BY_FREQUENCY: "freq",
  BY_FIRST_WORD: "fwrd",
  BY_SECOND_WORD: "swrd",
  BY_THIRD_WORD: "twrd",
  BY_FOURTH_WORD: "fowrd",
  BY_FIFTH_WORD: "fiwrd"
};

export const ClusterFinderRootNodePayloadKey = {
  CLAUSE_TYPE: "clauseType",
  WORD_TYPE: "wordType"
};
