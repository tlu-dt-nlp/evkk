import { complexityValues } from '../../correction/const/TabValuesConstant';

export const toDecimalScale2OrInteger = (value) => {
  const num = Number.parseFloat(value);
  return Number.isInteger(num) ? num : num.toFixed(2);
};

export const generateComplexityAnswer = (answer, t) => {
  return answer
    .split('/')
    .sort((a, b) => complexityValues.indexOf(a) - complexityValues.indexOf(b))
    .map(t)
    .map((complexityWord, index, array) =>
      index === array.length - 1 ? complexityWord : `${complexityWord} / `
    );
};
