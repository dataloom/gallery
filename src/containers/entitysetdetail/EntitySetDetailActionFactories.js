import * as actionTypes from './EntitySetDetailActionTypes';

export function entitySetDetailRequest(id) {
  return {
    type: actionTypes.ENTITY_SET_REQUEST,
    id
  };
}

export function setEntityData(data) {
  return {
    type: actionTypes.SET_ENTITY_DATA,
    data
  };
}

export function setPropertyData(data) {
  return {
    type: actionTypes.SET_PROPERTY_DATA,
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
