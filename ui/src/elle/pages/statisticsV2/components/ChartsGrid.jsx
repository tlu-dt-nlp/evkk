import { useState } from 'react';
import {
  Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
  List, ListItemButton, ListItemIcon, ListItemText, Typography
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { FIELDS, getField } from '../constants';
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
  const { t } = useTranslation();
  const { activeChartKeys, wideKeys, chartTypes, chartSortAlpha } = layout;
  const [checkedKeys, setCheckedKeys] = useState(null);

  const { columns, nextIsSecondInRow } = computeColumns(activeChartKeys, wideKeys);
  const lastExpandableKey = [...activeChartKeys].reverse().find(k => !wideKeys.includes(k) && columns[k] === 0);
  const inactiveFields = FIELDS.filter(f => !activeChartKeys.includes(f.key));

  const closeAddDialog = () => setCheckedKeys(null);

  const toggleChecked = (key) => setCheckedKeys(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const confirmAdd = () => {
    actions.addCharts(checkedKeys);
    closeAddDialog();
  };

  const expandPrevious = () => {
    actions.expandChart(lastExpandableKey);
    closeAddDialog();
  };

  return (
    <div className="sv2-charts-grid">
      {activeChartKeys.map(key => {
        const field = getField(key);
        if (!field) return null;
        const isWide = wideKeys.includes(key);
        const isLeftCol = columns[key] === 0;

        return (
          <div key={key} className={`sv2-chart-cell${isWide ? ' sv2-chart-cell--wide' : ''}`}>
            <ChartPanel
              title={t(field.labelKey)}
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

      {inactiveFields.length > 0 && (
        <>
          <button className="sv2-add-chart-slot" onClick={() => setCheckedKeys([])}>
            <Add className="sv2-add-chart-icon" />
            <Typography variant="body2" className="sv2-add-chart-label">{t('statistics_add_chart')}</Typography>
          </button>

          {/* Portalled out of the page, so it carries the page scope class itself */}
          <Dialog
            className="statistics-app"
            open={checkedKeys !== null}
            onClose={closeAddDialog}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle className="sv2-dialog-title">{t('statistics_add_charts_title')}</DialogTitle>
            <DialogContent className="sv2-dialog-content">
              <List dense disablePadding>
                {inactiveFields.map(({ key, labelKey }) => (
                  <ListItemButton key={key} onClick={() => toggleChecked(key)} className="sv2-filter-option">
                    <ListItemIcon className="sv2-filter-option-icon">
                      <Checkbox
                        edge="start" disableRipple tabIndex={-1} size="small"
                        className="sv2-filter-checkbox"
                        checked={checkedKeys?.includes(key) || false}
                      />
                    </ListItemIcon>
                    <ListItemText primary={t(labelKey)} />
                  </ListItemButton>
                ))}
              </List>
            </DialogContent>
            <DialogActions className="sv2-dialog-actions">
              {nextIsSecondInRow && lastExpandableKey ? (
                <Button
                  size="small" variant="text"
                  className="sv2-expand-previous-button"
                  onClick={expandPrevious}
                >
                  {t('statistics_expand_previous')}
                </Button>
              ) : <span />}
              <Button
                variant="contained" size="small"
                className="sv2-accent-button"
                disabled={!checkedKeys?.length}
                onClick={confirmAdd}
              >
                {t('statistics_add_charts_button')}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ChartsGrid;
