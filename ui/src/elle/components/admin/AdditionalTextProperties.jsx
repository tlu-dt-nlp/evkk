import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Grid, IconButton, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { SecondaryButtonStyle } from '../../const/StyleConstants';
import ReadOnlyField from './ReadOnlyField';

export default function AdditionalTextProperties({ isEditMode, properties, setProperties }) {
  const { t } = useTranslation();

  if (!isEditMode && !properties.length) {
    return null;
  }

  const updateProperty = (index, field, value) => {
    setProperties(prev => prev.map((property, propertyIndex) => (
      propertyIndex === index ? { ...property, [field]: value } : property
    )));
  };

  const removeProperty = (index) => {
    setProperties(prev => prev.filter((_, propertyIndex) => propertyIndex !== index));
  };

  const addProperty = () => {
    setProperties(prev => [
      ...prev,
      {
        propertyName: '',
        propertyValue: ''
      }
    ])
  };

  return (
    <div className="pt-4 pb-5">
      <h5>{t('admin_text_additional_properties')}</h5>

      {isEditMode ? (
        <>
          {properties.map((property, index) => (
            <Grid container
                  alignItems="center"
                  key={index}
                  spacing={2}
            >
              <Grid item sx={{ flex: 1 }}>
                <TextField
                  label={t('admin_text_property_name')}
                  name={`additional-property-name-${index}`}
                  onChange={event => updateProperty(index, 'propertyName', event.target.value)}
                  size="small"
                  value={property.propertyName}
                />
              </Grid>

              <Grid item sx={{ flex: 1 }}>
                <TextField
                  label={t('admin_text_property_value')}
                  name={`additional-property-value-${index}`}
                  onChange={event => updateProperty(index, 'propertyValue', event.target.value)}
                  size="small"
                  value={property.propertyValue}
                />
              </Grid>

              <Grid item sx={{ flex: '0 0 auto' }}>
                <IconButton
                  className="mt-3"
                  color="error"
                  onClick={() => removeProperty(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button
            onClick={addProperty}
            startIcon={<AddIcon />}
            sx={SecondaryButtonStyle}
            type="button"
            variant="outlined"
          >
            {t('admin_text_add_property')}
          </Button>
        </>
      ) : (
        <Grid container spacing={2}>
          {properties.map((property, index) => (
            <ReadOnlyField
              key={`${property.propertyName}-${index}`}
              label={property.propertyName}
              value={property.propertyValue}
            />
          ))}
        </Grid>
      )}
    </div>
  );
}
