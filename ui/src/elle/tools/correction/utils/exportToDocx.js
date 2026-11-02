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

export const downloadAsDocx = (editor, mainTab, subTab, errorResponse, t, includeHeader = true) => {
  if (!editor) return;

  const headerParagraphs = includeHeader ? (headerBuilders[mainTab]?.(subTab, errorResponse, t) ?? []) : [];
  const subTabLabel = getSubTabLabel(subTab, t);
  const titleBlock = buildTitleBlock(subTabLabel);
  const bodyParagraphs = buildDocBody(errorResponse, subTab, editor);

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: FONT, size: BODY_SIZE } }
      }
    },
    sections: [
      {
        properties: { page: { margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } },
        children: [...titleBlock, ...headerParagraphs, spacer(160), ...bodyParagraphs]
      }
    ]
  });

  const filename = `${subTabLabel}_${formatTimestamp()}.docx`;

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
