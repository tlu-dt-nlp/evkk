import { useGetTextToSpeech } from '../../../hooks/service/TextToSpeechService';
import { useRef } from 'react';

export const useTextToSpeech = () => {
  const { getTextToSpeechData } = useGetTextToSpeech();
  const lastAudioBase64 = useRef(null);

  const playTextToSpeech = async (selectedText, currentSpeaker, speed, setTextAvailable) => {
    if (!selectedText) return;

    const requestBody = {
      text: selectedText,
      speaker: currentSpeaker,
      speed: speed.toFixed(1)
    };

    try {
      const base64String = await getTextToSpeechData(requestBody);
      const audioElement = document.createElement('audio');

      lastAudioBase64.current = base64String;

      audioElement.src = 'data:audio/wav;base64,' + base64String;
      audioElement.preload = 'auto';
      audioElement.oncanplay = () => audioElement.play();
      setTextAvailable(true);
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  const downloadLastSpeech = (filename = 'speech.wav') => {
    if (!lastAudioBase64.current) return;

    const a = document.createElement('a');
    a.href = 'data:audio/wav;base64,' + lastAudioBase64.current;
    a.download = filename;
    a.click();
  };

  return { playTextToSpeech, downloadLastSpeech };
};
