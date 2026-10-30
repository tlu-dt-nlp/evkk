import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Grid, IconButton, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { SecondaryButtonStyle } from '../../const/StyleConstants';
import ReadOnlyField from './ReadOnlyField';

export default function AdditionalTextProperties({
                                                   isEditMode,
                                                   properties,
                                                   setProperties,
                                                   reservedNames,
                                                   derivedNames = new Set()
                                                 }) {
  const { t } = useTranslation();

  // Properties with a dedicated form field (except for the ones loaded as-is from the server)
  // and properties derived automatically can't be added here
  const getNameError = (property) => {
    const name = property.propertyName.trim().toLowerCase();
    if (reservedNames.has(name) && name !== property.allowedName) {
      return t('admin_text_property_name_reserved');
    }
    if (derivedNames.has(name)) {
      return t('admin_text_property_name_derived');
    }
    return '';
  };

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
      <div className="mb-2 font-weight-bold">{t('admin_text_additional_properties')}</div>

      {isEditMode ? (
        <>
          {properties.map((property, index) => (
            <Grid container
                  alignItems="flex-start"
                  key={index}
                  spacing={2}
            >
              <Grid item sx={{ flex: 1 }}>
                <TextField
                  error={!!getNameError(property)}
                  helperText={getNameError(property)}
                  inputRef={input => input?.setCustomValidity(getNameError(property))}
                  label={t('admin_text_property_name')}
                  name={`additional-property-name-${index}`}
                  onChange={event => updateProperty(index, 'propertyName', event.target.value)}
                  size="small"
                  slotProps={{ formHelperText: { sx: { marginBottom: '1rem' } } }}
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
                  color="error"
                  onClick={() => removeProperty(index)}
                  // label min-height + margin from index.css, so the button is level with the inputs
                  sx={{ marginTop: 'calc(25px + .25rem)' }}
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
