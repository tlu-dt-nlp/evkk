import { Button, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useTranslation } from 'react-i18next';
import { DefaultButtonStyle } from '../const/StyleConstants';
import { downloadCanvasAsImage, downloadSvgAsImage } from '../util/ImageDownloadUtils';

export default function ImageDownloadButton({ element, sourceType, fileName }) {

  const { t } = useTranslation();

  const handleClick = () => {
    if (sourceType === ImageDownloadSourceType.SVG) {
      downloadSvgAsImage(element, t(fileName));
    } else {
      downloadCanvasAsImage(element, t(fileName));
    }
  };

  return (
    <Tooltip
      title={t('common_download')}
      placement="top"
    >
      <Button
        style={DefaultButtonStyle}
        variant="contained"
        onClick={handleClick}
      >
        <DownloadIcon />
      </Button>
    </Tooltip>
  );
}

export const ImageDownloadSourceType = {
  SVG: 'SVG',
  CANVAS: 'CANVAS'
};
