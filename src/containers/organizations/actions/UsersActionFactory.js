/*
 * @flow
 */

import * as UsersActionTypes from './UsersActionTypes';

export function fetchAllUsersRequest() :Object {

  return {
    type: UsersActionTypes.FETCH_ALL_USERS_REQUEST
  };
}

export function fetchAllUsersSuccess(users :Object[]) :Object {

  return {
    type: UsersActionTypes.FETCH_ALL_USERS_SUCCESS,
    users
  };
}

export function fetchAllUsersFailure() :Object {

  return {
    type: UsersActionTypes.FETCH_ALL_USERS_FAILURE
  };
}

export function setUserRolesRequest(userId :UUID, roles :string[]) :Object {

  return {
    type: UsersActionTypes.SET_USER_ROLES_REQUEST,
    userId,
    roles
  };
}

export function setUserRolesSuccess() :Object {

  return {
    type: UsersActionTypes.SET_USER_ROLES_SUCCESS
  };
}

export function setUserRolesFailure() :Object {

  return {
    type: UsersActionTypes.SET_USER_ROLES_FAILURE
  };
}
