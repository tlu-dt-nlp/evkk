import { ACCENT_DEEP, FONT } from './constants';

// Prints a single chart from its own off-screen iframe.
//
// An earlier version printed from a div appended to the page and hid everything else
// with print CSS. That can't work reliably here: Bootstrap is loaded globally from a
// CDN and its print stylesheet sets `@page { size: a3 }` and
// `body { min-width: 992px !important }`, which override the sheet's own page setup.
// A separate document inherits none of that.

const FRAME_ID = 'sv2-print-frame';
const FONT_URL = 'https://fonts.googleapis.com/css?family=Mulish';

const STYLES = `
  @page { size: A4 landscape; margin: 0; }
  html, body { margin: 0; padding: 0; }
  body {
    padding: 18mm 20mm;
    box-sizing: border-box;
    font-family: ${FONT}, system-ui, sans-serif;
    color: #333;
  }
  h2 { color: ${ACCENT_DEEP}; font-size: 16pt; font-weight: 700; margin: 0 0 6pt; }
  .sv2-print-filters { font-size: 9pt; color: #666; margin: 0 0 14pt; line-height: 1.4; }
  .sv2-print-filters strong { color: #333; }
  .sv2-print-filters--empty { color: #aaa; }
  svg { width: 100%; height: auto; display: block; }
`;

const escapeHtml = (value) => String(value).replace(/[&<>"]/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// The chart SVG scaled to the printable width. aspect-ratio pins the height, which
// height:auto alone does not do reliably for a viewBox'd SVG.
const svgMarkup = (svg) => {
  const clone = svg.cloneNode(true);
  const width = Number(svg.getAttribute('width')) || svg.clientWidth;
  const height = Number(svg.getAttribute('height')) || svg.clientHeight;

  if (width && height) {
    clone.setAttribute('viewBox', `0 0 ${width} ${height}`);
    clone.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    clone.style.aspectRatio = `${width} / ${height}`;
  }
  clone.removeAttribute('width');
  clone.removeAttribute('height');
  return new XMLSerializer().serializeToString(clone);
};

export const printChart = ({ t, svg, title, filtersText }) => {
  if (!svg) return;

  document.getElementById(FRAME_ID)?.remove();

  const frame = document.createElement('iframe');
  frame.id = FRAME_ID;
  frame.setAttribute('aria-hidden', 'true');
  // Off-screen but at a real size — a zero-sized frame may not lay out its content.
  frame.style.cssText = 'position:fixed;left:-20000px;top:0;width:297mm;height:210mm;border:0;';
  document.body.append(frame);

  const filtersHtml = filtersText
    ? `<p class="sv2-print-filters"><strong>${escapeHtml(t('statistics_print_active_filters'))}</strong> ${escapeHtml(filtersText)}</p>`
    : `<p class="sv2-print-filters sv2-print-filters--empty">${escapeHtml(t('statistics_print_no_filters'))}</p>`;

  const doc = frame.contentDocument;
  doc.open();
  doc.write(
    '<!doctype html><html><head><meta charset="utf-8">'
    + `<link rel="stylesheet" href="${FONT_URL}">`
    + `<style>${STYLES}</style></head><body>`
    + `<h2>${escapeHtml(title)}</h2>${filtersHtml}${svgMarkup(svg)}`
    + '</body></html>'
  );
  doc.close();

  frame.contentWindow.addEventListener('afterprint', () => frame.remove(), { once: true });

  // Two frames so the iframe document has laid out — and the SVG resolved its scaled
  // height — before the print dialog snapshots it.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    frame.contentWindow.focus();
    frame.contentWindow.print();
  }));
};
