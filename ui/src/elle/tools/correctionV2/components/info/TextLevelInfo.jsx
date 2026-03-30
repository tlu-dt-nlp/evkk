import { useTranslation } from 'react-i18next';
import Translate from '../../../../components/Translate';

export default function TextLevelInfo() {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t('corrector_proficiency_level_infobox_intro')}</p>
      <p>{t('corrector_proficiency_level_infobox_list_header')}</p>
      <ul>
        <li>
          <Translate i18nKey="corrector_proficiency_level_infobox_list_overall" />
        </li>
        <li>
          <Translate i18nKey="corrector_proficiency_level_infobox_list_grammar" />
        </li>
        <li>
          <Translate i18nKey="corrector_proficiency_level_infobox_list_vocabulary" />
        </li>
        {/* Will be reimplemented when correctness is fixed */}
        {/*
        <li>
          <Translate i18nKey="corrector_proficiency_level_infobox_list_correctness" />
        </li>
        */}
        <li>
          <Translate i18nKey="corrector_proficiency_level_infobox_list_overall_score" />
        </li>
      </ul>
      <p>{t('corrector_proficiency_level_infobox_outro')}</p>
    </div>
  );
}
