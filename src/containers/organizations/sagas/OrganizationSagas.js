import {
  AuthorizationApi,
  EntityDataModelApi,
  OrganizationsApi,
  PermissionsApi,
  PrincipalsApi
} from 'lattice';

import {
  all,
  call,
  put,
  takeEvery
} from 'redux-saga/effects';

import { Map, Set, fromJS } from  'immutable'

import * as OrgActionTypes from '../actions/OrganizationActionTypes';
import * as OrgActionFactory from '../actions/OrganizationActionFactory';
import { Permission } from '../../../core/permissions/Permission';

import {
  ASSEMBLE_ENTITY_SETS,
  GET_ORGANIZATION_INTEGRATION_ACCOUNT,
  GET_OWNED_ROLES,
  LOAD_ORGANIZATION_ENTITY_SETS,
  SYNCHRONIZE_DATA_CHANGES,
  SYNCHRONIZE_EDM_CHANGES,
  assembleEntitySets,
  getOrganizationIntegrationAccount,
  getOwnedRoles,
  loadOrganizationEntitySets,
  synchronizeDataChanges,
  synchronizeEdmChanges
} from '../actions/OrganizationActionFactory';

import {
  FETCH_WRITABLE_ORGANIZATIONS,
  fetchWritableOrganizations
} from '../actions/OrganizationsActionFactory';

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

function* loadOrganizationEntitySetsWorker(action :Object) :Generator<*, *, *> {
  try {
    yield put(loadOrganizationEntitySets.request(action.id));

    const allOrganizationEntitySets = yield call(OrganizationsApi.getOrganizationEntitySets, action.value);

    const entitySetIds = Object.keys(allOrganizationEntitySets);

    const accessChecks = entitySetIds.map((entitySetId) => ({
      aclKey: [entitySetId],
      permissions: [Permission.READ.name, Permission.MATERIALIZE.name]
    }));


    let entitySetsById = Map();
    let entityTypesById = Map();
    let organizationEntitySets = Map();
    let materializableEntitySetIds = Set();

    const authorizations = yield call(AuthorizationApi.checkAuthorizations, accessChecks);

    const entitySetProjections = [];
    authorizations.forEach((authorization) => {
      const { aclKey, permissions } = authorization;
      const [entitySetId] = aclKey;

      if (permissions[Permission.READ.name]) {
        entitySetProjections.push({
          type: 'EntitySet',
          id: entitySetId,
          include: ['EntitySet', 'EntityType']
        });
      }

      if (permissions[Permission.MATERIALIZE.name]) {
        materializableEntitySetIds = materializableEntitySetIds.add(entitySetId);
      }
    });

    if (entitySetProjections.length) {
      const { entitySets, entityTypes } = yield call(EntityDataModelApi.getEntityDataModelProjection, entitySetProjections);

      Object.values(entitySets).forEach((entitySet) => {
        if (entitySet) {
          const { id } = entitySet;
          entitySetsById = entitySetsById.set(id, fromJS(entitySet));
          organizationEntitySets = organizationEntitySets.set(id, fromJS(allOrganizationEntitySets[id]));
        }
      });

      Object.values(entityTypes).forEach((entityType) => {
        const { id } = entityType;
        entityTypesById = entityTypesById.set(id, fromJS(entityType));
      });
    }

    yield put(loadOrganizationEntitySets.success(action.id, {
      entitySetsById,
      entityTypesById,
      organizationEntitySets,
      materializableEntitySetIds
    }));
  }
  catch (error) {
    console.error(error);
    yield put(loadOrganizationEntitySets.failure(action.id, error));
  }
  finally {
    yield put(loadOrganizationEntitySets.finally(action.id));
  }
}

export function* loadOrganizationEntitySetsWatcher() :Generator<*, *, *> {
  yield takeEvery(LOAD_ORGANIZATION_ENTITY_SETS, loadOrganizationEntitySetsWorker);
}

function* assembleEntitySetsWorker(action :Object) :Generator<*, *, *> {
  try {
    const { organizationId, entitySetIds } = action.value;
    yield put(assembleEntitySets.request(action.id));

    const refreshRates = {};
    entitySetIds.forEach((entitySetId) => {
      Object.assign(refreshRates, { [entitySetId]: null });
    });

    const organizationEntitySets = yield call(OrganizationsApi.assembleEntitySets, organizationId, refreshRates);

    yield put(assembleEntitySets.success(action.id, organizationEntitySets));

    yield put(loadOrganizationEntitySets(organizationId));
  }
  catch (error) {
    console.error(error);
    yield put(assembleEntitySets.failure(action.id, error));
  }
  finally {
    yield put(assembleEntitySets.finally(action.id));
  }
}

