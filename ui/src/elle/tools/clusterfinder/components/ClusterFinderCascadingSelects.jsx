import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import LabelWithTooltip from '../../../components/tooltip/LabelWithTooltip';
import { buildColumns, levelOptions, pruneUnreachable } from '../util/ClusterFinderLevels';
import ClusterFinderTreeSelect from './ClusterFinderTreeSelect';

/**
 * The ClusterFinder filter UI.
 *
 * An exclusive choice advances a column. Checkbox groups instead open a checkbox
 * RichTreeView inside a single dropdown, so a branch never spawns a new column.
 */
export default function ClusterFinderCascadingSelects({
  disabled,
  items,
  selectedItems,
  setSelectedItems
}) {
  const { t } = useTranslation();

  const columns = useMemo(() => buildColumns(items, selectedItems), [items, selectedItems]);

  const commitLevel = (level, nextForLevel) => {
    const levelIds = new Set(levelOptions(level).map((option) => option.id));
    const untouched = selectedItems.filter((id) => !levelIds.has(id));

    setSelectedItems(pruneUnreachable(items, [...untouched, ...nextForLevel]));
  };

  const renderSingle = (level) => {
    const label = t(level.labelKey);
    const chosen = level.options.find((option) => selectedItems.includes(option.id));

    return (
      <FormControl disabled={disabled} fullWidth size="small">
        <InputLabel id={`${level.id}-label`}>{label}</InputLabel>

        <Select
          input={<OutlinedInput label={label} />}
          labelId={`${level.id}-label`}
          onChange={(event) => commitLevel(level, [event.target.value])}
          renderValue={(value) =>
            t(level.options.find((option) => option.id === value)?.labelKey ?? '')
          }
          value={chosen?.id ?? ''}
        >
          {/* Menu rows only — the closed field uses renderValue, so the tooltip button
              never ends up sitting in the selected value. */}
          {level.options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              <LabelWithTooltip labelKey={option.labelKey} tooltipKey={option.tooltipKey} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <div className={`filter-columns${disabled ? ' is-disabled' : ''}`}>
      {columns.map((column, depth) => (
        <div className="filter-column" key={depth}>
          {column.map((level) => (
            <div key={level.id}>
              {level.kind === 'single'
                ? renderSingle(level)
                : (
                  <ClusterFinderTreeSelect
                    disabled={disabled}
                    level={level}
                    onChange={(next) => commitLevel(level, next)}
                    selectedItems={selectedItems}
                  />
                )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
