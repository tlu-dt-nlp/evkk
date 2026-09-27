import { useMemo, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { MenuOpen } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import '../components/styles/ResponsiveDrawer.css';
import './styles/Statistics.css';

import { DRAWER_WIDTH } from './statisticsV2/constants';
import { describeFilters, hasActiveFilters, toChartData, toDataRanges } from './statisticsV2/helpers';
import { useStatisticsFilters } from './statisticsV2/hooks/useStatisticsFilters';
import { useStatisticsQuery } from './statisticsV2/hooks/useStatisticsQuery';
import { useChartLayout } from './statisticsV2/hooks/useChartLayout';
import FilterSidebar from './statisticsV2/components/FilterSidebar';
import FilterDrawerContent from './statisticsV2/components/FilterDrawerContent';
import MetricCard from './statisticsV2/components/MetricCard';
import ChartsGrid from './statisticsV2/components/ChartsGrid';

const formatCount = (n) => (n || 0).toLocaleString('et-EE');

function StatisticsV2() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filters = useStatisticsFilters();
  const { response, isLoading } = useStatisticsQuery(filters.applied);
  const [layout, layoutActions] = useChartLayout();

  // Memoised so chart panels only re-render on new data, not on every filter click.
  const chartData = useMemo(() => toChartData(response?.distributions), [response]);
  const dataRanges = toDataRanges(response);
  const filtersText = describeFilters(filters.applied, dataRanges);

  if (!response && isLoading) {
    return (
      <Box className="global-page-content-container">
        <Box className="global-page-content-container-inner">
          <Typography variant="body1" className="statistics-no-results">Laadin statistikat...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="global-page-content-container">
      <Box className="global-page-content-container-inner">
        <Box className="responsive-drawer-main-box">

          <FilterSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)}>
            <FilterDrawerContent
              pending={filters.pending}
              sectionOptions={response?.filterOptions || {}}
              dataRanges={dataRanges}
              hasUnappliedChanges={filters.hasUnappliedChanges}
              hasActiveFilters={hasActiveFilters(filters.applied, dataRanges)}
              onToggleFilter={filters.toggleFilter}
              onSetRange={filters.setRange}
              onApply={filters.apply}
              onClearAll={filters.clearAll}
            />
          </FilterSidebar>

          <Box
            component="main"
            sx={{
              flexGrow: 1, p: 3,
              width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
              opacity: isLoading ? 0.6 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            <Button
              variant="contained" className="drawer-toggle-button"
              onClick={() => setMobileOpen(o => !o)}
              sx={{ display: { md: 'none' } }}
            >
              <MenuOpen className="drawer-toggle-icon" />
            </Button>

            <h2 className="tool-title">{t('common_statistics')}</h2>

            <div className="sv2-metrics-row">
              <MetricCard value={formatCount(response?.totalCount)} label="Tekstide arv" />
              <MetricCard value={formatCount(response?.avgWordCount)} label="Keskim. sõnade arv" />
              <MetricCard value={formatCount(response?.avgSentenceCount)} label="Keskim. lausete arv" />
            </div>

            <ChartsGrid
              layout={layout}
              actions={layoutActions}
              chartData={chartData}
              filtersText={filtersText}
            />

            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="small" variant="text" onClick={layoutActions.reset}
                sx={{ textTransform: 'none', color: '#aaa', fontSize: '0.75rem' }}
              >
                Taasta vaikimisi paigutus
              </Button>
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}

export default StatisticsV2;
