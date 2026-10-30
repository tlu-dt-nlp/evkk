export const sanitizeTexts = (text) => {
  return text.replaceAll('\\n\\n', ' ').replaceAll('\\n', ' ').replaceAll('&quot;', '"');
};
