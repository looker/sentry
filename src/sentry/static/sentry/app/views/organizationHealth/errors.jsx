import {Flex, Box} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import {t} from 'app/locale';
import AreaChart from 'app/components/charts/areaChart';
import AsyncView from 'app/views/asyncView';
import Feature from 'app/components/feature';
import HeaderSeparator from 'app/components/organizations/headerSeparator';
import HealthNavigationMenu from 'app/views/organizationHealth/healthNavigationMenu';
import MultipleProjectSelector from 'app/components/organizations/multipleProjectSelector';
import PanelChart from 'app/components/charts/panelChart';
import TimeRangeSelector from 'app/components/organizations/timeRangeSelector';
import withOrganization from 'app/utils/withOrganization';

const PREVIOUS = [746, 962, 395, 1040, 334, 881, 995];
const SERIES = [
  {
    name: 'Crash',
    data: [123, 234, 432, 342, 934, 345, 638],
  },
  {
    name: 'Handled',
    data: [89, 968, 485, 928, 345, 547, 746],
  },
];

class OrganizationHealthErrors extends React.Component {
  render() {
    let {organization, className} = this.props;
    return (
      <div className={className}>
        <Flex justify="space-between">
          <Header>
            Errors <Count>(12,198)</Count>
          </Header>
        </Flex>

        <Flex>
          <PanelChart
            title={t('Errors')}
            series={SERIES}
            lines={[
              {
                name: 'Previous Period',
                data: PREVIOUS,
              },
            ]}
          >
            <AreaChart />
          </PanelChart>
        </Flex>
      </div>
    );
  }
}

export default withOrganization(OrganizationHealthErrors);

const Header = styled(Flex)`
  font-size: 18px;
`;

const Count = styled('span')`
  color: ${p => p.theme.gray1};
`;

const Body = styled(Flex)``;
