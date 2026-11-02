import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { useGetCorrectorResult } from '../../../hooks/service/ToolsService';
import { GRAMMARCHECKER } from '../constants/constants';
import { tabValueMap, ToggleButtonCategories } from '../constants/tabConfig';

export const EditorContext = createContext();

export function EditorProvider({ children }) {
  const [editorValues, setEditorValues] = useState({
    text: '',
    content: '',
    initialText: '',
    selectedSubTab: ToggleButtonCategories[tabValueMap.CORRECTOR][0].value,
    errorResponse: {},
    editor: null
  });
  const { getCorrectorResult } = useGetCorrectorResult();
  const latestRequestIdRef = useRef(0);
  const pendingTextRef = useRef(null);

  const setText = newText => {
    setEditorValues(prev => ({ ...prev, text: newText }));
  };

  const setEditor = editor => {
    setEditorValues(prev => ({ ...prev, editor }));
  };

  const setSelectedSubTab = selectedSubTab => {
    setEditorValues(prev => ({ ...prev, selectedSubTab }));
  };

  const setErrorResponse = errorResponse => {
    // drop the result of any request still in flight
    latestRequestIdRef.current++;
    pendingTextRef.current = null;
    setEditorValues(prev => ({ ...prev, errorResponse }));
  };

  const setContent = content => {
    setEditorValues(prev => ({ ...prev, content }));
  };

  const analyzeText = async textToAnalyze => {
    const requestId = ++latestRequestIdRef.current;
    pendingTextRef.current = textToAnalyze;
    const result = await getCorrectorResult({ tekst: textToAnalyze, model: GRAMMARCHECKER });

    // a newer request has been sent, this response is stale
    if (requestId !== latestRequestIdRef.current) return;
    pendingTextRef.current = null;

    // failed request, useFetch has already shown the error snackbar
    if (!result) return;
    setEditorValues(prev => ({ ...prev, initialText: textToAnalyze, errorResponse: result }));
  };

  const reanalyzeIfStale = async () => {
    const { text, initialText, errorResponse } = editorValues;
    const hasResults = Object.keys(errorResponse).length !== 0;
    if (!hasResults || text === initialText || text === pendingTextRef.current) return;
    await analyzeText(text);
  };

  const value = useMemo(
    () => ({
      editorValues,
      setEditorValues,
      setText,
      setEditor,
      setSelectedSubTab,
      setErrorResponse,
      setContent,
      analyzeText,
      reanalyzeIfStale
    }),
    [editorValues, getCorrectorResult]
  );
  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext(selector) {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider');
  }

  const { editorValues, ...setters } = context;

  return {
    ...(selector ? selector(editorValues) : editorValues),
    ...setters
  };
}
