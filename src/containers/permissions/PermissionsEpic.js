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

import {
  deserializeAuthorization
} from './PermissionsStorage';

import type {
  AccessCheck,
  PermissionsRequest
} from './PermissionsStorage'

import {
  permissionsRequest
} from '../Api';

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

export default combineEpics(authorizationCheckEpic, requestPermissionsEpic);