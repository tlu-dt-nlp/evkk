import { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import { IconButton } from '@mui/material';
import ModalBase from '../../../components/modal/ModalBase';

const alignmentMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
};

export default function CorrectionInfoIcon({ children, containerHeight, align = 'right' }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ height: containerHeight || 'auto', display: 'flex', justifyContent: alignmentMap[align] }}>
      <IconButton
        aria-label="info"
        color="red"
        sx
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
