import { BarChart, PieChart, StackedBarChart } from '@mui/icons-material';

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const FONT = 'Mulish';

const EXAM_CORPUS_ID = 'clWmOIrLa';

export const FIELDS = [
  { key: 'korpus', labelKey: 'query_subcorpus' },
  { key: 'keeletase', labelKey: 'statistics_field_keeletase', order: LEVEL_ORDER },
  { key: 'sugu', labelKey: 'query_author_data_gender' },
  { key: 'kodakondsus', labelKey: 'query_author_data_nationality' },
  { key: 'emakeel', labelKey: 'query_author_data_native_language' },
  { key: 'haridus', labelKey: 'query_author_data_education' },
  { key: 'tekstityyp', labelKey: 'statistics_field_tekstityyp' },
  { key: 'abivahendid', labelKey: 'statistics_field_abivahendid' },
  { key: 'aasta', labelKey: 'statistics_field_aasta' },
  { key: 'tekstikeel', labelKey: 'statistics_field_tekstikeel' }
];

export const FIELD_KEYS = FIELDS.map(f => f.key);

export const getField = (key) => FIELDS.find(f => f.key === key);

const originChartKey = (korpusFilter) =>
  korpusFilter?.size === 1 && korpusFilter.has(EXAM_CORPUS_ID) ? 'kodakondsus' : 'emakeel';

export const defaultChartKeys = (korpusFilter) =>
  ['keeletase', 'sugu', originChartKey(korpusFilter), 'tekstityyp'];

export const EMPTY_FILTERS = { filters: {}, wordCountRange: null, sentenceCountRange: null };

// ── Chart options ────────────────────────────────────────────────

const ACCENT = '#9c27b0';
export const ACCENT_DEEP = '#4a148c';

const PIE_COLORS = [
  ACCENT, '#ce93d8', '#ab47bc', '#7b1fa2', '#e1bee7',
  '#6a0080', '#ba68c8', '#f3e5f5', ACCENT_DEEP, '#ea80fc'
];

const BAR_OPTS = {
  legend: { position: 'none' },
  colors: [ACCENT],
  chartArea: { width: '58%', height: '82%' },
  hAxis: { minValue: 0, textStyle: { fontSize: 11 } },
  vAxis: { textStyle: { fontSize: 11 } },
  fontName: FONT,
  bar: { groupWidth: '68%' }
};

const COL_OPTS = {
  legend: { position: 'none' },
  colors: [ACCENT],
  chartArea: { width: '82%', height: '68%' },
  vAxis: { minValue: 0, textStyle: { fontSize: 11 } },
  hAxis: { textStyle: { fontSize: 11 }, slantedText: true, slantedTextAngle: 30 },
  fontName: FONT,
  bar: { groupWidth: '68%' }
};

const PIE_OPTS = {
  chartArea: { width: '90%', height: '82%' },
  colors: PIE_COLORS,
  pieHole: 0.4,
  pieSliceTextStyle: { fontSize: 11 },
  legend: { position: 'right', textStyle: { fontSize: 11 } },
  fontName: FONT
};

export const CHART_TYPE_OPTIONS = [
  { type: 'BarChart', icon: <StackedBarChart fontSize="small" />, titleKey: 'statistics_chart_type_bar' },
  { type: 'ColumnChart', icon: <BarChart fontSize="small" />, titleKey: 'statistics_chart_type_column' },
  { type: 'PieChart', icon: <PieChart fontSize="small" />, titleKey: 'statistics_chart_type_pie' }
];

export const CHART_TYPES = CHART_TYPE_OPTIONS.map(o => o.type);

export const CHART_OPTS_MAP = {
  BarChart: BAR_OPTS,
  ColumnChart: COL_OPTS,
  PieChart: PIE_OPTS
};
