import { textLevelColors, textLevels } from '../../../const/TabValuesConstant';
import { useTranslation } from 'react-i18next';

export default function TextLevelAccordionInner({ complexityAnswer, key }) {

  const { t } = useTranslation();
  return (
    <div>
      {complexityAnswer.probabilities.map((value) => (
          <div key={`${key}-${value.index}-percentage`}>
            {t(textLevels[value.index])} - {(value.value * 100).toFixed(0)}%
          </div>
        )
      )}
      <div className="d-flex mt-3 rounded overflow-hidden">
        {complexityAnswer.probabilities.map((value) => {
          return (<div
            key={`${key}-${value.index}-bars`}
            style={{
              height: '1rem',
              backgroundColor: textLevelColors[value.index],
              width: `${value.value * 100}%`
            }}>
          </div>);
        })}
      </div>
    </div>
  );
};
