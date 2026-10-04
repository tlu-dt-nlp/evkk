import { Fragment, useState } from 'react';
import {
  Box, Divider, IconButton, ListItemIcon, ListItemText,
  Menu, MenuItem, Typography
} from '@mui/material';
import {
  AspectRatio, Check, Close, Download, MoreVert, OpenInFull, Print, SortByAlpha
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { CHART_TYPE_OPTIONS } from '../constants';

const ChartToolbar = ({
                        title, chartType, onChartTypeChange, sortAlpha, onSortAlphaChange,
                        isWide, onToggleWide, onFullscreen, onPrint, onDownload, onClose, closeTitleKey,
                        inlineClose
                      }) => {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState(null);

  const closeMenu = () => setAnchor(null);
  const run = (action, ...args) => () => {
    closeMenu();
    action(...args);
  };

  const item = (icon, label, onClick, key) => (
    <MenuItem key={key} onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{label}</ListItemText>
    </MenuItem>
  );

  return (
    <Box className="sv2-chart-toolbar">
      <Typography variant="subtitle2" className="sv2-chart-title">
        {title}
      </Typography>

      <IconButton
        size="small"
        title={t('statistics_chart_options')}
        aria-label={t('statistics_chart_options')}
        onClick={e => setAnchor(e.currentTarget)}
      >
        <MoreVert fontSize="small" />
      </IconButton>

      {inlineClose && (
        <IconButton size="small" title={t(closeTitleKey)} aria-label={t(closeTitleKey)} onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      )}

      <Menu className="statistics-app" anchorEl={anchor} open={Boolean(anchor)} onClose={closeMenu}>
        <Typography variant="overline" className="sv2-menu-section-label">
          {t('statistics_chart_type')}
        </Typography>
        {CHART_TYPE_OPTIONS.map(({ type, icon, titleKey }) => (
          <MenuItem key={type} selected={type === chartType} onClick={run(onChartTypeChange, type)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{t(titleKey)}</ListItemText>
            {type === chartType && <Check fontSize="small" className="sv2-menu-check" />}
          </MenuItem>
        ))}

        <Divider />

        {item(
          <SortByAlpha fontSize="small" />,
          sortAlpha ? t('statistics_sort_by_count') : t('statistics_sort_alphabetically'),
          run(onSortAlphaChange, !sortAlpha),
          'sort'
        )}

        {onToggleWide && item(
          <AspectRatio fontSize="small" />,
          isWide ? t('statistics_collapse_chart') : t('statistics_expand_chart'),
          run(onToggleWide),
          'wide'
        )}

        {onFullscreen && item(
          <OpenInFull fontSize="small" />,
          t('statistics_fullscreen'),
          run(onFullscreen),
          'fullscreen'
        )}

        <Divider />

        {item(<Print fontSize="small" />, t('statistics_print'), run(onPrint), 'print')}
        {item(<Download fontSize="small" />, t('common_download'), run(onDownload), 'download')}

        {!inlineClose && (
          <Fragment>
            <Divider />
            {item(<Close fontSize="small" />, t(closeTitleKey), run(onClose), 'close')}
          </Fragment>
        )}
      </Menu>
    </Box>
  );
};

export default ChartToolbar;
