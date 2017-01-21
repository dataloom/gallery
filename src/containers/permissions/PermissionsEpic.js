/* @flow */
import { Observable } from 'rxjs';

import { AuthorizationApi } from 'loom-data';

import * as actionTypes from './PermissionsActionTypes';
import * as actionFactories from './PermissionsActionFactories';
import { deserializeAuthorization } from './PermissionsStorage';


// TODO: Save property types
function authorizationCheck(accessChecks:Object[]) {
  return Observable.from(AuthorizationApi.checkAuthorizations(accessChecks))
    .map(authorizations => authorizations.map(deserializeAuthorization))
    .map(actionFactories.checkAuthorizationResolve)
    // Error Handling
    .catch(error => {
      console.error(error);
      return Observable.of(actionFactories.checkAuthorizationReject(accessChecks, "Error loading authorizations"))
    });
}

// TODO: Cancellation and Error handling
function authorizationCheckEpic(action$) {
  return action$.ofType(actionTypes.CHECK_AUTHORIZATION_REQUEST)
  // Run search
    .pluck('accessChecks')
    .mergeMap(authorizationCheck);
}

export default authorizationCheckEpic;