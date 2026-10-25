import { useMemo, useState } from 'react';
import { Chart } from 'react-google-charts';
import { Box, Dialog, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CHART_OPTS_MAP, FONT } from '../constants';
import { printChart } from '../printChart';
import { downloadSvgAsImage } from '../../../util/ImageDownloadUtils';
import { useElementSize } from '../hooks/useElementSize';
import ChartToolbar from './ChartToolbar';

const sortRowsAlphabetically = (data) => {
  const [header, ...rows] = data;
  return [header, ...[...rows].sort((a, b) => String(a[0]).localeCompare(String(b[0]), 'et'))];
};

const toStandaloneSvg = (svg) => {
  const clone = svg.cloneNode(true);
  clone.style.fontFamily = `${FONT}, sans-serif`;
  clone.setAttribute('width', svg.getAttribute('width') || svg.clientWidth);
  clone.setAttribute('height', svg.getAttribute('height') || svg.clientHeight);
  return clone;
};

const ChartView = ({ containerRef, size, data, chartType, fill, emptyLabel }) => {
  // The wrapper below always renders, whatever the content turns out to be: it carries
  // the ref the ResizeObserver measures, and nothing can be drawn until it has a size.
  const content = () => {
    if (data.length <= 1) {
      return <Typography variant="body2" color="text.secondary" className="sv2-chart-empty">{emptyLabel}</Typography>;
    }

    if (size.width <= 0 || size.height <= 0) {
      return null;
    }

    return (
      <Chart
        chartType={chartType}
        width={`${Math.round(size.width)}px`}
        height={`${Math.round(size.height)}px`}
        data={data}
        options={CHART_OPTS_MAP[chartType]}
        loader={<Typography variant="body2" color="text.secondary">...</Typography>}
      />
    );
  };

  return (
    <div ref={containerRef} className={`sv2-chart-box${fill ? ' sv2-chart-box--fill' : ''}`}>
      {content()}
    </div>
  );
};

const ChartPanel = ({
                      title, data, filtersText, isWide, onToggleWide, onRemove,
                      chartType, onChartTypeChange, sortAlpha, onSortAlphaChange
                    }) => {
  const { t } = useTranslation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [panelRef, panelSize, panelNode] = useElementSize();
  const [fullscreenRef, fullscreenSize, fullscreenNode] = useElementSize();

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

      <Dialog
        className="statistics-app"
        fullScreen
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      >
        <Box className="sv2-fullscreen-body">
          <ChartToolbar
            {...toolbarProps}
            onPrint={print(fullscreenNode)}
            onDownload={download(fullscreenNode)}
            onClose={() => setIsFullscreen(false)}
            closeTitleKey="statistics_close"
            inlineClose
          />
          <Box className="sv2-fullscreen-chart">
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
