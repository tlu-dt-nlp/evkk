import React from 'react';
import Accordion from '@mui/material/Accordion';
import { CorrectorAccordionStyle } from '../../../../../const/StyleConstants';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextLevelAccordionInner from './TextLevelAccordionInner';
import { useTranslation } from 'react-i18next';

export default function TextLevelAccordion({ complexityAnswer, label, key }) {
  const { t } = useTranslation();

  return (
    <div className="mb-2">
      <Accordion
        square={true}
        sx={CorrectorAccordionStyle}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          {t(label)}
        </AccordionSummary>
        <AccordionDetails>
          <TextLevelAccordionInner
            complexityAnswer={complexityAnswer}
            key={key}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
