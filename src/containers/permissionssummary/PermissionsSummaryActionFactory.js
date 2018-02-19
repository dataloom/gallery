import * as actionTypes from './PermissionsSummaryActionTypes';

export function initialLoad(entitySet) {
  return {
    type: actionTypes.INITIAL_LOAD,
    entitySet
  };
}

export function loadEntitySet(entitySet) {
  return {
    type: actionTypes.LOAD_ENTITY_SET,
    entitySet
  };
}

export function getAcls(entitySet) {
  return {
    type: actionTypes.GET_ACLS,
    entitySet
  };
}

export function getAllOrganizationsRequest() {
  return {
    type: actionTypes.GET_ALL_ORGANIZATIONS_REQUEST
  };
}

export function getAllOrganizationsSuccess(data) {
  return {
    type: actionTypes.GET_ALL_ORGANIZATIONS_SUCCESS,
    data
  };
}

export function getAllOrganizationsFailure() {
  return {
    type: actionTypes.GET_ALL_ORGANIZATIONS_FAILURE
  };
}

export function getAllRolesRequest() {
  return {
    type: actionTypes.GET_ALL_ROLES_REQUEST
  };
}

export function getAllRolesSuccess(data) {
  return {
    type: actionTypes.GET_ALL_ROLES_SUCCESS,
    data
  };
}

export function getAllRolesFailure() {
  return {
    type: actionTypes.GET_ALL_ROLES_FAILURE
  };
}

export function getAllMembersRequest() {
  return {
    type: actionTypes.GET_ALL_MEMBERS_REQUEST
  };
}

export function getAllMembersSuccess(data) {
  return {
    type: actionTypes.GET_ALL_MEMBERS_SUCCESS,
    data
  };
}

export function getAllMembersFailure() {
  return {
    type: actionTypes.GET_ALL_MEMBERS_FAILURE
  };
}

export function getUserRolePermissionsRequest(entitySetId, property) {
  return {
    type: actionTypes.GET_USER_ROLE_PERMISSIONS_REQUEST,
    entitySetId,
    property
  };
}

export function getUserRolePermissionsSuccess() {
  return {
    type: actionTypes.GET_USER_ROLE_PERMISSIONS_SUCCESS
  };
}

export function getUserRolePermissionsFailure() {
  return {
    type: actionTypes.GET_USER_ROLE_PERMISSIONS_FAILURE
  };
}

export function getAllUsersAndRolesRequest(entitySet) {
  return {
    type: actionTypes.GET_ALL_USERS_AND_ROLES_REQUEST,
    entitySet
  };
}

export function getAllUsersAndRolesSuccess(users, roles) {
  return {
    type: actionTypes.GET_ALL_USERS_AND_ROLES_SUCCESS,
    users,
    roles
  };
}

export function getAllUsersAndRolesFailure() {
  return {
    type: actionTypes.GET_ALL_USERS_AND_ROLES_FAILURE
  };
}

export function setUserPermissions(property, data) {
  return {
    type: actionTypes.SET_USER_PERMISSIONS,
    property,
    data
  };
}

export function setRolePermissions(property, data) {
  return {
    type: actionTypes.SET_ROLE_PERMISSIONS,
    property,
    data
  };
}

export function resetPermissions() {
  return {
    type: actionTypes.RESET_PERMISSIONS
  };
}
