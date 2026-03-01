import CorrectorButton from '../../components/CorrectorButton/CorrectorButton';
import CorrectorInput from '../../components/CorrectrorInput/CorrectorInput';
import { Box } from '@mui/material';
import CorrectorButtonGroup from '../../components/CorrectorButtonGroup/CorrectorButtonGroup';
import './CorrectorLayout.css';

export default function CorrectorLayout({ selectedTab, errorListSlot }) {


  return (
    <Box className={'correctorLayout-container'}>
      <Box style={{ flex: 1, minWidth: 300 }}>
        <CorrectorButtonGroup key={selectedTab} selectedTab={selectedTab} />
        <CorrectorInput />
        <CorrectorButton />
      </Box>
      <Box style={{ flex: 1, minWidth: 300 }}>{errorListSlot}</Box>
    </Box>);
}
