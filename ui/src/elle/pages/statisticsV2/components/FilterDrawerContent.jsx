import { useState } from 'react';
import {
  Box, Button, Collapse, Divider, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Typography
} from '@mui/material';
import { Check, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { FIELDS } from '../constants';
import { isRangeNarrowed } from '../helpers';
import { translateValue } from '../labels';
import RangeSliderFilter from './RangeSliderFilter';

const RANGE_SLIDERS = [
  { key: 'wordCountRange', dataKey: 'wordCount', labelKey: 'statistics_field_word_count' },
  { key: 'sentenceCountRange', dataKey: 'sentenceCount', labelKey: 'statistics_field_sentence_count' }
];

const FilterDrawerContent = ({
  pending, sectionOptions, dataRanges,
  hasUnappliedChanges, hasActiveFilters,
  onToggleFilter, onSetRange, onApply, onClearAll
}) => {
  const { t } = useTranslation();
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
          {t('statistics_filters')}
        </Typography>
      </Box>
      <Divider />

      <List dense disablePadding>
        {FIELDS.map(({ key, labelKey }) => {
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
                        <span>{t(labelKey)}</span>
                        {count > 0 && <span className="sv2-filter-badge">{count}</span>}
                      </Box>
                    }
                  />
                  {isOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </ListItemButton>
              </ListItem>

              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List dense disablePadding className="sv2-filter-options">
                  {options.map(value => {
                    const isSelected = selected?.has(value);
                    return (
                      <ListItemButton
                        key={value} selected={isSelected}
                        onClick={() => onToggleFilter(key, value)}
                        sx={{ pl: 1.5 }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check
                            fontSize="small"
                            sx={{ color: '#9c27b0', opacity: isSelected ? 1 : 0, fontSize: 16, transition: 'opacity 0.15s' }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={translateValue(t, key, value)} />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
              <Divider />
            </div>
          );
        })}
        {/* Inside the same List so the range sections inherit its dense typography */}
        {dataRanges && RANGE_SLIDERS.map(({ key, dataKey, labelKey }) => (
          <RangeSliderFilter
            key={key}
            label={t(labelKey)}
            range={dataRanges[dataKey]}
            value={pending[key] ?? dataRanges[dataKey]}
            onChange={range => onSetRange(key, range)}
            onReset={() => onSetRange(key, null)}
            isActive={isRangeNarrowed(pending[key], dataRanges[dataKey])}
            isOpen={openSections.has(dataKey)}
            onToggle={() => toggleSection(dataKey)}
          />
        ))}
      </List>

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
          {hasUnappliedChanges ? `${t('statistics_apply_filters')} ●` : t('statistics_apply_filters')}
        </Button>
        <Button
          variant="text" size="small"
          disabled={!hasActiveFilters && !hasUnappliedChanges}
          onClick={onClearAll}
          sx={{ fontSize: '0.75rem', textTransform: 'none', color: '#9c27b0' }}
        >
          {t('statistics_clear_filters')}
        </Button>
      </Box>
    </div>
  );
};

export default FilterDrawerContent;
