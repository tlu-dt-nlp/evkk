import { useTranslation } from 'react-i18next';
import { MathJax } from 'better-react-mathjax';
import NewTabHyperlink from '../../../../components/NewTabHyperlink';
import {
  VOCABULARY_DATA_LINK,
  VOCABULARY_LEXICAL_DENSITY_LINK,
  VOCABULARY_RANGE_LINK,
  VOCABULARY_REFERENCE_LINK_ONE,
  VOCABULARY_REFERENCE_LINK_TWO,
  VOCABULARY_TOOL_LINK
} from '../../../correction/const/PathConstants';

export default function VocabularyInfo() {
  const { t } = useTranslation();

  return (
    <div>
      {t('corrector_vocabulary_infobox_intro')}
      <br></br>
      <br></br>
      <ul>
        <li>
          <b>{t('corrector_vocabulary_infobox_root_type_token_bold')}</b>{' '}
          {t('corrector_vocabulary_infobox_root_type_token_value')}
          <MathJax style={{ padding: '0.5rem' }}>
            {`\\(\\frac{\\text{${t('common_different_word_count')}}}{\\sqrt{\\text{${t('common_word_count')}}}}\\)`}
          </MathJax>
        </li>
        <li>
          <b>{t('corrector_vocabulary_infobox_mtld_bold')}</b> {t('corrector_vocabulary_infobox_mtld_value')}
        </li>
        <li>
          <b>{t('corrector_vocabulary_infobox_hdd_bold')}</b> {t('corrector_vocabulary_infobox_hdd_value')}
        </li>
        <li>
          <b>{t('corrector_vocabulary_infobox_vocabulary_range_bold')}</b>{' '}
          {t('corrector_vocabulary_infobox_vocabulary_range_value')}&nbsp;
          <NewTabHyperlink path={VOCABULARY_RANGE_LINK} content={t('common_here')} />
          ).
        </li>
        <li>
          <b>{t('corrector_vocabulary_infobox_noun_abstractness_bold')}</b>&nbsp;
          {t('corrector_vocabulary_infobox_noun_abstractness_value')}&nbsp;
          <NewTabHyperlink path={VOCABULARY_TOOL_LINK} content={t('common_tool')} />
          {t('corrector_vocabulary_infobox_noun_abstractness_value_second')}&nbsp;
          <NewTabHyperlink path={VOCABULARY_DATA_LINK} content={t('correction_vocabulary_data')} />
          &nbsp;
          {t('corrector_vocabulary_infobox_noun_abstractness_value_end')}
        </li>
        <li>
          <b>{t('corrector_vocabulary_infobox_lexical_density_bold')}</b>{' '}
          {t('corrector_vocabulary_infobox_lexical_density_value')}&nbsp;
          <NewTabHyperlink
            path={VOCABULARY_LEXICAL_DENSITY_LINK}
            content={t('corrector_vocabulary_infobox_lexical_density_link')}
          />
        </li>
      </ul>
      <b>{t('corrector_vocabulary_infobox_reference_links_bold')}</b>&nbsp;
      {t('corrector_vocabulary_infobox_reference_links')}&nbsp;
      <NewTabHyperlink path={VOCABULARY_REFERENCE_LINK_ONE} content={t('common_here')} />
      &nbsp;
      {t('common_and')}&nbsp;
      <NewTabHyperlink path={VOCABULARY_REFERENCE_LINK_TWO} content={t('common_here')} />.<br></br>
      <br></br>
      {t('corrector_vocabulary_infobox_outro')}
    </div>
  );
}
