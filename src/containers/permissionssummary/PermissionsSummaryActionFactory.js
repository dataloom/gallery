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

export function setEntitySet(entitySet) {
  return {
    type: actionTypes.SET_ENTITY_SET,
    entitySet
  };
}

export function loadAclsRequest(entitySetId, property) {
  return {
    type: actionTypes.LOAD_ACLS_REQUEST,
    entitySetId,
    property
  };
}

export function updateAclsEpicRequest(entitySetId, property) {
  return {
    type: actionTypes.UPDATE_ACLS_EPIC_REQUEST,
    entitySetId,
    property
  };
}

export function updateAclsRequest(aces, property) {
  return {
    type: actionTypes.UPDATE_ACLS_REQUEST,
    aces,
    property
  };
}

export function updateAclsSuccess(aces, property) {
  return {
    type: actionTypes.UPDATE_ACLS_SUCCESS,
    aces,
    property
  };
}

export function updateAclsFailure() {
  return {
    type: actionTypes.UPDATE_ACLS_FAILURE
  };
}

export function setEntityData(data) {
  return {
    type: actionTypes.SET_ENTITY_DATA,
    data
  };
}

export function setEntityGlobalValue(data) {
  return {
    type: actionTypes.SET_ENTITY_GLOBAL_VALUE,
    data
  };
}

export function setPropertyData(data) {
  return {
    type: actionTypes.SET_PROPERTY_DATA,
    data
  };
}

export function setPropertyGlobalValue(id, data) {
  return {
    type: actionTypes.SET_PROPERTY_GLOBAL_VALUE,
    id,
    data
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

export function setNewRoleValue(value) {
  return {
    type: actionTypes.SET_NEW_ROLE_VALUE,
    value
  };
}

export function setNewEmailValue(value) {
  return {
    type: actionTypes.SET_NEW_EMAIL_VALUE,
    value
  };
}

export function setUpdateSuccess(bool) {
  return {
    type: actionTypes.SET_UPDATE_SUCCESS,
    bool
  };
}

export function setUpdateError(bool) {
  return {
    type: actionTypes.SET_UPDATE_ERROR,
    bool
  };
}

export function setAllPermissions(entitySetId, property) {
  return {
    type: actionTypes.SET_ALL_PERMISSIONS,
    entitySetId,
    property
  };
}

export function setUserPermissions(data) {
  return {
    type: actionTypes.SET_USER_PERMISSIONS,
    data
  }
}

export function setRolePermissions(data) {
  return {
    type: actionTypes.SET_ROLE_PERMISSIONS,
    data
  }
}

export function resetPermissions() {
  return {
    type: actionTypes.RESET_PERMISSIONS
  };
}
