import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AccordionStyle } from '../../const/StyleConstants';
import { useGetPublishedTexts } from '../../hooks/service/AdminService';
import PublishedTextSearchForm from '../modal/text-selection/PublishedTextSearchForm';
import PublishedTextsTable from './PublishedTextsTable';

export default function PublishedTexts() {
  const { t } = useTranslation();
  const { getPublishedTexts } = useGetPublishedTexts();

  const [isAccordionExpanded, setIsAccordionExpanded] = useState(true);
  const [results, setResults] = useState([]);

  const rows = useMemo(() => (
    results.map(row => ({
      textId: row.text_id,
      createdAt: row._meta?.created_at,
      title: row.property_value
    }))
  ), [results]);

  const handleResults = (response) => {
    setResults(response);
    setIsAccordionExpanded(response.length <= 0);
  };

  return (
    <>
      <h2 className="text-center pb-3">
        {t('common_published_texts')}
      </h2>

      <Accordion
        expanded={isAccordionExpanded}
        onChange={() => setIsAccordionExpanded(!isAccordionExpanded)}
        sx={AccordionStyle}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            {t('query_choose_texts')}
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <PublishedTextSearchForm
            fetchTexts={getPublishedTexts}
            onResults={handleResults}
          />
        </AccordionDetails>
      </Accordion>

      {rows.length > 0 && (
        <div className="mt-4">
          <PublishedTextsTable rows={rows} />
        </div>
      )}
    </>
  );
}
