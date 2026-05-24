import { AlignmentType, Paragraph, ShadingType, TextRun, UnderlineType } from 'docx';
import { BODY_SIZE, FONT } from './docxConstants';
import { hexColor } from './docxHelpers';
import { errorTypes } from '../../../correction/const/TabValuesConstant';
import { GRAMMARCHECKER, SPELLCHECKER } from '../../../correction/const/Constants';
import { correctorDocxColors } from '../../../../const/StyleConstants';

const paragraphProps = { alignment: AlignmentType.BOTH, spacing: { line: 320, after: 80 } };

const toRuns = (runs) => runs.length > 0 ? runs : [new TextRun({ text: '' })];

const buildBodyFromTokens = (tokens) => {
  if (!tokens) return [];
  const paragraphRuns = [[]];

  for (const token of tokens) {
    if (token.type === 'paragraphBreak') {
      paragraphRuns.push([]);
    } else if (token.type === 'lineBreak') {
      paragraphRuns.at(-1).push(new TextRun({ text: '', break: 1 }));
    } else if (token.corrected) {
      const color = hexColor(errorTypes[token.correction_type]?.color || '#EEEEEE');
      paragraphRuns.at(-1).push(new TextRun({
        text: token.text, font: FONT, size: BODY_SIZE,
        shading: { type: ShadingType.SOLID, color, fill: color },
        underline: { type: UnderlineType.SINGLE, color }
      }));
    } else {
      paragraphRuns.at(-1).push(new TextRun({ text: token.text, font: FONT, size: BODY_SIZE }));
    }
  }

  return paragraphRuns.map((runs) => new Paragraph({ ...paragraphProps, children: toRuns(runs) }));
};

const buildBodyFromHtml = (htmlString) => {
  const container = document.createElement('div');

  return htmlString.split('\n').map((line) => {
    container.innerHTML = line;
    const runs = [];

    container.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent) runs.push(new TextRun({ text: node.textContent, font: FONT, size: BODY_SIZE }));
      } else if (node.nodeName === 'SPAN') {
        const color = correctorDocxColors[node.className];
        runs.push(color
          ? new TextRun({ text: node.textContent, font: FONT, size: BODY_SIZE, shading: { type: ShadingType.SOLID, color, fill: color }, underline: { type: UnderlineType.SINGLE, color } })
          : new TextRun({ text: node.textContent, font: FONT, size: BODY_SIZE })
        );
      }
    });

    return new Paragraph({ ...paragraphProps, children: toRuns(runs) });
  });
};

const buildBodyFromEditor = (editor) => {
  const paragraphs = [];
  let currentRuns = [];

  const flushParagraph = () => {
    paragraphs.push(new Paragraph({ ...paragraphProps, children: toRuns(currentRuns) }));
    currentRuns = [];
  };

  editor.state.doc.forEach((node) => {
    if (node.type.name === 'paragraph') {
      node.forEach((inline) => {
        if (inline.type.name === 'hardBreak') {
          currentRuns.push(new TextRun({ text: '', break: 1 }));
          return;
        }
        if (inline.type.name !== 'text') return;

        const mark = inline.marks.find((m) => m.type.name === 'reactComponent');
        if (mark) {
          const color = hexColor(errorTypes[mark.attrs.errorType]?.color || '#EEEEEE');
          currentRuns.push(new TextRun({
            text: inline.text, font: FONT, size: BODY_SIZE,
            shading: { type: ShadingType.SOLID, color, fill: color },
            underline: { type: UnderlineType.SINGLE, color }
          }));
        } else {
          currentRuns.push(new TextRun({ text: inline.text, font: FONT, size: BODY_SIZE }));
        }
      });
      flushParagraph();
    }
  });

  return paragraphs;
};

export const buildDocBody = (errorResponse, subTab, editor) => {
  if (subTab === SPELLCHECKER) return buildBodyFromTokens(errorResponse?.speller);
  if (subTab === GRAMMARCHECKER) return buildBodyFromTokens(errorResponse?.grammatika);
  const html = errorResponse?.margitudLaused?.[subTab];
  if (html) return buildBodyFromHtml(html);
  return buildBodyFromEditor(editor);
};
