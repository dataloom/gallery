import * as actionTypes from './TopUtilizersActionTypes';

export function getEntitySetsRequest() {
  return {
    type: actionTypes.GET_ENTITY_SETS_REQUEST
  };
}

export function getEntitySetsSuccess(data) {
  return {
    type: actionTypes.GET_ENTITY_SETS_SUCCESS,
    data
  };
}

export function getEntitySetsFailure() {
  return {
    type: actionTypes.GET_ENTITY_SETS_FAILURE
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
