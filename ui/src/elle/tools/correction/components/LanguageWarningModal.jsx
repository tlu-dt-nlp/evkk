import { useTranslation } from 'react-i18next';
import ConfirmationModal from '../../../components/modal/ConfirmationModal';
import { useEditorContext } from '../providers/EditorProvider';

const getLanguageName = (languageCode, uiLanguage) => {
  try {
    return new Intl.DisplayNames([uiLanguage], { type: 'language' }).of(languageCode);
  } catch {
    return languageCode;
  }
};

export default function LanguageWarningModal() {
  const { t, i18n } = useTranslation();
  const { languageWarning, confirmLanguageWarning, closeLanguageWarning } = useEditorContext();

  return (
    <ConfirmationModal
      isOpen={languageWarning.isOpen}
      setIsOpen={closeLanguageWarning}
      title="corrector_language_warning_title"
      message={t('corrector_language_warning', { language: getLanguageName(languageWarning.language, i18n.language) })}
      confirmLabel="analyse_button"
      cancelLabel="common_cancel"
      onConfirm={confirmLanguageWarning}
      onCancel={closeLanguageWarning}
    />
  );
}
