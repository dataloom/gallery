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

export function loadAcls(entitySetId, property) {
  return {
    type: actionTypes.LOAD_ACLS,
    entitySetId,
    property
  };
}

// TODO: IS THIS REDUNDANT?
export function loadAclsRequest(entitySetId, property) {
  return {
    type: actionTypes.LOAD_ACLS_REQUEST,
    entitySetId,
    property
  };
}

export function getUserRolePermissionsRequest(entitySetId, property) {
  return {
    type: actionTypes.GET_USER_ROLE_PERMISSIONS_REQUEST,
    entitySetId,
    property
  };
}

export function getAllUsersAndRoles(entitySet) {
  return {
    type: actionTypes.GET_ALL_USERS_AND_ROLES,
    entitySet
  };
}

export function setAllUsersAndRoles(users, roles) {
  return {
    type: actionTypes.SET_ALL_USERS_AND_ROLES,
    users,
    roles
  };
}

export function setLoadUsersError(bool) {
  return {
    type: actionTypes.SET_LOAD_USERS_ERROR,
    bool
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
