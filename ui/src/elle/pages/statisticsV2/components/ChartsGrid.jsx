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
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState([]);

  const { columns, nextIsSecondInRow } = computeColumns(activeChartKeys, wideKeys);
  const lastExpandableKey = [...activeChartKeys].reverse().find(k => !wideKeys.includes(k) && columns[k] === 0);
  const inactiveFields = FIELDS.filter(f => !activeChartKeys.includes(f.key));

  const openAddDialog = () => {
    setCheckedKeys([]);
    setIsAddOpen(true);
  };

  const toggleChecked = (key) => setCheckedKeys(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const confirmAdd = () => {
    actions.addCharts(checkedKeys);
    setIsAddOpen(false);
  };

  const expandPrevious = () => {
    actions.expandChart(lastExpandableKey);
    setIsAddOpen(false);
  };

  return (
    <div className="sv2-charts-grid">
      {activeChartKeys.map(key => {
        const field = getField(key);
        if (!field) return null;
        const isWide = wideKeys.includes(key);
        const isLeftCol = columns[key] === 0;

        return (
          <div key={key} style={isWide ? { gridColumn: '1 / -1' } : undefined}>
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
          <button className="sv2-add-chart-slot" onClick={openAddDialog}>
            <Add sx={{ fontSize: 32, mb: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{t('statistics_add_chart')}</Typography>
          </button>

          <Dialog open={isAddOpen} onClose={() => setIsAddOpen(false)} fullWidth maxWidth="xs">
            <DialogTitle sx={{ pb: 0 }}>{t('statistics_add_charts_title')}</DialogTitle>
            <DialogContent sx={{ pt: 0 }}>
              <List dense disablePadding>
                {inactiveFields.map(({ key, labelKey }) => (
                  <ListItemButton key={key} onClick={() => toggleChecked(key)} sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Checkbox
                        edge="start" disableRipple tabIndex={-1}
                        checked={checkedKeys.includes(key)}
                        sx={{ color: '#9c27b0', '&.Mui-checked': { color: '#9c27b0' } }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={t(labelKey)} />
                  </ListItemButton>
                ))}
              </List>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
              {nextIsSecondInRow && lastExpandableKey ? (
                <Button
                  size="small" variant="text" onClick={expandPrevious}
                  sx={{ textTransform: 'none', color: '#9c27b0', fontStyle: 'italic' }}
                >
                  {t('statistics_expand_previous')}
                </Button>
              ) : <span />}
              <Button
                variant="contained" size="small"
                disabled={checkedKeys.length === 0}
                onClick={confirmAdd}
                sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#9c27b0', '&:hover': { bgcolor: '#6a1b9a' } }}
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
