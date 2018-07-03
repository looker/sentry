import {Flex, Box} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import {t} from 'app/locale';
import AsyncView from 'app/views/asyncView';
import Feature from 'app/components/feature';
import HeaderSeparator from 'app/components/organizations/headerSeparator';
import MultipleProjectSelector from 'app/components/organizations/multipleProjectSelector';
import TimeRangeSelector from 'app/components/organizations/timeRangeSelector';

class OrganizationHealth extends AsyncView {
  getTitle() {
    return t('Health');
  }

  getEndpoints() {
    return [];
  }

  renderBody() {
    return (
      <Feature feature={['health']} showNoFeatureMessage>
        <Header>
          <MultipleProjectSelector />
          <HeaderSeparator />
          <TimeRangeSelector />
        </Header>
        <div>hello2</div>
      </Feature>
    );
  }
}
export default OrganizationHealth;

const Header = styled(Flex)`
  font-size: 18px;
`;
