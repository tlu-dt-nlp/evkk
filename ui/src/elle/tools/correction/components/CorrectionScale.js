import React from 'react';

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
        <div>{parseFloat(value).toFixed(2)}{percentage && '%'}</div>
      </div>
      <div className="d-flex justify-content-around">
        <div>{percentage ? `${startValue}%` : startValue}</div>
        <div className="slider-track">
          <div className="slider-thumb"
               style={{ left: `${adjustedMarkerPosition * 100 / adjustedlength}%`, top: '-20%' }}></div>
          <div className="slider-labels">
            <div>{startText}</div>
            <div>{endText}</div>
          </div>
        </div>
        <div>{percentage ? `${newEndValue}%` : newEndValue}</div>
      </div>
    </div>
  );
};
