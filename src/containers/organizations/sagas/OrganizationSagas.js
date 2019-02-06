import { OrganizationsApi, PermissionsApi, PrincipalsApi } from 'lattice';

import {
  all,
  call,
  put,
  takeEvery
} from 'redux-saga/effects';

import * as OrgActionTypes from '../actions/OrganizationActionTypes';
import * as OrgActionFactory from '../actions/OrganizationActionFactory';
import { Permission } from '../../../core/permissions/Permission';

function* loadTrustedOrganizationsWorker(action :Object) :Generator<*, *, *> {
  const { organizationId } = action;

  try {
    const acl = yield call(PermissionsApi.getAcl, [organizationId]);
    const { aces } = acl;

    const orgPrincipals = aces
      .filter(ace => ace.permissions.includes(Permission.READ.name) && ace.principal.type === 'ORGANIZATION')
      .map(({ principal }) => principal);

    const securablePrincipals = yield all(
      orgPrincipals.map(principal => call(PrincipalsApi.getSecurablePrincipal, principal))
    );

    const orgIds = securablePrincipals.map(({ id }) => id);

    yield put(OrgActionFactory.loadTrustedOrganizationsSuccess(orgIds));
  }
  catch (error) {
    console.error(error)
    yield put(OrgActionFactory.loadTrustedOrganizationsFailure(error))
  }
}

export function* loadTrustedOrganizationsWatcher() :Generator<*, *, *> {
  yield takeEvery(OrgActionTypes.LOAD_TRUSTED_ORGS_REQUEST, loadTrustedOrganizationsWorker);
}

function* trustOrganizationWorker( action :Object) :Generator<*, *, *> {
  const {
    organizationId,
    trustedOrganizationPrincipal,
    isTrusted
  } = action;

  try {

    const action = isTrusted ? 'ADD' : 'REMOVE';

    const aclData = {
      acl: {
        aclKey: [organizationId],
        aces: [{
          principal: trustedOrganizationPrincipal,
          permissions: [Permission.READ.name]
        }]
      },
      action
    };

    yield call(PermissionsApi.updateAcl, aclData);

    yield put(OrgActionFactory.trustOrganizationSuccess());
    yield put(OrgActionFactory.loadTrustedOrganizationsRequest(organizationId));

  }
  catch (error) {
    console.error(error);
    yield put(OrgActionFactory.trustOrganizationFailure(error));
  }
}

export function* trustOrganizationWatcher() :Generator<*, *, *> {
  yield takeEvery(OrgActionTypes.TRUST_ORG_REQUEST, trustOrganizationWorker);
}
