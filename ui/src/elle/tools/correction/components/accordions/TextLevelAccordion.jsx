import TextLevelAccordionInner from './TextLevelAccordionInner';
import TextLevelCategoryAccordion from './TextLevelCategoryAccordion';
import { accordionDetails } from '../../constants/tabValues';
import { useTranslation } from 'react-i18next';

export default function TextLevelAccordion({ complexityAnswer }) {
  const { t } = useTranslation();

  return (
    <div className="corrector-right">
      <div className="level-accordion-overall-value-container">
        <div className="level-accordion-overall-value-label">
          {t(accordionDetails[0].label)}
        </div>
        <TextLevelAccordionInner
          complexityAnswer={complexityAnswer.mixed}
          key="mixed"
        />
      </div>
      <div>
        <TextLevelCategoryAccordion
          key="complexity"
          label={accordionDetails[1].label}
          complexityAnswer={complexityAnswer.complexity}
        />
        <TextLevelCategoryAccordion
          key="grammar"
          label={accordionDetails[2].label}
          complexityAnswer={complexityAnswer.grammatical}
        />
        {/*Needs to be fixed and will be reimplemented*/}
        {/*<TextLevelCategoryAccordion
                  key={'error'}
                  label={accordionDetails[3].label}
                  complexityAnswer={complexityAnswer.keeletase.error}
                />*/}
        <TextLevelCategoryAccordion
          key="lexical"
          label={accordionDetails[4].label}
          complexityAnswer={complexityAnswer.lexical}
        />
      </div>
    </div>
  );
}
