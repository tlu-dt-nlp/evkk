import React from 'react';
import { Alert, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { textLevelColors, textLevels } from '../../../correction/const/TabValuesConstant';
import { useEditorContext } from '../../providers/EditorProvider';
import CorrectionInfoIcon from '../../../correction/components/CorrectionInfoIcon';
import CircleIcon from '@mui/icons-material/Circle';
import TextLevelInfotext from './TextLevelInfoText/TextLevelInfotext';
import TextLevelAccordionV2 from './TextLevelAccordionV2/TextLevelAccordionV2';

export default function TextLevelView() {
  const { t } = useTranslation();

  const { errorResponse } = useEditorContext(state => ({
    errorResponse: state.errorResponse
  }));

  const complexityAnswer = errorResponse?.keeletase || null;

  const content = (() => {
    if (!errorResponse || !complexityAnswer) {
      return (
        <Box className="corrector-right-inner">
          <Alert
            severity="info"
            className="level-tab-short-text-notice"
          >
            {t('corrector_proficiency_level_gray_box')}
          </Alert>
        </Box>);
    }

    if (complexityAnswer?.length === 0) {
      return (
        <Alert
          severity="info"
          className="level-tab-short-text-notice"
        >
          {t('corrector_proficiency_level_short_text')}
        </Alert>);
    }

    return <TextLevelAccordionV2 complexityAnswer={complexityAnswer} />;
  })();

  return (
    <div>
      <Box>
        <CorrectionInfoIcon containerHeight={44}>
          <TextLevelInfotext />
        </CorrectionInfoIcon>
      </Box>
      <div>
        {complexityAnswer && complexityAnswer?.length !== 0 &&
          <div className="levels-row">
            <div className="levels-title">
              {t('corrector_proficiency_level_color_codes')}:
            </div>
            <div className="levels">
              {textLevelColors.map((color, index) => (
                <div className="level" key={t(textLevels[index])}>
                  <CircleIcon fontSize={'0.5rem'} sx={{ color }} />
                  <span>{t(textLevels[index])}</span>
                </div>
              ))}
            </div>
          </div>
        }
        {content}
      </div>
    </div>
  );
};
