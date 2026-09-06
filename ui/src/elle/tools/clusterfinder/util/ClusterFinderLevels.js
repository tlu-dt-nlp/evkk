/**
 * Turns the ClusterFinder node tree into a flat, ordered list of dropdown 'levels'.
 *
 * A level is one Select, positioned by its depth — its column.
 *
 *   Single-select levels hold a flat option list. Choosing one opens the next column.
 *
 *   Multi-select levels hold a checkbox tree: the groups that unlocked together become
 *   parent nodes, their options sit under them, and an option that has groups of its
 *   own nests further in the same menu. Checkbox branches therefore never spawn a new
 *   column — only an exclusive choice does.
 *
 * Parent check state is derived from the leaves, never stored, so there is nothing to
 * keep in sync.
 *
 * Everything here is pure: no React, no MUI, no i18n.
 */

const nodeId = (node, payloadKey) =>
  node.payloadValue ? `${payloadKey}:${node.payloadValue}` : payloadKey;

const isVisible = (node, selectedIds) => {
  const { visibleWhen } = node;
  if (!visibleWhen) {
    return true;
  }

  const anyOf = !visibleWhen.anyOf || visibleWhen.anyOf.some((id) => selectedIds.has(id));
  const allOf = !visibleWhen.allOf || visibleWhen.allOf.every((id) => selectedIds.has(id));

  return anyOf && allOf;
};

/** Every id inside a node, including its own when it has one. */
const subtreeIds = (node) => [
  ...(node.id ? [node.id] : []),
  ...node.children.flatMap(subtreeIds)
];

/**
 * RichTreeView drives selection itself; this only re-derives whether a heading — which
 * has no id of its own — should read as ticked. Returns 'checked', 'indeterminate' or
 * 'unchecked'.
 */
export const nodeCheckState = (node, selectedIds) => {
  const ids = subtreeIds(node);
  if (!ids.length) {
    return 'unchecked';
  }

  const hits = ids.filter((id) => selectedIds.has(id)).length;
  if (hits === 0) {
    return 'unchecked';
  }
  return hits === ids.length ? 'checked' : 'indeterminate';
};

/** Every selectable option in a level, flattened. */
export const levelOptions = (level) => {
  if (level.kind === 'single') {
    return level.options;
  }

  const out = [];
  const walk = (nodes) => nodes.forEach((node) => {
    if (node.id) {
      out.push({ id: node.id, labelKey: node.labelKey, tooltipKey: node.tooltipKey });
    }
    walk(node.children);
  });

  walk(level.tree);
  return out;
};

