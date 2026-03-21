import { useState } from 'react';
import { MarkViewContent } from '@tiptap/react';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import './MarkupComponent.css';
import { errorTypes } from '../../../correction/const/TabValuesConstant';
import SingleErrorV2 from '../errors/SingleErrorV2';

const WhiteTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ popper: className }}
    slotProps={{
      popper: {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -8]
            }
          }
        ]
      }
    }}
  />
))(() => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: '#fff',
    border: '1px solid #eee',
    padding: 0,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)'
  },
  [`& .MuiTooltip-arrow:before`]: {
    color: '#fff'
  }
}));

export default function MarkupComponent(props) {
  const { initialText, correctedText, errorType, errorId, classValue } = props.HTMLAttributes;

  const [isClosed, setIsClosed] = useState(false);

  const error = {
    text: initialText,
    corrected_text: correctedText,
    correction_type: errorType,
    error_id: errorId
  };

  const hasError = initialText && correctedText;

  return (
    <WhiteTooltip
      title={<SingleErrorV2 error={error} onClose={() => setIsClosed(true)} />}
      enterTouchDelay={0}
      leaveTouchDelay={3000}
      arrow
      placement="top"
      {...(isClosed || !hasError ? { open: false } : {})}
    >
      <span className="markup-component-content" tabIndex={0}>
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
