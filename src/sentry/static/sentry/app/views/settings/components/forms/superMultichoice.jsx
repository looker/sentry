import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import {t} from 'app/locale';
import Button from 'app/components/buttons/button';
import InputField from 'app/views/settings/components/forms/inputField';
import SelectControl from 'app/components/forms/selectControl';
import DropdownAutoComplete from 'app/components/dropdownAutoComplete';
import DropdownButton from 'app/components/dropdownButton';

export default class SuperMultichoice extends React.Component {
  static propTypes = {
    ...InputField.propTypes,

    /**
     * Text used for the 'add row' button.
     */
    addButtonText: PropTypes.node,

    /**
     * Configuration for the add item dropdown.
     */
    addDropdown: PropTypes.shape(DropdownAutoComplete.propTypes).isRequired,

    /**
     * The label to show above the row name selected from the dropdown.
     */
    mappedColumnLabel: PropTypes.node,

    /**
     * A list of keys that will be used for each item added
     */
    mappedKeys: PropTypes.arrayOf(PropTypes.string).isRequired,

    /**
     * A list of column labels (headers) for the multichoice table. This should
     * have the same number of items as the multiChoices prop.
     */
    columnLabels: PropTypes.objectOf(PropTypes.node).isRequired,

    /**
     * A list of select field properties that should be used to render the
     * select field for each column in the row.
     */
    multiChoices: PropTypes.objectOf(SelectControl.propTypes).isRequired,
  };

  renderField = ({onChange, ...props}) => {
    const value = props.value ? props.value : {};

    const {
      addButtonText,
      addDropdown,
      mappedColumnLabel,
      mappedKeys,
      columnLabels,
      multiChoices,
    } = props;

    const addRow = data => {
      const newValue = new Array(multiChoices.length).fill(null);
      onChange({...value, [data.value]: newValue}, {});
    };

    const setValue = (itemKey, fieldKey, fieldValue) => {
      onChange({...value, [itemKey]: {...value[itemKey], [fieldKey]: fieldValue}}, {});
    };

    const removeRow = itemKey => {
      const newValue = {...value};
      delete newValue[itemKey];

      onChange(newValue, {});
    };

    // Remove already added values from the items list
    const selectableValues = addDropdown.items.filter(
      i => !value.hasOwnProperty(i.value)
    );

    const valueMap = addDropdown.items.reduce((map, item) => {
      map[item.value] = item.label;
      return map;
    }, {});

    return (
      <table>
        <thead>
          <tr>
            <StyledHeader>{mappedColumnLabel}</StyledHeader>
            {mappedKeys.map(k => <StyledHeader key={k}>{columnLabels[k]}</StyledHeader>)}
            <th>
              <DropdownAutoComplete
                {...addDropdown}
                items={selectableValues}
                onSelect={addRow}
              >
                {({isOpen}) => (
                  <DropdownButton isOpen={isOpen} size="xsmall">
                    {addButtonText ? addButtonText : t('Add Item')}
                  </DropdownButton>
                )}
              </DropdownAutoComplete>
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(value).map(itemKey => (
            <tr key={itemKey}>
              <td>{valueMap[itemKey]}</td>

              {mappedKeys.map(fieldKey => (
                <td flex={1} key={fieldKey}>
                  <SelectControl
                    onChange={v => setValue(itemKey, fieldKey, v.value)}
                    value={value[itemKey][fieldKey]}
                    {...multiChoices[fieldKey]}
                  />
                </td>
              ))}
              <td>
                <Button
                  icon="icon-trash"
                  size="xsmall"
                  priority="danger"
                  onClick={() => removeRow(itemKey)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  render() {
    return <InputField {...this.props} inline={false} field={this.renderField} />;
  }
}

const StyledHeader = styled('th')`
  font-size: 0.8em;
  text-transform: uppercase;
  color: ${p => p.theme.gray3};
  align-sel
`;
