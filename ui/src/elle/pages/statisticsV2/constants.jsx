import { BarChart, PieChart, StackedBarChart } from '@mui/icons-material';

export const DRAWER_WIDTH = 270;
export const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const FONT = 'Mulish';

export const FILTER_SECTIONS = [
  { key: 'keeletase', label: 'Keeletase', order: LEVEL_ORDER },
  { key: 'sugu', label: 'Sugu' },
  { key: 'kodakondsus', label: 'Rahvus' },
  { key: 'haridus', label: 'Haridus' },
  { key: 'tekstityyp', label: 'Teksti liik' },
  { key: 'abivahendid', label: 'Abivahendid' },
  { key: 'aasta', label: 'Aasta' }
];

export const CHART_PANELS = [
  { key: 'keeletase', title: 'Keeletase', order: LEVEL_ORDER },
  { key: 'sugu', title: 'Sugu' },
  { key: 'kodakondsus', title: 'Rahvus' },
  { key: 'tekstityyp', title: 'Teksti liik' },
  { key: 'haridus', title: 'Haridus' },
  { key: 'abivahendid', title: 'Abivahendid' },
  { key: 'aasta', title: 'Aasta' },
  { key: 'tekstikeel', title: 'Tekstikeel' }
];

export const DEFAULT_CHART_KEYS = ['keeletase', 'sugu', 'kodakondsus', 'tekstityyp'];

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
  { type: 'BarChart', icon: <StackedBarChart fontSize="small" />, title: 'Horisontaalne tulpdiagramm' },
  { type: 'ColumnChart', icon: <BarChart fontSize="small" />, title: 'Vertikaalne tulpdiagramm' },
  { type: 'PieChart', icon: <PieChart fontSize="small" />, title: 'Sektordiagramm' }
];

export const CHART_OPTS_MAP = {
  BarChart: BAR_OPTS,
  ColumnChart: COL_OPTS,
  PieChart: PIE_OPTS
};

