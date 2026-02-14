import { DefaultButtonStyle, DefaultCircularProgressStyle } from '../../../const/StyleConstants';
import BrushIcon from '@mui/icons-material/Brush';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalBase from '../../../components/modal/ModalBase';
import '../styles/WordcloudView.css';
import WordCloud from 'wordcloud';
import ImageDownloadButton, { ImageDownloadSourceType } from '../../../components/ImageDownloadButton';

export default function WordcloudView({ data }) {

  const { t } = useTranslation();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [canvas, setCanvas] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const canvasHeight = 475;
  const canvasWidth = 1275;

  useEffect(() => {
    if (modalOpen && canvas) {
      canvas.addEventListener('wordcloudstop', () => {
        setIsLoading(false);
      });

      const list = data.map(({ word, frequencyCount }) => [word, frequencyCount]);
      WordCloud(canvas, {
        list: list,
        backgroundColor: '#FCFCFC',
        drawOutOfBound: false,
        shrinkToFit: true,
        minSize: 12,
        gridSize: Math.round(16 * canvasWidth / 1024),
        weightFactor: (size) => Math.sqrt(size) * 36
      });
    }

    return (() => {
      canvas?.removeEventListener('wordcloudstop', () => {
        setIsLoading(false);
      });
    });
  }, [modalOpen, data, canvas]);

  const handleClick = () => {
    setTooltipOpen(false);
    setModalOpen(true);
    setIsLoading(true);
  };

  return (
    <Tooltip
      title={t('wordlist_wordcloud')}
      open={tooltipOpen}
      placement="top"
    >
      <Button
        style={DefaultButtonStyle}
        variant="contained"
        onClick={handleClick}
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
      >
        <BrushIcon fontSize="large" />
      </Button>
      <ModalBase
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        innerClassName="wordcloud-modal"
        title="wordlist_wordcloud"
      >
        {isLoading ? (
          <div className="wordcloud-loader-container">
            <CircularProgress style={DefaultCircularProgressStyle} />
            <span>
            {t('wordlist_wordcloud_loading')}
            </span>
          </div>) : (
          <>
            <ImageDownloadButton
              element={canvas}
              sourceType={ImageDownloadSourceType.CANVAS}
              fileName="wordlist_wordcloud_filename"
            />
            <br />
          </>)
        }
        <canvas
          ref={setCanvas}
          height={canvasHeight}
          width={canvasWidth}
        ></canvas>
      </ModalBase>
    </Tooltip>
  );
}
