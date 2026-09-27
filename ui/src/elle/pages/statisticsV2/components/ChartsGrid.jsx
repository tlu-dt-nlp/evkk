import { useState } from 'react';
import { Divider, Menu, MenuItem, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { CHART_PANELS } from '../constants';
import ChartPanel from './ChartPanel';

// Column (0 or 1) each chart lands in, given that wide charts take both columns.
const computeColumns = (activeChartKeys, wideKeys) => {
  const columns = {};
  let pos = 0;
  activeChartKeys.forEach(k => {
    columns[k] = pos % 2;
    pos += wideKeys.includes(k) ? 2 : 1;
  });
  return { columns, nextIsSecondInRow: pos % 2 === 1 };
};

const ChartsGrid = ({ layout, chartData, filtersText, actions }) => {
  const { activeChartKeys, wideKeys, chartTypes, chartSortAlpha } = layout;
  const [addMenuAnchor, setAddMenuAnchor] = useState(null);
  const closeAddMenu = () => setAddMenuAnchor(null);

  const { columns, nextIsSecondInRow } = computeColumns(activeChartKeys, wideKeys);
  const lastExpandableKey = [...activeChartKeys].reverse().find(k => !wideKeys.includes(k) && columns[k] === 0);
  const inactivePanels = CHART_PANELS.filter(p => !activeChartKeys.includes(p.key));

  return (
    <div className="sv2-charts-grid">
      {activeChartKeys.map(key => {
        const panel = CHART_PANELS.find(p => p.key === key);
        if (!panel) return null;
        const isWide = wideKeys.includes(key);
        const isLeftCol = columns[key] === 0;

        return (
          <div key={key} style={isWide ? { gridColumn: '1 / -1' } : undefined}>
            <ChartPanel
              title={panel.title}
              data={chartData[key]}
              filtersText={filtersText}
              isWide={isWide}
              chartType={chartTypes[key] || 'BarChart'}
              onChartTypeChange={val => actions.setChartType(key, val)}
              sortAlpha={chartSortAlpha[key] || false}
              onSortAlphaChange={val => actions.setSortAlpha(key, val)}
              onToggleWide={isLeftCol ? () => actions.toggleWide(key) : undefined}
              onRemove={() => actions.removeChart(key)}
            />
          </div>
        );
      })}

      {inactivePanels.length > 0 && (
        <>
          <button className="sv2-add-chart-slot" onClick={e => setAddMenuAnchor(e.currentTarget)}>
            <Add sx={{ fontSize: 32, mb: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Lisa diagramm</Typography>
          </button>
          <Menu anchorEl={addMenuAnchor} open={Boolean(addMenuAnchor)} onClose={closeAddMenu}>
            {inactivePanels.map(p => (
              <MenuItem key={p.key} onClick={() => { actions.addChart(p.key); closeAddMenu(); }}>
                {p.title}
              </MenuItem>
            ))}
            {nextIsSecondInRow && lastExpandableKey && [
              <Divider key="divider" />,
              <MenuItem
                key="leave-empty"
                onClick={() => { actions.expandChart(lastExpandableKey); closeAddMenu(); }}
                sx={{ color: '#9c27b0', fontStyle: 'italic' }}
              >
                Jäta tühjaks (laienda eelmist)
              </MenuItem>
            ]}
          </Menu>
        </>
      )}
    </div>
  );
};

export default ChartsGrid;
