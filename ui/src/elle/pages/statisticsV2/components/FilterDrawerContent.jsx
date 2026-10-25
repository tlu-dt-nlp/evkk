import {
  Box, Button, Checkbox, Collapse, Divider, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Typography
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
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
  openSections, onToggleSection,
  hasUnappliedChanges, hasActiveFilters,
  onToggleFilter, onSetRange, onApply, onClearAll
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <Box className="sv2-drawer-header">
        <Typography variant="overline" className="sv2-drawer-title">
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
                <ListItemButton onClick={() => onToggleSection(key)}>
                  <ListItemText
                    primary={
                      <Box className="sv2-filter-section-label">
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
                  {options.map(value => (
                    <ListItemButton
                      key={value}
                      className="sv2-filter-option"
                      onClick={() => onToggleFilter(key, value)}
                    >
                      <ListItemIcon className="sv2-filter-option-icon">
                        <Checkbox
                          edge="start" disableRipple tabIndex={-1} size="small"
                          className="sv2-filter-checkbox"
                          checked={Boolean(selected?.has(value))}
                        />
                      </ListItemIcon>
                      <ListItemText primary={translateValue(t, key, value)} />
                    </ListItemButton>
                  ))}
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
            onToggle={() => onToggleSection(dataKey)}
          />
        ))}
      </List>

      <Box className="sv2-drawer-footer">
        <Button
          variant="contained" size="small" fullWidth
          className={`sv2-accent-button${hasUnappliedChanges ? ' sv2-accent-button--pending' : ''}`}
          onClick={onApply}
        >
          {hasUnappliedChanges ? `${t('statistics_apply_filters')} ●` : t('statistics_apply_filters')}
        </Button>
        <Button
          variant="text" size="small"
          className="sv2-text-button"
          disabled={!hasActiveFilters && !hasUnappliedChanges}
          onClick={onClearAll}
        >
          {t('statistics_clear_filters')}
        </Button>
      </Box>
    </div>
  );
};

export default FilterDrawerContent;
