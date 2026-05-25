export const selectOnFocusIfCoarsePointer = event => {
  if (globalThis.matchMedia?.('(pointer: coarse)').matches) {
    setTimeout(() => event.target.select(), 0);
  }
};
