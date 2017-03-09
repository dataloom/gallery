import * as actionTypes from './EntitySetDetailActionTypes';

export function entitySetDetailRequest(id) {
  return {
    type: actionTypes.ENTITY_SET_REQUEST,
    id
  };
}

export function setPropertyData(data) {
  return {
    type: actionTypes.SET_PROPERTY_DATA,
    data
  };
}
