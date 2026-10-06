import {
  ClusterFinderSortingType,
  ClusterFinderTreeType,
  ordinalSortingValues,
} from '../../../const/ClusterFinderConstants';

const { MORPHOLOGICAL, SYNTACTIC, WORD_TYPE } = ClusterFinderTreeType;
const { BY_FREQUENCY } = ClusterFinderSortingType;

export const initialClusterFormState = {
  typeValue: {
    [MORPHOLOGICAL]: false,
    [SYNTACTIC]: false,
    [WORD_TYPE]: false,
  },
  typeError: false,
  wordSequenceLength: 1,
  orderBy: BY_FREQUENCY,
  isPunctuationSensitiveChecked: false,
  selectedClauseTypeItems: [],
  selectedWordTypeItems: [],
};

/**
 * Builds the starting state, optionally from the parameters a previous visit left in the
 * store. Used as useReducer's lazy initializer, so a restored form is right on the first
 * render instead of appearing empty and then filling in.
 *
 * The fields are listed rather than spread: only these are persisted, and typeError must
 * not survive a restore.
 */
export function initClusterFormState(params) {
  if (!params) {
    return initialClusterFormState;
  }

  return {
    ...initialClusterFormState,
    typeValue: params.typeValue,
    wordSequenceLength: params.wordSequenceLength,
    orderBy: params.orderBy,
    isPunctuationSensitiveChecked: params.isPunctuationSensitiveChecked,
    selectedClauseTypeItems: params.selectedClauseTypeItems,
    selectedWordTypeItems: params.selectedWordTypeItems,
  };
}

/**
 * Every interdependent form transition in one pure function. The analysis-type rules
 * that used to be spread across handlers and side-effecting setters now each produce
 * the whole next state from one visible draft.
 */
export function clusterFormReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_ANALYSIS': {
      const { key, checked } = action;
      const typeValue = { ...state.typeValue, [key]: checked };
      let { selectedWordTypeItems, isPunctuationSensitiveChecked } = state;

      // WordType is mutually exclusive with Morphological and Syntactic.
      if (key === WORD_TYPE && checked) {
        typeValue[MORPHOLOGICAL] = false;
        typeValue[SYNTACTIC] = false;
        selectedWordTypeItems = [];
      }

      // Checking Morphological or Syntactic clears WordType.
      if ((key === MORPHOLOGICAL || key === SYNTACTIC) && checked) {
        typeValue[WORD_TYPE] = false;
        if (key === MORPHOLOGICAL) {
          selectedWordTypeItems = [];
        }
      }

      // Syntactic without Morphological cannot carry punctuation.
      if (key === SYNTACTIC && checked && !typeValue[MORPHOLOGICAL]) {
        isPunctuationSensitiveChecked = false;
      }

      // Unchecking Morphological while Syntactic stays on clears punctuation.
      if (key === MORPHOLOGICAL && !checked && typeValue[SYNTACTIC]) {
        isPunctuationSensitiveChecked = false;
      }

      return { ...state, typeValue, selectedWordTypeItems, isPunctuationSensitiveChecked, typeError: false };
    }

    case 'TOGGLE_PUNCTUATION': {
      const { checked } = action;
      const typeValue = { ...state.typeValue };

      // Punctuation on Syntactic-only analysis is invalid, so turn Syntactic off.
      if (checked && !typeValue[MORPHOLOGICAL]) {
        typeValue[SYNTACTIC] = false;
      }

      return { ...state, typeValue, isPunctuationSensitiveChecked: checked };
    }

    case 'SET_SEQUENCE_LENGTH': {
      const { length } = action;
      const orderByOutOfBounds = ordinalSortingValues.indexOf(state.orderBy) >= length;

      return {
        ...state,
        wordSequenceLength: length,
        orderBy: orderByOutOfBounds ? BY_FREQUENCY : state.orderBy,
      };
    }

    case 'SET_ORDER_BY':
      return { ...state, orderBy: action.orderBy };

    case 'SET_CLAUSE_ITEMS':
      return { ...state, selectedClauseTypeItems: action.items };

    case 'SET_WORD_ITEMS':
      return { ...state, selectedWordTypeItems: action.items };

    case 'SET_TYPE_ERROR':
      return { ...state, typeError: action.value };

    default:
      return state;
  }
}
