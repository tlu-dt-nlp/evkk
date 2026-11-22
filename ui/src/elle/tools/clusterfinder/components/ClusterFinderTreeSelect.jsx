import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Chip, FormControl, InputLabel, OutlinedInput, Popover, Select, Typography } from '@mui/material';
import { useTreeItemModel } from '@mui/x-tree-view/hooks';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LabelWithTooltip from '../../../components/tooltip/LabelWithTooltip';
import { levelOptions, nodeCheckState } from '../util/ClusterFinderLevels';

/** Chips shown before the rest collapse into a '+ veel n' summary. */
const VISIBLE_CHIPS = 2;

/** RichTreeView needs an id on every item; headings do not have one of their own. */
const itemId = (node) => node.id ?? node.key;

/**
 * Adds the tooltip button to a tree row. Declared at module scope: an inline slot would
 * be a new component type on every render and remount each checkbox.
 */
function TreeItemWithTooltip(props) {
  const item = useTreeItemModel(props.itemId);

  return (
    <TreeItem
      {...props}
      label={<LabelWithTooltip labelKey={item?.labelKey} tooltipKey={item?.tooltipKey} />}
    />
  );
}

const treeSlots = { item: TreeItemWithTooltip };

/**
 * A checkbox RichTreeView presented as a dropdown.
 *
 * The tree cannot live in the Select's own menu: Select clones each child as one
 * `role="option"` and closes the menu on any click inside it, so expanding a branch or
 * ticking a box would dismiss the dropdown. A Popover is an unopinionated surface, so the
 * tree goes there and the Select is held permanently closed — kept only for its outlined
 * field, notched label and chip area, which renderValue paints for free.
 *
 * selectionPropagation gives parent/descendant selection and the indeterminate state, so
 * none of that has to be maintained by hand.
 *
 * onChange receives this level's ids only; selectedItems spans the whole filter set.
 */
export default function ClusterFinderTreeSelect({ disabled, level, onChange, selectedItems }) {
  const { t } = useTranslation();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const label = t(level.labelKey);

  /** Every option this level owns, for membership tests and chip labels alike. */
  const optionsById = useMemo(
    () => new Map(levelOptions(level).map((option) => [option.id, option])),
    [level]
  );

  const chosen = useMemo(
    () => selectedItems.filter((id) => optionsById.has(id)),
    [optionsById, selectedItems]
  );

  /** A lone group would only repeat the dropdown's own label, so drop its heading. */
  const roots = useMemo(
    () => (level.tree.length === 1 ? level.tree[0].children : level.tree),
    [level]
  );

  const items = useMemo(() => {
    // `label` is what RichTreeView itself uses; the keys are for the row's own rendering.
    const toItem = (node) => ({
      id: itemId(node),
      label: t(node.labelKey),
      labelKey: node.labelKey,
      tooltipKey: node.tooltipKey,
      children: node.children.length ? node.children.map(toItem) : undefined
    });

    return roots.map(toItem);
  }, [roots, t]);

  /**
   * Headings carry no payload id, so they are re-derived for display each render. Walked
   * from `roots`, not the whole tree: a heading that was dropped above has no item to tick.
   */
  const treeSelection = useMemo(() => {
    const selectedSet = new Set(selectedItems);
    const headings = [];

    const walk = (nodes) => nodes.forEach((node) => {
      if (!node.id && nodeCheckState(node, selectedSet) === 'checked') {
        headings.push(node.key);
      }
      walk(node.children);
    });

    walk(roots);
    return [...chosen, ...headings];
  }, [chosen, roots, selectedItems]);

  const renderValue = () => {
    if (!chosen.length) {
      return null;
    }

    const shown = chosen.slice(0, VISIBLE_CHIPS);
    const hidden = chosen.length - shown.length;

    return (
      <div className="selected-chips">
        {shown.map((id) => (
          <Chip
            className="selected-chip"
            key={id}
            label={t(optionsById.get(id)?.labelKey ?? '')}
            size="small"
          />
        ))}
        {hidden > 0 && (
          <Typography className="selected-chips-overflow" component="span">
            {t('cluster_finder_more_selected', { count: hidden })}
          </Typography>
        )}
      </div>
    );
  };

  return (
    <>
      <FormControl disabled={disabled} fullWidth ref={anchorRef} size="small">
        <InputLabel id={`${level.id}-label`} shrink>{label}</InputLabel>

        <Select
          IconComponent={ArrowDropDownIcon}
          displayEmpty
          input={<OutlinedInput label={label} notched />}
          labelId={`${level.id}-label`}
          multiple
          onOpen={() => setOpen(true)}
          open={false}
          renderValue={renderValue}
          // The tree owns the selection; an empty value keeps MUI from trying to match
          // ids against menu children that are never rendered.
          value={[]}
        />
      </FormControl>

      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={() => setOpen(false)}
        open={open}
        slotProps={{ paper: { className: 'clusterfinder-tree-popover' } }}
      >
        <RichTreeView
          checkboxSelection
          items={items}
          multiSelect
          onSelectedItemsChange={(_, ids) => onChange(ids.filter((id) => optionsById.has(id)))}
          selectedItems={treeSelection}
          selectionPropagation={{ descendants: true, parents: true }}
          slots={treeSlots}
        />
      </Popover>
    </>
  );
}
