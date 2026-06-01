export const getPropertyValues = (properties, propertyName) => (
  (properties ?? [])
    .filter(property => property.propertyName === propertyName)
    .map(property => property.propertyValue)
);

export const getFirstPropertyValue = (properties, propertyName, fallback = '') => (
  getPropertyValues(properties, propertyName)?.[0] ?? fallback
);

export const getTextTitle = (details, fallback = '') => (
  getFirstPropertyValue(details?.properties, 'title', fallback)
);

const isFilled = value => (
  Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && String(value).trim() !== ''
);

const createProperty = (propertyName, propertyValue) => ({
  propertyName,
  propertyValue
});

export const pushProperty = (properties, propertyName, propertyValue) => {
  if (isFilled(propertyValue)) {
    properties.push(createProperty(propertyName, String(propertyValue)));
  }
};

export const pushMultiProperties = (properties, propertyName, values) => {
  (values ?? [])
    .filter(isFilled)
    .forEach(value => pushProperty(properties, propertyName, value));
};

export const translateOption = (t, optionList, value) => {
  if (!value) {
    return null;
  }

  const translationKey = optionList?.[value];
  return translationKey ? t(translationKey) : value;
};

export const translateOptions = (t, optionList, values) => {
  return (values ?? [])
    .map(value => translateOption(t, optionList, value))
    .join(', ');
};

export const toAdditionalProperties = (properties, knownProperties) => (
  (properties ?? [])
    .filter(property => !knownProperties.has(property.propertyName))
    .map(property => ({ ...property }))
);

export const appendAdditionalProperties = (properties, additionalProperties) => {
  additionalProperties
    .filter(property => property.propertyName?.trim() && property.propertyValue?.trim())
    .forEach(property => pushProperty(properties, property.propertyName.trim(), property.propertyValue.trim()));
};