export function* assembleEntitySetsWatcher() :Generator<*, *, *> {
  yield takeEvery(ASSEMBLE_ENTITY_SETS, assembleEntitySetsWorker);
}

function* fetchWritableOrganizationsWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(fetchWritableOrganizations.request(action.id));

    const allOrgs = yield call(OrganizationsApi.getAllOrganizations);

    const accessChecks = allOrgs.map(({ id }) => ({
      aclKey: [id],
      permissions: [Permission.WRITE.name]
    }));

    const authorizations = yield call(AuthorizationApi.checkAuthorizations, accessChecks);

    const writableOrganizationIds = authorizations
      .filter(({ permissions }) => permissions[Permission.WRITE.name])
      .map(({ aclKey }) => aclKey[0]);

    const writableOrganizations = allOrgs.filter(({ id }) => writableOrganizationIds.includes(id));

    yield put(fetchWritableOrganizations.success(action.id, writableOrganizations));

  }
  catch (error) {
    console.error(error)
    yield put(fetchWritableOrganizations.failure(action.id, error));
  }
  finally {
    yield put(fetchWritableOrganizations.finally(action.id));
  }
}

export function* fetchWritableOrganizationsWatcher() :Generator<*, *, *> {
  yield takeEvery(FETCH_WRITABLE_ORGANIZATIONS, fetchWritableOrganizationsWorker);
}

function* getOrganizationIntegrationAccountWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(getOrganizationIntegrationAccount.request(action.id));

    const account = yield call(OrganizationsApi.getOrganizationIntegrationAccount, action.value);

    yield put(getOrganizationIntegrationAccount.success(action.id, account));

  }
  catch (error) {
    console.error(error)
    yield put(getOrganizationIntegrationAccount.failure(action.id, error));
  }
  finally {
    yield put(getOrganizationIntegrationAccount.finally(action.id));
  }
}

export function* getOrganizationIntegrationAccountWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_ORGANIZATION_INTEGRATION_ACCOUNT, getOrganizationIntegrationAccountWorker);
}

function* getOwnedRolesWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(getOwnedRoles.request(action.id));

    const aclKeys = action.value;

    const accessChecks = aclKeys.map((aclKey) => {
      return {
        aclKey,
        permissions: [Permission.OWNER.name]
      };
    });

    const authorizations = yield call(AuthorizationApi.checkAuthorizations, accessChecks);

    const ownedRoles = authorizations
      .filter(({ permissions }) => permissions[Permission.OWNER.name])
      .map(({ aclKey }) => aclKey);

    yield put(getOwnedRoles.success(action.id, ownedRoles));

  }
  catch (error) {
    console.error(error)
    yield put(getOwnedRoles.failure(action.id, error));
  }
  finally {
    yield put(getOwnedRoles.finally(action.id));
  }
}

export function* getOwnedRolesWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_OWNED_ROLES, getOwnedRolesWorker);
}

function* synchronizeDataChangesWorker(action :SequenceAction) :Generator<*, *, *> {
  const { entitySetId, organizationId } = action.value;

  try {
    yield put(synchronizeDataChanges.request(action.id, { entitySetId }));

    yield call(OrganizationsApi.synchronizeDataChanges, organizationId, entitySetId);

    yield put(synchronizeDataChanges.success(action.id));
    yield put(loadOrganizationEntitySets(organizationId));

  }
  catch (error) {
    console.error(error)
    yield put(synchronizeDataChanges.failure(action.id, error));
  }
  finally {
    yield put(synchronizeDataChanges.finally(action.id, { entitySetId }));
  }
}

export function* synchronizeDataChangesWatcher() :Generator<*, *, *> {
  yield takeEvery(SYNCHRONIZE_DATA_CHANGES, synchronizeDataChangesWorker);
}

function* synchronizeEdmChangesWorker(action :SequenceAction) :Generator<*, *, *> {
  const { entitySetId, organizationId } = action.value;

  try {
    yield put(synchronizeEdmChanges.request(action.id, { entitySetId }));

    yield call(OrganizationsApi.synchronizeEdmChanges, organizationId, entitySetId);

    yield put(synchronizeEdmChanges.success(action.id));
    yield put(loadOrganizationEntitySets(organizationId));

  }
  catch (error) {
    console.error(error)
    yield put(synchronizeEdmChanges.failure(action.id, error));
  }
  finally {
    yield put(synchronizeEdmChanges.finally(action.id, { entitySetId }));
  }
}

export function* synchronizeEdmChangesWatcher() :Generator<*, *, *> {
  yield takeEvery(SYNCHRONIZE_EDM_CHANGES, synchronizeEdmChangesWorker);
}
