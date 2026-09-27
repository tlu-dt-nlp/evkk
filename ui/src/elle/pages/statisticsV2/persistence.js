import { DEFAULT_CHART_KEYS } from './constants';

const STORAGE_KEY = 'elle-statistics-v2-config';
const VALID_CHART_KEYS = ['keeletase', 'sugu', 'kodakondsus', 'tekstityyp', 'haridus', 'abivahendid', 'aasta', 'tekstikeel'];
const VALID_CHART_TYPES = ['BarChart', 'ColumnChart', 'PieChart'];

export const DEFAULT_LAYOUT = { activeChartKeys: DEFAULT_CHART_KEYS, wideKeys: [], chartTypes: {}, chartSortAlpha: {} };

const pickValid = (obj, isValidValue) =>
  Object.fromEntries(Object.entries(obj || {}).filter(([k, v]) => VALID_CHART_KEYS.includes(k) && isValidValue(v)));

export const loadLayout = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    const activeChartKeys = (p.activeChartKeys || []).filter(k => VALID_CHART_KEYS.includes(k));
    if (!activeChartKeys.length) return null;
    return {
      activeChartKeys,
      wideKeys: (p.wideKeys || []).filter(k => VALID_CHART_KEYS.includes(k)),
      chartTypes: pickValid(p.chartTypes, v => VALID_CHART_TYPES.includes(v)),
      chartSortAlpha: pickValid(p.chartSortAlpha, v => typeof v === 'boolean')
    };
  } catch {
    return null;
  }
};

export const saveLayout = (layout) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch {
    // localStorage unavailable — layout simply won't persist
  }
};
