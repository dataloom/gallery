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

export function setAllUsersById(data) {
  return {
    type: actionTypes.SET_ALL_USERS_BY_ID,
    data
  };
}
