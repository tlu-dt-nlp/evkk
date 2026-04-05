import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  wordlist: null,
  wordContext: null,
  collocates: null,
  clusterFinder: null
};

const toolAnalysisSlice = createSlice({
  name: 'toolAnalysis',
  initialState,
  reducers: {
    changeWordlistResult: (state, action) => {
      state.wordlist = action.payload;
    },
    changeWordContextResult: (state, action) => {
      state.wordContext = action.payload;
    },
    changeCollocatesResult: (state, action) => {
      state.collocates = action.payload;
    },
    changeClusterFinderResult: (state, action) => {
      state.clusterFinder = action.payload;
    }
  }
});

export const {
  changeWordlistResult,
  changeWordContextResult,
  changeCollocatesResult,
  changeClusterFinderResult
} = toolAnalysisSlice.actions;

export const toolAnalysisStore = configureStore({
  reducer: toolAnalysisSlice.reducer
});
