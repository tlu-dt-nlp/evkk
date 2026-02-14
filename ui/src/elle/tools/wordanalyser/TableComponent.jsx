import { Box, Grid, Tab, Tabs } from '@mui/material';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabContext } from './Contexts';

export default function TableComponent() {

  const { t } = useTranslation();
  const setTabValue = useContext(TabContext)[1];

  const handleChange = (_event, newValue) => {
    setValue(newValue);
    setTabValue(newValue + 1);
  };

  const [value, setValue] = useState(0);

  return (
    <Box>
      <Grid
        item
        size={12}
        marginTop="100px"
        marginBottom="50px"
      >
        <h2>{t('text_analysis')}</h2>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
          >
            <Tab label={t('common_syllables')} />
            <Tab label={t('common_lemmas')} />
            <Tab label={t('tab_gram_anal')} />
          </Tabs>
        </Box>
      </Grid>
    </Box>);
}
