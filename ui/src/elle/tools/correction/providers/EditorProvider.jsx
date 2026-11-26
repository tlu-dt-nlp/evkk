import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { useGetCorrectorResult, useGetLanguageDetection } from '../../../hooks/service/ToolsService';
import { ESTONIAN_LANGUAGE_CODE, GRAMMARCHECKER, LANGUAGE_DETECTION_MIN_PROBABILITY } from '../constants/constants';
import { tabValueMap, ToggleButtonCategories } from '../constants/tabConfig';
import { useAnalytics } from '../../../context/AnalyticsContext';

export const EditorContext = createContext();

const isNonEstonian = detection => detection?.keel
  && detection.keel !== ESTONIAN_LANGUAGE_CODE
  && detection.toenaosus >= LANGUAGE_DETECTION_MIN_PROBABILITY;

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
  const { getLanguageDetection } = useGetLanguageDetection();
  const { trackToolAnalyze } = useAnalytics();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [languageWarning, setLanguageWarning] = useState({ isOpen: false, language: null, text: null });
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
    setIsAnalyzing(false);
    setEditorValues(prev => ({ ...prev, errorResponse }));
  };

  const setContent = content => {
    setEditorValues(prev => ({ ...prev, content }));
  };

  // a newer request has been sent, so the response of this one is stale
  const isStale = requestId => requestId !== latestRequestIdRef.current;

  // track: count in analytics only when the user clicks btn, not on automatic re-analysis after a tab switch
  const analyzeText = async (textToAnalyze, { checkLanguage = false, track = false } = {}) => {
    const requestId = ++latestRequestIdRef.current;
    pendingTextRef.current = textToAnalyze;
    setIsAnalyzing(true);

    try {
      if (checkLanguage) {
        const detection = await getLanguageDetection({ tekst: textToAnalyze });
        if (isStale(requestId)) return;

        if (isNonEstonian(detection)) {
          // keep pendingTextRef so that switching tabs does not analyse the text the user did not confirm
          setLanguageWarning({ isOpen: true, language: detection.keel, text: textToAnalyze });
          return;
        }
      }

      if (track) trackToolAnalyze('corrector');
      const result = await getCorrectorResult({ tekst: textToAnalyze, model: GRAMMARCHECKER });
      if (isStale(requestId)) return;

      pendingTextRef.current = null;
      // on a failed request result is empty and useFetch has already shown the error snackbar
      if (result) {
        setEditorValues(prev => ({ ...prev, initialText: textToAnalyze, errorResponse: result }));
      }
    } finally {
      if (!isStale(requestId)) setIsAnalyzing(false);
    }
  };

  const closeLanguageWarning = () => {
    setLanguageWarning(prev => ({ ...prev, isOpen: false }));
  };

  const confirmLanguageWarning = async () => {
    closeLanguageWarning();
    await analyzeText(languageWarning.text, { track: true });
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
      reanalyzeIfStale,
      isAnalyzing,
      languageWarning,
      confirmLanguageWarning,
      closeLanguageWarning
    }),
    [editorValues, getCorrectorResult, getLanguageDetection, trackToolAnalyze, isAnalyzing, languageWarning]
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
