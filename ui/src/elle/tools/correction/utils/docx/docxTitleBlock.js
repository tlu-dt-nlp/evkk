import { HeadingLevel, Paragraph, TextRun } from 'docx';
import { FONT, TITLE_SIZE } from './docxConstants';
import { thickDivider } from './docxHelpers';

export const buildTitleBlock = (subTabLabel) => [
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 0, after: 60 },
    children: [new TextRun({ text: subTabLabel, font: FONT, size: TITLE_SIZE, bold: true })]
  }),
  thickDivider()
];
