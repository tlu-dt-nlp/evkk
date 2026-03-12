import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import RootContext from '../context/RootContext';
import {
  useGetDatabaseHealth,
  useGetInternalServerErrorMetrics,
  useGetTextsToReviewCount,
  useGetWordAnalyserMetrics
} from '../hooks/service/AdminService';
import { Box } from '@mui/material';

export default function Admin() {
  const { t } = useTranslation();
  const { user } = useContext(RootContext);
  const textsToReviewCount = useGetTextsToReviewCount();
  const databaseHealth = useGetDatabaseHealth();
  const wordAnalyserMetrics = useGetWordAnalyserMetrics();
  const internalServerErrorMetrics = useGetInternalServerErrorMetrics();
  const [wordAnalyserCount, setWordAnalyserCount] = useState(null);
  const [wordAnalyserMax, setWordAnalyserMax] = useState(null);
  const [wordAnalyserAverage, setWordAnalyserAverage] = useState(null);

  useEffect(() => {
    if (wordAnalyserMetrics?.measurements) {
      const wordAnalyserMeasurements = wordAnalyserMetrics.measurements;
      const wordAnalyserCount = wordAnalyserMeasurements.find(m => m.statistic === 'COUNT').value;
      const wordAnalyserMax = Math.round(wordAnalyserMeasurements.find(m => m.statistic === 'MAX').value * 100) / 100;
      const wordAnalyserTotal = wordAnalyserMeasurements.find(m => m.statistic === 'TOTAL_TIME').value;
      const wordAnalyserAverage = Math.round(wordAnalyserTotal / wordAnalyserCount * 100) / 100;
      setWordAnalyserCount(wordAnalyserCount);
      setWordAnalyserMax(wordAnalyserMax);
      setWordAnalyserAverage(wordAnalyserAverage);
    }
  }, [wordAnalyserMetrics]);

  return (
    <Box className="global-page-content-container">
      <Box
        className="global-page-content-container-inner"
        style={{ paddingLeft: '2rem' }}
      >
        {t('common_hello')}, {user.firstName}!
        <br /><br />
        {t('admin_panel_texts_to_review')}: {textsToReviewCount}
        <br />
        {t('admin_panel_database_status')}: {databaseHealth?.status}
        <br /><br />
        <b>{t('admin_panel_metrics')}</b>
        <br /><br />
        <i>{t('common_word_analyser')}</i>
        <br />
        {wordAnalyserMetrics ? (
          <>
            {t('admin_panel_metrics_count')}: {wordAnalyserCount}
            <br />
            {t('admin_panel_metrics_max')}: {wordAnalyserMax} {t('admin_panel_metrics_seconds')}
            <br />
            {t('admin_panel_metrics_average')}: {wordAnalyserAverage} {t('admin_panel_metrics_seconds')}
          </>
        ) : (
          <>
            {t('admin_panel_metrics_no_data')}
          </>
        )}
        <br /><br />
        {t('admin_panel_metrics_internal_server_error')}: {internalServerErrorMetrics?.measurements[0].value}
      </Box>
    </Box>
  );
}
