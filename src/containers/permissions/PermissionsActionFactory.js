/*
 * @flow
 */

import { DataModels } from 'loom-data';

import * as PermissionsActionTypes from './PermissionsActionTypes';

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

const {
  Acl,
  AclData
} = DataModels;

export function checkAuthorizationRequest(accessChecks :AccessCheck[]) :Object {

  return {
    type: PermissionsActionTypes.CHECK_AUTHORIZATION_REQUEST,
    accessChecks
  };
}
export function checkAuthorizationResolve(authorizations :Authorization[]) :Object {

  return {
    type: PermissionsActionTypes.CHECK_AUTHORIZATION_RESOLVE,
    authorizations
  };
}
export function checkAuthorizationReject(accessChecks :AccessCheck[], errorMessage :string) :Object {

  return {
    type: PermissionsActionTypes.CHECK_AUTHORIZATION_REJECT,
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
    type: PermissionsActionTypes.REQUEST_PERMISSIONS_MODAL_SHOW,
    entitySetId
  }
}
export function requestPermissionsModalHide() {
  return {
    type: PermissionsActionTypes.REQUEST_PERMISSIONS_MODAL_HIDE
  }
}

export function requestPermissionsModalSuccess() {
  return {
    type: PermissionsActionTypes.REQUEST_PERMISSIONS_MODAL_SUCCESS
  }
}

export function requestPermissionsModalError() {
  return {
    type: PermissionsActionTypes.REQUEST_PERMISSIONS_MODAL_FAILURE
  }
}

export function submitAuthNRequest(requests :AuthNRequest[]) {
  return {
    type: PermissionsActionTypes.SUBMIT_AUTHN_REQUEST,
    requests
  }
}

export function loadOpenStatusesRequest(aclKeys :AclKey[]) {
  return {
    type: PermissionsActionTypes.LOAD_STATUSES,
    aclKeys,
    reqStatus: RequestStatus.SUBMITTED
  }
}
export function updateStatusesStatusesRequest(statuses :Status[]) {
  return {
    type: PermissionsActionTypes.UPDATE_STATUSES,
    statuses
  }
}

export function getAclRequest(aclKey :UUID[]) :Object {

  return {
    type: PermissionsActionTypes.GET_ACL_REQUEST,
    aclKey
  };
}

export function getAclSuccess(aclKey :UUID[], acl :Acl) :Object {

  return {
    type: PermissionsActionTypes.GET_ACL_SUCCESS,
    aclKey,
    acl
  };
}

export function getAclFailure(aclKey :UUID[]) :Object {

  return {
    type: PermissionsActionTypes.GET_ACL_FAILURE,
    aclKey
  };
}

export function updateAclRequest(aclData :AclData) :Object {

  return {
    type: PermissionsActionTypes.UPDATE_ACL_REQUEST,
    aclData
  };
}

export function updateAclSuccess(aclData :AclData) :Object {

  return {
    type: PermissionsActionTypes.UPDATE_ACL_SUCCESS,
    aclData
  };
}

export function updateAclFailure(aclData :AclData) :Object {

  return {
    type: PermissionsActionTypes.UPDATE_ACL_FAILURE,
    aclData
  };
}
