/*
 * @flow
 */

import {
  AuthorizationApi
} from 'loom-data';

import {
  Observable
} from 'rxjs';

import {
  combineEpics
} from 'redux-observable'

import * as PermissionsActionTypes from './PermissionsActionTypes';
import * as PermissionsActionFactory from './PermissionsActionFactory';
import AsyncActionFactory from '../async/AsyncActionFactory';

import {
  STATUS as ASYNC_STATUS
} from '../async/AsyncStorage';

import {
  deserializeAuthorization,
  createStatusAsyncReference
} from './PermissionsStorage';

import type {
  AccessCheck,
  PermissionsRequest,
  AclKey
} from './PermissionsStorage'

import {
  permissionsRequest,
  getStatus
} from '../Api';

function loadStatuses(reqStatus :string, aclKeys :AclKey[]) {
  const references = aclKeys.map(createStatusAsyncReference);
  return Observable.merge(
    Observable.from(references)
      .map(AsyncActionFactory.asyncReferenceLoading),

    Observable.from(getStatus(reqStatus, aclKeys))
      .mergeMap(statuses => {
        const statusByReference = {};
        statuses.forEach(status => {
          statusByReference[createStatusAsyncReference(status.aclKey)] = status;
        });
        return references.map(reference => {
          const status = statusByReference[reference];
          const value = status ? status : ASYNC_STATUS.NOT_FOUND;
          return AsyncActionFactory.updateAsyncReference(reference, value);
        });
      })
  );
}

function loadStatusesEpic(action$) {
  return action$.ofType(PermissionsActionTypes.LOAD_STATUSES)
    .mergeMap(action => loadStatuses(action.reqStatus, action.aclKeys));
}

function requestPermissions(requests :PermissionsRequest[]) :Observable<Action> {
  return Observable
    .of(requests)
    // .from(permissionsRequest(requests))
    .map(console.log);
}

function requestPermissionsEpic(action$ :Observable<Action>) :Observable<Action> {
  return action$
    .ofType(PermissionsActionTypes.REQUEST_PERMISSIONS_REQUEST)
    .pluck('requests')
    .mergeMap(requestPermissions);
}

// TODO: Save property types
function authorizationCheck(accessChecks :AccessCheck[]) :Observable<Action> {

  return Observable
    .from(AuthorizationApi.checkAuthorizations(accessChecks))
    .map((authorizations) => {
      return authorizations.map(deserializeAuthorization);
    })
    .map(PermissionsActionFactory.checkAuthorizationResolve)
    .catch(() => {
      return Observable.of(
        PermissionsActionFactory.checkAuthorizationReject(accessChecks, 'Error loading authorizations')
      );
    });
}

// TODO: Cancellation and Error handling
function authorizationCheckEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(PermissionsActionTypes.CHECK_AUTHORIZATION_REQUEST)
    .pluck('accessChecks')
    .mergeMap(authorizationCheck);
}

export default combineEpics(authorizationCheckEpic, requestPermissionsEpic, loadStatusesEpic);