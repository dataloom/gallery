import * as actionTypes from './PermissionsSummaryActionTypes';

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

export function setPropertyUserPermissions(data) {
  return {
    type: actionTypes.SET_PROPERTY_USER_PERMISSIONS,
    data
  };
}

export function setPropertyRolePermissions(data) {
  return {
    type: actionTypes.SET_PROPERTY_ROLE_PERMISSIONS,
    data
  };
}

export function setEntityUserPermissions(data) {
  return {
    type: actionTypes.SET_ENTITY_USER_PERMISSIONS,
    data
  };
}

export function setEntityRolePermissions(data) {
  return {
    type: actionTypes.SET_ENTITY_ROLE_PERMISSIONS,
    data
  };
}
