import { IconButton, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { QuestionMark } from '@mui/icons-material';
import '../styles/TooltipButton.css';

export default function TooltipButton({ children }) {
  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  return (
    <Tooltip
      title={children}
      placement="top"
      className="tooltip-button"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      disableTouchListener
    >
      <IconButton onClick={handleClick}>
        <QuestionMark className="tooltip-icon" />
      </IconButton>
    </Tooltip>
  );
}
