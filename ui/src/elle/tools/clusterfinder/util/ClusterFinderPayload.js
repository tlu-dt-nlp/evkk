/**
 * Builds the ClusterFinder request body.
 *
 * The endpoint is form-urlencoded, not JSON: the Spring controller reads
 * request.getParameterMap(), so a JSON body would arrive empty and every filter would
 * silently fall back to ALL. ToolsService sends this with disableContentTypeJson.
 *
 * Pure — given the same form, text and selections it always produces the same body, apart
 * from the generated form id.
 */

import { ClauseType } from '../../../const/ClusterFinderClauseConstants';
import {
  ClusterFinderTreeType,
  ClusterSearchForm,
  ClusterSearchFormInputType,
} from '../../../const/ClusterFinderConstants';
import { morphologicalWordTypeNodes, WordType } from '../../../const/ClusterFinderWordConstants';
import { hasPartialFilters } from './ClusterFinderLevels';

const { MORPHOLOGICAL, SYNTACTIC, WORD_TYPE } = ClusterFinderTreeType;

// crypto.randomUUID exists only in secure contexts; fall back for plain-HTTP hosts.
const createFormId = () =>
  crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** Selected ids carry their own destination, as `payloadKey:payloadValue`. */
const appendSelectedItems = (params, selectedItems) =>
  selectedItems.forEach((item) => {
    const [key, value] = item.split(':');
    if (key && value) {
      params.append(key, value);
    }
  });

/**
 * `clauseItems` and `wordItems` are the selections the UI is actually showing — the
 * caller resolves that, so nothing here has to reason about which filters are visible.
 */
export const buildClusterPayload = ({ form, storeData, clauseItems, wordItems }) => {
  const { typeValue, wordSequenceLength, orderBy, isPunctuationSensitiveChecked } = form;
  const morfo = typeValue[MORPHOLOGICAL];

  const fields = {
    [ClusterSearchForm.INPUT_TYPE]: ClusterSearchFormInputType.FREE_TEXT,
    [ClusterSearchForm.USER_TEXT]: storeData,
    [ClusterSearchForm.FORM_ID]: createFormId(),
    [ClusterSearchForm.FILE_NAME]: '',
    [ClusterSearchForm.ANALYSIS_LENGTH]: wordSequenceLength,
    [ClusterSearchForm.MORFO_ANALYSIS]: morfo,
    [ClusterSearchForm.SYNTACTIC_ANALYSIS]: typeValue[SYNTACTIC],
    [ClusterSearchForm.INCLUDE_PUNCTUATION]: isPunctuationSensitiveChecked,
    [ClusterSearchForm.WORDTYPE_ANALYSIS]: typeValue[WORD_TYPE],
    [ClusterSearchForm.PARTIAL_FILTERS]:
      morfo && hasPartialFilters(morphologicalWordTypeNodes, wordItems),
    [ClusterSearchForm.SORTING_TYPE]: orderBy,
  };

  const params = new URLSearchParams();
  Object.entries(fields).forEach(([key, value]) => params.append(key, String(value)));

  appendSelectedItems(params, clauseItems);
  appendSelectedItems(params, wordItems);

  // The backend requires these keys; default to ALL when no refinement was chosen.
  if (!params.has(ClusterSearchForm.CLAUSE_TYPE)) {
    params.append(ClusterSearchForm.CLAUSE_TYPE, ClauseType.ALL);
  }
  if (!params.has(ClusterSearchForm.WORD_TYPE)) {
    params.append(ClusterSearchForm.WORD_TYPE, WordType.ALL);
  }

  return params;
};
