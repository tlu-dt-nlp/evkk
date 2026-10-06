import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetPropertyNames, useGetPropertyValues } from '../../hooks/service/AdminTextService';

function PropertyValuesPanel({ propertyName }) {
  const { getPropertyValues } = useGetPropertyValues();
  const [values, setValues] = useState(null);

  useEffect(() => {
    getPropertyValues(propertyName).then((data) => {
      setValues(data ?? []);
    });
  }, [propertyName, getPropertyValues]);

  return (
    <AccordionDetails>
      {values !== null && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {values.length === 0 && (
            <Typography variant="body2" color="text.secondary">—</Typography>
          )}
          {values.map((v) => (
            <Chip key={v} label={v} size="small" variant="outlined" />
          ))}
        </Box>
      )}
    </AccordionDetails>
  );
}

export default function PropertyValuesBrowser() {
  const { t } = useTranslation();
  const { getPropertyNames } = useGetPropertyNames();
  const [propertyNames, setPropertyNames] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getPropertyNames().then((data) => setPropertyNames(data ?? []));
  }, [getPropertyNames]);

  const handleChange = (name) => (_event, isExpanded) => {
    setExpanded(isExpanded ? name : null);
  };

  if (!propertyNames) return null;

  return (
    <>
      <h2 className="text-center pb-3">
        {t('admin_property_values_title')}
      </h2>

      {propertyNames.map((name) => (
        <Accordion
          key={name}
          expanded={expanded === name}
          onChange={handleChange(name)}
          disableGutters
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            {name}
          </AccordionSummary>

          {expanded === name && (
            <PropertyValuesPanel propertyName={name} />
          )}
        </Accordion>
      ))}
    </>
  );
}
