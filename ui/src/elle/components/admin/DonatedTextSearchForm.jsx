import { Alert, Button, Grid } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DonatedTextDetailsFormMode } from '../../const/Constants';
import { DefaultButtonStyle } from '../../const/StyleConstants';
import DonatedTextDetailsForm from '../form/DonatedTextDetailsForm';

const INITIAL_FORM_DATA = {
  liik: '',
  oppematerjal: '',
  akadOppematerjal: [],
  akadOppematerjalMuu: '',
  mitteakadAlamliik: '',
  akadKategooria: '',
  akadAlamliik: '',
  artikkelValjaanne: '',
  artikkelAasta: '',
  artikkelNumber: '',
  artikkelLehekyljed: '',
  autoriVanus: '',
  autoriSugu: '',
  autoriOppeaste: '',
  autoriTeaduskraad: '',
  autoriHaridus: '',
  autoriValdkond: '',
  autoriEmakeel: '',
  autoriMuudKeeled: '',
  autoriElukohariik: ''
};

const FIELD_DEPENDENCIES = {
  liik: [
    'mitteakadAlamliik',
    'akadKategooria',
    'akadAlamliik',
    'artikkelValjaanne',
    'artikkelAasta',
    'artikkelNumber',
    'artikkelLehekyljed',
    'autoriOppeaste',
    'autoriTeaduskraad',
    'autoriHaridus',
    'autoriValdkond'
  ],
  oppematerjal: [
    'akadOppematerjal',
    'akadOppematerjalMuu'
  ],
  akadKategooria: [
    'akadAlamliik',
    'artikkelValjaanne',
    'artikkelAasta',
    'artikkelNumber',
    'artikkelLehekyljed'
  ],
  akadAlamliik: [
    'artikkelValjaanne',
    'artikkelAasta',
    'artikkelNumber',
    'artikkelLehekyljed'
  ]
};

export default function DonatedTextSearchForm({ fetchTexts, onResults }) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [noResultsError, setNoResultsError] = useState(false);

  const updateFormField = (name, value) => {
    setFormData(prev => {
      const isResetting = prev[name] === value || value === undefined;
      const updatedValue = isResetting ? '' : value;

      const nextState = { ...prev, [name]: updatedValue };

      if (FIELD_DEPENDENCIES[name]) {
        FIELD_DEPENDENCIES[name].forEach(dependentField => {
          nextState[dependentField] = INITIAL_FORM_DATA[dependentField];
        });
      }

      return nextState;
    });
  };

  const handleStandardChange = (event, fieldName) => {
    const isClick = event.type === 'click';
    const name = isClick ? fieldName : event.target.name;
    const value = isClick ? event.target.dataset?.value : event.target.value;

    updateFormField(name, value);
  };

  const formatPayload = (formData) => {
    const payload = {};

    Object.entries(formData).forEach(([key, value]) => {
      // Skip UI-only field
      if (key === 'akadKategooria') {
        return;
      }

      const hasValue = Array.isArray(value) ? value.length > 0 : value !== '';

      if (hasValue) {
        // Convert "true" or "false" string to actual boolean value
        if (key === 'oppematerjal') {
          payload[key] = value === 'true';
        } else {
          payload[key] = value;
        }
      }
    });

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = formatPayload(formData);

    const response = await fetchTexts(payload);
    if (!response) {
      return;
    }

    const hasResults = response.length > 0;
    setNoResultsError(!hasResults);
    onResults?.(response);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container
            spacing={3}
            sx={{
              flexDirection: { xs: 'column', sm: 'row' }
            }}
      >
        <DonatedTextDetailsForm
          formData={formData}
          itemSize={{ xs: 12, sm: 6, md: 6 }}
          mode={DonatedTextDetailsFormMode.SEARCH}
          onChange={handleStandardChange}
          onMultiValueChange={updateFormField}
        />
      </Grid>

      {noResultsError && (
        <Alert severity="error" sx={{ my: 2 }}>
          {t('query_results_no_texts_found')}
        </Alert>
      )}

      <Button
        sx={DefaultButtonStyle}
        type="submit"
        variant="contained"
      >
        {t('send_request_button')}
      </Button>
    </form>
  );
}
