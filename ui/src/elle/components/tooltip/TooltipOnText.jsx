import { Tooltip } from '@mui/material';
import { useState } from 'react';
import '../styles/TooltipOnText.css';

export default function TooltipOnText({ title, children }) {
  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  return (
    <Tooltip
      title={title}
      placement="bottom"
      className="tooltip-on-text"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      followCursor
      disableTouchListener
    >
      <span onClick={handleClick}>
        {children}
      </span>
    </Tooltip>
  );
}
