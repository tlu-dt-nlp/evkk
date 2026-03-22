import { useRichTreeViewApiRef } from "@mui/x-tree-view/hooks";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { enrichClusterFinderTreeViewItems, getClusterFinderTreeViewDisplayItems } from "../util/ClusterFinderUtils";
import ClusterFinderTreeItem from "./ClusterFinderTreeItem";

/** @typedef {import("../../const/ClusterFinderConstants").Option} Option */
/** @typedef {import("react").Dispatch<import("react").SetStateAction<string[]>>} SetStringArrayState */
/** @typedef {import("../util/ClusterFinderUtils").EnrichedOption} EnrichedOption */
/** @typedef {import("@mui/x-tree-view/models").TreeViewDefaultItemModelProperties} TreeViewDefaultItemModelProperties */
/** @typedef {TreeViewDefaultItemModelProperties & EnrichedOption} EnrichedTreeItem */

/* eslint-disable react/prop-types -- PropTypes dependency is not present */
/**
 * ClusterFinder RichTreeView component
 * @param {boolean} disabled - Whether the tree view is disabled
 * @param {Option[]} items - Tree nodes
 * @param {string[]} selectedItems - Selected items
 * @param {SetStringArrayState} setSelectedItems - Set selected items
 * @return {React.JSX.Element}
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
      getClusterFinderTreeViewDisplayItems(enrichedItems, selectedItems, apiRef),
    [enrichedItems, selectedItems, apiRef]
  );
  const displayItemsIds = useMemo(() => {
    /**
     * @param {EnrichedOption[]} nodes
     * @return {string[]}
     */
    const collectIds = (nodes = []) =>
      nodes.flatMap((node) => [node.id, ...collectIds(node.children)]);

    return new Set(collectIds(displayItems));
  }, [displayItems]);

  useEffect(() => {
    if (disabled) {
      setExpandedItems([]);
      setSelectedItems([]);
      return;
    }

    setSelectedItems([]);

    const rootId = enrichedItems[0]?.id;
    if (rootId) {
      setExpandedItems([rootId]);
    }
  }, [disabled, setSelectedItems, enrichedItems]);

  useEffect(() => {
    const prune = (prev) => {
      const next = prev.filter((id) => displayItemsIds.has(id));
      return next.length === prev.length ? prev : next;
    };

    setSelectedItems(prune);
    setExpandedItems(prune);
  }, [displayItemsIds, setSelectedItems]);

  /**
   * @param {string} id
   * @return {EnrichedTreeItem}
   */
  const getItem = (id) => apiRef.current.getItem(id);

  /**
   * @param {string} id
   * @return {string[]}
   */
  const getChildIds = (id) => apiRef.current.getItemOrderedChildrenIds(id);

  /**
   * @param {string} id
   * @return {string[]}
   */
  const getDescendantIds = (id) => getChildIds(id).flatMap((childId) => [childId, ...getDescendantIds(childId)]);

  /**
   * @param {EnrichedTreeItem} node
   * @return {boolean}
   */
  const isSelectableCheckbox = (node) => node && !node.isHeader && !node.isRadio;

  /**
   * @param {string[]} arr
   * @param {string} id
   * @return {string[]}
   */
  const addIfMissing = (arr, id) => (arr.includes(id) ? arr : [...arr, id]);

  /**
   * @param {string[]} ids
   * @param {string} fromItemId
   * @return {string[]}
   */
  const syncParentCheckboxes = (ids, fromItemId) => {
    let next = ids;
    let parentId = getItem(fromItemId)?.parentId;

    while (parentId) {
      const parent = getItem(parentId);

      if (isSelectableCheckbox(parent)) {
        const selectableLeafDescendantIds = getDescendantIds(parentId).filter((id) => {
          const node = getItem(id);
          return isSelectableCheckbox(node) && !node.children?.length;
        });

        const allSelected = selectableLeafDescendantIds.length
          && selectableLeafDescendantIds.every((id) => next.includes(id));

        next = allSelected ? addIfMissing(next, parentId) : next.filter((id) => id !== parentId);
      }

      parentId = parent?.parentId;
    }

    return next;
  };

  const handleItemClick = (_, itemId) => {
    const item = getItem(itemId);
    if (!item || item.isHeader) {
      return;
    }

    const siblings = item.parentId ? getChildIds(item.parentId) : [];

    if (item.isRadio) {
      const siblingRadios = siblings.filter((id) => id !== itemId && getItem(id).isRadio);
      const idsToRemove = new Set(siblingRadios.flatMap((id) => [id, ...getDescendantIds(id)]));

      setSelectedItems((prev) => addIfMissing(prev.filter((id) => !idsToRemove.has(id)), itemId));
      setExpandedItems((prev) => addIfMissing(prev.filter((id) => !idsToRemove.has(id)), itemId));
      return;
    }

    const hasChildCheckboxes = getDescendantIds(itemId).some((id) => {
      const node = getItem(id);
      return isSelectableCheckbox(node);
    });

    if (hasChildCheckboxes) {
      setExpandedItems((prev) => {
        const isExpanded = prev.includes(itemId);
        const isChecked = selectedItems.includes(itemId);

        return !isExpanded && !isChecked ? [...prev, itemId] : prev;
      });
      return;
    }

    setSelectedItems((prev) => {
      const next = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];

      return syncParentCheckboxes(next, itemId);
    });

    setExpandedItems((prev) =>
      !prev.includes(itemId) && !selectedItems.includes(itemId) ? [...prev, itemId] : prev
    );
  };

  const handleItemSelectionToggle = (_, itemId, isSelected) => {
    const item = getItem(itemId);
    if (!item || !isSelectableCheckbox(item) || !item.children?.length) {
      return;
    }

    const descendantCheckboxIds = getDescendantIds(itemId).filter((id) => isSelectableCheckbox(getItem(id)));
    const idsToToggle = [itemId, ...descendantCheckboxIds];

    setSelectedItems((prev) => {
      const toggled = isSelected
        ? Array.from(new Set([...prev, ...idsToToggle]))
        : prev.filter((id) => !idsToToggle.includes(id));

      return syncParentCheckboxes(toggled, itemId);
    });
  };

  const handleItemExpansionToggle = (_, itemId, isExpanded) => {
    setExpandedItems((prev) =>
      isExpanded ? addIfMissing(prev, itemId) : prev.filter((id) => id !== itemId)
    );
  };

  return (
    <RichTreeView
      apiRef={apiRef}
      checkboxSelection
      expandedItems={expandedItems}
      getItemLabel={(item) => t(item.translationKey)}
      isItemSelectionDisabled={(item) => item.isHeader}
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
