import { useState } from 'react';
import { defaultChartKeys } from '../constants';
import { BASE_LAYOUT, clearLayout, loadLayout, saveLayout } from '../persistence';

const without = (keys, key) => keys.filter(k => k !== key);
const withKey = (keys, key) => (keys.includes(key) ? keys : [...keys, key]);

// Which charts are shown, which span both columns, and per-chart type/sort.
//
// Until the user changes something there is no stored layout, and the visible charts
// follow the subcorpus selection — kodakondsus for the state exam corpus alone,
// emakeel otherwise. The first change freezes the layout into localStorage and the
// subcorpus selection stops moving it; "restore default layout" hands control back.
export const useChartLayout = (korpusFilter) => {
  const [stored, setStored] = useState(loadLayout);

  const layout = stored ?? { ...BASE_LAYOUT, activeChartKeys: defaultChartKeys(korpusFilter) };

  const patch = (fn) => {
    const next = { ...layout, ...fn(layout) };
    saveLayout(next);
    setStored(next);
  };

  const actions = {
    addCharts: keys => patch(p => ({ activeChartKeys: keys.reduce(withKey, p.activeChartKeys) })),
    removeChart: key => patch(p => ({
      activeChartKeys: without(p.activeChartKeys, key),
      wideKeys: without(p.wideKeys, key)
    })),
    toggleWide: key => patch(p => ({
      wideKeys: p.wideKeys.includes(key) ? without(p.wideKeys, key) : [...p.wideKeys, key]
    })),
    expandChart: key => patch(p => ({ wideKeys: withKey(p.wideKeys, key) })),
    setChartType: (key, type) => patch(p => ({ chartTypes: { ...p.chartTypes, [key]: type } })),
    setSortAlpha: (key, sortAlpha) => patch(p => ({ chartSortAlpha: { ...p.chartSortAlpha, [key]: sortAlpha } })),
    reset: () => {
      clearLayout();
      setStored(null);
    }
  };

  return [layout, actions, stored !== null];
};
