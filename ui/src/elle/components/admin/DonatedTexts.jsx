import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useTranslation } from 'react-i18next';

import { AccordionStyle } from '../../const/StyleConstants';
import { useGetDonatedTexts } from '../../hooks/service/AdminTextService';
import useAdminTextsPage from '../../hooks/useAdminTextsPage';
import DonatedTextDetailsModal from './DonatedTextDetailsModal';
import DonatedTextSearchForm from './DonatedTextSearchForm';
import AdminTextsTable from './AdminTextsTable';

export default function DonatedTexts() {
  const { t } = useTranslation();
  const { getDonatedTexts } = useGetDonatedTexts();

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
        {t('common_donated_texts')}
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
          <DonatedTextSearchForm
            fetchTexts={getDonatedTexts}
            onResults={handleResults}
            refetchTrigger={refetchTrigger}
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

      <DonatedTextDetailsModal
        isOpen={!!selectedTextId}
        refetch={handleTriggerRefetch}
        setIsOpen={handleSetIsOpen}
        textId={selectedTextId}
      />
    </>
  );
}
