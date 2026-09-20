import { useEffect, useReducer, useState } from 'react';

import { errorEmitter } from '../../../../App';
import { ErrorSnackbarEventType } from '../../../components/snackbar/ErrorSnackbar';
import { syntacticClauseTypeNodes } from '../../../const/ClusterFinderClauseConstants';
import {
  ClusterFinderSortingType,
  ClusterFinderTreeType,
} from '../../../const/ClusterFinderConstants';
import {
  morphologicalWordTypeNodes,
  wordTypeNodes,
} from '../../../const/ClusterFinderWordConstants';
import { useGetSelectedTexts } from '../../../hooks/service/TextService';
import { useGetClusterFinderResult } from '../../../hooks/service/ToolsService';
import { queryStore } from '../../../store/QueryStore';
import { changeClusterFinderResult, toolAnalysisStore } from '../../../store/ToolAnalysisStore';
import { clusterFormReducer, initClusterFormState } from '../state/clusterFormReducer';
import { pruneUnreachable } from '../util/ClusterFinderLevels';
import { buildClusterPayload } from '../util/ClusterFinderPayload';

const { MORPHOLOGICAL, SYNTACTIC, WORD_TYPE } = ClusterFinderTreeType;

/**
 * The result a previous visit to the tool left behind, or null if there is none worth
 * restoring. Read once at mount, never subscribed to: the store is only ever written
 * from here, so nothing can change it while this component is alive.
 */
const restorableResult = () => {
  const stored = toolAnalysisStore.getState().clusterFinder;
  return stored?.analysis?.clusters?.length > 0 ? stored : null;
};

/**
 * Owns all ClusterFinder form state. The interdependent analysis-type fields live in a
 * reducer (clusterFormReducer); the result display flags are derived from `response`
 * rather than stored. The component only renders what this returns.
 */
export function useClusterFinderForm() {
  const { getClusterFinderResult } = useGetClusterFinderResult();

  // useState purely to run the read once, on mount.
  const [restored] = useState(restorableResult);

  const [form, dispatch] = useReducer(clusterFormReducer, restored?.parameters, initClusterFormState);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(!restored);
  const [response, setResponse] = useState(restored?.analysis ?? null);
  const [hasNoTextError, setHasNoTextError] = useState(false);
  const [storeData, setStoreData] = useState('');
  const { getSelectedTexts } = useGetSelectedTexts(setStoreData);

  const {
    typeValue,
    typeError,
    wordSequenceLength,
    orderBy,
    isPunctuationSensitiveChecked,
    selectedClauseTypeItems,
    selectedWordTypeItems,
  } = form;

  // Result display is a function of the response, not separate state.
  const hasClusters = response?.clusters?.length > 0;
  const showNoResultsError = response != null && !hasClusters;

  // Fetch the selected texts now, then again whenever the selection changes — which also
  // invalidates whatever result is on screen.
  useEffect(() => {
    getSelectedTexts();

    return queryStore.subscribe(() => {
      // Dropped first: getSelectedTexts leaves the previous text in place when the
      // selection is now empty, which would let an analysis run on removed texts.
      setStoreData('');
      getSelectedTexts();

      toolAnalysisStore.dispatch(changeClusterFinderResult(null));
      setResponse(null);
      setHasNoTextError(false);
      setIsAccordionExpanded(true);
    });
  }, [getSelectedTexts]);

  /**
   * Records a result together with the parameters that produced it, so returning to the
   * tool shows the same thing. Called from the submit handler rather than an effect: the
   * store should follow the request, not every later edit to the form.
   */
  const persistResult = (analysis) => {
    toolAnalysisStore.dispatch(
      changeClusterFinderResult({
        parameters: {
          typeValue,
          wordSequenceLength,
          orderBy,
          isPunctuationSensitiveChecked,
          selectedClauseTypeItems,
          selectedWordTypeItems,
        },
        analysis,
      }),
    );
  };

  const isByFrequency = orderBy === ClusterFinderSortingType.BY_FREQUENCY;

  // The two filter groups, exactly as the UI shows them. `nodes` decides which tree is
  // rendered, `disabled` whether it is offered at all.
  const clauseGroup = {
    disabled: isByFrequency || !typeValue[SYNTACTIC],
    nodes: syntacticClauseTypeNodes,
    selected: selectedClauseTypeItems,
  };

  const wordGroup = {
    disabled: isByFrequency || (!typeValue[MORPHOLOGICAL] && !typeValue[WORD_TYPE]),
    nodes: typeValue[MORPHOLOGICAL] ? morphologicalWordTypeNodes : wordTypeNodes,
    selected: selectedWordTypeItems,
  };

  /**
   * The selections a group actually contributes: nothing while it is disabled, and
   * otherwise only the ids still reachable in its current tree.
   *
   * Computed here rather than trusted from state, so the payload cannot carry a filter
   * the user can no longer see — whichever way the selection went stale.
   */
  const renderedItems = (group) =>
    group.disabled ? [] : pruneUnreachable(group.nodes, group.selected);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Both are reported before bailing out, so the user sees everything that is wrong.
    const noTypeValueSelected = !Object.values(typeValue).some(Boolean);
    const noTextSelected = !storeData;

    dispatch({ type: 'SET_TYPE_ERROR', value: noTypeValueSelected });
    setHasNoTextError(noTextSelected);

    if (noTypeValueSelected || noTextSelected) {
      return;
    }

    // Clear the previous result so the table/alert hide while the request runs.
    setResponse(null);
    persistResult(null);

    const payload = buildClusterPayload({
      form,
      storeData,
      clauseItems: renderedItems(clauseGroup),
      wordItems: renderedItems(wordGroup),
    });

    getClusterFinderResult(payload)
      .then((result) => {
        // A failed request resolves empty, having already raised its own snackbar.
        if (!result) {
          return;
        }

        const parsedResult = JSON.parse(result);
        setResponse(parsedResult);
        persistResult(parsedResult);
        setIsAccordionExpanded(!(parsedResult?.clusters?.length > 0));
      })
      .catch(() => {
        // An unparseable body would otherwise leave the form with no result and no reason.
        errorEmitter.emit(ErrorSnackbarEventType.GENERIC_ERROR);
      });
  };

  return {
    isAccordionExpanded,
    toggleAccordion: () => setIsAccordionExpanded((expanded) => !expanded),
    onSubmit: handleSubmit,
    response,
    showTable: hasClusters,
    showNoResultsError,
    showNoTextError: hasNoTextError,
    options: {
      typeValue,
      typeError,
      onTypeChange: (key, checked) => dispatch({ type: 'TOGGLE_ANALYSIS', key, checked }),
      wordSequenceLength,
      onWordSequenceLengthChange: (length) => dispatch({ type: 'SET_SEQUENCE_LENGTH', length }),
      orderBy,
      onOrderByChange: (orderBy) => dispatch({ type: 'SET_ORDER_BY', orderBy }),
      isPunctuationSensitiveChecked,
      onPunctuationChange: (checked) => dispatch({ type: 'TOGGLE_PUNCTUATION', checked }),
    },
    clauseSelect: {
      disabled: clauseGroup.disabled,
      items: clauseGroup.nodes,
      selectedItems: clauseGroup.selected,
      setSelectedItems: (items) => dispatch({ type: 'SET_CLAUSE_ITEMS', items }),
    },
    wordSelect: {
      disabled: wordGroup.disabled,
      items: wordGroup.nodes,
      selectedItems: wordGroup.selected,
      setSelectedItems: (items) => dispatch({ type: 'SET_WORD_ITEMS', items }),
    },
  };
}
