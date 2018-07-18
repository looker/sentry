import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import {Flex, Box} from 'grid-emotion';

import {t} from 'app/locale';
import DropdownLink from 'app/components/dropdownLink';
import Button from 'app/components/buttons/button';
import MultiSelectField from 'app/components/forms/multiSelectField';
import SentryTypes from 'app/sentryTypes';

/**
 * Environment Selector
 */
class MultipleEnvironmentSelector extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    projects: PropTypes.arrayOf(SentryTypes.Project),
    onChange: PropTypes.func,
    runQuery: PropTypes.func,
  };

  componentDidMount() {}

  render() {
    const {className, value, onChange, runQuery} = this.props;
    const environmentList = [];
    const summary = environmentList.length
      ? `${environmentList.join(', ')}`
      : t('All Environments');

    return (
      <Flex direction="column" justify="center" className={className}>
        <label>{t('Environment')}</label>
        <DropdownLink title={summary} keepMenuOpen={true} anchorRight={true}>
          <Box p={2}>
            <MultiSelectField
              name="environments"
              value={value}
              options={[]}
              onChange={onChange}
            />
            <Button onClick={runQuery}>{t('Update')}</Button>
          </Box>
        </DropdownLink>
      </Flex>
    );
  }
}

export default styled(MultipleEnvironmentSelector)`
  text-align: right;
  label {
    font-weight: 400;
    font-size: 13px;
    color: #afa3bb;
    margin-bottom: 12px;
  }
  .dropdown-actor-title {
    font-size: 15px;
    height: auto;
    color: ${p => p.theme.button.default.colorActive};
  }
`;
