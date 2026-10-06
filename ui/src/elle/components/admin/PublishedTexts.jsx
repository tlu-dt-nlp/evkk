import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useTranslation } from 'react-i18next';

import { AccordionStyle } from '../../const/StyleConstants';
import { useGetPublishedTexts } from '../../hooks/service/AdminTextService';
import useAdminTextsPage from '../../hooks/useAdminTextsPage';
import PublishedTextSearchForm from '../modal/text-selection/PublishedTextSearchForm';
import PublishedTextDetailsModal from './PublishedTextDetailsModal';
import AdminTextsTable from './AdminTextsTable';

export default function PublishedTexts() {
  const { t } = useTranslation();
  const { getPublishedTexts } = useGetPublishedTexts();

  const {
    isAccordionExpanded,
    setIsAccordionExpanded,
    rows,
    selectedTextId,
    refetchTrigger,
    handleResults,
    handleOpenDetails,
    handleTriggerRefetch,
    handleSetIsOpen
  } = useAdminTextsPage();

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
            refetchTrigger={refetchTrigger}
            isAdminView={true}
          />
        </AccordionDetails>
      </Accordion>

      {rows.length > 0 && (
        <div className="mt-4">
          <AdminTextsTable
            onOpenDetails={handleOpenDetails}
            rows={rows}
          />
        </div>
      )}

      <PublishedTextDetailsModal
        isOpen={!!selectedTextId}
        refetch={handleTriggerRefetch}
        setIsOpen={handleSetIsOpen}
        textId={selectedTextId}
      />
    </>
  );
}
