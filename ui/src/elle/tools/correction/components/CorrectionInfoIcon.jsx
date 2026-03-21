import { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import { IconButton } from '@mui/material';
import ModalBase from '../../../components/modal/ModalBase';

const alignmentMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
};

export default function CorrectionInfoIcon({ children, fixedHeight = false, align = 'right', className = '' }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      className={className}
      style={{ height: fixedHeight ? '44px' : 'auto', display: 'flex', justifyContent: alignmentMap[align] }}
    >
      <IconButton aria-label="info" color="red" onClick={() => setModalOpen(true)}>
        <InfoIcon className="elle-dark-text" />
      </IconButton>
      <ModalBase isOpen={modalOpen} setIsOpen={setModalOpen}>
        {children}
      </ModalBase>
    </div>
  );
}
