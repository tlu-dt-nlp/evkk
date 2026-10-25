export const selectOnFocusIfCoarsePointer = event => {
  if (globalThis.matchMedia?.('(pointer: coarse)').matches) {
    setTimeout(() => event.target.select(), 0);
  }
};

export const isSelectOptionReselected = (event, currentValue) => {
  const clickedValue = event.target.closest?.('[data-value]')?.dataset.value;
  return clickedValue !== undefined && clickedValue !== '' && clickedValue === String(currentValue);
};
