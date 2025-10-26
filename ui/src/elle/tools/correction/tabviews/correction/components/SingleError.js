import React from 'react';
import { Divider, IconButton, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { ACCEPT_ERROR, DECLINE_ERROR, GRAMMARCHECKER_TEST } from '../../../const/Constants';

export default function SingleError(
  {
    error,
    setErrorList,
    setHoveredId,
    setInputType,
    correctionModel,
    errorText
  }) {

  const resolveErrors = (decision) => {
    setErrorList((prevList) => {
      return Object.keys(prevList).reduce((newList, key) => {
        newList[key] = prevList[key].filter((entry) => entry.error_id !== error.error_id);
        return newList;
      }, {});
    });

    setInputType(prevData =>
      prevData.map(entry =>
        entry.error_id === error.error_id ? {
          ...entry, ...{
            corrected: false,
            text: decision === ACCEPT_ERROR ? error.corrected_text : error.text
          }
        } : entry
      )
    );
  };

  return (
    <Paper className="p-2 d-flex flex-column gap-1">
      <div
        className="correction-single-error"
        onMouseOver={() => setHoveredId(error.error_id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <span className="corrector-error-word">{error.text}</span>
        <KeyboardArrowRightIcon fontStyle="small" />
        <strong>{error.corrected_text}</strong>
        <span className="fix-pair">
          <IconButton
            className="corrector-error-icon-button"
            color="success"
            onClick={() => resolveErrors(ACCEPT_ERROR)}
          >
            <CheckCircleIcon fontSize="medium" />
          </IconButton>
          <IconButton
            className="corrector-error-icon-button"
            color="error"
            onClick={() => resolveErrors(DECLINE_ERROR)}
          >
            <CancelIcon fontSize="medium" />
          </IconButton>
        </span>
      </div>
      {errorText && <Divider />}
      {correctionModel === GRAMMARCHECKER_TEST && error.correction_type === 'multipleErrors' && error.correction_value &&
        <div>
          <div>Vealiigid: {error.correction_value}</div>
          <Divider />
        </div>
      }
      <div>
        {correctionModel === GRAMMARCHECKER_TEST && errorText &&
          <div>{errorText}</div>}
      </div>
    </Paper>

  );
};
