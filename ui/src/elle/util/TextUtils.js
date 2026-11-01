export const sanitizeTexts = (text) => {
  return text.replaceAll(String.raw`\n\n`, ' ').replaceAll(String.raw`\n`, ' ').replaceAll('&quot;', '"');
};
