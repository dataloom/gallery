/* @flow */
import * as actionTypes from './PermissionsActionTypes';
import type { Authorization, ALL_PERMISSIONS } from './PermissionsStorage';

export function checkAuthorizationRequest(accessChecks:Object[]) {
  return {
    type: actionTypes.CHECK_AUTHORIZATION_REQUEST,
    accessChecks
  };
}
export function checkAuthorizationReject(accessChecks:Object[], errorMessage) {
  return {
    type: actionTypes.CHECK_AUTHORIZATION_REJECT,
    accessChecks,
    errorMessage
  };
}
export function checkAuthorizationResolve(authorizations:Authorization[]) {
  return {
    type: actionTypes.CHECK_AUTHORIZATION_RESOLVE,
    authorizations,
  };
}

export function getEntitySetsAuthorizations(ids:string[]) {
  const accessChecks = ids.map(id => {
    return {
      aclKey: [id],
      permissions: ALL_PERMISSIONS
    }
  });
  return checkAuthorizationRequest(accessChecks);
}