import { useState } from 'react';
import {
  Box, Button, Collapse, Divider, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Typography
} from '@mui/material';
import { Check, ExpandLess, ExpandMore } from '@mui/icons-material';
import { FILTER_SECTIONS } from '../constants';
import { isRangeNarrowed } from '../helpers';
import RangeSliderFilter from './RangeSliderFilter';

const RANGE_SLIDERS = [
  { key: 'wordCountRange', dataKey: 'wordCount', label: 'Sõnade arv' },
  { key: 'sentenceCountRange', dataKey: 'sentenceCount', label: 'Lausete arv' }
];

const FilterDrawerContent = ({
  pending, sectionOptions, dataRanges,
  hasUnappliedChanges, hasActiveFilters,
  onToggleFilter, onSetRange, onApply, onClearAll
}) => {
  const [openSections, setOpenSections] = useState(new Set());

  const toggleSection = (key) => setOpenSections(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  return (
    <div>
      <Box className="sv2-drawer-header">
        <Typography variant="overline" display="block" sx={{ color: '#4a148c', lineHeight: 1.5 }}>
          Filtrid
        </Typography>
      </Box>
      <Divider />

      <List dense disablePadding>
        {FILTER_SECTIONS.map(({ key, label }) => {
          const selected = pending.filters[key];
          const count = selected?.size || 0;
          const isOpen = openSections.has(key);
          const options = sectionOptions[key] || [];

          return (
            <div key={key}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => toggleSection(key)}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <span>{label}</span>
                        {count > 0 && <span className="sv2-filter-badge">{count}</span>}
                      </Box>
                    }
                  />
                  {isOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </ListItemButton>
              </ListItem>

              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List dense disablePadding>
                  {options.map(id => {
                    const isSelected = selected?.has(id);
                    return (
                      <ListItemButton
                        key={id} selected={isSelected}
                        onClick={() => onToggleFilter(key, id)}
                        sx={{ pl: 1.5 }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check
                            fontSize="small"
                            sx={{ color: '#9c27b0', opacity: isSelected ? 1 : 0, fontSize: 16, transition: 'opacity 0.15s' }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={id} />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
              <Divider />
            </div>
          );
        })}
      </List>

      {dataRanges && RANGE_SLIDERS.map(({ key, dataKey, label }) => (
        <RangeSliderFilter
          key={key}
          label={label}
          range={dataRanges[dataKey]}
          value={pending[key] ?? dataRanges[dataKey]}
          onChange={range => onSetRange(key, range)}
          onReset={() => onSetRange(key, null)}
          isActive={isRangeNarrowed(pending[key], dataRanges[dataKey])}
          isOpen={openSections.has(dataKey)}
          onToggle={() => toggleSection(dataKey)}
        />
      ))}

      <Box className="sv2-drawer-footer" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Button
          variant="contained" size="small" fullWidth
          onClick={onApply}
          sx={{
            textTransform: 'none', fontWeight: 600, bgcolor: '#9c27b0',
            '&:hover': { bgcolor: '#6a1b9a' },
            outline: hasUnappliedChanges ? '2px solid #ce93d8' : 'none',
            outlineOffset: '2px'
          }}
        >
          {hasUnappliedChanges ? 'Rakenda filtrid ●' : 'Rakenda filtrid'}
        </Button>
        <Button
          variant="text" size="small"
          disabled={!hasActiveFilters && !hasUnappliedChanges}
          onClick={onClearAll}
          sx={{ fontSize: '0.75rem', textTransform: 'none', color: '#9c27b0' }}
        >
          Kustuta kõik filtrid
        </Button>
      </Box>
    </div>
  );
};

export default FilterDrawerContent;
