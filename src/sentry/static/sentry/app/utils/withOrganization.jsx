import React from 'react';

import SentryTypes from 'app/proptypes';

/**
 * HoC that provides "organization" from context
 */
const withOrganization = WrappedComponent =>
  class extends React.Component {
    static contextTypes = {
      organization: SentryTypes.Organization,
    };
    render() {
      return (
        <WrappedComponent organization={this.context.organization} {...this.props} />
      );
    }
  };

export default withOrganization;
