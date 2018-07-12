import {Box} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import {Panel, PanelHeader, PanelItem} from 'app/components/panels';
import SentryTypes from 'app/proptypes';

export const PanelTable = styled(
  class PanelTableComponent extends React.Component {
    static propTypes = {
      data: SentryTypes.ChartData,
      widths: PropTypes.arrayOf(PropTypes.number),
      showRowTotal: PropTypes.bool,
      showColumnTotal: PropTypes.bool,
      shadeRowPercentage: PropTypes.bool,
      getValue: PropTypes.func,
      renderHeader: PropTypes.func,
      renderBody: PropTypes.func,
      renderHeaderCell: PropTypes.func,
      renderItemCell: PropTypes.func,
    };

    static get defaultProps() {
      const defaultRenderHeader = ({widths, headers, renderRow, ...props}) => (
        <PanelTableHeader widths={widths}>
          {renderRow({isHeader: true, widths, items: headers, ...props})}
        </PanelTableHeader>
      );

      const defaultRenderBody = ({widths, data, dataWithTotals, renderRow, ...props}) =>
        data.map((row, rowIndex) => {
          let lastCellIndex = row.length - 1;
          let lastRowIndex = data.length - 1;
          let isLastRow = rowIndex === lastRowIndex;
          let showBar = !isLastRow;

          return (
            <PanelTableRow
              key={rowIndex}
              showBar={showBar}
              value={dataWithTotals[rowIndex][lastCellIndex + 1]}
              total={dataWithTotals[lastRowIndex + 1][lastCellIndex + 1]}
              widths={widths}
            >
              {renderRow({
                css: {zIndex: showBar ? '2' : undefined},
                widths,
                items: row,
                rowIndex,
                ...props,
              })}
            </PanelTableRow>
          );
        });

      const defaultRenderRow = ({items, isHeader, rowIndex, renderCell, ...props}) =>
        items.map((item, columnIndex) => {
          let renderCellProps = {
            value: item,
            columnIndex,
            rowIndex,
            ...props,
          };

          return renderCell(renderCellProps);
        });

      const defaultRenderCell = p => {
        let {
          isHeader,
          justify,
          width,
          rowIndex,
          columnIndex,
          renderHeaderCell,
          renderItemCell,
        } = p;

        return (
          <Cell justify={justify} width={width} key={`${rowIndex}-${columnIndex}`}>
            {isHeader ? renderHeaderCell(p) : renderItemCell(p)}
          </Cell>
        );
      };

      const defaultRenderItemCell = ({
        isHeader,
        justify,
        value,
        width,
        rowIndex,
        columnIndex,
      }) => value;
      const defaultRenderHeaderCell = defaultRenderItemCell;

      return {
        getValue: i => i,
        renderHeader: defaultRenderHeader,
        renderBody: defaultRenderBody,
        renderRow: defaultRenderRow,
        renderCell: defaultRenderCell,
        renderHeaderCell: defaultRenderHeaderCell,
        renderItemCell: defaultRenderItemCell,
      };
    }

    // TODO(billy): memoize?
    getRowsWithTotals(rows) {
      const {getValue, showColumnTotal} = this.props;
      const totalRows = rows.length;
      const totalColumns = !!rows.length ? rows[0].length : 0;
      const reduceSum = (sum, val) => (sum += getValue(val));

      let columnTotals = [];
      // deep clone rows
      let newRows = [...rows.map(row => [...row])];

      for (let i = 0; i < totalRows; i++) {
        newRows[i].push(rows[i].slice(1).reduce(reduceSum, 0));

        for (let j = 1; j < totalColumns; j++) {
          columnTotals[j - 1] = (columnTotals[j - 1] || 0) + getValue(rows[i][j]);
        }
      }

      newRows.push(['Total', ...columnTotals, columnTotals.reduce(reduceSum, 0)]);
      return newRows;
    }

    render() {
      let {
        className,
        children,
        data,
        getValue,
        showRowTotal,
        showColumnTotal,
        shadeRowPercentage,
        renderHeader,
        renderBody,
        widths,
        ...props
      } = this.props;

      // If we need to calculate totals...
      let dataWithTotals =
        showRowTotal || showColumnTotal || shadeRowPercentage
          ? this.getRowsWithTotals(data)
          : [];

      // For better render customization
      let isRenderProp = typeof children === 'function';
      let renderProps = {
        data,
        getValue,
        showRowTotal,
        showColumnTotal,
        shadeRowPercentage,
        dataWithTotals,
        widths,
        ...props,
      };

      return (
        <Panel className={className}>
          {isRenderProp ? (
            children(renderProps)
          ) : (
            <React.Fragment>
              {renderHeader(renderProps)}
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

export const PanelTableRowBar = styled('div')`
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
