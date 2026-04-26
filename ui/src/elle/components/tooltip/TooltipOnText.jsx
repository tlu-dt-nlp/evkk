import { Tooltip } from '@mui/material';
import { useState } from 'react';
import '../styles/TooltipOnText.css';

export default function TooltipOnText({
                                        title,
                                        children,
                                        className = '',
                                        placement = 'bottom',
                                        disabled = false
                                      }) {
  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  if (disabled) {
    return children;
  }

  return (
    <Tooltip
      title={title}
      placement={placement}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      followCursor
      disableTouchListener
    >
      <span
        className={`tooltip-on-text-trigger ${className}`}
        onClick={handleClick}
      >
        <span className="tooltip-on-text-content">
          {children}
        </span>
      </span>
    </Tooltip>
  );
}
