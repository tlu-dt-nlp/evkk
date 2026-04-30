import './styles/CorrectorInput.css';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Fragment, Slice } from '@tiptap/pm/model';
import { EditorState } from '@tiptap/pm/state';
import { useEffect, useRef } from 'react';
import MarkComponentExtension from './MarkComponentExtension.js';
import { useEditorContext } from '../../providers/EditorProvider.jsx';
import { GRAMMARCHECKER, SPELLCHECKER } from '../../../correction/const/Constants';
import TextUpload from '../../../../components/TextUpload';
import { IconButton } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

const buildPlainTextPasteSlice = (schema, plainText) => {
  const normalizedText = plainText.replaceAll(/\r\n?/g, '\n');
  const paragraphTexts = normalizedText.split(/\n{2,}/);

  const paragraphNodes = paragraphTexts.map(paragraphText => {
    if (!paragraphText) return schema.nodes.paragraph.create();

    const lineParts = paragraphText.split('\n');
    const content = [];

    lineParts.forEach((part, index) => {
      if (part) content.push(schema.text(part));

      // add hard break only if it's not the last part
      if (index < lineParts.length - 1) {
        content.push(schema.nodes.hardBreak.create());
      }
    });

    return schema.nodes.paragraph.create(null, content.length > 0 ? content : undefined);
  });

  return new Slice(Fragment.fromArray(paragraphNodes), 0, 0);
};

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

  const initialTextRef = useRef(text);

  const handleTextUpload = uploadedText => {
    setErrorResponse({});
    setText(uploadedText);
    editor?.commands.setContent(`<p>${uploadedText}</p>`);
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
    content: `<p>${text}</p>`,
    editorProps: {
      handlePaste(view, event) {
        const plainText = event.clipboardData?.getData('text/plain');
        if (!plainText || plainText === '') return false;

        event.preventDefault();
        const { state, dispatch } = view;
        const slice = buildPlainTextPasteSlice(state.schema, plainText);

        dispatch(state.tr.replaceSelection(slice).scrollIntoView());
        return true;
      }
    }
  });

  const replaceContent = (content) => {
    editor
      .chain()
      .command(({ tr }) => {
        tr.setMeta('addToHistory', false);
        return true;
      })
      .setContent(content, { emitUpdate: false })
      .run();

    editor.view.updateState(
      EditorState.create({
        doc: editor.state.doc,
        plugins: editor.state.plugins
      })
    );
  };

  const buildDocFromTokens = (tokens) => {
    const paragraphs = [[]];

    for (const token of tokens) {
      if (token.type === 'paragraphBreak') {
        paragraphs.push([]);
      } else if (token.type === 'lineBreak') {
        paragraphs.at(-1).push({ type: 'hardBreak' });
      } else if (token.corrected) {
        paragraphs.at(-1).push({
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
        paragraphs.at(-1).push({ type: 'text', text: token.text });
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
    initialTextRef.current = text;
  }, [errorResponse]);

  useEffect(() => {
    if (!editor) return;

    const hasErrors = Object.keys(errorResponse).length > 0;
    if (!selectedSubTab || !hasErrors) return;

    if (initialTextRef.current !== text) {
      replaceContent(text);
      return;
    }

    if (selectedSubTab === SPELLCHECKER || selectedSubTab === GRAMMARCHECKER) {
      const tokens = selectedSubTab === SPELLCHECKER
        ? errorResponse.speller
        : errorResponse.grammatika;
      replaceContent(buildDocFromTokens(tokens));
    } else {
      const html = errorResponse.margitudLaused[selectedSubTab]
        .replaceAll('<span', '<markup-error')
        .replaceAll('</span>', '</markup-error>')
        .replaceAll(' class=', ' data-classValue=')
        .split('\n')
        .map(line => `<p>${line}</p>`)
        .join('');

      replaceContent(html || '<p></p>');
    }

    setContent(editor.getHTML());
  }, [selectedSubTab, errorResponse, editor]);

  return (
    <div className="corrector-input-wrapper">
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
        <TextUpload
          className="corrector-input-icon-button"
          sendTextFromFile={handleTextUpload}
          disableStyles={true}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
