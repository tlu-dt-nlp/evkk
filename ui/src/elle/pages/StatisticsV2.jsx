import { useCallback, useMemo, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { MenuOpen } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import '../components/styles/ResponsiveDrawer.css';
import './styles/Statistics.css';

import { describeFilters, hasActiveFilters, toChartData, toDataRanges } from './statisticsV2/helpers';
import { useStatisticsFilters } from './statisticsV2/hooks/useStatisticsFilters';
import { useStatisticsQuery } from './statisticsV2/hooks/useStatisticsQuery';
import { useChartLayout } from './statisticsV2/hooks/useChartLayout';
import FilterSidebar from './statisticsV2/components/FilterSidebar';
import FilterDrawerContent from './statisticsV2/components/FilterDrawerContent';
import MetricCard from './statisticsV2/components/MetricCard';
import ChartsGrid from './statisticsV2/components/ChartsGrid';

function StatisticsV2() {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState(new Set());

  const filters = useStatisticsFilters();
  const { response, isLoading } = useStatisticsQuery(filters.applied);
  // The applied subcorpus selection decides the default origin chart (kodakondsus vs emakeel).
  const [layout, layoutActions, isCustomLayout] = useChartLayout(filters.applied.filters.korpus);

  const toggleSection = useCallback((key) => setOpenSections(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  }), []);

  const formatCount = useCallback(
    (n) => (n || 0).toLocaleString(i18n.language === 'et' ? 'et-EE' : i18n.language),
    [i18n.language]
  );

  const chartData = useMemo(() => toChartData(t, response?.distributions), [t, response]);
  const dataRanges = useMemo(() => toDataRanges(response), [response]);
  const filtersText = useMemo(
    () => describeFilters(t, filters.applied, dataRanges),
    [t, filters.applied, dataRanges]
  );

  if (!response && isLoading) {
    return (
      <Box className="statistics-app global-page-content-container">
        <Box className="global-page-content-container-inner">
          <Typography variant="body1" className="statistics-no-results">{t('statistics_loading')}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="statistics-app global-page-content-container">
      <Box className="global-page-content-container-inner">
        <Box className="responsive-drawer-main-box">

          <FilterSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)}>
            <FilterDrawerContent
              pending={filters.pending}
              sectionOptions={response?.filterOptions || {}}
              dataRanges={dataRanges}
              openSections={openSections}
              onToggleSection={toggleSection}
              hasUnappliedChanges={filters.hasUnappliedChanges}
              hasActiveFilters={hasActiveFilters(filters.applied, dataRanges)}
              onToggleFilter={filters.toggleFilter}
              onSetRange={filters.setRange}
              onApply={filters.apply}
              onClearAll={filters.clearAll}
            />
          </FilterSidebar>

          <Box component="main" className={`sv2-main${isLoading ? ' sv2-main--loading' : ''}`}>
            <Button
              variant="contained"
              className="drawer-toggle-button sv2-drawer-toggle"
              onClick={() => setMobileOpen(o => !o)}
            >
              <MenuOpen className="drawer-toggle-icon" />
            </Button>

            <h2 className="tool-title">{t('common_statistics')}</h2>

            <div className="sv2-metrics-row">
              <MetricCard value={formatCount(response?.totalCount)} label={t('statistics_text_count')} />
              <MetricCard value={formatCount(response?.avgWordCount)} label={t('statistics_avg_word_count')} />
              <MetricCard value={formatCount(response?.avgSentenceCount)} label={t('statistics_avg_sentence_count')} />
            </div>

            <ChartsGrid
              layout={layout}
              actions={layoutActions}
              chartData={chartData}
              filtersText={filtersText}
            />

            {isCustomLayout && (
              <Box className="sv2-layout-reset-row">
                <Button size="small" variant="text" className="sv2-quiet-button" onClick={layoutActions.reset}>
                  {t('statistics_reset_layout')}
                </Button>
              </Box>
            )}
          </Box>

        </Box>
      </Box>
    </Box>
  );
}

export default StatisticsV2;
