import {isEqual} from 'lodash';
import {Box, Flex} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import styled from 'react-emotion';

import {PanelTable} from 'app/components/charts/panelTable';
import {doHealthRequest} from 'app/actionCreators/health';
import {t} from 'app/locale';
import AreaChart from 'app/components/charts/areaChart';
import Count from 'app/components/count';
import HealthContext from 'app/views/organizationHealth/healthContext';
import IdBadge from 'app/components/idBadge';
import PanelChart from 'app/components/charts/panelChart';
import SentryTypes from 'app/proptypes';
import space from 'app/styles/space';
import withApi from 'app/utils/withApi';
import withOrganization from 'app/utils/withOrganization';

function GIVE_DATA(size) {
  return [...Array(size)].map(() => (Math.random() * 1000) % 1000);
}
const TMPSIZE = 7;
const START_DATE = moment().subtract(TMPSIZE, 'days');
const ERROR_TYPE_DATA = [
  ['TypeError', 50, 40, 30],
  ['SyntaxError', 40, 30, 20],
  ['NameError', 30, 20, 10],
  ['ZeroDivisionError', 20, 10, 0],
];

class HealthRequestWithParams extends React.Component {
  static propTypes = {
    /**
     * Health tag (this will use a BASE_URL defined in health actionCreators
     */
    tag: PropTypes.string.isRequired,

    organization: SentryTypes.Organization.isRequired,

    api: PropTypes.object,

    /**
     * List of project ids to query
     */
    projects: PropTypes.arrayOf(PropTypes.number),

    /**
     * List of environments to query
     */
    environments: PropTypes.arrayOf(PropTypes.string),

    /**
     * Time period in query. Currently only supports relative dates
     *
     * e.g. 24h, 7d, 30d
     */
    period: PropTypes.string,

    /**
     * Include data for previous period
     */
    includePrevious: PropTypes.bool,

    /**
     * Should we query for timeseries data
     */
    timeseries: PropTypes.bool,

    /**
     * topK value
     */
    topk: PropTypes.number,
  };

  static defaultProps = {
    period: '7d',
    includePrevious: true,
    timeseries: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (
      isEqual(prevProps.projects, this.props.projects) &&
      isEqual(prevProps.environments, this.props.environments) &&
      isEqual(prevProps.period, this.props.period) &&
      isEqual(prevProps.organization, this.props.organization)
    ) {
      return;
    }
    this.fetchData();
  }

  fetchData() {
    let {api, ...props} = this.props;
    doHealthRequest(api, props).then(({data}) => {
      console.log('request', props, data);
      this.setState({
        data,
      });
    });
  }

  render() {
    let {children} = this.props;
    let {data} = this.state;
    return children({
      // Loading if data is null
      loading: data === null,
      data,
    });
  }
}

const HealthRequest = withOrganization(
  withApi(
    class extends React.Component {
      render() {
        return (
          <HealthContext.Consumer>
            {({projects, environments, period}) => (
              <HealthRequestWithParams
                projects={projects}
                environments={environments}
                period={period}
                {...this.props}
              />
            )}
          </HealthContext.Consumer>
        );
      }
    }
  )
);

