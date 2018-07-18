import {Flex, Box} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import {Panel, PanelHeader, PanelItem} from 'app/components/panels';
import SentryTypes from 'app/sentryTypes';

export const PanelTable = styled(
  class PanelTableComponent extends React.Component {
    static propTypes = {
      data: SentryTypes.ChartData,
      /**
       * The column index where your data starts.
       * This is used to calculate totals.
       *
       * Will not work if you have mixed string/number columns
       */
      dataStartIndex: PropTypes.number,
      widths: PropTypes.arrayOf(PropTypes.number),
      getValue: PropTypes.func,
      renderTableHeader: PropTypes.func,
      renderBody: PropTypes.func,
      renderHeaderCell: PropTypes.func,
      renderDataCell: PropTypes.func,
      shadeRowPercentage: PropTypes.bool,
      showRowTotal: PropTypes.bool,
      showColumnTotal: PropTypes.bool,
      columnTotalLabel: PropTypes.string,
    };

    static get defaultProps() {
      const defaultRenderTableHeader = ({widths, headers, renderRow, ...props}) => (
        <PanelTableHeader widths={widths}>
          {renderRow({isTableHeader: true, widths, items: headers, ...props})}
        </PanelTableHeader>
      );

      const defaultRenderBody = ({
        widths,
        data,
        dataTotals,
        renderRow,
        showRowTotal,
        showColumnTotal,
        columnTotalLabel,
        ...props
      }) => {
        const dataMaybeWithTotals = [
          ...data,
          ...(showColumnTotal
            ? [[columnTotalLabel, ...dataTotals.columnTotals, dataTotals.total]]
            : []),
        ];

        return dataMaybeWithTotals.map((row, rowIndex) => {
          let lastRowIndex = dataMaybeWithTotals.length - 1;
          let isLastRow = rowIndex === lastRowIndex;
          let showBar = !isLastRow;

          return (
            <PanelTableRow
              key={rowIndex}
              showBar={showBar}
              value={dataTotals.rowTotals[rowIndex]}
              total={dataTotals.total}
              widths={widths}
            >
              {renderRow({
                css: {zIndex: showBar ? '2' : undefined},
                widths,
                items: [
                  ...row,
                  ...(showRowTotal ? [dataTotals.rowTotals[rowIndex]] : []),
                ],
                rowIndex,
                ...props,
              })}
            </PanelTableRow>
          );
        });
      };

      const defaultRenderRow = ({
        dataStartIndex,
        css,
        items,
        rowHeaders,
        rowData,
        isTableHeader,
        rowIndex,
        renderCell,
        renderHeaderCell,
        renderDataCell,
        widths,
        ...props
      }) => {
        // items.map((item, columnIndex) => {
        // let renderCellProps = {
        // value: item,
        // columnIndex,
        // rowIndex,
        // ...props,
        // };

        // return renderCell(renderCellProps);
        // });

        return (
          <Flex flex={1} css={css}>
            {rowHeaders[rowIndex].map((rowHeaderValue, columnIndex) =>
              renderHeaderCell({
                value: rowHeaderValue,
                columnIndex,
                width: widths[columnIndex + dataStartIndex],
                rowIndex,
                ...props,
              })
            )}

            <DataGroup>
              {rowData[rowIndex].map((rowDataValue, columnIndex) => {
                let renderCellProps = {
                  value: rowDataValue,
                  columnIndex,
                  rowIndex,
                  width: widths[columnIndex + dataStartIndex],
                  justify: 'right',
                  ...props,
                };

                return renderDataCell(renderCellProps);
              })}
            </DataGroup>
          </Flex>
        );
      };

      const defaultRenderCell = p => {
        let {
          isTableHeader,
          justify,
          width,
          rowIndex,
          columnIndex,
          renderHeaderCell,
          renderDataCell,
        } = p;

        return (
          <Cell justify={justify} width={width} key={`${rowIndex}-${columnIndex}`}>
            {isTableHeader ? renderHeaderCell(p) : renderDataCell(p)}
          </Cell>
        );
      };

      const defaultRenderDataCell = ({
        isTableHeader,
        justify,
        value,
        width,
        rowIndex,
        columnIndex,
      }) => value;
      const defaultRenderHeaderCell = defaultRenderDataCell;

      return {
        dataStartIndex: 1,
        getValue: i => i,
        renderTableHeader: defaultRenderTableHeader,
        renderBody: defaultRenderBody,
        renderRow: defaultRenderRow,
        renderCell: defaultRenderCell,
        renderHeaderCell: defaultRenderHeaderCell,
        renderDataCell: defaultRenderDataCell,
        columnTotalLabel: 'Total',
        rowTotalLabel: 'Total',
      };
    }

    // TODO(billy): memoize?
    getTotals(rows) {
      const {getValue, dataStartIndex} = this.props;

      const reduceSum = (sum, val) => (sum += getValue(val));
      const rowTotals = rows.map((row, rowIndex) =>
        row.slice(dataStartIndex).reduce(reduceSum, 0)
      );
      const columnTotals = rows.length
        ? rows[0]
            .slice(dataStartIndex)
            .map((r, currentColumn) =>
              rows.reduce(
                (sum, row) => (sum += getValue(row[currentColumn + dataStartIndex])),
                0
              )
            )
        : [];

      return {
        rowTotals,
        columnTotals,
        total: columnTotals.reduce(reduceSum, 0),
      };
    }

    /**
     * Given a set of `data`, and a `dataStartIndex`, split `data` into a list
     * of `[<rowHeaders>, <rowData>]`.
     */
    getSpecificRows() {
      let {data, dataStartIndex} = this.props;

      return data
        .map((row, rowIndex) => [row.slice(0, dataStartIndex), row.slice(dataStartIndex)])
        .reduce(
          (acc, [rowHeader, rowDataCell]) => {
            return [[...acc[0], rowHeader], [...acc[1], rowDataCell]];
          },
          [[], []]
        );
    }

    render() {
      let {
        className,
        children,
        data,
        dataStartIndex,
        getValue,
        showRowTotal,
        showColumnTotal,
        shadeRowPercentage,
        renderTableHeader,
        renderBody,
        widths,
        ...props
      } = this.props;

      // If we need to calculate totals...
      let dataTotals =
        showRowTotal || showColumnTotal || shadeRowPercentage ? this.getTotals(data) : [];

      let [rowHeaders, rowData] = this.getSpecificRows();

      // For better render customization
      let isRenderProp = typeof children === 'function';
      let renderProps = {
        data,
        dataTotals,
        rowHeaders,
        rowData,
        dataStartIndex,
        getValue,
        showRowTotal,
        showColumnTotal,
        shadeRowPercentage,
        widths,
        ...props,
      };

      return (
        <Panel className={className}>
          {isRenderProp ? (
            children(renderProps)
          ) : (
            <React.Fragment>
              {renderTableHeader(renderProps)}
              {renderBody(renderProps)}
            </React.Fragment>
          )}
        </Panel>
      );
    }
  }
)`
  flex: 1;
`;

