import { Box, Button, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { successEmitter } from '../../../App';
import {
  textPublishAcademicResearchSubtypeOptions,
  textPublishAcademicStudiesSubtypeOptions
} from '../../const/Constants';
import { DangerButtonStyle, DefaultButtonStyle, SecondaryButtonStyle } from '../../const/StyleConstants';
import {
  useDeleteDonatedText,
  useGetDonatedTextDetails,
  usePublishDonatedText,
  useUpdateDonatedText
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
import DonatedTextEditForm from './DonatedTextEditForm';
import DonatedTextReadOnlyForm from './DonatedTextReadOnlyForm';

const DONATED_TEXT_KNOWN_PROPERTIES = new Set([
  'title',
  'kirjeldus',
  'tekstityyp',
  'abivahendid',
  'akad_oppematerjal',
  'akad_oppematerjal_muu',
  'mitteakad_alamliik',
  'akad_alamliik',
  'artikkel_valjaanne',
  'artikkel_aasta',
  'artikkel_number',
  'artikkel_lehekyljed',
  'kasAutor',
  'vanus',
  'sugu',
  'oppeaste',
  'teaduskraad',
  'haridus',
  'valdkond',
  'emakeel',
  'muudkeeled',
  'riik'
]);

const EMPTY_DONATED_TEXT_FORM = {
  title: '',
  kirjeldus: '',
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
  tekstiAutor: '',
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

const inferUsedMaterials = (usedMaterials) => {
  if (usedMaterials === 'jah') {
    return 'true';
  }
  if (usedMaterials === 'ei') {
    return 'false';
  }
  return '';
};

const inferAcademicCategory = (subtype) => {
  if (Object.keys(textPublishAcademicStudiesSubtypeOptions).includes(subtype)) {
    return 'ak_erialaopingud';
  }
  if (Object.keys(textPublishAcademicResearchSubtypeOptions).includes(subtype)) {
    return 'ak_uurimused';
  }
  return '';
};

const createDonatedTextFormData = (details) => {
  const properties = details?.properties ?? [];

  const usedMaterials = getFirstPropertyValue(properties, 'abivahendid');
  const academicSubtype = getFirstPropertyValue(properties, 'akad_alamliik');

  return {
    ...EMPTY_DONATED_TEXT_FORM,
    title: getFirstPropertyValue(properties, 'title'),
    kirjeldus: getFirstPropertyValue(properties, 'kirjeldus'),
    liik: getFirstPropertyValue(properties, 'tekstityyp'),
    oppematerjal: inferUsedMaterials(usedMaterials),
    akadOppematerjal: getPropertyValues(properties, 'akad_oppematerjal'),
    akadOppematerjalMuu: getFirstPropertyValue(properties, 'akad_oppematerjal_muu'),
    mitteakadAlamliik: getFirstPropertyValue(properties, 'mitteakad_alamliik'),
    akadKategooria: inferAcademicCategory(academicSubtype),
    akadAlamliik: academicSubtype,
    artikkelValjaanne: getFirstPropertyValue(properties, 'artikkel_valjaanne'),
    artikkelAasta: getFirstPropertyValue(properties, 'artikkel_aasta'),
    artikkelNumber: getFirstPropertyValue(properties, 'artikkel_number'),
    artikkelLehekyljed: getFirstPropertyValue(properties, 'artikkel_lehekyljed'),
    tekstiAutor: getFirstPropertyValue(properties, 'kasAutor'),
    autoriVanus: getFirstPropertyValue(properties, 'vanus'),
    autoriSugu: getFirstPropertyValue(properties, 'sugu'),
    autoriOppeaste: getFirstPropertyValue(properties, 'oppeaste'),
    autoriTeaduskraad: getFirstPropertyValue(properties, 'teaduskraad'),
    autoriHaridus: getFirstPropertyValue(properties, 'haridus'),
    autoriValdkond: getFirstPropertyValue(properties, 'valdkond'),
    autoriEmakeel: getFirstPropertyValue(properties, 'emakeel'),
    autoriMuudKeeled: getPropertyValues(properties, 'muudkeeled').join(', '),
    autoriElukohariik: getFirstPropertyValue(properties, 'riik')
  };
};

const createDonatedTextPayload = (text, formData, additionalProperties) => {
  const properties = [];

  pushProperty(properties, 'title', formData.title);
  pushProperty(properties, 'kirjeldus', formData.kirjeldus);
  pushProperty(properties, 'tekstityyp', formData.liik);

  if (formData.oppematerjal === 'true' || formData.oppematerjal === true) {
    pushProperty(properties, 'abivahendid', 'jah');
    pushMultiProperties(properties, 'akad_oppematerjal', formData.akadOppematerjal);
    pushProperty(properties, 'akad_oppematerjal_muu', formData.akadOppematerjalMuu);
  } else if (formData.oppematerjal === 'false' || formData.oppematerjal === false) {
    pushProperty(properties, 'abivahendid', 'ei');
  }

  if (formData.liik === 'akadeemiline') {
    pushProperty(properties, 'valdkond', formData.autoriValdkond);
    pushProperty(properties, 'akad_alamliik', formData.akadAlamliik);
    pushProperty(properties, 'artikkel_valjaanne', formData.artikkelValjaanne);
    pushProperty(properties, 'artikkel_aasta', formData.artikkelAasta);
    pushProperty(properties, 'artikkel_number', formData.artikkelNumber);
    pushProperty(properties, 'artikkel_lehekyljed', formData.artikkelLehekyljed);
    pushProperty(properties, 'oppeaste', formData.autoriOppeaste);
    pushProperty(properties, 'teaduskraad', formData.autoriTeaduskraad);
  }

  if (formData.liik === 'mitteakadeemiline') {
    pushProperty(properties, 'mitteakad_alamliik', formData.mitteakadAlamliik);
    pushProperty(properties, 'haridus', formData.autoriHaridus);
  }

  pushProperty(properties, 'kasAutor', formData.tekstiAutor);
  pushProperty(properties, 'vanus', formData.autoriVanus);
  pushProperty(properties, 'sugu', formData.autoriSugu);
  pushProperty(properties, 'emakeel', formData.autoriEmakeel?.toLowerCase());
  pushMultiProperties(properties, 'muudkeeled', formData.autoriMuudKeeled.split(',').map(s => s.trim()).filter(Boolean));
  pushProperty(properties, 'riik', formData.autoriElukohariik);

  appendAdditionalProperties(properties, additionalProperties);

  return { text, properties };
};

export default function DonatedTextDetailsModal({ isOpen, refetch, setIsOpen, textId }) {
  const { t } = useTranslation();
  const { getDonatedTextDetails } = useGetDonatedTextDetails();
  const { publishDonatedText } = usePublishDonatedText();
  const { updateDonatedText } = useUpdateDonatedText();
  const { deleteDonatedText } = useDeleteDonatedText();

  const [details, setDetails] = useState(null);
  const [text, setText] = useState('');
  const [formData, setFormData] = useState(EMPTY_DONATED_TEXT_FORM);
  const [additionalProperties, setAdditionalProperties] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const title = getTextTitle(details);

  const hydrateForm = useCallback((response) => {
    setDetails(response);
    setText(response?.text ?? '');
    setFormData(createDonatedTextFormData(response));
    setAdditionalProperties(toAdditionalProperties(response?.properties, DONATED_TEXT_KNOWN_PROPERTIES));
  }, []);

  useEffect(() => {
    if (!isOpen || !textId) {
      return;
    }

    setDetails(null);
    setIsEditMode(false);
    setIsPublishModalOpen(false);
    setIsDeleteModalOpen(false);

    getDonatedTextDetails(textId).then(response => {
      if (!response) {
        return;
      }
      hydrateForm(response);
    });
  }, [isOpen, textId, getDonatedTextDetails, hydrateForm]);

  const buildPayload = () => createDonatedTextPayload(text, formData, additionalProperties);

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = buildPayload();
    if (!payload) {
      return;
    }

    updateDonatedText(textId, payload).then(response => {
      if (!response) {
        return;
      }

      hydrateForm(response);
      setIsEditMode(false);
      refetch();
      successEmitter.emit(SuccessSnackbarEventType.GENERIC_SUCCESS);
    });
  };

  const handleCancel = () => {
    hydrateForm(details);
    setIsEditMode(false);
  };

  const handlePublish = () => {
    const payload = isEditMode ? buildPayload() : null;
    if (isEditMode && !payload) {
      setIsPublishModalOpen(false);
      return;
    }

    publishDonatedText(textId, payload).then(response => {
      if (!response) {
        return;
      }

      refetch();
      successEmitter.emit(SuccessSnackbarEventType.GENERIC_SUCCESS);
      setIsPublishModalOpen(false);
      setIsOpen(false);
    });
  };

  const handleDelete = () => {
    deleteDonatedText(textId).then(() => {
      refetch();
      successEmitter.emit(SuccessSnackbarEventType.GENERIC_SUCCESS);
      setIsDeleteModalOpen(false);
      setIsOpen(false);
    });
  };

  const headerActions = (
    <Box className="d-flex flex-wrap gap-1">
      <Button
        onClick={() => setIsPublishModalOpen(true)}
        size="small"
        sx={DefaultButtonStyle}
        type="button"
        variant="contained"
      >
        {t('common_publish')}
      </Button>

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
        innerClassName="modal-head-stacked"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={title}
      >
        <form onSubmit={handleSubmit}>
          {isEditMode ? (
            <DonatedTextEditForm
              formData={formData}
              setFormData={setFormData}
              setText={setText}
              text={text}
            />
          ) : (
            <DonatedTextReadOnlyForm
              formData={formData}
              text={text}
            />
          )}

          <AdditionalTextProperties
            isEditMode={isEditMode}
            properties={additionalProperties}
            setProperties={setAdditionalProperties}
          />

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
        isOpen={isPublishModalOpen}
        message={t('admin_text_publish_modal_message')}
        onCancel={() => setIsPublishModalOpen(false)}
        onConfirm={handlePublish}
        setIsOpen={setIsPublishModalOpen}
        title="admin_text_publish_modal_title"
      />

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
