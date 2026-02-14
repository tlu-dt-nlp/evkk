import { useTranslation } from 'react-i18next';
import '../../translations/i18n';
import { Alert } from '@mui/material';

export const WordInfo = ({ _onShowWordInfo, onWordInfo }) => {

  const { t } = useTranslation();

  return (
    <div className="word-info">
      <h2>{t('common_word_analysis')}</h2>
      <br />
      {onWordInfo.syllables === '–' &&
        <Alert severity="warning">
          {t('word_analyser_word_with_foreign_characters_warning')}
        </Alert>
      }
      <p>{t('wordinfo_word')}: {onWordInfo.word}</p>
      <p>{t('common_lemma')}: {onWordInfo.lemma}</p>
      <p>{t('common_syllables')}: {onWordInfo.syllables}</p>
      <p>{t('common_wordtype')}: {onWordInfo.type}</p>
      <p>{t('common_form')}: {onWordInfo.form}</p>
    </div>
  );
};
