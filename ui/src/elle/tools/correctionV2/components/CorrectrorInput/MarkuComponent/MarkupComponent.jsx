import React, { useState } from 'react';
import { MarkViewContent } from '@tiptap/react';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import './MarkupComponent.css';
import { errorTypes } from '../../../../correction/const/TabValuesConstant';
import SingleErrorV2 from '../../../views/CorrectorView/ErrorAccordionV2/SingleErrorV2/SingeErrorV2';

const WhiteTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    PopperProps={{
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, -8]
          }
        }
      ]
    }}
  />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: '#fff',
    color: '#222',
    border: '1px solid #eee',
    padding: 0,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
    position: 'relative'
  },
  [`& .MuiTooltip-arrow:before`]: {
    border: '1px solid #eee',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
    color: '#fff'
  }
}));

export default function MarkupComponent(props) {
  const { initialText, correctedText, errorType, errorId, classValue } = props.HTMLAttributes;

  const [isTooltipVisible, setIsTooltipVisible] = useState(true);

  const error = {
    error: {
      text: initialText,
      corrected_text: correctedText,
      correction_type: errorType,
      error_id: errorId
    }
  };


  return (
    <WhiteTooltip
      key={`tooltip-${isTooltipVisible}`}
      title={
        <SingleErrorV2 error={error} onClose={() => setIsTooltipVisible(false)} />
      }
      enterTouchDelay={0}
      leaveTouchDelay={3000}
      style={{ display: isTooltipVisible ? 'block' : 'none' }}
      arrow
      placement="top"
      disableHoverListener={!initialText && !correctedText}
    >
      <span className="content" tabIndex={0} style={{ cursor: 'pointer' }}>
        <span
          className={`mark-view-content-wrapper ${classValue}`}
          style={{ backgroundColor: errorTypes[errorType]?.color }}
        >
          <MarkViewContent />
        </span>
      </span>
    </WhiteTooltip>
  );
}
