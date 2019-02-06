/*
 * @flow
 */

import * as OrganizationSagas from '../../containers/organizations/sagas/OrganizationSagas';
import { fork } from 'redux-saga/effects';

export default function* sagas() :Generator<*, *, *> {

  yield [
    // "lattice-auth" sagas
    fork(OrganizationSagas.loadTrustedOrganizationsWatcher),
    fork(OrganizationSagas.trustOrganizationWatcher)
  ];
}
