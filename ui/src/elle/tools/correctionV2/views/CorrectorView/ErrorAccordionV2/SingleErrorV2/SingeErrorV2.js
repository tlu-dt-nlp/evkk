import React from 'react';
import { IconButton, Paper } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useEditorContext } from '../../../../providers/EditorProvider';
import { changeHandler } from '../../../../util/errorChangerHelpers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


export default function SingleErrorV2({ error, onClose = null }) {
  const { selectedSubTab, setErrorResponse, errorResponse } = useEditorContext(state => ({
    selectedSubTab: state.selectedSubTab,
    setErrorResponse: state.setErrorResponse,
    errorResponse: state.errorResponse
  }));

  const handleChange = (isAcceptSelected = false) => {
    onClose && onClose();
    setErrorResponse(changeHandler(isAcceptSelected, errorResponse, selectedSubTab, error.error.error_id));
  };

  return (
    <Paper className="p-2 d-flex flex-column gap-1">
      <div className="correction-single-error">
        <span className="corrector-error-word">{error.error.text}</span>
        <KeyboardArrowRightIcon fontStyle="small" />
        <strong>{error.error.corrected_text}</strong>
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
};