class OrganizationHealthErrors extends React.Component {
  render() {
    let {className} = this.props;
    return (
      <div className={className}>
        <Flex justify="space-between">
          <Header>
            Errors
            <SubduedCount>
              (<Count value={12198} />)
            </SubduedCount>
          </Header>
        </Flex>

        <Flex>
          <StyledPanelChart
            height={200}
            startDate={START_DATE}
            title={t('Errors')}
            series={[
              {
                name: 'Crash',
                data: GIVE_DATA(TMPSIZE),
              },
              {
                name: 'Handled',
                data: GIVE_DATA(TMPSIZE),
              },
            ]}
            lines={[
              {
                name: 'Previous Period',
                data: GIVE_DATA(TMPSIZE),
              },
            ]}
          >
            <AreaChart />
          </StyledPanelChart>

          <HealthRequest tag="user" timeseries={true}>
            {({data, loading}) => (
              <StyledPanelChart
                height={200}
                startDate={START_DATE}
                title={t('Users')}
                series={[
                  {
                    name: 'User Session',
                    data: GIVE_DATA(TMPSIZE),
                  },
                  {
                    name: 'Affected',
                    data: GIVE_DATA(TMPSIZE),
                  },
                ]}
                lines={[
                  {
                    name: 'Previous Period',
                    data: GIVE_DATA(TMPSIZE),
                  },
                ]}
              >
                <AreaChart />
              </StyledPanelChart>
            )}
          </HealthRequest>
        </Flex>

        <Flex>
          <StyledPanelTable
            title="Error Type"
            headers={['Error type', 'Test', 'Another Test', 'What', 'Total']}
            data={ERROR_TYPE_DATA}
            widths={[null, 80, 80, 80, 100]}
            renderRow={({
              css,
              items,
              isHeader,
              rowIndex,
              renderCell,
              widths,
              ...props
            }) => {
              const firstCell = items && items.length && items[0];
              return (
                <Flex flex={1} css={css}>
                  <Box flex={1}>
                    {renderCell({
                      isHeader,
                      value: firstCell,
                      columnIndex: 0,
                      rowIndex,
                      ...props,
                    })}
                  </Box>

                  <DataGroup>
                    {items.slice(1).map((item, columnIndex) => {
                      let renderCellProps = {
                        isHeader,
                        value: item,
                        columnIndex,
                        rowIndex,
                        width: widths[columnIndex + 1],
                        justify: 'right',
                        ...props,
                      };

                      return renderCell(renderCellProps);
                    })}
                  </DataGroup>
                </Flex>
              );
            }}
            showRowTotal
            showColumnTotal
            shadeRowPercentage
          />
          <HealthRequest tag="user" timeseries={false}>
            {({data, loading}) => (
              <React.Fragment>
                {!loading && (
                  <StyledPanelTable
                    headers={[t('Most Impacted')]}
                    data={data.map(row => [row, row])}
                    widths={[null, 120]}
                    getValue={item =>
                      typeof item === 'number' ? item : item && item.count}
                    renderRow={({
                      css,
                      items,
                      isHeader,
                      rowIndex,
                      renderCell,
                      widths,
                      ...props
                    }) => {
                      const firstCell = items && items.length && items[0];
                      return (
                        <Flex flex={1} css={css}>
                          <Box flex={1}>
                            {renderCell({
                              isHeader,
                              value: firstCell,
                              columnIndex: 0,
                              rowIndex,
                              ...props,
                            })}
                          </Box>

                          <DataGroup>
                            {items.slice(1).map((item, columnIndex) => {
                              let renderCellProps = {
                                isHeader,
                                value: item,
                                columnIndex: columnIndex + 1,
                                rowIndex,
                                width: widths[columnIndex + 1],
                                justify: 'right',
                                ...props,
                              };

                              return renderCell(renderCellProps);
                            })}
                          </DataGroup>
                        </Flex>
                      );
                    }}
                    renderItemCell={({getValue, value, columnIndex}) => {
                      if (columnIndex === 0) {
                        return value.user.id;
                      } else {
                        return <Count value={getValue(value)} />;
                      }
                    }}
                    showRowTotal={false}
                    showColumnTotal={false}
                    shadeRowPercentage
                  />
                )}
              </React.Fragment>
            )}
          </HealthRequest>
        </Flex>

        <Flex>
          <HealthRequest tag="release" timeseries={false} topk={5}>
            {({data, loading}) => (
              <React.Fragment>
                {!loading && (
                  <StyledPanelTable
                    headers={[t('Errors by Release')]}
                    data={data.map(row => [row, row])}
                    widths={[null, 120]}
                    getValue={item =>
                      typeof item === 'number' ? item : item && item.count}
                    renderRow={({
                      css,
                      items,
                      isHeader,
                      rowIndex,
                      renderCell,
                      widths,
                      ...props
                    }) => {
                      const firstCell = items && items.length && items[0];
                      return (
                        <Flex flex={1} css={css}>
                          <Box flex={1}>
                            {renderCell({
                              isHeader,
                              value: firstCell,
                              columnIndex: 0,
                              rowIndex,
                              ...props,
                            })}
                          </Box>

                          <DataGroup>
                            {items.slice(1).map((item, columnIndex) => {
                              let renderCellProps = {
                                isHeader,
                                value: item,
                                columnIndex: columnIndex + 1,
                                rowIndex,
                                width: widths[columnIndex + 1],
                                justify: 'right',
                                ...props,
                              };

                              return renderCell(renderCellProps);
                            })}
                          </DataGroup>
                        </Flex>
                      );
                    }}
                    renderItemCell={({getValue, value, columnIndex}) => {
                      if (columnIndex === 0) {
                        return (
                          <Flex justify="space-between">
                            <Box flex={1}>{value.release.version}</Box>
                            <Box>
                              {value.topProjects.map(p => (
                                <IdBadge key={p.slug} project={p} />
                              ))}
                            </Box>
                          </Flex>
                        );
                      } else {
                        return <Count value={getValue(value)} />;
                      }
                    }}
                    showRowTotal={false}
                    showColumnTotal={false}
                    shadeRowPercentage
                  />
                )}
              </React.Fragment>
            )}
          </HealthRequest>
        </Flex>
      </div>
    );
  }
}

class OrganizationHealthErrorsContainer extends React.Component {
  render() {
    return (
      <HealthContext.Consumer>
        {({projects, environments, period}) => (
          <OrganizationHealthErrors
            projects={projects}
            environments={environments}
            period={period}
            {...this.props}
          />
        )}
      </HealthContext.Consumer>
    );
  }
}

export default withApi(withOrganization(OrganizationHealthErrorsContainer));

const Header = styled(Flex)`
  font-size: 18px;
  margin-bottom: ${space(2)};
`;

const SubduedCount = styled('span')`
  color: ${p => p.theme.gray1};
  margin-left: ${space(0.5)};
`;

const getChartMargin = () => `
  margin-right: ${space(2)};
  &:last-child {
    margin-right: 0;
  }
`;

const StyledPanelChart = styled(PanelChart)`
  ${getChartMargin};
`;

const StyledPanelTable = styled(PanelTable)`
  ${getChartMargin};
`;

const DataGroup = styled(Flex)`
  flex-shrink: 0;
`;
