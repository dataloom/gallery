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
