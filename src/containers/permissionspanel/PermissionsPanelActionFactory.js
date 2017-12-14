import * as actionTypes from './PermissionsPanelActionTypes';

export function getAllRoles() {
  return {
    type: actionTypes.GET_ALL_ROLES_REQUEST
  };
}

export function getAllRolesSuccess(roles) {
  return {
    type: actionTypes.GET_ALL_ROLES_SUCCESS,
    roles
  };
}

export function getAllRolesFailure(errorMessage) {
  return {
    type: actionTypes.GET_ALL_ROLES_FAILURE,
    errorMessage
  };
}

export function getAllUsers() {
  return {
    type: actionTypes.GET_ALL_USERS_REQUEST
  };
}

export function getAllUsersSuccess(users) {
  return {
    type: actionTypes.GET_ALL_USERS_SUCCESS,
    users
  };
}

export function getAllUsersFailure(errorMessage) {
  return {
    type: actionTypes.GET_ALL_USERS_FAILURE,
    errorMessage
  };
}
