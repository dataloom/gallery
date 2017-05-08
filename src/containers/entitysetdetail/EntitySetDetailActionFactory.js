import * as actionTypes from './EntitySetDetailActionTypes';

export function entitySetDetailRequest(id) {
  return {
    type: actionTypes.ENTITY_SET_REQUEST,
    id
  };
}

export function setEntitySet(data) {
  return {
    type: actionTypes.SET_ENTITY_SET,
    data
  };
}
