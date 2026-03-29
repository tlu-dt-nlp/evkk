import { Trans, useTranslation } from 'react-i18next';
import { MathJax } from 'better-react-mathjax';
import {
  VOCABULARY_DATA_LINK,
  VOCABULARY_LEXICAL_DENSITY_LINK,
  VOCABULARY_RANGE_LINK,
  VOCABULARY_REFERENCE_LINK_ONE,
  VOCABULARY_REFERENCE_LINK_TWO,
  VOCABULARY_TOOL_LINK
} from '../../../correction/const/PathConstants';

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };

export default function VocabularyInfo() {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t('corrector_vocabulary_infobox_intro')}</p>
      <ul>
        <li>
          <Trans
            i18nKey="corrector_vocabulary_infobox_root_type_token"
            components={{ bold: <b /> }}
          />
          <MathJax className="vocabulary-mathjax">
            {`\\(\\frac{\\text{${t('common_different_word_count')}}}{\\sqrt{\\text{${t('common_word_count')}}}}\\)`}
          </MathJax>
        </li>
        <li>
          <Trans
            i18nKey="corrector_vocabulary_infobox_mtld"
            components={{ bold: <b /> }}
          />
        </li>
        <li>
          <Trans
            i18nKey="corrector_vocabulary_infobox_hdd"
            components={{ bold: <b /> }}
          />
        </li>
        <li>
          <Trans
            i18nKey="corrector_vocabulary_infobox_vocabulary_range"
            components={{
              bold: <b />,
              rangeLink: <a href={VOCABULARY_RANGE_LINK} {...linkProps} />
            }}
          />
        </li>
        <li>
          <Trans
            i18nKey="corrector_vocabulary_infobox_noun_abstractness"
            components={{
              bold: <b />,
              toolLink: <a href={VOCABULARY_TOOL_LINK} {...linkProps} />,
              dataLink: <a href={VOCABULARY_DATA_LINK} {...linkProps} />
            }}
          />
        </li>
        <li>
          <Trans
            i18nKey="corrector_vocabulary_infobox_lexical_density"
            components={{
              bold: <b />,
              link: <a href={VOCABULARY_LEXICAL_DENSITY_LINK} {...linkProps} />
            }}
          />
        </li>
      </ul>
      <p>
        <Trans
          i18nKey="corrector_vocabulary_infobox_reference_links"
          components={{
            bold: <b />,
            link1: <a href={VOCABULARY_REFERENCE_LINK_ONE} {...linkProps} />,
            link2: <a href={VOCABULARY_REFERENCE_LINK_TWO} {...linkProps} />
          }}
        />
      </p>
      <p>{t('corrector_vocabulary_infobox_outro')}</p>
    </div>
  );
}
