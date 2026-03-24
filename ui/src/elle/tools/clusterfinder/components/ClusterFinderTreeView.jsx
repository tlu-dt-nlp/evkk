import { useRichTreeViewApiRef } from "@mui/x-tree-view/hooks";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  addIdsToArray,
  addIdToArray,
  enrichClusterFinderTreeViewItems,
  getClusterFinderTreeViewDisplayItems,
  getClusterFinderTreeViewDisplayItemsIdSet,
  pruneClusterFinderTreeViewHiddenIds,
  removeIdFromArray,
  removeIdsFromArray
} from "../util/ClusterFinderUtils";
import ClusterFinderTreeItem from "./ClusterFinderTreeItem";

/** @typedef {import("../../const/ClusterFinderConstants").ClusterFinderTreeNode} ClusterFinderTreeNode */
/** @typedef {import("react").Dispatch<import("react").SetStateAction<string[]>>} SetStringArrayState */
/** @typedef {import("@mui/x-tree-view/models").TreeViewDefaultItemModelProperties} TreeViewDefaultItemModelProperties */
/** @typedef {import("../util/ClusterFinderUtils").EnrichedClusterFinderTreeNode} EnrichedClusterFinderTreeNode */
/** @typedef {TreeViewDefaultItemModelProperties & EnrichedClusterFinderTreeNode} EnrichedTreeItem */

/* eslint-disable react/prop-types -- PropTypes dependency is not present */
/**
 * @param {boolean} disabled
 * @param {ClusterFinderTreeNode[]} items
 * @param {string[]} selectedItems
 * @param {SetStringArrayState} setSelectedItems
 */
