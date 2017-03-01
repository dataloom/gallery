/*
 * @flow
 */

import * as PrincipalsActionTypes from './PrincipalsActionTypes';

export function loadPrincipalDetails(id :string) {

  return {
    type: PrincipalsActionTypes.LOAD_PRINCIPAL_DETAILS,
    id
  };
}

export function fetchAllUsersRequest() :Object {

  return {
    type: PrincipalsActionTypes.FETCH_ALL_USERS_REQUEST
  };
}

export function fetchAllUsersSuccess(users :Object[]) :Object {

  return {
    type: PrincipalsActionTypes.FETCH_ALL_USERS_SUCCESS,
    users
  };
}

export function fetchAllUsersFailure() :Object {

  return {
    type: PrincipalsActionTypes.FETCH_ALL_USERS_FAILURE
  };
}

export function fetchUsersRequest(userIds :string[]) :Object {

  return {
    type: PrincipalsActionTypes.FETCH_USERS_REQUEST,
    userIds
  };
}

export function fetchUsersSuccess(users :Object[]) :Object {

  return {
    type: PrincipalsActionTypes.FETCH_USERS_SUCCESS,
    users
  };
}

export function fetchUsersFailure(userIds :string[]) :Object {

  return {
    type: PrincipalsActionTypes.FETCH_USERS_FAILURE,
    userIds
  };
}

export function fetchUserRequest(userId :string) :Object {

  return {
    type: PrincipalsActionTypes.FETCH_USER_REQUEST,
    userId
  };
}

export function fetchUserSuccess(user :Object) :Object {

  return {
    type: PrincipalsActionTypes.FETCH_USER_SUCCESS,
    user
  };
}

export function fetchUserFailure(userId :string) :Object {

  return {
    type: PrincipalsActionTypes.FETCH_USER_FAILURE,
    userId
  };
}

export function searchAllUsersByEmailRequest(searchQuery :string) :Object {

  return {
    type: PrincipalsActionTypes.SEARCH_ALL_USERS_BY_EMAIL_REQUEST,
    searchQuery
  };
}

export function searchAllUsersByEmailSuccess(searchResults :Object[]) :Object {

  return {
    type: PrincipalsActionTypes.SEARCH_ALL_USERS_BY_EMAIL_SUCCESS,
    searchResults
  };
}

export function searchAllUsersByEmailFailure() :Object {

  return {
    type: PrincipalsActionTypes.SEARCH_ALL_USERS_BY_EMAIL_FAILURE
  };
}

export function addRoleToUserRequest(userId :string, roleId :string) :Object {

  return {
    type: PrincipalsActionTypes.ADD_ROLE_TO_USER_REQUEST,
    userId,
    roleId
  };
}

export function addRoleToUserSuccess(userId :string, roleId :string) :Object {

  return {
    type: PrincipalsActionTypes.ADD_ROLE_TO_USER_SUCCESS,
    userId,
    roleId
  };
}

export function addRoleToUserFailure(userId :string, roleId :string) :Object {

  return {
    type: PrincipalsActionTypes.ADD_ROLE_TO_USER_FAILURE,
    userId,
    roleId
  };
}

export function removeRoleFromUserRequest(userId :string, roleId :string) :Object {

  return {
    type: PrincipalsActionTypes.REMOVE_ROLE_FROM_USER_REQUEST,
    userId,
    roleId
  };
}

export function removeRoleFromUserSuccess(userId :string, roleId :string) :Object {

  return {
    type: PrincipalsActionTypes.REMOVE_ROLE_FROM_USER_SUCCESS,
    userId,
    roleId
  };
}

export function removeRoleFromUserFailure(userId :string, roleId :string) :Object {

  return {
    type: PrincipalsActionTypes.REMOVE_ROLE_FROM_USER_FAILURE,
    userId,
    roleId
  };
}
