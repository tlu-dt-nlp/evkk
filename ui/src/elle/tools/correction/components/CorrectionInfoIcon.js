import React, { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import { IconButton } from '@mui/material';
import ModalBase from '../../../components/modal/ModalBase';

export default function CorrectionInfoIcon({ children }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <IconButton
        aria-label="info"
        color="red"
        onClick={() => setModalOpen(true)}
      >
        <InfoIcon className="elle-dark-text" />
      </IconButton>
      <ModalBase
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
      >
        {children}
      </ModalBase>
    </div>
  );
};
