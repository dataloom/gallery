/*
 * @flow
 */

import * as EdmSagas from '../../containers/edm/EdmSagas';
import * as OrganizationSagas from '../../containers/organizations/sagas/OrganizationSagas';
import * as PermissionsSummarySagas from  '../../containers/permissionssummary/PermissionsSummarySagas';
import * as ProfileSagas from '../../containers/profile/ProfileSagas';

import { fork } from 'redux-saga/effects';

export default function* sagas() :Generator<*, *, *> {

  yield [

    // EdmSagas
    fork(EdmSagas.loadEntitySetWatcher),

    // OrganizationSagas
    fork(OrganizationSagas.fetchWritableOrganizationsWatcher),
    fork(OrganizationSagas.loadTrustedOrganizationsWatcher),
    fork(OrganizationSagas.trustOrganizationWatcher),
    fork(OrganizationSagas.loadOrganizationEntitySetsWatcher),
    fork(OrganizationSagas.assembleEntitySetsWatcher),

    // PermissionsSummarySagas
    fork(PermissionsSummarySagas.getRolesForUsersWatcher),

    // ProfileSagas
    fork(ProfileSagas.getDbAccessCredentialWatcher)

  ];
}
