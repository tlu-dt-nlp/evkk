import { Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../providers/EditorProvider';
import { ESTONIAN_LANGUAGE_CODE, LANGUAGE_DETECTION_MIN_PROBABILITY } from '../constants/constants';

const getLanguageName = (languageCode, uiLanguage) => {
  try {
    return new Intl.DisplayNames([uiLanguage], { type: 'language' }).of(languageCode) ?? languageCode;
  } catch {
    return languageCode;
  }
};

export default function LanguageWarningAlert() {
  const { t, i18n } = useTranslation();
  const { detectedLanguage, text, initialText } = useEditorContext((state) => ({
    detectedLanguage: state.errorResponse.keel,
    text: state.text,
    initialText: state.initialText
  }));

  // keeletuvastus kehtib analüüsitud teksti kohta, peidetakse hoiatus kui teksti on muudetud
  const showWarning = text === initialText
    && detectedLanguage?.keel
    && detectedLanguage.keel !== ESTONIAN_LANGUAGE_CODE
    && detectedLanguage.toenaosus >= LANGUAGE_DETECTION_MIN_PROBABILITY;

  if (!showWarning) return null;

  return (
    <Alert severity="warning" sx={{ marginBottom: '1rem' }}>
      {t('corrector_language_warning', { language: getLanguageName(detectedLanguage.keel, i18n.language) })}
    </Alert>
  );
}
