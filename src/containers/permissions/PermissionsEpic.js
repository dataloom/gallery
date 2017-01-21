/*
 * @flow
 */

import {
  AuthorizationApi
} from 'loom-data';

import {
  Observable
} from 'rxjs';

import * as PermissionsActionTypes from './PermissionsActionTypes';
import * as PermissionsActionFactory from './PermissionsActionFactory';

import {
  deserializeAuthorization
} from './PermissionsStorage';

// TODO: Save property types
function authorizationCheck(accessChecks :Object[]) :Observable<Action> {

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
export default function authorizationCheckEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(PermissionsActionTypes.CHECK_AUTHORIZATION_REQUEST)
    .pluck('accessChecks')
    .mergeMap(authorizationCheck);
}
