import {Flex} from 'grid-emotion';
import React from 'react';
import styled from 'react-emotion';

import Feature from 'app/components/feature';
import HeaderSeparator from 'app/components/organizations/headerSeparator';
import HealthNavigationMenu from 'app/views/organizationHealth/healthNavigationMenu';
import MultipleEnvironmentSelector from 'app/components/organizations/multipleEnvironmentSelector';
import MultipleProjectSelector from 'app/components/organizations/multipleProjectSelector';
import TimeRangeSelector from 'app/components/organizations/timeRangeSelector';
import space from 'app/styles/space';
import withOrganization from 'app/utils/withOrganization';

class OrganizationHealth extends React.Component {
  render() {
    let {organization, children} = this.props;
    let projects = organization.projects.filter(projects => projects.isMember);

    return (
      <Feature feature={['health']} showNoFeatureMessage>
        <HealthWrapper>
          <HealthNavigationMenu />
          <Content>
            <Header>
              <MultipleProjectSelector projects={projects} />
              <HeaderSeparator />
              <MultipleEnvironmentSelector projects={projects} />
              <HeaderSeparator />
              <TimeRangeSelector />
            </Header>
            <Body>{children}</Body>
          </Content>
        </HealthWrapper>
      </Feature>
    );
  }
}

export default withOrganization(OrganizationHealth);

const HealthWrapper = styled(Flex)`
  flex: 1;
  margin-bottom: -20px; /* <footer> has margin-top: 20px; */
`;
const Content = styled(Flex)`
  flex-direction: column;
  flex: 1;
`;

const Header = styled(Flex)`
  border-bottom: 1px solid ${p => p.theme.borderLight};
  font-size: 18px;
`;

const Body = styled('div')`
  flex: 1;
  padding: ${space(3)};
`;