export default PanelTable;

export class PanelTableHeader extends React.Component {
  static propTypes = {
    widths: PropTypes.arrayOf(PropTypes.number),
  };
  render() {
    let {children} = this.props;
    return (
      <PanelHeader>
        {React.Children.map(children, (child, i) => {
          return React.cloneElement(child, {
            width: this.props.widths[i],
          });
        })}
      </PanelHeader>
    );
  }
}
export const PanelTableRow = styled(
  class extends React.Component {
    static propTypes = {
      widths: PropTypes.arrayOf(PropTypes.number),
      showBar: PropTypes.bool,
      /**
       * Total value of row
       */
      value: PropTypes.number,
      /**
       * Total value of all rows
       */
      total: PropTypes.number,
    };

    render() {
      let {className, showBar, total, value, children, widths} = this.props;
      let barWidth =
        total > 0 && typeof value === 'number' ? Math.round(value / total * 100) : 0;

      return (
        <PanelItem className={className}>
          {React.Children.map(children, (child, i) => {
            return React.cloneElement(child, {
              width: widths[i],
            });
          })}
          {showBar && <PanelTableRowBar width={barWidth} />}
        </PanelItem>
      );
    }
  }
)`
  position: relative;
  flex: 1;
`;

/**
 * Shows relative percentage as width of bar inside of a table's row
 */
export const PanelTableRowBar = styled(({width, ...props}) => <div {...props} />)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: ${p => 100 - p.width}%;
  background-color: ${p => p.theme.offWhite2};
  z-index: 1;
`;

export const Cell = styled(Box)`
  z-index: 2;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${p => (!p.width ? 'flex: 1' : '')};
  ${p => (p.justify === 'right' ? 'text-align: right' : '')};
`;

const DataGroup = styled(Flex)`
  flex-shrink: 0;
`;
