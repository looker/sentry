import React from 'react';
import {mount} from 'enzyme';

import PanelTable from 'app/components/charts/panelTable';

describe('PanelTable', function() {
  it('can calculate row total', function() {
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
        dataWithTotals: [
          ['TypeError', 50, 40, 30, 120],
          ['SyntaxError', 40, 30, 20, 90],
          ['NameError', 15, 15, 15, 45],
          ['ZeroDivisionError', 20, 10, 0, 30],
          ['Total', 125, 95, 65, 285],
        ],
      })
    );
  });
});
