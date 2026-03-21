import TextLevelAccordionInner from '../../../correction/tabviews/textlevel/components/TextLevelAccordionInner';
import TextLevelAccordion from '../../../correction/tabviews/textlevel/components/TextLevelAccordion';
import { accordionDetails } from '../../../correction/const/TabValuesConstant';
import { useTranslation } from 'react-i18next';

export default function TextLevelAccordionV2({ complexityAnswer }) {
  const { t } = useTranslation();

  return (
    <div className="corrector-right">
      <div className="level-accordion-overall-value-container">
        <div className="level-accordion-overall-value-label">{t(accordionDetails[0].label)}</div>
        <TextLevelAccordionInner complexityAnswer={complexityAnswer.mixed} key="mixed" />
      </div>
      <div>
        <TextLevelAccordion
          key="complexity"
          label={accordionDetails[1].label}
          complexityAnswer={complexityAnswer.complexity}
        />
        <TextLevelAccordion
          key="grammar"
          label={accordionDetails[2].label}
          complexityAnswer={complexityAnswer.grammatical}
        />
        {/*Needs to be fixed and will be reimplemented*/}
        {/*<TextLevelAccordion
                  key={'error'}
                  label={accordionDetails[3].label}
                  complexityAnswer={complexityAnswer.keeletase.error}
                />*/}
        <TextLevelAccordion
          key="lexical"
          label={accordionDetails[4].label}
          complexityAnswer={complexityAnswer.lexical}
        />
      </div>
    </div>
  );
}
