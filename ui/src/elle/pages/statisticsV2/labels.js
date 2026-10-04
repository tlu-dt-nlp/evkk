import {
  corpuses,
  educationOptions,
  genderOptions,
  languageOptionsForNativeLangs,
  textLanguageOptions,
  textTypeList,
  usedMaterialsDisplayOptions
} from '../../const/Constants';

// Raw core.text_property values -> the same translation keys the "Otsi tekste" query uses,
// so a chart label and a query form option read identically. Fields left out here
// (keeletase, aasta, kodakondsus) are already stored as human-readable values.
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

// Falls back to the raw value, so a database value with no mapping shows up as itself
// rather than as a blank label.
export const translateValue = (t, field, value) => {
  const key = VALUE_LABEL_KEYS[field]?.[value];
  return key ? t(key) : value;
};
