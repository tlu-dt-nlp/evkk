// Original code by Reydan Niineorg

import { useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { TextSelectionContext } from './TextSelectionContext';
import { textToSpeechVoices } from '../../const/Constants';
import { useTranslation } from 'react-i18next';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { Alert, Button, ClickAwayListener, Paper, Popper } from '@mui/material';
import { DefaultButtonStyle5px, DefaultSliderStyle, ToggleButtonGroupStyle } from '../../const/StyleConstants';
import DownloadIcon from '@mui/icons-material/Download';
import './styles/TextToSpeechMenu.css';

const sliderMarks = [
  { value: 0.5, label: '0.5' },
  { value: 1, label: '1' },
  { value: 1.5, label: '1.5' },
  { value: 2, label: '2' }
];

const speechPopperAnchorOrigins = {
  vertical: 'bottom',
  horizontal: 'center'
};

const speechPopperTransformOrigins = {
  vertical: 'top',
  horizontal: 'center'
};

export default function TextToSpeechMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const selectedText = useContext(TextSelectionContext);
  const [speed, setSpeed] = useState(1.0);
  const [latestListenedSpeaker, setLatestListenedSpeaker] = useState(null);
  const [latestListenedSpeed, setLatestListenedSpeed] = useState(null);
  const [speaker, setSpeaker] = useState(textToSpeechVoices.mari);
  const [textAvailable, setTextAvailable] = useState(false);
  const [selectedTextChecker, setSelectedTextChecker] = useState(true);
  const { playTextToSpeech, downloadLastSpeech } = useTextToSpeech();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setSelectedTextChecker(selectedText === '');
  }, [t, selectedText]);

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleTogglePopper = event => {
    if (anchorEl) {
      handlePopoverClose();
    } else {
      handlePopoverOpen(event);
    }
  };

  const open = Boolean(anchorEl);

  const handlePlay = (speakerOverride) => {
    playTextToSpeech(
      selectedText,
      speakerOverride || speaker,
      speed,
      setTextAvailable
    ).then(() => {
      setLatestListenedSpeaker(speaker);
      setLatestListenedSpeed(speed);
    });
  };

  return (
    <ClickAwayListener onClickAway={handlePopoverClose}>
      <div>
        <VolumeUpIcon
          className="text-to-speech-icon"
          onClick={handleTogglePopper}
        />
        <Popper
          className="speech-menu-popper-container"
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={speechPopperAnchorOrigins}
          transformOrigin={speechPopperTransformOrigins}
        >
          <Paper className="speech-menu-popper-paper">
            <div>
              <Typography>
                {t('text_to_speech_speed')}
              </Typography>
              <div className="text-to-speech-slider-container">
                <Slider
                  sx={DefaultSliderStyle}
                  valueLabelDisplay="auto"
                  value={speed}
                  onChange={(_, newValue) => setSpeed(newValue)}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  marks={sliderMarks}
                />
              </div>
              <FormControl fullWidth>
                <FormLabel id="toggle-buttons-group-label">
                  {t('text_to_speech_voice')}
                </FormLabel>
                <ToggleButtonGroup
                  color="primary"
                  fullWidth
                  value={speaker}
                  onChange={(_, newSpeaker) => setSpeaker(newSpeaker)}
                  exclusive
                  sx={ToggleButtonGroupStyle}
                  size="small"
                >
                  <ToggleButton value={textToSpeechVoices.mari}>
                    {textToSpeechVoices.mari}
                  </ToggleButton>
                  <ToggleButton value={textToSpeechVoices.albert}>
                    {textToSpeechVoices.albert}
                  </ToggleButton>
                  <ToggleButton value={textToSpeechVoices.kalev}>
                    {textToSpeechVoices.kalev}
                  </ToggleButton>
                </ToggleButtonGroup>
              </FormControl>
            </div>
            {selectedTextChecker &&
              <Alert severity="warning">
                {t('text_to_speech_text')}
              </Alert>
            }
            <div className="speech-menu-popper-button-container">
              <Button
                disabled={selectedTextChecker}
                sx={{ ...DefaultButtonStyle5px, flex: 3 }}
                onClick={() => handlePlay(speaker)}
                fullWidth
                variant="contained"
              >
                {t('text_to_speech_play')}
              </Button>
              <Button
                disabled={!textAvailable}
                sx={{ ...DefaultButtonStyle5px, flex: 1 }}
                aria-label="download speech"
                onClick={() => downloadLastSpeech(`${latestListenedSpeaker}_${i18n.language}_${latestListenedSpeed}.wav`)}>
                <DownloadIcon className="text-white" />
              </Button>
            </div>
          </Paper>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};
