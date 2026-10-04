import { BarChart, PieChart, StackedBarChart } from '@mui/icons-material';

export const DRAWER_WIDTH = 270;
export const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const FONT = 'Mulish';

// Subcorpus id of "K2 riiklikud eksamitööd" (query_subcorpus_L2_proficiency_examinations).
export const EXAM_CORPUS_ID = 'clWmOIrLa';

// Every metadata field the page can filter and chart by, in sidebar order.
// `order` fixes the value order in charts; without it values are sorted by count.
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

// Citizenship is only recorded for the state exam corpus, so it is the meaningful
// origin field only when that corpus is selected on its own. Any other or mixed
// selection gets the native language chart instead.
export const originChartKey = (korpusFilter) =>
  korpusFilter?.size === 1 && korpusFilter.has(EXAM_CORPUS_ID) ? 'kodakondsus' : 'emakeel';

export const defaultChartKeys = (korpusFilter) =>
  ['keeletase', 'sugu', originChartKey(korpusFilter), 'tekstityyp'];

export const EMPTY_FILTERS = { filters: {}, wordCountRange: null, sentenceCountRange: null };

// ── Chart options ────────────────────────────────────────────────

export const BAR_OPTS = {
  legend: { position: 'none' },
  colors: ['#9c27b0'],
  chartArea: { width: '58%', height: '82%' },
  hAxis: { minValue: 0, textStyle: { fontSize: 11 } },
  vAxis: { textStyle: { fontSize: 11 } },
  fontName: FONT,
  bar: { groupWidth: '68%' }
};

export const COL_OPTS = {
  legend: { position: 'none' },
  colors: ['#9c27b0'],
  chartArea: { width: '82%', height: '68%' },
  vAxis: { minValue: 0, textStyle: { fontSize: 11 } },
  hAxis: { textStyle: { fontSize: 11 }, slantedText: true, slantedTextAngle: 30 },
  fontName: FONT,
  bar: { groupWidth: '68%' }
};

export const PIE_OPTS = {
  chartArea: { width: '90%', height: '82%' },
  colors: ['#9c27b0', '#ce93d8', '#ab47bc', '#7b1fa2', '#e1bee7', '#6a0080', '#ba68c8', '#f3e5f5', '#4a148c', '#ea80fc'],
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
