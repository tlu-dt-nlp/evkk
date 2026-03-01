import React from 'react';
import { Alert, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../providers/EditorProvider';
import CorrectionInfoIcon from '../../../correction/components/CorrectionInfoIcon';
import ComplexityInfoText from './ComplexityInfoText/ComplexityInfoText';
import ComplexityAccordionV2 from './ComplexityAccordionV2/ComplexityAccordionV2';

export default function ComplexityView() {
  const { t } = useTranslation();

  const { errorResponse } = useEditorContext(state => ({
    errorResponse: state.errorResponse
  }));

  const content = (() => {
    if (!errorResponse || Object.entries(errorResponse).length < 1) {
      return (
        <Box className="corrector-right-inner">
          <Alert
            severity="info"
            className="level-tab-short-text-notice"
          >
            {t('corrector_complexity_gray_box')}
          </Alert>
        </Box>);
    }

    return <ComplexityAccordionV2 complexityAnswer={errorResponse} />;
  })();


  return (
    <div className="corrector-border-box">
      <CorrectionInfoIcon containerHeight={44}>
        <ComplexityInfoText />
      </CorrectionInfoIcon>
      <div className="d-flex gap-2 flex-wrap">
        {content}
      </div>
    </div>
  );
};
