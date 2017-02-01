/*
 * @flow
 */

import {
  CHECK_AUTHORIZATION_REQUEST,
  CHECK_AUTHORIZATION_RESOLVE,
  CHECK_AUTHORIZATION_REJECT,
  REQUEST_PERMISSIONS_MODAL_SHOW,
  REQUEST_PERMISSIONS_MODAL_HIDE,
  REQUEST_PERMISSIONS_MODAL_SUCCESS,
  REQUEST_PERMISSIONS_MODAL_FAILURE,
  SUBMIT_AUTHN_REQUEST,
  LOAD_STATUSES,
  UPDATE_STATUSES
} from './PermissionsActionTypes';

import {
  ALL_PERMISSIONS,
  RequestStatus,
  Status,
  AccessCheck
} from './PermissionsStorage';

import type {
  Authorization,
  AuthNRequest,
  AclKey
} from './PermissionsStorage';

export function checkAuthorizationRequest(accessChecks :AccessCheck[]) :Object {

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
export function checkAuthorizationReject(accessChecks :AccessCheck[], errorMessage :string) :Object {

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

export function requestPermissionsModalSuccess() {
  return {
    type: REQUEST_PERMISSIONS_MODAL_SUCCESS
  }
}

export function requestPermissionsModalError() {
  return {
    type: REQUEST_PERMISSIONS_MODAL_FAILURE
  }
}

export function submitAuthNRequest(requests :AuthNRequest[]) {
  return {
    type: SUBMIT_AUTHN_REQUEST,
    requests
  }
}

export function loadOpenStatusesRequest(aclKeys :AclKey[]) {
  return {
    type: LOAD_STATUSES,
    aclKeys,
    reqStatus: RequestStatus.SUBMITTED
  }
}
export function updateStatusesStatusesRequest(statuses :Status[]) {
  return {
    type: UPDATE_STATUSES,
    statuses
  }
}
