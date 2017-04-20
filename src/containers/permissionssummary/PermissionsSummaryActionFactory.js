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

export function setUserPermissions(property, data) {
  return {
    type: actionTypes.SET_USER_PERMISSIONS,
    property,
    data
  }
}

export function setRolePermissions(property, data) {
  return {
    type: actionTypes.SET_ROLE_PERMISSIONS,
    property,
    data
  }
}

export function resetPermissions() {
  return {
    type: actionTypes.RESET_PERMISSIONS
  };
}
