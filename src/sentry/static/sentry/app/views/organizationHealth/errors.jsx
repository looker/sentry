import {Box, Flex} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import styled from 'react-emotion';

import {PanelTable} from 'app/components/charts/panelTable';
import {t} from 'app/locale';
import AreaChart from 'app/components/charts/areaChart';
import PanelChart from 'app/components/charts/panelChart';
import SentryTypes from 'app/proptypes';
import space from 'app/styles/space';
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

class OrganizationHealthErrors extends React.Component {
  static propTypes = {
    organization: SentryTypes.Organization,
  };

  render() {
    let {className} = this.props;
    return (
      <div className={className}>
        <Flex justify="space-between">
          <Header>
            Errors <Count>(12,198)</Count>
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
        </Flex>

        <Flex>
          <PanelTable
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
        </Flex>
      </div>
    );
  }
}
export default withOrganization(OrganizationHealthErrors);

const Header = styled(Flex)`
  font-size: 18px;
  margin-bottom: ${space(2)};
`;

const Count = styled('span')`
  color: ${p => p.theme.gray1};
`;

const StyledPanelChart = styled(PanelChart)`
  margin-right: ${space(2)};
  &:last-child {
    margin-right: 0;
  }
`;

const DataGroup = styled(Flex)`
  flex-shrink: 0;
`;
