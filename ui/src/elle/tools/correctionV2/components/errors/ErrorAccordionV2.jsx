import Accordion from '@mui/material/Accordion';
import { CorrectorAccordionStyle, CorrectorErrorCircle } from '../../../../const/StyleConstants';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Alert, Box } from '@mui/material';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../providers/EditorProvider';
import SingleErrorV2 from './SingleErrorV2';
import { errorTypes } from '../../../correction/const/TabValuesConstant';
import { errorMap } from '../../constants/maps';

export default function ErrorAccordionV2() {
  const { t } = useTranslation();

  const { selectedSubTab, errorResponse, content } = useEditorContext((state) => ({
    selectedSubTab: state.selectedSubTab,
    errorResponse: state.errorResponse,
    content: state.content
  }));

  if (Object.keys(errorResponse).length === 0) {
    return (
      <Box className="corrector-right-inner">
        <Alert severity="info">{t('corrector_proofreading_gray_box')}</Alert>
      </Box>
    );
  }

  if (
    !errorResponse[errorMap[selectedSubTab]] ||
    Object.entries(errorResponse[errorMap[selectedSubTab]]).length === 0
  ) {
    return (
      <Box className="corrector-right-inner">
        <Alert severity="info">{t('corrector_proofreading_gray_box_no_errors')}</Alert>
      </Box>
    );
  }

  const errorTypeArrays = Object.entries(errorResponse[errorMap[selectedSubTab]]);

  const handleContentFilter = (errorList) => {
    return errorList.filter((value) => content.includes(value.error_id));
  };

  const errorCount = errorTypeArrays.flatMap(([_, value]) => handleContentFilter(value)).length;

  return (
    <div className="corrector-right">
      <Box className="h4">
        {t('corrector_errors_in_total')}: {errorCount}
      </Box>
      {errorTypeArrays.map(([type, errors]) => {
        const filtered = handleContentFilter(errors);
        if (filtered.length === 0) return null;
        return (
          <Accordion key={type} square={true} sx={CorrectorAccordionStyle}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={CorrectorErrorCircle(errorTypes[type].color)} />
              {t(errorTypes[type].label)} ({filtered.length})
            </AccordionSummary>
            <AccordionDetails>
              <div className="d-flex gap-1 flex-column">
                {filtered.map((error) => (
                  <SingleErrorV2 key={error.error_id} error={error} />
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
