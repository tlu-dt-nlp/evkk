import Accordion from '@mui/material/Accordion';
import { CorrectorAccordionStyle, CorrectorErrorCircle } from '../../../../../const/StyleConstants';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import AccordionDetails from '@mui/material/AccordionDetails';
import SingleError from './SingleError';
import { errorTypes } from '../../../const/TabValuesConstant';
import { useTranslation } from 'react-i18next';

export default function ErrorAccordion(
  {
    errorList,
    setErrorList,
    setHoveredId,
    setInputType,
    correctionModel
  }) {
  const { t } = useTranslation();

  return (
    <>
      {Object.entries(errorList).map((errorProperties) => {
        if (errorProperties[1].length === 0) return null;
        return (<Accordion key={errorProperties[0]} square={true} sx={CorrectorAccordionStyle}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Box component="span"
                 sx={CorrectorErrorCircle(errorTypes[errorProperties[0]].color)}>
            </Box>
            {t(errorTypes[errorProperties[0]].label)} ({errorProperties[1].length})
          </AccordionSummary>
          <AccordionDetails>
            <div className="d-flex gap-1 flex-column">
              {errorProperties[1].map(error => (
                <SingleError
                  key={error.error_id}
                  error={error}
                  setErrorList={setErrorList}
                  setHoveredId={setHoveredId}
                  setInputType={setInputType}
                  correctionModel={correctionModel}
                  errorText={error.long_explanation ? error.long_explanation : error.short_explanation}
                />
              ))}
            </div>
          </AccordionDetails>
        </Accordion>);
      })}
    </>
  );
};
