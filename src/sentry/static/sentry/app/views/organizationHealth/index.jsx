import React from 'react';

import {t} from 'app/locale';
import AsyncView from 'app/views/asyncView';

class OrganizationHealth extends AsyncView {
  getTitle() {
    return t('Health');
  }

  getEndpoints() {
    return [];
  }

  renderBody() {
    return <div>hello2</div>;
  }
}
export default OrganizationHealth;
