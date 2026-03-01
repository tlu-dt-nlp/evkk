import { Tabs, useMediaQuery } from '@mui/material';
import './styles/GenericTabs.css';

export default function GenericTabs({
                                      children,
                                      className,
                                      value,
                                      handleChange,
                                      leftPadding = false,
                                      mobileViewMaxWidth = '600px',
                                      secondaryVariant = ''
                                    }) {

  const isMobileView = useMediaQuery(`(max-width:${mobileViewMaxWidth})`);
  const tabsVariant = isMobileView ? 'scrollable' : secondaryVariant;

  return (
    <Tabs
      className={`generic-tabs ${className}`}
      orientation="horizontal"
      variant={tabsVariant}
      centered={!isMobileView}
      value={value}
      onChange={handleChange}
      scrollButtons
      allowScrollButtonsMobile
      sx={{
        paddingLeft: leftPadding ? '15px' : '0'
      }}
    >
      {children}
    </Tabs>
  );
}
