import { useTranslation } from 'react-i18next';
import { MathJax } from 'better-react-mathjax';
import {
  VOCABULARY_DATA_LINK,
  VOCABULARY_LEXICAL_DENSITY_LINK,
  VOCABULARY_RANGE_LINK,
  VOCABULARY_REFERENCE_LINK_ONE,
  VOCABULARY_REFERENCE_LINK_TWO,
  VOCABULARY_TOOL_LINK
} from '../../../correction/const/PathConstants';
import Translate from '../../../../components/Translate';
import NewTabHyperlink from '../../../../components/NewTabHyperlink';

export default function VocabularyInfo() {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t('corrector_vocabulary_infobox_intro')}</p>
      <ul>
        <li>
          <Translate i18nKey="corrector_vocabulary_infobox_root_type_token" />
          <MathJax className="vocabulary-mathjax">
            {`\\(\\frac{\\text{${t('common_different_word_count')}}}{\\sqrt{\\text{${t('common_word_count')}}}}\\)`}
          </MathJax>
        </li>
        <li>
          <Translate i18nKey="corrector_vocabulary_infobox_mtld" />
        </li>
        <li>
          <Translate i18nKey="corrector_vocabulary_infobox_hdd" />
        </li>
        <li>
          <Translate
            i18nKey="corrector_vocabulary_infobox_vocabulary_range"
            components={{ rangeLink: <NewTabHyperlink path={VOCABULARY_RANGE_LINK} /> }}
          />
        </li>
        <li>
          <Translate
            i18nKey="corrector_vocabulary_infobox_noun_abstractness"
            components={{
              toolLink: <NewTabHyperlink path={VOCABULARY_TOOL_LINK} />,
              dataLink: <NewTabHyperlink path={VOCABULARY_DATA_LINK} />
            }}
          />
        </li>
        <li>
          <Translate
            i18nKey="corrector_vocabulary_infobox_lexical_density"
            components={{
              linkTag: <NewTabHyperlink path={VOCABULARY_LEXICAL_DENSITY_LINK} />
            }}
          />
        </li>
      </ul>
      <p>
        <Translate
          i18nKey="corrector_vocabulary_infobox_reference_links"
          components={{
            link1: <NewTabHyperlink path={VOCABULARY_REFERENCE_LINK_ONE} />,
            link2: <NewTabHyperlink path={VOCABULARY_REFERENCE_LINK_TWO} />
          }}
        />
      </p>
      <p>{t('corrector_vocabulary_infobox_outro')}</p>
    </div>
  );
}
