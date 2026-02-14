import { Button, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useTranslation } from 'react-i18next';
import './styles/ImageDownloadButton.css';
import { DefaultButtonStyle } from '../const/StyleConstants';

export default function ImageDownloadButton({ element, sourceType, fileName }) {

  const { t } = useTranslation();
  const imagePadding = 20;

  const handleClick = () => {
    if (sourceType === ImageDownloadSourceType.SVG) {
      downloadSvgAsImage();
    } else {
      downloadCanvasAsImage();
    }
  };

  const downloadSvgAsImage = () => {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(element);

    const image = new Image();

    image.onload = () => {
      const canvas = createNewCanvas(image);
      const context = canvas.getContext('2d');

      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.drawImage(image, imagePadding, imagePadding, image.width, image.height);

      canvasAsImage(canvas);
    };

    image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  };

  const downloadCanvasAsImage = () => {
    canvasAsImage(element);
  };

  const canvasAsImage = (canvasElement) => {
    const canvas = createNewCanvas(canvasElement);
    const context = canvas.getContext('2d');

    context.drawImage(canvasElement, imagePadding, imagePadding);

    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, imagePadding);
    context.fillRect(0, 0, imagePadding, canvas.height);
    context.fillRect(canvas.width - imagePadding, 0, imagePadding, canvas.height);
    context.fillRect(0, canvas.height - imagePadding, canvas.width, imagePadding);

    const canvasDataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = canvasDataURL;
    link.download = t(fileName);
    link.click();
  };

  const createNewCanvas = (element) => {
    const canvas = document.createElement('canvas');
    canvas.width = element.width + 2 * imagePadding;
    canvas.height = element.height + 2 * imagePadding;
    return canvas;
  };

  return (
    <div className="image-download-button-row">
      <Tooltip
        title={t('common_download')}
        placement="top"
      >
        <Button
          style={DefaultButtonStyle}
          variant="contained"
          onClick={handleClick}
        >
          <DownloadIcon fontSize="large" />
        </Button>
      </Tooltip>
    </div>
  );
}

export const ImageDownloadSourceType = {
  SVG: 'SVG',
  CANVAS: 'CANVAS'
};
