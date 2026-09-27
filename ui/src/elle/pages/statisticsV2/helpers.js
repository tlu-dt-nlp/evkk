import { CHART_PANELS, FILTER_SECTIONS } from './constants';

export const sortByOrder = (items, order) =>
  [...items].sort((a, b) => {
    const ia = order.indexOf(a), ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

export const toBarData = (counts, order) => {
  const entries = Object.entries(counts);
  const sorted = order
    ? sortByOrder(entries.map(e => e[0]), order).map(k => [k, counts[k]])
    : entries.sort((a, b) => b[1] - a[1]);
  return [['Väärtus', 'Arv'], ...sorted];
};

export const toChartData = (distributions = {}) =>
  Object.fromEntries(CHART_PANELS.map(({ key, order }) => [key, toBarData(distributions[key] || {}, order)]));

export const toDataRanges = (response) => response
  ? { wordCount: response.wordCountRange || [0, 0], sentenceCount: response.sentenceCountRange || [0, 0] }
  : null;

// ── Filter state helpers ─────────────────────────────────────────
// Filter state shape: { filters: { [sectionKey]: Set<string> }, wordCountRange, sentenceCountRange }

export const isRangeNarrowed = (range, dataRange) =>
  !!(range && dataRange && (range[0] > dataRange[0] || range[1] < dataRange[1]));

const sameSet = (a, b) => {
  const sizeA = a?.size || 0, sizeB = b?.size || 0;
  if (sizeA !== sizeB) return false;
  return sizeA === 0 || [...a].every(v => b.has(v));
};

const sameRange = (a, b) => a?.[0] === b?.[0] && a?.[1] === b?.[1];

export const isSameFilterState = (a, b) =>
  FILTER_SECTIONS.every(({ key }) => sameSet(a.filters[key], b.filters[key])) &&
  sameRange(a.wordCountRange, b.wordCountRange) &&
  sameRange(a.sentenceCountRange, b.sentenceCountRange);

export const hasActiveFilters = ({ filters, wordCountRange, sentenceCountRange }, dataRanges) =>
  Object.values(filters).some(s => s?.size > 0) ||
  isRangeNarrowed(wordCountRange, dataRanges?.wordCount) ||
  isRangeNarrowed(sentenceCountRange, dataRanges?.sentenceCount);

export const toRequestPayload = ({ filters, wordCountRange, sentenceCountRange }) => {
  const payload = {};
  FILTER_SECTIONS.forEach(({ key }) => {
    if (filters[key]?.size > 0) payload[key] = [...filters[key]];
  });
  if (wordCountRange) [payload.wordCountMin, payload.wordCountMax] = wordCountRange;
  if (sentenceCountRange) [payload.sentenceCountMin, payload.sentenceCountMax] = sentenceCountRange;
  return payload;
};

export const describeFilters = ({ filters, wordCountRange, sentenceCountRange }, dataRanges) => {
  const parts = FILTER_SECTIONS
    .filter(({ key }) => filters[key]?.size > 0)
    .map(({ key, label }) => `${label}: ${[...filters[key]].join(', ')}`);
  if (isRangeNarrowed(wordCountRange, dataRanges?.wordCount)) {
    parts.push(`Sõnade arv: ${wordCountRange[0]}–${wordCountRange[1]}`);
  }
  if (isRangeNarrowed(sentenceCountRange, dataRanges?.sentenceCount)) {
    parts.push(`Lausete arv: ${sentenceCountRange[0]}–${sentenceCountRange[1]}`);
  }
  return parts.join('   |   ');
};
