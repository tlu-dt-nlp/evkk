import { useTranslation } from 'react-i18next';
import { MathJax } from 'better-react-mathjax';
import {
  COMPLEXITY_LIX_LINK,
  COMPLEXITY_LONG_WORD_LINK,
  COMPLEXITY_SMOG_LINK
} from '../../../correction/const/PathConstants';
import Translate from '../../../../components/Translate';
import NewTabHyperlink from '../../../../components/NewTabHyperlink';

export default function ComplexityInfo() {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t('corrector_complexity_infobox_intro')}</p>
      <ul>
        <li>
          <Translate i18nKey="corrector_complexity_infobox_lix" />
          <MathJax className="vocabulary-mathjax">
            {`\\(\\frac{\\text{${t('common_word_count')}}}{\\text{${t('common_sentence_count')}}}\\) + \\(\\frac{\\text{${t('common_long_word_count')}} \\times 100}{\\text{${t('common_word_count')}}}\\)`}
          </MathJax>
        </li>
        <li>
          <Translate i18nKey="corrector_complexity_infobox_smog" />
          <MathJax className="vocabulary-mathjax">
            {`\\(\\text{1.043} \\times \\sqrt{\\frac{\\text{${t('common_polysyllabic_words')}} \\times 30}{\\text{${t('common_sentence_count')}}}}\\) + \\(3.1291\\)`}
          </MathJax>
        </li>
        <li>
          <Translate i18nKey="corrector_complexity_infobox_flesch_kincaid" />
          <MathJax className="vocabulary-mathjax">
            {`\\(\\text{0.39} \\times (\\frac{ \\text{${t('common_word_count')}}}{\\text{${t('common_sentence_count')}}})\\) + \\(11.8 \\times (\\frac{\\text{${t('common_syllable_count')}}}{\\text{${t('common_word_count')}}})- 15.59\\)`}
          </MathJax>
        </li>
        <li>
          <Translate i18nKey="corrector_complexity_infobox_noun_to_verb" />
        </li>
      </ul>
      <p>
        <Translate
          i18nKey="corrector_complexity_infobox_outro"
          components={{
            lixLink: <NewTabHyperlink path={COMPLEXITY_LIX_LINK} />,
            smogLink: <NewTabHyperlink path={COMPLEXITY_SMOG_LINK} />
          }}
        />
      </p>
      <p>
        <Translate
          i18nKey="corrector_complexity_infobox_word_length_outro"
          components={{ linkTag: <NewTabHyperlink path={COMPLEXITY_LONG_WORD_LINK} /> }}
        />
      </p>
    </div>
  );
}
