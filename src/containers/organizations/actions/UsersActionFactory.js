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

export function addRoleToUserRequest(userId :UUID, role :string) :Object {

  return {
    type: UsersActionTypes.ADD_ROLE_TO_USER_REQUEST,
    userId,
    role
  };
}

export function addRoleToUserSuccess(userId :UUID, role :string) :Object {

  return {
    type: UsersActionTypes.ADD_ROLE_TO_USER_SUCCESS,
    userId,
    role
  };
}

export function addRoleToUserFailure() :Object {

  return {
    type: UsersActionTypes.ADD_ROLE_TO_USER_FAILURE
  };
}

export function removeRoleFromUserRequest(userId :UUID, role :string) :Object {

  return {
    type: UsersActionTypes.REMOVE_ROLE_FROM_USER_REQUEST,
    userId,
    role
  };
}

export function removeRoleFromUserSuccess(userId :UUID, role :string) :Object {

  return {
    type: UsersActionTypes.REMOVE_ROLE_FROM_USER_SUCCESS,
    userId,
    role
  };
}

export function removeRoleFromUserFailure() :Object {

  return {
    type: UsersActionTypes.REMOVE_ROLE_FROM_USER_FAILURE
  };
}
