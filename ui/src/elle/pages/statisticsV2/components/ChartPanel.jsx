import { useMemo, useRef, useState } from 'react';
import { Chart } from 'react-google-charts';
import { Box, Dialog, Paper, Typography } from '@mui/material';
import { CHART_OPTS_MAP } from '../constants';
import { printChart } from '../printChart';
import ChartToolbar from './ChartToolbar';

const sortRowsAlphabetically = (data) => {
  const [header, ...rows] = data;
  return [header, ...[...rows].sort((a, b) => String(a[0]).localeCompare(String(b[0]), 'et'))];
};

// The ref lands on the wrapper so the rendered SVG can be found for printing.
const ChartView = ({ ref, data, chartType, height, remountKey }) => (
  <div ref={ref}>
    {data.length > 1
      ? <Chart
          key={remountKey}
          chartType={chartType}
          width="100%"
          height={height}
          data={data}
          options={CHART_OPTS_MAP[chartType]}
          loader={<Typography variant="body2" color="text.secondary">Laadin...</Typography>}
        />
      : <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>Andmed puuduvad</Typography>}
  </div>
);

const ChartPanel = ({
  title, data, filtersText, isWide, onToggleWide, onRemove,
  chartType, onChartTypeChange, sortAlpha, onSortAlphaChange
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const panelChartRef = useRef(null);
  const fullscreenChartRef = useRef(null);

  // Memoised: react-google-charts redraws whenever it receives a new data reference.
  const displayData = useMemo(
    () => (sortAlpha && data.length > 1 ? sortRowsAlphabetically(data) : data),
    [data, sortAlpha]
  );

  const print = (containerRef) => () =>
    printChart({ svg: containerRef.current?.querySelector('svg'), title, filtersText });

  const toolbarProps = { title, chartType, onChartTypeChange, sortAlpha, onSortAlphaChange };

  return (
    <>
      <Paper elevation={0} className="sv2-chart-panel">
        <ChartToolbar
          {...toolbarProps}
          isWide={isWide}
          onToggleWide={onToggleWide}
          onFullscreen={() => setIsFullscreen(true)}
          onPrint={print(panelChartRef)}
          onClose={onRemove}
          closeTitle="Eemalda diagramm"
        />
        {/* Remount on width toggle: Google Charts draws at a fixed pixel width and only redraws on window resize */}
        <ChartView ref={panelChartRef} data={displayData} chartType={chartType} height="240px" remountKey={isWide} />
      </Paper>

      <Dialog fullScreen open={isFullscreen} onClose={() => setIsFullscreen(false)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
          <ChartToolbar
            {...toolbarProps}
            onPrint={print(fullscreenChartRef)}
            onClose={() => setIsFullscreen(false)}
            closeTitle="Sulge"
          />
          <Box sx={{ flexGrow: 1 }}>
            <ChartView ref={fullscreenChartRef} data={displayData} chartType={chartType} height="100%" />
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default ChartPanel;
