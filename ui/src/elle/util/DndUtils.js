export const toTranslateTransform = (transform) =>
  transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined;
