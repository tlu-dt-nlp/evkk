import { useTranslation } from "react-i18next";

import TooltipButton from "./TooltipButton";

export default function LabelWithTooltip({ labelKey, tooltipKey }) {
  const { t } = useTranslation();

  const tooltip =
    labelKey || tooltipKey
      ? t(tooltipKey ?? `${labelKey}_tooltip`, { defaultValue: "" })
      : "";

  return (
    <>
      {labelKey && t(labelKey)}
      {tooltip && <TooltipButton>{tooltip}</TooltipButton>}
    </>
  );
}
