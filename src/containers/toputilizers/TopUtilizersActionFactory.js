import * as actionTypes from './TopUtilizersActionTypes';

export function getAllEntityTypesRequest() {
  return {
    type: actionTypes.GET_ENTITY_TYPES_REQUEST
  };
}

export function getAllEntityTypesSuccess(data) {
  return {
    type: actionTypes.GET_ENTITY_TYPES_SUCCESS,
    data
  };
}

export function getAllEntityTypesFailure(err) {
  return {
    type: actionTypes.GET_ENTITY_TYPES_FAILURE,
    err
  };
}

export function setEntitySets(data) {
  return {
    type: actionTypes.SET_ENTITY_SETS,
    data
  };
}

export function setEntitySet(data) {
  return {
    type: actionTypes.SET_ENTITY_SET,
    data
  };
}

export function onEntitySelect(data) {
  return {
    type: actionTypes.ON_ENTITY_SELECT,
    data
  };
}

export function submitTopUtilizersRequest() {
  return {
    type: actionTypes.SUBMIT_TOP_UTILIZERS_REQUEST
  };
}

export function submitTopUtilizersSuccess(data) {
  return {
    type: actionTypes.SUBMIT_TOP_UTILIZERS_SUCCESS,
    data
  };
}

export function submitTopUtilizersFailure() {
  return {
    type: actionTypes.SUBMIT_TOP_UTILIZERS_FAILURE
  };
}
