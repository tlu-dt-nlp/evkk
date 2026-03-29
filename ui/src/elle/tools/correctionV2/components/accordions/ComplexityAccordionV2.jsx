import { CorrectorAccordionStyle } from '../../../../const/StyleConstants';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useTranslation } from 'react-i18next';
import { Divider } from '@mui/material';
import { complexityValues } from '../../../correction/const/TabValuesConstant';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import CorrectionScale from '../../../correction/components/CorrectionScale';

export default function ComplexityAccordionV2({ complexityAnswer }) {
  const { t } = useTranslation();

  const generateComplexityAnswer = answer => {
    return answer
      .split('/')
      .sort((a, b) => complexityValues.indexOf(a) - complexityValues.indexOf(b))
      .map(t)
      .map((complexityWord, index, array) =>
        index === array.length - 1 ? complexityWord : `${complexityWord} / `
      );
  };

  return (
    <div className="corrector-right">
      <div className="complexity-tab-header">
        <span>{t('corrector_complexity_level')}</span>
        <span>{generateComplexityAnswer(complexityAnswer.keerukus[11])}</span>
      </div>
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
              <div>{t('corrector_complexity_statistics_phrases')}</div>
              <div>{complexityAnswer.keerukus[0] || 0}</div>
            </div>
            <div className="tab-table">
              <div>{t('corrector_complexity_statistics_words')}</div>
              <div>{complexityAnswer.sonad.length}</div>
            </div>
            <div className="tab-table">
              <div>{t('corrector_complexity_statistics_syllables')}</div>
              <div>{complexityAnswer.keerukus[3] || 0}</div>
            </div>
            <div className="tab-table">
              <div>
                {t('corrector_complexity_statistics_polysyllabic_words')}
              </div>
              <div>{complexityAnswer.keerukus[2] || 0}</div>
            </div>
            <div className="tab-table">
              <div>{t('corrector_complexity_statistics_long_words')}</div>
              <div>{complexityAnswer.keerukus[4] || 0}</div>
            </div>
            <div className="tab-table">
              <div>{t('corrector_complexity_statistics_nouns')}</div>
              <div>{complexityAnswer.korrektoriLoendid.nimisonad || 0}</div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion square={true} sx={CorrectorAccordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {t('common_indexes')}
        </AccordionSummary>
        <AccordionDetails className="index-row">
          <CorrectionScale
            title={t('corrector_smog_index')}
            startValue={0}
            endValue={20}
            value={complexityAnswer.keerukus[5]}
            startText={t('corrector_index_score_easy')}
            endText={t('corrector_index_score_difficult')}
          />
          <Divider />
          <CorrectionScale
            title={t('corrector_flesch_kincaid_grade_level')}
            startValue={0}
            endValue={30}
            value={complexityAnswer.keerukus[6]}
            startText={t('corrector_index_score_easy')}
            endText={t('corrector_index_score_difficult')}
          />
          <Divider />
          <CorrectionScale
            title={t('corrector_lix_index')}
            startValue={20}
            endValue={70}
            value={complexityAnswer.keerukus[7]}
            startText={t('corrector_index_score_easy')}
            endText={t('corrector_index_score_difficult')}
          />
          <Divider />
          <CorrectionScale
            title={t('corrector_noun_to_verb_ratio')}
            startValue={0}
            endValue={3}
            value={complexityAnswer.korrektoriLoendid.nimitegusuhe}
            startText={t('corrector_has_more_verbs')}
            endText={t('corrector_has_more_nouns')}
          />
          <Divider />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
