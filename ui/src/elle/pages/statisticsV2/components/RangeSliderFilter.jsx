import { useState } from 'react';
import {
  Box, Button, Collapse, Divider,
  ListItem, ListItemButton, ListItemText,
  Slider, TextField, Typography
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const RangeSliderFilter = ({ label, range, value, onChange, onReset, isActive, isOpen, onToggle }) => {
  const { t } = useTranslation();

  const [draft, setDraft] = useState({ min: String(value[0]), max: String(value[1]), from: value });

  if (draft.from !== value) {
    setDraft({ min: String(value[0]), max: String(value[1]), from: value });
  }

  const commitMin = () => {
    const num = parseInt(draft.min, 10);
    if (!isNaN(num)) onChange([Math.max(range[0], Math.min(num, value[1])), value[1]]);
    else setDraft(prev => ({ ...prev, min: String(value[0]) }));
  };

  const commitMax = () => {
    const num = parseInt(draft.max, 10);
    if (!isNaN(num)) onChange([value[0], Math.min(range[1], Math.max(num, value[0]))]);
    else setDraft(prev => ({ ...prev, max: String(value[1]) }));
  };

  return (
    <div>
      <ListItem disablePadding>
        <ListItemButton onClick={onToggle}>
          <ListItemText
            primary={
              <Box className="sv2-filter-section-label">
                <span>{label}</span>
                {isActive && <span className="sv2-filter-badge">1</span>}
              </Box>
            }
          />
          {isOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
        </ListItemButton>
      </ListItem>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Box className="sv2-range-body">
          <Slider
            className="sv2-range-slider"
            value={value}
            min={range[0]}
            max={range[1]}
            onChange={(_, newVal) => onChange(newVal)}
            valueLabelDisplay="auto"
            size="small"
          />
          <Box className="sv2-range-inputs">
            <TextField
              className="sv2-range-input"
              value={draft.min}
              onChange={e => setDraft(prev => ({ ...prev, min: e.target.value }))}
              onBlur={commitMin}
              onKeyDown={e => e.key === 'Enter' && commitMin()}
              size="small" type="number"
              inputProps={{ min: range[0], max: range[1] }}
            />
            <Typography variant="caption" color="text.secondary">–</Typography>
            <TextField
              className="sv2-range-input"
              value={draft.max}
              onChange={e => setDraft(prev => ({ ...prev, max: e.target.value }))}
              onBlur={commitMax}
              onKeyDown={e => e.key === 'Enter' && commitMax()}
              size="small" type="number"
              inputProps={{ min: range[0], max: range[1] }}
            />
          </Box>
          {isActive && (
            <Button size="small" variant="text" className="sv2-range-reset" onClick={onReset}>
              {t('statistics_reset_range')}
            </Button>
          )}
        </Box>
      </Collapse>
      <Divider />
    </div>
  );
};

export default RangeSliderFilter;