export const buildLevels = (nodes, selectedIdsArray) => {
  const selectedIds = new Set(selectedIdsArray);
  const levels = [];

  /** Collects the selectable groups under some siblings, stepping through headings. */
  const collectSections = (siblings, inheritedKey, labelKey, out) => {
    const visible = (siblings ?? []).filter((node) => isVisible(node, selectedIds));
    const categories = visible.filter((node) => node.isCategory);
    const choices = visible.filter((node) => !node.isCategory);

    if (choices.length) {
      const payloadKey = choices[0].payloadKey ?? inheritedKey;
      out.push({
        id: `${payloadKey}#${out.length}`,
        labelKey,
        payloadKey,
        kind: choices[0].isRadio ? 'single' : 'multi',
        choices
      });
    }

    categories.forEach((category) => {
      collectSections(category.children, category.payloadKey ?? inheritedKey, category.labelKey, out);
    });
  };

  /** A checkbox group becomes a parent node; its options' own groups nest beneath them. */
  const treeFromSections = (sections) => sections.map((section) => ({
    key: section.id,
    labelKey: section.labelKey,
    isGroup: true,
    children: section.choices.map((choice) => {
      const key = choice.payloadKey ?? section.payloadKey;
      const nested = [];
      collectSections(choice.children, key, choice.labelKey, nested);

      return {
        key: nodeId(choice, key),
        id: nodeId(choice, key),
        labelKey: choice.labelKey,
        tooltipKey: choice.tooltipKey,
        isGroup: false,
        children: treeFromSections(nested.filter((entry) => entry.kind === 'multi'))
      };
    })
  }));

  const walk = (siblings, inheritedKey, depth, labelKey, parentId) => {
    const sections = [];
    collectSections(siblings, inheritedKey, labelKey, sections);
    if (!sections.length) {
      return;
    }

    const scope = parentId ?? 'root';
    const multi = sections.filter((section) => section.kind === 'multi');
    const single = sections.filter((section) => section.kind === 'single');

    if (multi.length) {
      levels.push({
        id: `${scope}@${depth}@m`,
        // Several groups in one dropdown are named after the choice that opened them.
        labelKey: multi.length > 1 ? (labelKey ?? multi[0].labelKey) : multi[0].labelKey,
        kind: 'multi',
        depth,
        options: [],
        tree: treeFromSections(multi)
      });
    }

    single.forEach((section, index) => {
      levels.push({
        id: `${scope}@${depth}@s${index}`,
        labelKey: section.labelKey,
        kind: 'single',
        depth,
        tree: [],
        options: section.choices.map((choice) => {
          const key = choice.payloadKey ?? section.payloadKey;
          return {
            id: nodeId(choice, key),
            labelKey: choice.labelKey,
            tooltipKey: choice.tooltipKey
          };
        })
      });

      // Only an exclusive choice opens the next column.
      section.choices.forEach((choice) => {
        const key = choice.payloadKey ?? section.payloadKey;
        const id = nodeId(choice, key);
        if (choice.children?.length && selectedIds.has(id)) {
          walk(choice.children, key, depth + 1, choice.labelKey, id);
        }
      });
    });
  };

  walk(nodes, null, 0, nodes[0]?.labelKey, null);
  return levels;
};

/**
 * The same levels, bucketed into the columns they render in. Depth is assigned here, so
 * the grouping belongs here too rather than being redone by the component.
 */
export const buildColumns = (nodes, selectedIdsArray) => {
  const byDepth = [];

  buildLevels(nodes, selectedIdsArray).forEach((level) => {
    byDepth[level.depth] = byDepth[level.depth] ?? [];
    byDepth[level.depth].push(level);
  });

  // A depth with no levels leaves a hole, which is not a column.
  return byDepth.filter(Boolean);
};

/**
 * Drops selections that are no longer reachable — e.g. everything under a radio option
 * the user just switched away from. Repeats until stable, because removing one level
 * can hide the levels below it.
 */
export const pruneUnreachable = (nodes, selectedIds) => {
  let current = selectedIds;

  for (;;) {
    const reachable = new Set(
      buildLevels(nodes, current).flatMap((level) => levelOptions(level).map((option) => option.id))
    );
    const next = current.filter((id) => reachable.has(id));

    if (next.length === current.length) {
      return current;
    }
    current = next;
  }
};

/**
 * True when a visible checkbox group has nothing chosen, which is what the backend's
 * partialFilters flag means. Checked per group, since each group is one backend
 * parameter.
 *
 * Unreachable branches never produce a level, so the group belonging to an unselected
 * radio cannot be counted here.
 */
export const hasPartialFilters = (nodes, selectedIds) => {
  const selected = new Set(selectedIds);
  let partial = false;

  // `required` is false inside an option the user has not ticked: the backend never
  // reads that group's parameter, so an empty one there is not a partial filter.
  const check = (treeNodes, required) => treeNodes.forEach((node) => {
    if (node.isGroup) {
      const ids = node.children.filter((child) => child.id).map((child) => child.id);
      if (required && ids.length && !ids.some((id) => selected.has(id))) {
        partial = true;
      }
      check(node.children, required);
      return;
    }

    check(node.children, selected.has(node.id));
  });

  buildLevels(nodes, selectedIds)
    .filter((level) => level.kind === 'multi')
    .forEach((level) => check(level.tree, true));

  return partial;
};
