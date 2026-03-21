import { useTranslation } from 'react-i18next';

export default function TextLevelInfo() {
  const { t } = useTranslation();

  return (
    <div>
      {t('corrector_proficiency_level_infobox_intro')}
      <br></br>
      <br></br>
      {t('corrector_proficiency_level_infobox_list_header')}
      <ul>
        <li>
          <b>{t('corrector_proficiency_level_infobox_list_bold_overall')}</b> –{' '}
          {t('corrector_proficiency_level_infobox_list_overall_value')}
        </li>
        <li>
          <b>{t('corrector_proficiency_level_infobox_list_bold_grammar')}</b> –{' '}
          {t('corrector_proficiency_level_infobox_list_grammar_value')}
        </li>
        <li>
          <b>{t('corrector_proficiency_level_infobox_list_bold_vocabulary')}</b> –{' '}
          {t('corrector_proficiency_level_infobox_list_vocabulary_value')}
        </li>
        {/* Will be reimplemented when correctness is fixed */}
        {/*<li>
                  <b>{t('corrector_proficiency_level_infobox_list_bold_correctness')}</b> – {t('corrector_proficiency_level_infobox_list_correctness_value')}
                </li>*/}
        <li>
          <b>{t('corrector_proficiency_level_infobox_list_bold_overall_score')}</b> –{' '}
          {t('corrector_proficiency_level_infobox_list_overall_score_value')}
        </li>
      </ul>
      {t('corrector_proficiency_level_infobox_outro')}
    </div>
  );
}
