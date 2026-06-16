import { Box, Button, Stack, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { successEmitter } from '../../../App';
import { DangerButtonStyle, DefaultButtonStyle, SecondaryButtonStyle } from '../../const/StyleConstants';
import {
  useDeletePublishedText,
  useGetPublishedTextDetails,
  useUpdatePublishedText
} from '../../hooks/service/AdminTextService';
import {
  appendAdditionalProperties,
  getFirstPropertyValue,
  getPropertyValues,
  getTextTitle,
  pushMultiProperties,
  pushProperty,
  toAdditionalProperties
} from '../../util/AdminUtils';
import ConfirmationModal from '../modal/ConfirmationModal';
import ModalBase from '../modal/ModalBase';
import { SuccessSnackbarEventType } from '../snackbar/SuccessSnackbar';
import AdditionalTextProperties from './AdditionalTextProperties';
import PublishedTextEditForm from './PublishedTextEditForm';
import PublishedTextReadOnlyForm from './PublishedTextReadOnlyForm';
import ReadOnlyField from './ReadOnlyField';

const PUBLISHED_TEXT_KNOWN_PROPERTIES = new Set([
  'title',
  'korpus',
  'tekstityyp',
  'tekstikeel',
  'keeletase',
  'tulemusvahemik',
  'abivahendid',
  'valdkond',
  'akad_oppematerjal',
  'ajavahemik',
  'vanusevahemik',
  'sugu',
  'haridus',
  'oppeaste',
  'teaduskraad',
  'emakeel',
  'muudkeeled',
  'kodakondsus',
  'riik'
]);

const EMPTY_PUBLISHED_TEXT_FORM = {
  title: '',
  korpus: '',
  tekstityyp: '',
  tekstikeel: '',
  keeletase: '',
  tulemusvahemik: '',
  abivahendid: '',
  valdkond: '',
  akadOppematerjal: [],
  ajavahemik: '',
  vanusevahemik: '',
  sugu: '',
  haridus: '',
  oppeaste: '',
  teaduskraad: '',
  emakeel: '',
  muudkeeled: '',
  kodakondsus: '',
  riik: ''
};

const createPublishedTextFormData = (details) => {
  const properties = details?.properties ?? [];

  const korpus = getFirstPropertyValue(properties, 'korpus');
  const isAcademic = korpus === 'cwUSEqQLt';
  const isL1Estonian = korpus === 'cYDRkpymb';
  const isL2Exams = korpus === 'clWmOIrLa';

  return {
    ...EMPTY_PUBLISHED_TEXT_FORM,

    title: getFirstPropertyValue(properties, 'title'),
    korpus,
    tekstityyp: getFirstPropertyValue(properties, 'tekstityyp'),
    tekstikeel: getFirstPropertyValue(properties, 'tekstikeel'),
    ajavahemik: getFirstPropertyValue(properties, 'ajavahemik'),
    vanusevahemik: getFirstPropertyValue(properties, 'vanusevahemik'),
    sugu: getFirstPropertyValue(properties, 'sugu'),
    riik: getFirstPropertyValue(properties, 'riik'),

    ...(isAcademic ? {
      valdkond: getFirstPropertyValue(properties, 'valdkond'),
      akadOppematerjal: getPropertyValues(properties, 'akad_oppematerjal'),
      oppeaste: getFirstPropertyValue(properties, 'oppeaste'),
      teaduskraad: getFirstPropertyValue(properties, 'teaduskraad'),
      muudkeeled: getPropertyValues(properties, 'muudkeeled').join(', ')
    } : {
      abivahendid: getFirstPropertyValue(properties, 'abivahendid'),
      haridus: getFirstPropertyValue(properties, 'haridus')
    }),

    ...(isL1Estonian ? {
      tulemusvahemik: getFirstPropertyValue(properties, 'tulemusvahemik')
    } : {
      keeletase: getFirstPropertyValue(properties, 'keeletase')
    }),

    ...(isL2Exams ? {
      kodakondsus: getFirstPropertyValue(properties, 'kodakondsus')
    } : {
      emakeel: getFirstPropertyValue(properties, 'emakeel')
    })
  };
};

const createPublishedTextPayload = (text, formData, additionalProperties) => {
  const properties = [];

  const isAcademic = formData.korpus === 'cwUSEqQLt';
  const isL1Estonian = formData.korpus === 'cYDRkpymb';
  const isL2Exams = formData.korpus === 'clWmOIrLa';

  pushProperty(properties, 'title', formData.title);
  pushProperty(properties, 'korpus', formData.korpus);
  pushProperty(properties, 'tekstityyp', formData.tekstityyp);
  pushProperty(properties, 'tekstikeel', formData.tekstikeel);
  pushProperty(properties, 'ajavahemik', formData.ajavahemik);
  pushProperty(properties, 'vanusevahemik', formData.vanusevahemik);
  pushProperty(properties, 'sugu', formData.sugu);
  pushProperty(properties, 'riik', formData.riik);

  if (isAcademic) {
    pushProperty(properties, 'valdkond', formData.valdkond);
    pushMultiProperties(properties, 'akad_oppematerjal', formData.akadOppematerjal);
    pushProperty(properties, 'oppeaste', formData.oppeaste);
    pushProperty(properties, 'teaduskraad', formData.teaduskraad);
    pushMultiProperties(properties, 'muudkeeled', formData.muudkeeled.split(',').map(s => s.trim()).filter(Boolean));
  } else {
    pushProperty(properties, 'abivahendid', formData.abivahendid);
    pushProperty(properties, 'haridus', formData.haridus);
  }

  if (isL1Estonian) {
    pushProperty(properties, 'tulemusvahemik', formData.tulemusvahemik);
  } else {
    pushProperty(properties, 'keeletase', formData.keeletase);
  }

  if (isL2Exams) {
    pushProperty(properties, 'kodakondsus', formData.kodakondsus);
  } else {
    pushProperty(properties, 'emakeel', formData.emakeel);
  }

  appendAdditionalProperties(properties, additionalProperties);

  return { text, properties };
};

export default function PublishedTextDetailsModal({ isOpen, refetch, setIsOpen, textId }) {
  const { t } = useTranslation();
  const { getPublishedTextDetails } = useGetPublishedTextDetails();
  const { updatePublishedText } = useUpdatePublishedText();
  const { deletePublishedText } = useDeletePublishedText();

  const [details, setDetails] = useState(null);
  const [text, setText] = useState('');
  const [formData, setFormData] = useState(EMPTY_PUBLISHED_TEXT_FORM);
  const [additionalProperties, setAdditionalProperties] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const title = getTextTitle(details);

  const hydrateForm = useCallback((response) => {
    setDetails(response);
    setText(response?.text ?? '');

    const newFormData = createPublishedTextFormData(response);
    setFormData(newFormData);

    const orphanedKnownProperties = (response?.properties ?? [])
      .filter(p => PUBLISHED_TEXT_KNOWN_PROPERTIES.has(p.propertyName))
      .filter(p => {
        const formKey = p.propertyName === 'akad_oppematerjal' ? 'akadOppematerjal' : p.propertyName;
        const formValue = newFormData[formKey];
        return formValue === '' || formValue === undefined || (Array.isArray(formValue) && formValue.length === 0);
      });

    setAdditionalProperties([
      ...toAdditionalProperties(response?.properties, PUBLISHED_TEXT_KNOWN_PROPERTIES),
      ...orphanedKnownProperties.map(p => ({ ...p }))
    ]);
  }, []);

  useEffect(() => {
    if (!isOpen || !textId) {
      return;
    }

    setDetails(null);
    setIsEditMode(false);
    setIsDeleteModalOpen(false);

    getPublishedTextDetails(textId).then(response => {
      if (!response) {
        return;
      }
      hydrateForm(response);
    });
  }, [isOpen, textId, getPublishedTextDetails, hydrateForm]);

  const buildPayload = () => createPublishedTextPayload(text, formData, additionalProperties);

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = buildPayload();
    if (!payload) {
      return;
    }

    updatePublishedText(textId, payload).then(response => {
      if (!response) {
        return;
      }

      hydrateForm(response);
      setIsEditMode(false);
      refetch();
      successEmitter.emit(SuccessSnackbarEventType.GENERIC_SUCCESS);
    });
  };

  const handleChange = (event) => {
    setFormData(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleTextChange = (event) => {
    setText(event.target.value.replaceAll('\n', String.raw`\n`));
  };

  const handleCancel = () => {
    hydrateForm(details);
    setIsEditMode(false);
  };

  const handleDelete = () => {
    deletePublishedText(textId).then(() => {
      refetch();
      successEmitter.emit(SuccessSnackbarEventType.GENERIC_SUCCESS);
      setIsDeleteModalOpen(false);
      setIsOpen(false);
    });
  };

  const headerActions = (
    <Box className="d-flex flex-wrap gap-1" sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
      {!isEditMode && (
        <Button
          onClick={() => setIsEditMode(true)}
          size="small"
          sx={SecondaryButtonStyle}
          type="button"
          variant="outlined"
        >
          {t('common_edit')}
        </Button>
      )}

      <Button
        onClick={() => setIsDeleteModalOpen(true)}
        size="small"
        sx={DangerButtonStyle}
        type="button"
        variant="outlined"
      >
        {t('common_delete')}
      </Button>
    </Box>
  );

  return (
    <>
      <ModalBase
        disableComfortClosing
        headerActions={headerActions}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={title}
      >
        <form onSubmit={handleSubmit}>
          {isEditMode ? (
            <PublishedTextEditForm
              formData={formData}
              setFormData={setFormData}
            />
          ) : (
            <PublishedTextReadOnlyForm
              formData={formData}
            />
          )}

          <AdditionalTextProperties
            isEditMode={isEditMode}
            properties={additionalProperties}
            setProperties={setAdditionalProperties}
          />

          <Stack spacing={2}>
            {isEditMode ? (
              <>
                <TextField
                  label={t('publish_your_text_title')}
                  multiline
                  name="title"
                  onChange={handleChange}
                  required
                  size="small"
                  value={formData.title}
                />

                <TextField
                  label={t('publish_your_text_content')}
                  multiline
                  name="sisu"
                  onChange={handleTextChange}
                  required
                  rows={8}
                  value={text.replaceAll(String.raw`\n`, '\n')}
                />
              </>
            ) : (
              <>
                <ReadOnlyField
                  label={t('query_results_text_title')}
                  value={formData.title}
                />

                <ReadOnlyField
                  label={t('publish_your_text_content')}
                  value={text}
                  multiline
                />
              </>
            )}
          </Stack>

          {isEditMode && (
            <Stack direction="row" spacing={2}>
              <Button
                sx={DefaultButtonStyle}
                type="submit"
                variant="contained"
              >
                {t('common_save')}
              </Button>

              <Button
                onClick={handleCancel}
                sx={SecondaryButtonStyle}
                type="button"
                variant="outlined"
              >
                {t('common_cancel')}
              </Button>
            </Stack>
          )}
        </form>
      </ModalBase>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        message={t('admin_text_delete_modal_message')}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        setIsOpen={setIsDeleteModalOpen}
        title="admin_text_delete_modal_title"
      />
    </>
  );
}
