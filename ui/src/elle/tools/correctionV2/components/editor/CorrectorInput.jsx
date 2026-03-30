import './styles/CorrectorInput.css';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef } from 'react';
import MarkComponentExtension from './MarkComponentExtension.js';
import { useEditorContext } from '../../providers/EditorProvider.jsx';
import { GRAMMARCHECKER, SPELLCHECKER } from '../../../correction/const/Constants';
import TextUpload from '../../../../components/TextUpload';

export default function CorrectorInput() {
  const {
    errorResponse,
    setEditor,
    setText,
    selectedSubTab,
    text,
    setErrorResponse,
    setContent
  } = useEditorContext(state => ({
    errorResponse: state.errorResponse,
    setEditor: state.setEditor,
    setText: state.setText,
    selectedSubTab: state.selectedSubTab,
    text: state.text,
    setErrorResponse: state.setErrorResponse,
    setContent: state.setContent
  }));

  const contentRef = useRef(null);
  const textRef = useRef(text);
  textRef.current = text;

  const handleTextUpload = uploadedText => {
    setErrorResponse({});
    setText(uploadedText);
  };

  const handleTextChange = (newText, newContent) => {
    setContent(newContent.toString());
    setText(newText);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      MarkComponentExtension.configure({
        onTextUpdate: handleTextChange
      })
    ],
    content: `<p>${text}</p>`
  });

  const setEditorContent = content => {
    editor
      .chain()
      .command(({ tr }) => {
        tr.setMeta('addToHistory', false);
        return true;
      })
      .setContent(content, { emitUpdate: false })
      .run();

    setContent(editor.getHTML());
  };

  const buildErrorContent = errors => ({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: errors.map(error =>
          error.corrected
            ? {
                type: 'text',
                text: error.text === ' ' ? '\u00A0' : error.text,
                marks: [
                  {
                    type: 'reactComponent',
                    attrs: {
                      initialText: error.text,
                      correctedText: error.corrected_text,
                      errorType: error.correction_type,
                      errorId: error.error_id
                    }
                  }
                ]
              }
            : { type: 'text', text: error.text }
        )
      }
    ]
  });

  useEffect(() => {
    if (editor) setEditor(editor);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    if (!selectedSubTab || Object.keys(errorResponse).length === 0) {
      setEditorContent(`<p>${textRef.current}</p>`);
    } else if (selectedSubTab === SPELLCHECKER) {
      setEditorContent(buildErrorContent(errorResponse.speller));
    } else if (selectedSubTab === GRAMMARCHECKER) {
      setEditorContent(buildErrorContent(errorResponse.grammatika));
    } else {
      const html = errorResponse.margitudLaused[selectedSubTab]
        .replaceAll('<span', '<markup-error')
        .replaceAll('</span>', '</markup-error>')
        .replaceAll(' class=', ' data-classValue=');
      setEditorContent(`<p>${html}</p>`);
    }
  }, [selectedSubTab, errorResponse, editor]);

  return (
    <div className="position-relative">
      <EditorContent ref={contentRef} editor={editor} />
      <div className="corrector-input-icon-bar">
        <TextUpload sendTextFromFile={handleTextUpload} disableStyles={true} />
      </div>
    </div>
  );
}
