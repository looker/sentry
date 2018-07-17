import React from 'react';
import {mount} from 'enzyme';

import PanelTable from 'app/components/charts/panelTable';

describe('PanelTable', function() {
  it('can calculate row and column totals', function() {
    const ERROR_TYPE_DATA = [
      ['TypeError', 50, 40, 30],
      ['SyntaxError', 40, 30, 20],
      ['NameError', 15, 15, 15],
      ['ZeroDivisionError', 20, 10, 0],
    ];
    const renderer = jest.fn();
    mount(
      <PanelTable
        title="Error Type"
        data={ERROR_TYPE_DATA}
        showRowTotal
        showColumnTotal
        shadeRowPercentage
        widths={[null, 80, 80, 80, 100]}
      >
        {renderer}
      </PanelTable>
    );

    expect(renderer).toHaveBeenCalledWith(
      expect.objectContaining({
        data: ERROR_TYPE_DATA,
        dataTotals: {
          columnTotals: [125, 95, 65],
          rowTotals: [120, 90, 45, 30],
          total: 285,
        },
      })
    );
  });

  it('can calculate totals with multiple non-data columns', function() {
    const ERROR_TYPE_DATA = [
      ['TypeError', 'Label', 50, 40, 30],
      ['SyntaxError', 'Label', 40, 30, 20],
      ['NameError', 'Label', 15, 15, 15],
      ['ZeroDivisionError', 'Label', 20, 10, 0],
    ];
    const renderer = jest.fn();
    mount(
      <PanelTable
        title="Error Type"
        data={ERROR_TYPE_DATA}
        showRowTotal
        showColumnTotal
        shadeRowPercentage
        dataStartIndex={2}
        widths={[null, 80, 80, 80, 100]}
      >
        {renderer}
      </PanelTable>
    );

    expect(renderer).toHaveBeenCalledWith(
      expect.objectContaining({
        data: ERROR_TYPE_DATA,
        dataTotals: {
          columnTotals: [125, 95, 65],
          rowTotals: [120, 90, 45, 30],
          total: 285,
        },
      })
    );
  });

  it('divides `data` into "header" and "data" arrays', function() {
    const ERROR_TYPE_DATA = [
      ['TypeError', 'project1', 50, 40, 30],
      ['SyntaxError', 'project2', 40, 30, 20],
      ['NameError', 'project3', 15, 15, 15],
      ['ZeroDivisionError', 'project4', 20, 10, 0],
    ];
    const renderer = jest.fn();
    mount(
      <PanelTable
        title="Error Type"
        data={ERROR_TYPE_DATA}
        showRowTotal
        showColumnTotal
        shadeRowPercentage
        dataStartIndex={2}
        widths={[null, 80, 80, 80, 100]}
      >
        {renderer}
      </PanelTable>
    );

    expect(renderer).toHaveBeenCalledWith(
      expect.objectContaining({
        rowHeaders: [
          ['TypeError', 'project1'],
          ['SyntaxError', 'project2'],
          ['NameError', 'project3'],
          ['ZeroDivisionError', 'project4'],
        ],
        rowData: [[50, 40, 30], [40, 30, 20], [15, 15, 15], [20, 10, 0]],
        dataTotals: {
          columnTotals: [125, 95, 65],
          rowTotals: [120, 90, 45, 30],
          total: 285,
        },
      })
    );
  });
});
