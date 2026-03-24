const generateNodeId = (node, fallbackKey) => {
  const key = node.payloadKey ?? fallbackKey;
  if (!key) {
    throw new Error("ClusterFinder node missing payloadKey");
  }

  return node.payloadValue ? `${key}:${node.payloadValue}` : key;
};

export const enrichClusterFinderTreeViewItems = (items) => {
  const walkNodes = (nodes = [], parentPayloadKey = null, parentId = null) => {
    return nodes.map((node) => {
      const payloadKey = node.payloadKey ?? parentPayloadKey;
      const id = generateNodeId(node, payloadKey);

      return {
        ...node,
        payloadKey,
        children: walkNodes(node.children, payloadKey, id),
        id,
        parentId
      };
    });
  }

  return walkNodes(items);
};

const isNodeVisible = (node, selectedIds) => {
  const {visibleWhen} = node;
  if (!visibleWhen) {
    return true;
  }

  const checkMatch = (id) => selectedIds.has(id);

  const satisfiesAny = !visibleWhen.anyOf || visibleWhen.anyOf.some(checkMatch);
  const satisfiesAll = !visibleWhen.allOf || visibleWhen.allOf.every(checkMatch);

  return satisfiesAny && satisfiesAll;
};

export const getClusterFinderTreeViewDisplayItems = (items, selectedIdsArray) => {
  const selectedIds = new Set(selectedIdsArray);

  const filterNodes = (nodes) =>
    nodes
      .filter(node => isNodeVisible(node, selectedIds))
      .map(node => ({
        ...node,
        children: filterNodes(node.children || [])
      }));

  return filterNodes(items);
};

export const getClusterFinderTreeViewDisplayItemsIdSet = (items) => {
  const ids = new Set();

  const walkNodes = (nodes) => {
    nodes.forEach(node => {
      ids.add(node.id);

      if (node.children) {
        walkNodes(node.children);
      }
    });
  }

  walkNodes(items);
  return ids;
};

export const pruneClusterFinderTreeViewHiddenIds = (ids, visibleIdsSet) => {
  const pruned = ids.filter((id) => visibleIdsSet.has(id));
  return pruned.length === ids.length ? ids : pruned;
};

export const addIdsToArray = (arr, idsToAddSet) =>
  [...new Set([...arr, ...idsToAddSet])];

export const removeIdsFromArray = (arr, idsToRemoveSet) =>
  arr.filter((id) => !idsToRemoveSet.has(id));

export const addIdToArray = (arr, id) =>
  arr.includes(id) ? arr : [...arr, id];

export const removeIdFromArray = (arr, id) =>
  arr.filter((item) => item !== id);
