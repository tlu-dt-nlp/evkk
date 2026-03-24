import { Checkbox, Radio } from "@mui/material";
import { useTreeItemModel } from "@mui/x-tree-view/hooks";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useTranslation } from "react-i18next";

import TooltipButton from "../../../components/tooltip/TooltipButton";

/** @typedef {import("@mui/x-tree-view/TreeItem").TreeItemProps} TreeItemProps */
/** @typedef {import("@mui/x-tree-view/models").TreeViewDefaultItemModelProperties} TreeViewDefaultItemModelProperties */
/** @typedef {import("../util/ClusterFinderUtils").EnrichedClusterFinderTreeNode} EnrichedClusterFinderTreeNode */
/** @typedef {TreeViewDefaultItemModelProperties & EnrichedClusterFinderTreeNode} EnrichedTreeItem */

/* eslint-disable react/prop-types -- PropTypes dependency is not present */
/**
 * @param {TreeItemProps} props
 */
export default function ClusterFinderTreeItem(props) {
  const {t, i18n} = useTranslation();

  /** @type {EnrichedTreeItem | null} */
  const item = useTreeItemModel(props.itemId);
  const tooltipKey = item.tooltipKey ?? `${item?.labelKey}_tooltip`;
  const showTooltip = i18n.exists(tooltipKey);

  return (
    <TreeItem
      {...props}
      label={
        item && (
          <>
            {t(item.labelKey)}
            {showTooltip && <TooltipButton>{t(tooltipKey)}</TooltipButton>}
          </>
        )
      }
      slotProps={{
        content: {
          sx: item?.isCategory && item?.parentId ? {ml: 2} : undefined
        }
      }}
      slots={{
        checkbox: (slotProps) => {
          if (item?.isCategory) {
            return null;
          }

          return item?.isRadio
            ? <Radio {...slotProps} sx={{p: 0}} />
            : <Checkbox {...slotProps} sx={{p: 0}} />;
        }
      }}
    />
  );
};
