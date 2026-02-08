import './CorrectorInput.css';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useRef } from 'react';
import MarkComponentExtension from './MarkuComponent/MarkComponentExtension.js';
import { useEditorContext } from '../../providers/EditorProvider.js';
import { GRAMMARCHECKER, SPELLCHECKER } from '../../../correction/const/Constants';
import TextUpload from '../../../../components/TextUpload';
import { Paper } from '@mui/material';

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

  const handleTextUpload = (uploadedText) => {
    setErrorResponse({});
    setText(uploadedText);
  };

  const content = (() => {
    if (!selectedSubTab || Object.keys(errorResponse).length === 0) return text;

    if (selectedSubTab === SPELLCHECKER) {
      return (errorResponse.speller.reduce((acc, error) => {
        if (error.corrected) {
          const inputLine = `<react-component data-errorType="${
            error.correction_type
          }" data-initialText="${error.text}" data-correctedText="${
            error.corrected_text
          }" data-componentId="${error.error_id}">${
            error.text === ' ' ? '&nbsp;' : error.text
          }</react-component>`;
          return acc + inputLine;
        } else return acc + error.text;
      }, ''));
    }

    if (selectedSubTab === GRAMMARCHECKER) {
      return (errorResponse.grammatika.reduce((acc, error) => {
        if (error.corrected) {
          const inputLine = `<react-component data-errorType="${
            error.correction_type
          }" data-initialText="${error.text}" data-correctedText="${
            error.corrected_text
          }" data-componentId="${error.error_id}">${
            error.text === ' ' ? '&nbsp;' : error.text
          }</react-component>`;
          return acc + inputLine;
        } else return acc + error.text;
      }, ''));
    }

    return errorResponse.margitudLaused[selectedSubTab].replaceAll('<span', '<react-component').replaceAll('</span>', '</react-component>').replaceAll(' class=', ' data-classValue=');
  })();


  const handleTextChange = (newText, newContent) => {
    setContent(newContent.toString());
    setText(newText);
  };

  const editor = useEditor({
    extensions: [StarterKit, MarkComponentExtension.configure({
      onTextUpdate: handleTextChange
    })],
    content: `
    <p>
      ${content}
    </p>
    `
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(`<p>${content}</p>`);
      setEditor(editor);
      setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="position-relative">
      <EditorContent ref={contentRef} editor={editor} />
      <Paper className="corrector-input-icon-bar" elevation={3}>
        <TextUpload sendTextFromFile={handleTextUpload} buttonClassName={'corrector-input-download-button'} />
      </Paper>
    </div>
  );
}
