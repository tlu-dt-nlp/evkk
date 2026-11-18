import { cleanup } from '@testing-library/react';
import i18n from 'i18next';
import { afterEach, beforeEach } from 'vitest';
import { Languages } from '../elle/translations/i18n';

beforeEach(async () => {
  localStorage.clear();
  await i18n.changeLanguage(Languages.ESTONIAN);
});

afterEach(() => {
  cleanup();
});
