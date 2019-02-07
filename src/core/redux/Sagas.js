/*
 * @flow
 */

import * as OrganizationSagas from '../../containers/organizations/sagas/OrganizationSagas';
import * as ProfileSagas from '../../containers/profile/ProfileSagas';

import { fork } from 'redux-saga/effects';

export default function* sagas() :Generator<*, *, *> {

  yield [
    // OrganizationSagas
    fork(OrganizationSagas.fetchWritableOrganizationsWatcher),
    fork(OrganizationSagas.loadTrustedOrganizationsWatcher),
    fork(OrganizationSagas.trustOrganizationWatcher),
    fork(OrganizationSagas.loadOrganizationEntitySetsWatcher),
    fork(OrganizationSagas.assembleEntitySetsWatcher),

    // ProfileSagas
    fork(ProfileSagas.getDbAccessCredentialWatcher)
  ];
}
