import { Divider } from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import Accordion from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import AccordionDetails from '@mui/material/AccordionDetails';
import CorrectionScale from '../../../correction/components/CorrectionScale';
import { CorrectorAccordionStyle } from '../../../../const/StyleConstants';

export default function VocabularyAccordionV2({ complexityAnswer }) {
  const { t } = useTranslation();

  return (
    <div className="corrector-right">
      <Accordion
        square={true}
        style={{ marginBottom: '0.5em' }}
        sx={CorrectorAccordionStyle}
        defaultExpanded
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {t('common_statistics')}
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <div className="tab-table">
              <div>{t('corrector_vocabulary_statistics_the_words_considered')}</div>
              <div>{complexityAnswer.sonad.length}</div>
            </div>
            <div className="tab-table">
              <div>{t('corrector_vocabulary_statistics_different_words')}</div>
              <div>{complexityAnswer.mitmekesisus[11] || 0}</div>
            </div>
            <div className="tab-table">
              <div>
                {t('corrector_vocabulary_statistics_low_frequency_words')}
              </div>
              <div>{complexityAnswer.korrektoriLoendid.harvaesinevad || 0}</div>
            </div>
            <div className="tab-table">
              <div>{t('corrector_vocabulary_statistics_content_words')}</div>
              <div>{complexityAnswer.korrektoriLoendid.sisusonad || 0}</div>
            </div>
            {complexityAnswer.abstraktsus && (
              <div className="tab-table">
                <div>{t('corrector_vocabulary_statistics_abstract_nouns')}</div>
                <div>{complexityAnswer.korrektoriLoendid.abstraktsed || 0}</div>
              </div>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion square={true} sx={CorrectorAccordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {t('common_indexes')}
        </AccordionSummary>
        <AccordionDetails className="index-row">
          <CorrectionScale
            title={t('corrector_vocabulary_indexes_root_type_token_ratio')}
            startValue={0}
            endValue={15}
            value={complexityAnswer.mitmekesisus[1]}
            startText={t('corrector_vocabulary_repetitive_vocabulary')}
            endText={t('corrector_vocabulary_diverse_vocabulary')}
          />
          <Divider />
          {complexityAnswer.mitmekesisus[4] > -1 && (
            <>
              <CorrectionScale
                title={t('corrector_vocabulary_mtld_index')}
                startValue={0}
                endValue={400}
                value={complexityAnswer.mitmekesisus[4]}
                startText={t('corrector_vocabulary_repetitive_vocabulary')}
                endText={t('corrector_vocabulary_diverse_vocabulary')}
              />
              <Divider />
            </>
          )}
          {complexityAnswer.mitmekesisus[5] > 0 && (
            <>
              <CorrectionScale
                title={t('corrector_vocabulary_hdd_index')}
                startValue={0.5}
                endValue={1}
                value={complexityAnswer.mitmekesisus[5]}
                startText={t('corrector_vocabulary_repetitive_vocabulary')}
                endText={t('corrector_vocabulary_diverse_vocabulary')}
              />
              <Divider />
            </>
          )}
          {complexityAnswer.abstraktsus && (
            <>
              <CorrectionScale
                title={t('corrector_vocabulary_noun_abstractness')}
                startValue={1}
                endValue={3}
                value={complexityAnswer.korrektoriLoendid.abskeskmine}
                startText={t('corrector_vocabulary_more_concrete_vocabulary')}
                endText={t('corrector_vocabulary_more_abstract_vocabulary')}
              />
              <Divider />
            </>
          )}
          <CorrectionScale
            title={t('corrector_vocabulary_range')}
            startValue={0}
            endValue={10}
            value={
              (complexityAnswer.korrektoriLoendid.harvaesinevad * 100) / complexityAnswer.mitmekesisus[10]
            }
            startText={t('corrector_vocabulary_more_frequent_vocabulary')}
            endText={t('corrector_vocabulary_less_frequent_vocabulary')}
            percentage={true}
          />
          <Divider />
          <CorrectionScale
            title={t('corrector_vocabulary_lexical_density')}
            startValue={30}
            endValue={70}
            value={
              (complexityAnswer.korrektoriLoendid.sisusonad * 100) / complexityAnswer.mitmekesisus[10]
            }
            startText={t('corrector_vocabulary_less_content_words')}
            endText={t('corrector_vocabulary_more_content_words')}
            percentage={true}
          />
          <Divider />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
