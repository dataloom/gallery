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

export function getEntitySetSizeRequest(id) {
  return {
    type: actionTypes.GET_ENTITY_SET_SIZE_REQUEST,
    id
  };
}

export function getEntitySetSizeSuccess(size) {
  return {
    type: actionTypes.GET_ENTITY_SET_SIZE_SUCCESS,
    size
  };
}

export function getEntitySetSizeFailure(errorMessage) {
  return {
    type: actionTypes.GET_ENTITY_SET_SIZE_FAILURE,
    errorMessage
  };
}
