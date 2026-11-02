import {
  AlignmentType,
  BorderStyle,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType
} from 'docx';
import { DARK_GRAY, FONT, HEADING_SIZE, LABEL_SIZE, LIGHT_GRAY, MID_GRAY, PURPLE, WHITE } from './docxConstants';

export const hexColor = (hex) => hex.replace('#', '').toUpperCase();

const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

export const thickDivider = () =>
  new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PURPLE } },
    spacing: { before: 80, after: 160 }
  });

export const thinDivider = () =>
  new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: MID_GRAY } },
    spacing: { before: 40, after: 80 }
  });

export const spacer = (after = 120) => new Paragraph({ spacing: { after } });

export const sectionHeading = (text) =>
  new Paragraph({
    spacing: { before: 160, after: 80 },
    children: [
      new TextRun({ text, font: FONT, size: HEADING_SIZE, bold: true, color: DARK_GRAY })
    ]
  });

export const statTable = (rows) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: noBorder, bottom: noBorder, left: noBorder, right: noBorder,
      insideH: { style: BorderStyle.SINGLE, size: 1, color: MID_GRAY },
      insideV: noBorder
    },
    rows: rows.map(([label, value], i) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            shading: i % 2 === 0 ? { type: ShadingType.SOLID, color: LIGHT_GRAY, fill: LIGHT_GRAY } : undefined,
            borders: noBorders,
            children: [
              new Paragraph({
                spacing: { before: 60, after: 60 },
                children: [new TextRun({ text: label, font: FONT, size: LABEL_SIZE, bold: true })]
              })
            ]
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: i % 2 === 0 ? { type: ShadingType.SOLID, color: LIGHT_GRAY, fill: LIGHT_GRAY } : undefined,
            borders: noBorders,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 60, after: 60 },
                children: [new TextRun({ text: String(value ?? '—'), font: FONT, size: LABEL_SIZE })]
              })
            ]
          })
        ]
      })
    )
  });
