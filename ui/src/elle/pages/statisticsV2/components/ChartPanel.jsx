import { useMemo, useState } from 'react';
import { Chart } from 'react-google-charts';
import { Box, Dialog, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CHART_OPTS_MAP, FONT } from '../constants';
import { printChart } from '../printChart';
import { downloadSvgAsImage } from '../../../util/ImageDownloadUtils';
import { useElementSize } from '../hooks/useElementSize';
import ChartToolbar from './ChartToolbar';

const PANEL_CHART_HEIGHT = 240;

const sortRowsAlphabetically = (data) => {
  const [header, ...rows] = data;
  return [header, ...[...rows].sort((a, b) => String(a[0]).localeCompare(String(b[0]), 'et'))];
};

// Google Charts' <text> inherits the page font; a serialised copy has no page to
// inherit from, so the font is pinned on the clone before it is rasterised.
const toStandaloneSvg = (svg) => {
  const clone = svg.cloneNode(true);
  clone.style.fontFamily = `${FONT}, sans-serif`;
  clone.setAttribute('width', svg.getAttribute('width') || svg.clientWidth);
  clone.setAttribute('height', svg.getAttribute('height') || svg.clientHeight);
  return clone;
};

// Drawn at the measured pixel size of its container rather than at "100%", so the
// chart fills the panel and the fullscreen dialog in both dimensions and redraws
// whenever that box changes.
const ChartView = ({ containerRef, size, data, chartType, fill, emptyLabel }) => (
  <div
    ref={containerRef}
    style={{ height: fill ? '100%' : PANEL_CHART_HEIGHT, minHeight: 0, overflow: 'hidden' }}
  >
    {data.length > 1
      ? size.width > 0 && size.height > 0 && (
          <Chart
            chartType={chartType}
            width={`${Math.round(size.width)}px`}
            height={`${Math.round(size.height)}px`}
            data={data}
            options={CHART_OPTS_MAP[chartType]}
            loader={<Typography variant="body2" color="text.secondary">...</Typography>}
          />
        )
      : <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>{emptyLabel}</Typography>}
  </div>
);

const ChartPanel = ({
  title, data, filtersText, isWide, onToggleWide, onRemove,
  chartType, onChartTypeChange, sortAlpha, onSortAlphaChange
}) => {
  const { t } = useTranslation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [panelRef, panelSize, panelNode] = useElementSize();
  const [fullscreenRef, fullscreenSize, fullscreenNode] = useElementSize();

  // Memoised: react-google-charts redraws whenever it receives a new data reference.
  const displayData = useMemo(
    () => (sortAlpha && data.length > 1 ? sortRowsAlphabetically(data) : data),
    [data, sortAlpha]
  );

  const svgOf = (nodeRef) => nodeRef.current?.querySelector('svg');

  const print = (nodeRef) => () =>
    printChart({ t, svg: svgOf(nodeRef), title, filtersText });

  const download = (nodeRef) => () => {
    const svg = svgOf(nodeRef);
    if (svg) downloadSvgAsImage(toStandaloneSvg(svg), `${title}.png`);
  };

  const toolbarProps = { title, chartType, onChartTypeChange, sortAlpha, onSortAlphaChange };
  const emptyLabel = t('statistics_no_data');

  return (
    <>
      <Paper elevation={0} className="sv2-chart-panel">
        <ChartToolbar
          {...toolbarProps}
          isWide={isWide}
          onToggleWide={onToggleWide}
          onFullscreen={() => setIsFullscreen(true)}
          onPrint={print(panelNode)}
          onDownload={download(panelNode)}
          onClose={onRemove}
          closeTitleKey="statistics_remove_chart"
        />
        <ChartView
          containerRef={panelRef} size={panelSize} data={displayData}
          chartType={chartType} emptyLabel={emptyLabel}
        />
      </Paper>

      <Dialog fullScreen open={isFullscreen} onClose={() => setIsFullscreen(false)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
          <ChartToolbar
            {...toolbarProps}
            onPrint={print(fullscreenNode)}
            onDownload={download(fullscreenNode)}
            onClose={() => setIsFullscreen(false)}
            closeTitleKey="statistics_close"
            inlineClose
          />
          {/* minHeight:0 lets this flex item shrink, giving the chart a definite height to fill */}
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            <ChartView
              containerRef={fullscreenRef} size={fullscreenSize} data={displayData}
              chartType={chartType} fill emptyLabel={emptyLabel}
            />
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default ChartPanel;
