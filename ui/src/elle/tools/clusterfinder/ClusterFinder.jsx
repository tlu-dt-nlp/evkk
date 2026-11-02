import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { AccordionStyle, DefaultButtonStyle } from '../../const/StyleConstants';
import ClusterFinderAnalysisOptions from './components/ClusterFinderAnalysisOptions';
import ClusterFinderCascadingSelects from './components/ClusterFinderCascadingSelects';
import ClusterFinderTable from './components/ClusterFinderTable';
import { useClusterFinderForm } from './hooks/useClusterFinderForm';
import './styles/ClusterFinder.css';

export default function ClusterFinder() {
  const { t } = useTranslation();
  const {
    isAccordionExpanded,
    toggleAccordion,
    onSubmit,
    response,
    showTable,
    showNoResultsError,
    showNoTextError,
    options,
    clauseSelect,
    wordSelect,
  } = useClusterFinderForm();

  return (
    <div className="clusterfinder-app">
      <h2 className="page-title">{t('common_clusters')}</h2>
      <Accordion
        expanded={isAccordionExpanded}
        onChange={toggleAccordion}
        sx={AccordionStyle}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t('common_analysis_options')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={onSubmit}>
            <ClusterFinderAnalysisOptions {...options} />
            <div className="filter-groups">
              <ClusterFinderCascadingSelects {...clauseSelect} />
              <ClusterFinderCascadingSelects {...wordSelect} />
            </div>
            <Button sx={DefaultButtonStyle} type="submit" variant="contained">
              {t('analyse_button')}
            </Button>

            {showNoTextError && (
              <Alert className="no-text-error" severity="error">
                {t('error_no_texts_selected')}
              </Alert>
            )}
          </form>
        </AccordionDetails>
      </Accordion>
      {showTable && <ClusterFinderTable clusters={response.clusters} />}
      {showNoResultsError && (
        <Alert severity="error">{t('error_no_matching_keywords')}</Alert>
      )}
    </div>
  );
}
