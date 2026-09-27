import { useEffect, useState } from 'react';
import {
  Box, Button, Collapse, Divider,
  ListItem, ListItemButton, ListItemText,
  Slider, TextField, Typography
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const RangeSliderFilter = ({ label, range, value, onChange, onReset, isActive, isOpen, onToggle }) => {
  const [inputMin, setInputMin] = useState(String(value[0]));
  const [inputMax, setInputMax] = useState(String(value[1]));

  useEffect(() => { setInputMin(String(value[0])); }, [value[0]]);
  useEffect(() => { setInputMax(String(value[1])); }, [value[1]]);

  const commitMin = () => {
    const num = parseInt(inputMin, 10);
    if (!isNaN(num)) onChange([Math.max(range[0], Math.min(num, value[1])), value[1]]);
    else setInputMin(String(value[0]));
  };

  const commitMax = () => {
    const num = parseInt(inputMax, 10);
    if (!isNaN(num)) onChange([value[0], Math.min(range[1], Math.max(num, value[0]))]);
    else setInputMax(String(value[1]));
  };

  const inputSx = {
    width: 72,
    '& input': { fontSize: '0.72rem', p: '3px 6px', textAlign: 'center' },
    '& .MuiOutlinedInput-root': { borderRadius: 1 }
  };

  return (
    <div>
      <ListItem disablePadding>
        <ListItemButton onClick={onToggle}>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <span>{label}</span>
                {isActive && <span className="sv2-filter-badge">1</span>}
              </Box>
            }
          />
          {isOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
        </ListItemButton>
      </ListItem>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Box sx={{ px: 2.5, pt: 1, pb: 2, overflowX: 'hidden' }}>
          <Slider
            value={value}
            min={range[0]}
            max={range[1]}
            onChange={(_, newVal) => onChange(newVal)}
            valueLabelDisplay="auto"
            size="small"
            sx={{ color: '#9c27b0', mx: 0.5, width: 'calc(100% - 12px)' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5, gap: 1 }}>
            <TextField
              value={inputMin}
              onChange={e => setInputMin(e.target.value)}
              onBlur={commitMin}
              onKeyDown={e => e.key === 'Enter' && commitMin()}
              size="small" type="number"
              inputProps={{ min: range[0], max: range[1] }}
              sx={inputSx}
            />
            <Typography variant="caption" color="text.secondary">–</Typography>
            <TextField
              value={inputMax}
              onChange={e => setInputMax(e.target.value)}
              onBlur={commitMax}
              onKeyDown={e => e.key === 'Enter' && commitMax()}
              size="small" type="number"
              inputProps={{ min: range[0], max: range[1] }}
              sx={inputSx}
            />
          </Box>
          {isActive && (
            <Button
              size="small" variant="text" onClick={onReset}
              sx={{ mt: 0.5, fontSize: '0.7rem', textTransform: 'none', color: '#9c27b0', p: 0, minWidth: 0 }}
            >
              Lahtesta
            </Button>
          )}
        </Box>
      </Collapse>
      <Divider />
    </div>
  );
};

export default RangeSliderFilter;

