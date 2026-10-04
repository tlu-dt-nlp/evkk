import { CHART_TYPES, FIELD_KEYS } from './constants';

const STORAGE_KEY = 'elle-statistics-v2-config';

export const BASE_LAYOUT = { wideKeys: [], chartTypes: {}, chartSortAlpha: {} };

const pickValid = (obj, isValidValue) =>
  Object.fromEntries(Object.entries(obj || {}).filter(([k, v]) => FIELD_KEYS.includes(k) && isValidValue(v)));

export const loadLayout = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    const activeChartKeys = (p.activeChartKeys || []).filter(k => FIELD_KEYS.includes(k));
    if (!activeChartKeys.length) return null;
    return {
      activeChartKeys,
      wideKeys: (p.wideKeys || []).filter(k => FIELD_KEYS.includes(k)),
      chartTypes: pickValid(p.chartTypes, v => CHART_TYPES.includes(v)),
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

export const clearLayout = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nothing to clear
  }
};
