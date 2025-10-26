import React from 'react';
import { toDecimalScale2OrInteger } from '../util/Utils';

export default function CorrectionScale({ title, startValue, endValue, value, startText, endText, percentage }) {
  let newEndValue = endValue;
  const val = Number(value);
  const endVal = Number(endValue);

  if (endVal < val && val > 10) {
    newEndValue = Math.ceil(val / 5) * 5;
  } else if (endVal === val && val > 10) {
    newEndValue = Math.ceil((val + 0.1) / 5) * 5;
  } else if (endVal <= val) {
    newEndValue = Math.ceil(val);
  }

  const adjustedlength = newEndValue - startValue;
  const adjustedMarkerPosition = val - startValue;

  return (
    <div>
      <div className="d-flex justify-content-between mb-2 font-weight-bold">
        <div>{title}</div>
        <div>{toDecimalScale2OrInteger(value)}{percentage && '%'}</div>
      </div>
      <div className="d-flex justify-content-around">
        <div className="slider-tip-indicator">{percentage ? `${startValue}%` : startValue}</div>
        <div className="slider-track">
          <div className="slider-thumb"
               style={{ left: `${adjustedMarkerPosition * 100 / adjustedlength}%`, top: '-20%' }}/>
          <div className="slider-labels">
            <div>{startText}</div>
            <div>{endText}</div>
          </div>
        </div>
        <div className="slider-tip-indicator">{percentage ? `${newEndValue}%` : newEndValue}</div>
      </div>
    </div>
  );
};
