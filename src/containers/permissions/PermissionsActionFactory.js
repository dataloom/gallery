/*
 * @flow
 */

import {
  CHECK_AUTHORIZATION_REQUEST,
  CHECK_AUTHORIZATION_RESOLVE,
  CHECK_AUTHORIZATION_REJECT,
  REQUEST_PERMISSIONS_MODAL_SHOW,
  REQUEST_PERMISSIONS_MODAL_HIDE,
  REQUEST_PERMISSIONS_REQUEST,
  REQUEST_PERMISSIONS_REJECT,
  REQUEST_PERMISSIONS_RESOLVE
} from './PermissionsActionTypes';

import {
  ALL_PERMISSIONS
} from './PermissionsStorage';

import type {
  Authorization,
  PermissionsRequest
} from './PermissionsStorage';

export function checkAuthorizationRequest(accessChecks :Object[]) :Object {

  return {
    type: CHECK_AUTHORIZATION_REQUEST,
    accessChecks
  };
}
export function checkAuthorizationResolve(authorizations :Authorization[]) :Object {

  return {
    type: CHECK_AUTHORIZATION_RESOLVE,
    authorizations
  };
}
export function checkAuthorizationReject(accessChecks :Object[], errorMessage :string) :Object {

  return {
    type: CHECK_AUTHORIZATION_REJECT,
    accessChecks,
    errorMessage
  };
}

export function getEntitySetsAuthorizations(entitySetIds :UUID[]) :Object {

  const accessChecks = entitySetIds.map((id :UUID) => {
    return {
      aclKey: [id],
      permissions: ALL_PERMISSIONS
    };
  });

  return checkAuthorizationRequest(accessChecks);
}

export function requestPermissionsModalShow(entitySetId: UUID) {
  return {
    type: REQUEST_PERMISSIONS_MODAL_SHOW,
    entitySetId
  }
}
export function requestPermissionsModalHide() {
  return {
    type: REQUEST_PERMISSIONS_MODAL_HIDE
  }
}

export function requestPermissionsRequest(requests :PermissionsRequest[]) {
  return {
    type: REQUEST_PERMISSIONS_REQUEST,
    requests
  }
}
export function requestPermissionsReject(requests :PermissionsRequest[], errorMessage :string) {
  return {
    type: REQUEST_PERMISSIONS_RESOLVE,
    requests,
    errorMessage
  }
}
export function requestPermissionsResolve(requests :PermissionsRequest[]) {
  return {
    type: REQUEST_PERMISSIONS_RESOLVE,
    requests
  }
}