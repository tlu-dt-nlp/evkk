import {
  createContext,
  useContext,
  useMemo,
  useState
} from 'react';

export const EditorContext = createContext();

export function EditorProvider({ children }) {
  const [editorValues, setEditorValues] = useState({
    text: '',
    content: '',
    initialText: '',
    selectedSubTab: null,
    errorResponse: {},
    editor: null
  });

  const setText = newText => {
    setEditorValues(prev => ({ ...prev, text: newText }));
  };

  const setEditor = editor => {
    setEditorValues(prev => ({ ...prev, editor }));
  };

  const setInitialText = initialText => {
    setEditorValues(prev => ({ ...prev, initialText }));
  };

  const setSelectedSubTab = selectedSubTab => {
    setEditorValues(prev => ({ ...prev, selectedSubTab }));
  };

  const setErrorResponse = errorResponse => {
    setEditorValues(prev => ({ ...prev, errorResponse }));
  };

  const setContent = content => {
    setEditorValues(prev => ({ ...prev, content }));
  };

  const value = useMemo(
    () => ({
      editorValues,
      setEditorValues,
      setText,
      setEditor,
      setInitialText,
      setSelectedSubTab,
      setErrorResponse,
      setContent
    }),
    [editorValues]
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
    throw new Error(
      'useEditorContext must be used within EditorProvider'
    );
  }

  const { editorValues, ...setters } = context;

  return {
    ...(selector ? selector(editorValues) : editorValues),
    ...setters
  };
}
