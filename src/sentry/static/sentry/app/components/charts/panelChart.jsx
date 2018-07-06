import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import {Panel, PanelHeader} from 'app/components/panels';

const PanelChart = styled(
  class extends React.Component {
    static propTypes = {
      title: PropTypes.node,
      series: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          data: PropTypes.arrayOf(PropTypes.number),
        })
      ),

      /**
     * Other line series to display
     */
      lines: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          data: PropTypes.arrayOf(PropTypes.number),
        })
      ),
    };

    constructor(props) {
      super(props);
    }

    render() {
      const {title, children, className, ...props} = this.props;

      return (
        <Panel className={className}>
          {title && <PanelHeader>{title}</PanelHeader>}
          {React.cloneElement(children, props)}
        </Panel>
      );
    }
  }
)`
  flex: 1;
`;

export default PanelChart;
