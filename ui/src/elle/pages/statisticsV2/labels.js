import {
  corpuses,
  educationOptions,
  genderOptions,
  languageOptionsForNativeLangs,
  textLanguageOptions,
  textTypeList,
  usedMaterialsDisplayOptions
} from '../../const/Constants';

const VALUE_LABEL_KEYS = {
  korpus: corpuses,
  sugu: genderOptions,
  kodakondsus: null,
  emakeel: languageOptionsForNativeLangs,
  haridus: educationOptions,
  tekstityyp: textTypeList,
  abivahendid: usedMaterialsDisplayOptions,
  tekstikeel: textLanguageOptions
};

export const translateValue = (t, field, value) => {
  const key = VALUE_LABEL_KEYS[field]?.[value];
  return key ? t(key) : value;
};
