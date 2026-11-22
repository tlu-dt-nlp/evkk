import { Document, Packer } from 'docx';
import { saveAs } from 'file-saver';
import { tabValueMap, ToggleButtonCategories } from '../constants/tabConfig';
import { BODY_SIZE, FONT } from './docx/docxConstants';
import { spacer } from './docx/docxHelpers';
import { buildTitleBlock } from './docx/docxTitleBlock';
import {
  buildComplexityHeader,
  buildCorrectorHeader,
  buildTextLevelHeader,
  buildVocabularyHeader
} from './docx/docxHeaders';
import { buildDocBody } from './docx/docxBody';

const headerBuilders = {
  [tabValueMap.CORRECTOR]: (subTab, errorResponse, t) => buildCorrectorHeader(subTab, errorResponse, t),
  [tabValueMap.PROFICIENCY_LEVEL]: (_, errorResponse, t) => buildTextLevelHeader(errorResponse, t),
  [tabValueMap.COMPLEXITY]: (_, errorResponse, t) => buildComplexityHeader(errorResponse, t),
  [tabValueMap.VOCABULARY]: (_, errorResponse, t) => buildVocabularyHeader(errorResponse, t)
};

const tabLabels = {
  [tabValueMap.CORRECTOR]: 'corrector_proofreading',
  [tabValueMap.PROFICIENCY_LEVEL]: 'corrector_proficiency_level',
  [tabValueMap.COMPLEXITY]: 'corrector_complexity',
  [tabValueMap.VOCABULARY]: 'corrector_vocabulary'
};

const pageProperties = { page: { margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } };

export const downloadAsDocx = (editor, mainTab, subTabs, activeSubTab, errorResponse, t, includeHeader = true) => {
  if (!editor) return;

  const orderedSubTabs = (ToggleButtonCategories[mainTab] ?? [])
    .map(({ value }) => value)
    .filter((value) => subTabs.includes(value));
  if (orderedSubTabs.length === 0) return;

  const hasSummaryPerView = mainTab === tabValueMap.CORRECTOR;

  const sections = orderedSubTabs.map((subTab, index) => {
    const withHeader = includeHeader && (hasSummaryPerView || index === 0);
    const headerParagraphs = withHeader ? (headerBuilders[mainTab]?.(subTab, errorResponse, t) ?? []) : [];
    const titleBlock = buildTitleBlock(getSubTabLabel(subTab, t));
    const bodyParagraphs = buildDocBody(errorResponse, subTab, subTab === activeSubTab ? editor : null);

    return {
      properties: pageProperties,
      children: [...titleBlock, ...headerParagraphs, spacer(160), ...bodyParagraphs]
    };
  });

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: FONT, size: BODY_SIZE } }
      }
    },
    sections
  });

  const fileLabel = orderedSubTabs.length === 1
    ? getSubTabLabel(orderedSubTabs[0], t)
    : t(tabLabels[mainTab] ?? mainTab);
  const filename = `${fileLabel}_${formatTimestamp()}.docx`;

  Packer.toBlob(doc).then((blob) => saveAs(blob, filename));
};

const formatTimestamp = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
};

const getSubTabLabel = (subTab, t) => {
  const textMap = Object.values(ToggleButtonCategories).flat().reduce((acc, { value, text }) => ({
    ...acc,
    [value]: text
  }), {});
  return t(textMap[subTab] ?? subTab);
};
