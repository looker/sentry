import React from 'react';

import {t} from 'app/locale';
import AsyncView from 'app/views/asyncView';
import Feature from 'app/components/feature';

class OrganizationHealth extends AsyncView {
  getTitle() {
    return t('Health');
  }

  getEndpoints() {
    return [];
  }

  renderBody() {
    return (
      <Feature feature={['health']} showNoFeatureMessage>
        <div>hello2</div>
      </Feature>
    );
  }
}
export default OrganizationHealth;
