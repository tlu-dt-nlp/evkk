import { useState } from 'react';
import { EMPTY_FILTERS } from '../constants';
import { isSameFilterState } from '../helpers';

export const useStatisticsFilters = () => {
  const [pending, setPending] = useState(EMPTY_FILTERS);
  const [applied, setApplied] = useState(EMPTY_FILTERS);

  const toggleFilter = (key, value) => setPending(prev => {
    const next = new Set(prev.filters[key]);
    next.has(value) ? next.delete(value) : next.add(value);
    return { ...prev, filters: { ...prev.filters, [key]: next } };
  });

  const setRange = (rangeKey, range) => setPending(prev => ({ ...prev, [rangeKey]: range }));

  const apply = () => setApplied(pending);

  const clearAll = () => {
    setPending(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
  };

  return {
    pending,
    applied,
    hasUnappliedChanges: !isSameFilterState(pending, applied),
    toggleFilter,
    setRange,
    apply,
    clearAll
  };
};