export default function ClusterFinderTreeView({
  disabled,
  items,
  selectedItems,
  setSelectedItems
}) {
  const {t} = useTranslation();
  const apiRef = useRichTreeViewApiRef();

  const [expandedItems, setExpandedItems] = useState([]);

  const enrichedItems = useMemo(() =>
      enrichClusterFinderTreeViewItems(items),
    [items]
  );
  const displayItems = useMemo(() =>
      getClusterFinderTreeViewDisplayItems(enrichedItems, selectedItems),
    [enrichedItems, selectedItems]
  );
  const displayItemsIds = useMemo(() =>
      getClusterFinderTreeViewDisplayItemsIdSet(displayItems),
    [displayItems]
  );

  useEffect(() => {
    if (disabled) {
      setExpandedItems([]);
      setSelectedItems([]);
    }
  }, [disabled]);

  useEffect(() => {
    if (disabled) {
      return;
    }

    const resetToDefault = () => {
      setSelectedItems([]);

      const rootId = enrichedItems[0]?.id;
      setExpandedItems(rootId ? [rootId] : []);
    }

    resetToDefault();
  }, [disabled, enrichedItems]);

  useEffect(() => {
    setSelectedItems(prev => pruneClusterFinderTreeViewHiddenIds(prev, displayItemsIds));
    setExpandedItems(prev => pruneClusterFinderTreeViewHiddenIds(prev, displayItemsIds));
  }, [displayItemsIds]);

  /**
   * @param {string} id
   * @return {string[]}
   */
  const getChildIds = (id) => apiRef.current.getItemOrderedChildrenIds(id);

  const getDescendantIds = (id) => getChildIds(id).flatMap((childId) => [childId, ...getDescendantIds(childId)]);

  const getFullSubtrees = (ids) => {
    return new Set(ids.flatMap((id) => [id, ...getDescendantIds(id)]));
  };

  /**
   * @param {string} id
   * @return {EnrichedTreeItem}
   */
  const getItem = (id) => apiRef.current.getItem(id);

  const getIdsToClearForRadioGroup = (itemId) => {
    const item = getItem(itemId);
    const siblingIds = item.parentId ? getChildIds(item.parentId) : [];

    const siblingRadioIds = siblingIds.filter((id) => id !== itemId && getItem(id).isRadio);
    return getFullSubtrees(siblingRadioIds);
  };

  const handleRadioClick = (itemId) => {
    const idsToClear = getIdsToClearForRadioGroup(itemId);

    setSelectedItems((prev) => {
      const cleared = removeIdsFromArray(prev, idsToClear);
      return addIdToArray(cleared, itemId);
    });

    setExpandedItems((prev) => {
      const cleared = removeIdsFromArray(prev, idsToClear);
      return addIdToArray(cleared, itemId);
    });
  };

  const isSelectableCheckbox = (node) => node && !node.isCategory && !node.isRadio;

  const hasChildCheckboxes = (itemId) => {
    return getDescendantIds(itemId).some((id) => isSelectableCheckbox(getItem(id)));
  };

  const handleGroupCheckboxClick = (itemId) => {
    setExpandedItems((prev) => {
      const isExpanded = prev.includes(itemId);
      const isChecked = selectedItems.includes(itemId);
      return (!isExpanded && !isChecked) ? [...prev, itemId] : prev;
    });
  };

  const shouldParentBeSelected = (parentId, selectedIds) => {
    const leafIds = getDescendantIds(parentId).filter((id) => {
      const node = getItem(id);
      return isSelectableCheckbox(node) && !node.children?.length;
    })

    return leafIds.length > 0 && leafIds.every((id) => selectedIds.includes(id));
  };

  const syncParentCheckboxes = (initialIds, fromItemId) => {
    let updatedIds = initialIds;
    let currentParentId = getItem(fromItemId)?.parentId;

    while (currentParentId) {
      const parent = getItem(currentParentId);

      if (isSelectableCheckbox(parent)) {
        const allChildrenSelected = shouldParentBeSelected(currentParentId, updatedIds);

        updatedIds = allChildrenSelected
          ? addIdToArray(updatedIds, currentParentId)
          : removeIdFromArray(updatedIds, currentParentId);
      }

      currentParentId = parent?.parentId;
    }

    return updatedIds;
  };

  const handleLeafCheckboxClick = (itemId) => {
    const isCurrentlySelected = selectedItems.includes(itemId);

    setSelectedItems((prev) => {
      const next = isCurrentlySelected ? removeIdFromArray(prev, itemId) : addIdToArray(prev, itemId);
      return syncParentCheckboxes(next, itemId);
    })

    if (!isCurrentlySelected) {
      setExpandedItems((prev) => addIdToArray(prev, itemId));
    }
  };

  const handleItemClick = (_, itemId) => {
    const item = getItem(itemId);

    if (!item || item.isCategory) {
      return;
    }

    if (item.isRadio) {
      handleRadioClick(itemId);
      return;
    }

    if (hasChildCheckboxes(itemId)) {
      handleGroupCheckboxClick(itemId);
      return;
    }

    handleLeafCheckboxClick(itemId);
  };

  const handleItemExpansionToggle = (_, itemId, isExpanded) => {
    setExpandedItems((prev) =>
      isExpanded ? addIdToArray(prev, itemId) : removeIdFromArray(prev, itemId)
    );
  };

  const getChildCheckboxIds = (itemId) => {
    return getDescendantIds(itemId).filter((id) => isSelectableCheckbox(getItem(id)));
  };

  const handleItemSelectionToggle = (_, itemId, isSelected) => {
    const item = getItem(itemId);

    if (!item || !isSelectableCheckbox(item) || !item.children?.length) {
      return;
    }

    const descendantCheckboxIds = getChildCheckboxIds(itemId);
    const idsToToggle = new Set([itemId, ...descendantCheckboxIds]);

    setSelectedItems((prev) => {
      const next = isSelected
        ? addIdsToArray(prev, idsToToggle)
        : removeIdsFromArray(prev, idsToToggle);

      return syncParentCheckboxes(next, itemId);
    })
  };

  return (
    <RichTreeView
      apiRef={apiRef}
      checkboxSelection
      expandedItems={expandedItems}
      getItemLabel={(item) => t(item.labelKey)}
      isItemSelectionDisabled={(item) => item.isCategory}
      itemChildrenIndentation={24}
      items={displayItems}
      multiSelect
      onItemClick={handleItemClick}
      onItemExpansionToggle={handleItemExpansionToggle}
      onItemSelectionToggle={handleItemSelectionToggle}
      selectedItems={selectedItems}
      slots={{item: ClusterFinderTreeItem}}
      sx={{
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
        "& .MuiTreeItem-content": {
          paddingLeft: "calc(var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))"
        }
      }}
    />
  );
};
