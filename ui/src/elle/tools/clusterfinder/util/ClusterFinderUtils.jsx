/** @typedef {import("../../const/ClusterFinderConstants").Option} Option */
/** @typedef {Option & {id: string; parentId: string | null}} EnrichedOption */
/** @typedef {import("@mui/x-tree-view/RichTreeView").RichTreeViewApiRef} RichTreeViewApiRef */

/**
 * Add requestKeys, ids, and parentIds to tree nodes.
 * id format:
 * - `requestKey:requestValue` when requestValue is present
 * - `requestKey` when requestValue is missing
 *
 * @param {Option[]} items
 * @return {EnrichedOption[]}
 */
export const enrichClusterFinderTreeViewItems = (items) => {
  const walkNodes = (nodes = [], parentRequestKey = null, parentId = null) => {
    if (!nodes.length) {
      return [];
    }

    return nodes.map((node) => {
      const requestKey = node.requestKey ?? parentRequestKey;

      if (!requestKey) {
        throw new Error("ClusterFinder tree node is missing requestKey and has no parent requestKey to inherit.");
      }

      const id = node.requestValue
        ? `${requestKey}:${node.requestValue}`
        : requestKey;

      return {
        ...node,
        requestKey,
        children: walkNodes(node.children, requestKey, id),
        id,
        parentId
      };
    });
  }

  return walkNodes(items);
};

/**
 * Get currently visible tree nodes.
 *
 * @param {EnrichedOption[]} items
 * @param {string[]} selectedItems
 * @param {RichTreeViewApiRef} apiRef
 * @return {EnrichedOption[]}
 */
export const getClusterFinderTreeViewDisplayItems = (items, selectedItems, apiRef) => {
  const selectedNodes = selectedItems
    .map((id) => apiRef.current?.getItem(id))
    .filter(Boolean);

  const hasToken = (token) =>
    selectedNodes.some((node) => node.requestKey === token || node.requestValue === token);

  const isVisible = (node) =>
    !node.visibleWhen
    || (!node.visibleWhen.anyOf || node.visibleWhen.anyOf.some(hasToken))
    && (!node.visibleWhen.allOf || node.visibleWhen.allOf.every(hasToken));

  const walkNodes = (nodes = []) =>
    nodes.flatMap((node) => (
      isVisible(node) ? [{...node, children: walkNodes(node.children)}] : []
    ));

  return walkNodes(items);
};
