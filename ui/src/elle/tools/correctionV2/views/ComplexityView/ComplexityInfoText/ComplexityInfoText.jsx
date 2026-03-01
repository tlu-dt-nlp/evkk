import { useTranslation } from 'react-i18next';
import { MathJax } from 'better-react-mathjax';
import NewTabHyperlink from '../../../../../components/NewTabHyperlink';
import {
  COMPLEXITY_LIX_LINK,
  COMPLEXITY_LONG_WORD_LINK,
  COMPLEXITY_SMOG_LINK
} from '../../../../correction/const/PathConstants';

export default function ComplexityInfoText() {
  const { t } = useTranslation();

  return (<div>
    {t('corrector_complexity_infobox_intro')}
    <br></br><br></br>
    <ul>
      <li>
        <b>{t('corrector_complexity_infobox_lix_bold')}</b> {t('corrector_complexity_infobox_lix_value')}
        <br></br>
        {/* sõnade arv / lausete arv + pikkade sõnade arv * 100 / sõnade arv */}
        <MathJax style={{ padding: '0.5rem' }}>
          {`\\(\\frac{\\text{${t('common_word_count')}}}{\\text{${t('common_sentence_count')}}}\\) + \\(\\frac{\\text{${t('common_long_word_count')}} \\times 100}{\\text{${t('common_word_count')}}}\\)`}
        </MathJax>
      </li>
      <li>
        <b>{t('corrector_complexity_infobox_smog_bold')}</b> {t('corrector_complexity_infobox_smog_value')}
        <br></br>
        {/* 1,043 * √paljusilbiliste sõnade arv * 30 / lausete arv + 3,1291 */}
        <MathJax style={{ padding: '0.5rem' }}>
          {`\\(\\text{1.043} \\times \\sqrt{\\frac{\\text{${t('common_polysyllabic_words')}} \\times 30}{\\text{${t('common_sentence_count')}}}}\\) + \\(3.1291\\)`}
        </MathJax>
      </li>
      <li>
        <b>{t('corrector_complexity_infobox_flesch_kincaid_bold')}</b> {t('corrector_complexity_infobox_flesch_kincaid_value')}
        <br></br>
        {/* 0,39 * sõnade arv / lausete arv + 11,8 * silpide arv / sõnade arv - 15,59 */}
        <MathJax style={{ padding: '0.5rem' }}>
          {`\\(\\text{0.39} \\times (\\frac{ \\text{${t('common_word_count')}}}{\\text{${t('common_sentence_count')}}})\\) + \\(11.8 \\times (\\frac{\\text{${t('common_syllable_count')}}}{\\text{${t('common_word_count')}}})- 15.59\\)`}
        </MathJax>
      </li>
      <li>
        <b>{t('corrector_complexity_infobox_noun_to_verb_bold')}</b> {t('corrector_complexity_infobox_noun_to_verb_value')}
      </li>
    </ul>
    {t('corrector_complexity_infobox_lix_outro')}&nbsp;
    <NewTabHyperlink path={COMPLEXITY_LIX_LINK} content={t('common_here')} />,&nbsp;
    {t('corrector_complexity_infobox_smog_outro')}&nbsp;
    <NewTabHyperlink path={COMPLEXITY_SMOG_LINK} content={t('common_here')} />.&nbsp;
    {t('corrector_complexity_infobox_smog_outro_extra')}
    <br></br><br></br>
    {t('corrector_complexity_infobox_word_length_outro')}&nbsp;
    <NewTabHyperlink path={COMPLEXITY_LONG_WORD_LINK} content={t('common_here')} />).
  </div>);
}
