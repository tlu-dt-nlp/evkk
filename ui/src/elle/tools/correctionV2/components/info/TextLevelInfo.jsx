import { Trans, useTranslation } from 'react-i18next';

const transComponents = { bold: <b /> };

export default function TextLevelInfo() {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t('corrector_proficiency_level_infobox_intro')}</p>
      <p>{t('corrector_proficiency_level_infobox_list_header')}</p>
      <ul>
        <li>
          <Trans
            i18nKey="corrector_proficiency_level_infobox_list_overall"
            components={transComponents}
          />
        </li>
        <li>
          <Trans
            i18nKey="corrector_proficiency_level_infobox_list_grammar"
            components={transComponents}
          />
        </li>
        <li>
          <Trans
            i18nKey="corrector_proficiency_level_infobox_list_vocabulary"
            components={transComponents}
          />
        </li>
        {/* Will be reimplemented when correctness is fixed */}
        {/*
        <li>
          <Trans i18nKey="corrector_proficiency_level_infobox_list_correctness" components={transComponents} />
        </li>
        */}
        <li>
          <Trans
            i18nKey="corrector_proficiency_level_infobox_list_overall_score"
            components={transComponents}
          />
        </li>
      </ul>
      <p>{t('corrector_proficiency_level_infobox_outro')}</p>
    </div>
  );
}
