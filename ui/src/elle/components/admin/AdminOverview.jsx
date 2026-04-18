import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import RootContext from '../../context/RootContext';
import {
  useGetDatabaseHealth,
  useGetInternalServerErrorMetrics,
  useGetTextsToReview,
  useGetWordAnalyserMetrics
} from '../../hooks/service/AdminService';

function calculateMetrics(measurements) {
  if (!measurements?.length) {
    return null;
  }

  const metricsMap = new Map(
    measurements.map((m) => [m.statistic, m.value])
  );

  const count = metricsMap.get('COUNT');
  const max = metricsMap.get('MAX');
  const totalTime = metricsMap.get('TOTAL_TIME');

  if (count === undefined || max === undefined || totalTime === undefined) {
    return null;
  }

  return {
    count,
    max: Math.round(max * 100) / 100,
    average: count > 0 ? Math.round((totalTime / count) * 100) / 100 : 0
  };
}

export default function AdminOverview() {
  const { t } = useTranslation();
  const { user } = useContext(RootContext);
  const { getTextsToReview } = useGetTextsToReview();
  const { getDatabaseHealth } = useGetDatabaseHealth();
  const { getWordAnalyserMetrics } = useGetWordAnalyserMetrics();
  const { getInternalServerErrorMetrics } = useGetInternalServerErrorMetrics();

  const [textsToReview, setTextsToReview] = useState();
  const [databaseHealth, setDatabaseHealth] = useState();
  const [wordAnalyserMetrics, setWordAnalyserMetrics] = useState();
  const [internalServerErrorMetrics, setInternalServerErrorMetrics] = useState();

  const calculatedMetrics = useMemo(
    () => calculateMetrics(wordAnalyserMetrics?.measurements),
    [wordAnalyserMetrics?.measurements]
  );

  useEffect(() => {
    getTextsToReview().then(setTextsToReview);
  }, [getTextsToReview]);

  useEffect(() => {
    getDatabaseHealth().then(setDatabaseHealth);
  }, [getDatabaseHealth]);

  useEffect(() => {
    getWordAnalyserMetrics().then(setWordAnalyserMetrics);
  }, [getWordAnalyserMetrics]);

  useEffect(() => {
    getInternalServerErrorMetrics().then(setInternalServerErrorMetrics);
  }, [getInternalServerErrorMetrics]);

  return (
    <div>
      <p>
        {t('common_hello')}, {user?.firstName}!
      </p>

      <p>
        {t('admin_panel_texts_to_review')}: {textsToReview?.count}
        <br />
        {t('admin_panel_database_status')}: {databaseHealth?.status}
      </p>

      <p>
        <b>{t('admin_panel_metrics')}</b>
      </p>

      <p>
        <i>{t('common_word_analyser')}</i>
        <br />
        {calculatedMetrics ? (
          <>
            {t('admin_panel_metrics_count')}: {calculatedMetrics.count}
            <br />
            {t('admin_panel_metrics_max')}: {calculatedMetrics.max} {t('admin_panel_metrics_seconds')}
            <br />
            {t('admin_panel_metrics_average')}: {calculatedMetrics.average} {t('admin_panel_metrics_seconds')}
          </>
        ) : (
          <>
            {t('admin_panel_metrics_no_data')}
          </>
        )}
      </p>

      <p>
        {t('admin_panel_metrics_internal_server_error')}: {internalServerErrorMetrics?.measurements?.[0]?.value}
      </p>
    </div>
  );
}
