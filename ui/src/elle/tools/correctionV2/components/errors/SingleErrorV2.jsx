import { IconButton, Paper } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useEditorContext } from '../../providers/EditorProvider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function SingleErrorV2({
                                        error,
                                        onClose = null
                                      }) {
  const { editor } = useEditorContext(state => ({
    editor: state.editor
  }));

  const handleChange = (isAcceptSelected = false) => {
    onClose?.();
    if (!editor) return;

    requestAnimationFrame(() => {
      let markFrom = null;
      let markTo = null;

      editor.state.doc.descendants((node, pos) => {
        if (node.isText) {
          const mark = node.marks.find(m =>
            m.type.name === 'reactComponent' && m.attrs.errorId === error.error_id
          );
          if (mark) {
            markFrom = pos;
            markTo = pos + node.nodeSize;
            return false;
          }
        }
      });

      if (markFrom === null) return;

      editor.chain().command(({ tr }) => {
        const markType = editor.schema.marks.reactComponent;
        tr.removeMark(markFrom, markTo, markType);
        if (isAcceptSelected) {
          tr.replaceWith(markFrom, markTo, editor.schema.text(error.corrected_text));
        }
        return true;
      }).run();
    });
  };

  return (
    <Paper className="p-2 d-flex flex-column gap-1">
      <div className="correction-single-error">
        <span className="corrector-error-word">
          {error.text}
        </span>
        <KeyboardArrowRightIcon fontStyle="small" />
        <strong>{error.corrected_text}</strong>
      </div>
      <span className="fix-pair d-flex gap-1">
        <IconButton
          className="corrector-error-icon-button"
          color="success"
          onClick={() => handleChange(true)}
        >
          <CheckCircleIcon fontSize="medium" />
        </IconButton>
        <IconButton
          className="corrector-error-icon-button"
          color="error"
          onClick={() => handleChange(false)}
        >
          <CancelIcon fontSize="medium" />
        </IconButton>
      </span>
    </Paper>
  );
}
