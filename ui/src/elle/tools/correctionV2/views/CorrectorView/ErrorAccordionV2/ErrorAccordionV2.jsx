import React from 'react';
import Accordion from '@mui/material/Accordion';
import { CorrectorAccordionStyle, CorrectorErrorCircle } from '../../../../../const/StyleConstants';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Alert, Box } from '@mui/material';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../providers/EditorProvider';
import SingleErrorV2 from './SingleErrorV2/SingeErrorV2';
import { errorTypes } from '../../../../correction/const/TabValuesConstant';
import { errorMap } from '../../../const/maps';

export default function ErrorAccordionV2() {
  const { t } = useTranslation();

  const { selectedSubTab, errorResponse, content } = useEditorContext(state => ({
    selectedSubTab: state.selectedSubTab,
    errorResponse: state.errorResponse,
    content: state.content
  }));

  if (Object.keys(errorResponse).length === 0) {
    return (<Box className="corrector-right-inner">
      <Alert severity="info">
        {t('corrector_proofreading_gray_box')}
      </Alert>
    </Box>);
  }

  if (!errorResponse[errorMap[selectedSubTab]] || Object.entries(errorResponse[errorMap[selectedSubTab]]).length === 0) {
    return (<Box className="corrector-right-inner">
      <Alert severity="info">
        {t('corrector_proofreading_gray_box_no_errors')}
      </Alert>
    </Box>);
  }

  const errorTypeArrays = Object.entries(errorResponse[errorMap[selectedSubTab]]);

  const handleContentFilter = (errorList) => {
    return errorList.filter(value => content.includes(value.error_id));
  };

  const errorCount = errorTypeArrays
    .map(([_, value]) => handleContentFilter(value))
    .reduce((acc, curr) => acc.concat(curr), [])
    .length;

  return (
    <div className="corrector-right">
      <Box className="h4">{t('corrector_errors_in_total')}: {errorCount}</Box>
      {errorTypeArrays.map((errorProperties) => {
        if (handleContentFilter(errorProperties[1]).length === 0) return null;
        return (<Accordion key={errorProperties[0]} square={true} sx={CorrectorAccordionStyle}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Box sx={CorrectorErrorCircle(errorTypes[errorProperties[0]].color)} />
            {t(errorTypes[errorProperties[0]].label)} ({handleContentFilter(errorProperties[1]).length})
          </AccordionSummary>
          <AccordionDetails>
            <div className="d-flex gap-1 flex-column">
              {errorProperties[1].map((error) => {
                if (content.includes(error.error_id)) return <SingleErrorV2 error={{ error }} />;
                return null;
              })}
            </div>
          </AccordionDetails>
        </Accordion>);
      })}
    </div>
  );
};
