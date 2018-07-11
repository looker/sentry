import {Flex} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import Feature from 'app/components/feature';
import HeaderSeparator from 'app/components/organizations/headerSeparator';
import MultipleEnvironmentSelector from 'app/components/organizations/multipleEnvironmentSelector';
import MultipleProjectSelector from 'app/components/organizations/multipleProjectSelector';
import SentryTypes from 'app/proptypes';
import TimeRangeSelector from 'app/components/organizations/timeRangeSelector';
import space from 'app/styles/space';
import withOrganization from 'app/utils/withOrganization';

import HealthContext from './healthContext';
import HealthNavigationMenu from './healthNavigationMenu';

class OrganizationHealth extends React.Component {
  static propTypes = {
    organization: SentryTypes.Organization,
  };

  constructor(props) {
    super(props);
    this.state = {
      params: {
        projects: [],
        environments: [],
        daterange: '7d',
      },
    };
  }

  updateParams = obj => {
    console.log('update params', obj);
    this.setState(state => ({
      ...state,
      params: {
        ...state.params,
        ...obj,
      },
    }));
  };

  handleUpdateProjects = projects => {
    this.updateParams({projects});
  };

  handleUpdateEnvironments = environments => {
    this.updateParams({environments});
  };

  handleUpdateTime = daterange => {
    this.updateParams({daterange});
  };

  render() {
    let {organization, children} = this.props;

    // TODO(billy): Is this what we want, only projects user is member of?
    let projects = organization.projects.filter(({isMember}) => isMember);

    return (
      <Feature feature={['health']} showNoFeatureMessage>
        <HealthContext.Provider value={this.state.params}>
          <HealthWrapper>
            <HealthNavigationMenu />
            <Content>
              <Header>
                <MultipleProjectSelectorContainer
                  projects={projects}
                  onUpdate={this.handleUpdateProjects}
                />
                <HeaderSeparator />
                <MultipleEnvironmentSelectorContainer
                  projects={projects}
                  onUpdate={this.handleUpdateEnvironments}
                />
                <HeaderSeparator />
                <TimeRangeSelectorContainer onUpdate={this.handleUpdateTime} />
              </Header>
              <Body>{children}</Body>
            </Content>
          </HealthWrapper>
        </HealthContext.Provider>
      </Feature>
    );
  }
}

export default withOrganization(OrganizationHealth);

class MultipleProjectSelectorContainer extends React.Component {
  static propTypes = {
    initialValue: PropTypes.arrayOf(PropTypes.string),
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue || '',
    };
  }

  handleChange = value => {
    this.setState({value});
  };

  render() {
    return (
      <HealthContext.Consumer>
        {projects => (
          <MultipleProjectSelector
            {...this.props}
            onChange={this.handleChange}
            value={this.state.value}
          />
        )}
      </HealthContext.Consumer>
    );
  }
}

class MultipleEnvironmentSelectorContainer extends React.Component {
  render() {
    return (
      <HealthContext.Consumer>
        {environments => (
          <MultipleEnvironmentSelector {...this.props} value={environments} />
        )}
      </HealthContext.Consumer>
    );
  }
}

class TimeRangeSelectorContainer extends React.Component {
  render() {
    return (
      <HealthContext.Consumer>
        {daterange => <TimeRangeSelector {...this.props} value={daterange} />}
      </HealthContext.Consumer>
    );
  }
}

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
