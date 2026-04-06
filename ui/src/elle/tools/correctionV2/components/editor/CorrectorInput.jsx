import './styles/CorrectorInput.css';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef } from 'react';
import MarkComponentExtension from './MarkComponentExtension.js';
import { useEditorContext } from '../../providers/EditorProvider.jsx';
import { GRAMMARCHECKER, SPELLCHECKER } from '../../../correction/const/Constants';
import TextUpload from '../../../../components/TextUpload';
import { IconButton } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

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

  /** Replaces editor content without adding to undo history or triggering onUpdate. */
  const replaceContent = (content) => {
    editor
      .chain()
      .command(({ tr }) => {
        tr.setMeta('addToHistory', false);
        return true;
      })
      .setContent(content, { emitUpdate: false })
      .run();
  };

  /** Converts a flat token array from the backend into a TipTap document. */
  const buildDocFromTokens = (tokens) => {
    const paragraphs = [[]];

    for (const token of tokens) {
      if (token.type === 'paragraphBreak') {
        paragraphs.push([]);
      } else if (token.type === 'lineBreak') {
        paragraphs[paragraphs.length - 1].push({ type: 'hardBreak' });
      } else if (token.corrected) {
        paragraphs[paragraphs.length - 1].push({
          type: 'text',
          text: token.text === ' ' ? '\u00A0' : token.text,
          marks: [{
            type: 'reactComponent',
            attrs: {
              initialText: token.text,
              correctedText: token.corrected_text,
              errorType: token.correction_type,
              errorId: token.error_id
            }
          }]
        });
      } else {
        paragraphs[paragraphs.length - 1].push({ type: 'text', text: token.text });
      }
    }

    return {
      type: 'doc',
      content: paragraphs.map(p => ({
        type: 'paragraph',
        ...(p.length > 0 ? { content: p } : {})
      }))
    };
  };

  useEffect(() => {
    if (editor) setEditor(editor);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const hasErrors = Object.keys(errorResponse).length > 0;
    if (!selectedSubTab || !hasErrors) return;

    if (selectedSubTab === SPELLCHECKER || selectedSubTab === GRAMMARCHECKER) {
      const tokens = selectedSubTab === SPELLCHECKER
        ? errorResponse.speller
        : errorResponse.grammatika;
      replaceContent(buildDocFromTokens(tokens));
    } else {
      const html = errorResponse.margitudLaused[selectedSubTab]
        .replaceAll('<span', '<markup-error')
        .replaceAll('</span>', '</markup-error>')
        .replaceAll(' class=', ' data-classValue=');
      replaceContent(html.split('\n').map(line => `<p>${line}</p>`).join('') || '<p></p>');
    }

    setContent(editor.getHTML());
  }, [selectedSubTab, errorResponse, editor]);

  return (
    <div className="position-relative">
      <EditorContent ref={contentRef} editor={editor} />
      <div className="corrector-input-icon-bar">
        <div>
          <IconButton
            className="corrector-input-icon-button"
            disableRipple
            size="small"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
          >
            <UndoIcon fontSize="small" />
          </IconButton>
          <IconButton
            className="corrector-input-icon-button"
            disableRipple
            size="small"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
          >
            <RedoIcon fontSize="small" />
          </IconButton>
        </div>
        <TextUpload className="corrector-input-icon-button" sendTextFromFile={handleTextUpload} disableStyles={true} />
      </div>
    </div>
  );
}
