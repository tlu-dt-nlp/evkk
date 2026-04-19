import { Checkbox, ListItemIcon, ListItemText, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function SelectMultiple({
                                         name,
                                         selectedValues,
                                         setSelectedValues,
                                         type,
                                         optionList,
                                         valueList,
                                         disabled,
                                         pluralSelectedTranslationKey,
                                         preconditionStatuses,
                                         enableFullRenderValue,
                                         onClose
                                       }) {

  const { t } = useTranslation();
  const isFlatType = type === SelectMultipleType.FLAT || type === SelectMultipleType.FLAT_KEYS;

  const getRenderValue = (values) => {
    if (enableFullRenderValue) {
      return values.join(', ');
    }

    if (values.length > 1) {
      return t(pluralSelectedTranslationKey, { amount: values.length });
    }

    if (type === SelectMultipleType.FLAT_KEYS && Array.isArray(optionList)) {
      const item = optionList.find(option => option.key === values[0]);
      return t(item?.label || item?.key || values[0]);
    }

    return t(valueList ? valueList[values[0]] : values[0]);
  };

  const alterHierarchyDropdown = (e, isParent = false, group = null) => {
    const id = e.target.localName === 'span'
      ? e.target.offsetParent.children[1].id
      : e.target.id;

    if (isParent) {
      const baseOptions = group ? optionList[group] : optionList;
      const childrenArray = Array.from(Object.keys(baseOptions[id]));
      const filteredValues = selectedValues.filter(value => !childrenArray.includes(value));

      if (childrenArray.every(child => selectedValues.includes(child))) {
        setSelectedValues(filteredValues);
      } else {
        setSelectedValues([...filteredValues, ...childrenArray]);
      }

      return;
    }

    if (selectedValues.includes(id)) {
      setSelectedValues(selectedValues.filter(value => value !== id));
    } else {
      setSelectedValues([...selectedValues, id]);
    }
  };

  const checkHierarchyCheckboxStatus = (name, group = null) => {
    const baseKeys = group ? optionList[group] : optionList;
    let checked = true;
    let indeterminate = false;

    Object.keys(baseKeys[name]).forEach(value => {
      if (selectedValues.includes(value)) {
        indeterminate = true;
      } else {
        checked = false;
      }
    });

    return { checked, indeterminate };
  };

  const renderSingleMenuItem = (value, label, group = null, indent = false, isParent = false) => {
    const status = isParent
      ? checkHierarchyCheckboxStatus(value, group)
      : { checked: selectedValues.includes(value), indeterminate: false };

    return (
      <MenuItem
        key={value}
        id={value}
        value={value}
        className={status.checked || status.indeterminate ? 'Mui-selected' : ''}
        onClick={
          isFlatType
            ? null
            : e => alterHierarchyDropdown(e, isParent, group)
        }
        sx={
          indent
            ? { paddingLeft: '2rem' }
            : undefined
        }
      >
        <ListItemIcon>
          <Checkbox
            id={value}
            checked={status.checked}
            indeterminate={!status.checked && status.indeterminate}
          />
        </ListItemIcon>
        <ListItemText
          id={value}
          primary={t(label)}
        />
      </MenuItem>
    );
  };

  const renderSelectWrapper = children => (
    <Select
      multiple
      value={selectedValues}
      name={name}
      renderValue={getRenderValue}
      disabled={disabled}
      onClose={onClose}
      onChange={
        isFlatType
          ? e => setSelectedValues(e.target.value)
          : null
      }
    >
      {children}
    </Select>
  );

  if (type === SelectMultipleType.FLAT) {
    return renderSelectWrapper(
      optionList.map(value => (
        renderSingleMenuItem(value, value)
      ))
    );
  } else if (type === SelectMultipleType.FLAT_KEYS) {
    return renderSelectWrapper(
      optionList.map(item => (
        renderSingleMenuItem(item.key, item.label || item.key)
      ))
    );
  } else if (type === SelectMultipleType.SIMPLE_HIERARCHICAL) {
    return renderSelectWrapper(
      Object.keys(optionList).map(value => (
        typeof optionList[value] === 'string'
          ? renderSingleMenuItem(value, optionList[value])
          : (
            <span key={`${value}_span`}>
              {renderSingleMenuItem(value, value, null, false, true)}
              {Object.keys(optionList[value]).map(childValue => (
                renderSingleMenuItem(childValue, optionList[value][childValue], null, true)
              ))}
            </span>
          )
      ))
    );
  } else if (type === SelectMultipleType.GROUPED_HIERARCHICAL) {
    return renderSelectWrapper(
      Object.keys(optionList).map(group => (
        preconditionStatuses[group] && Object.keys(optionList[group]).map(value => (
          typeof optionList[group][value] === 'string'
            ? renderSingleMenuItem(value, optionList[group][value])
            : (
              <span key={`${value}_span`}>
                {renderSingleMenuItem(value, value, group, false, true)}
                {Object.keys(optionList[group][value]).map(childValue => (
                  renderSingleMenuItem(childValue, optionList[group][value][childValue], null, true)
                ))}
              </span>
            )
        ))
      ))
    );
  }

  return null;
}

export const SelectMultipleType = {
  FLAT: 'FLAT',
  FLAT_KEYS: 'FLAT_KEYS',
  SIMPLE_HIERARCHICAL: 'SIMPLE_HIERARCHICAL',
  GROUPED_HIERARCHICAL: 'GROUPED_HIERARCHICAL'
};
