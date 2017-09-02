import * as actionTypes from './TopUtilizersActionTypes';

export function getEntitySetRequest(entitySetId) {
  return {
    type: actionTypes.GET_ENTITY_SET_REQUEST,
    entitySetId
  };
}

export function getEntitySetSuccess(entitySet) {
  return {
    type: actionTypes.GET_ENTITY_SET_SUCCESS,
    entitySet
  };
}

export function getEntitySetFailure(err) {
  return {
    type: actionTypes.GET_ENTITY_SET_FAILURE,
    err
  };
}

export function getAssociationsRequest(entityTypeId) {
  return {
    type: actionTypes.GET_ASSOCIATIONS_REQUEST,
    entityTypeId
  };
}

export function getAssociationsSuccess(data) {
  return {
    type: actionTypes.GET_ASSOCIATIONS_SUCCESS,
    data
  };
}

export function getAssociationsFailure(err) {
  return {
    type: actionTypes.GET_ASSOCIATIONS_FAILURE,
    err
  };
}

export function setEntitySet(data) {
  return {
    type: actionTypes.SET_ENTITY_SET,
    data
  };
}

export function onEntitySelect(rowNum, data) {
  return {
    type: actionTypes.ON_ENTITY_SELECT,
    rowNum,
    data
  };
}

export function getAssociationDetailsRequest(associationId) {
  return {
    type: actionTypes.GET_ASSOCIATION_DETAILS_REQUEST,
    associationId
  };
}

export function getAssociationDetailsSuccess(associationId, associationDetails) {
  return {
    type: actionTypes.GET_ASSOCIATION_DETAILS_SUCCESS,
    associationId,
    associationDetails
  };
}

export function getAssociationDetailsFailure(err) {
  return {
    type: actionTypes.GET_ASSOCIATION_DETAILS_FAILURE,
    err
  };
}

export function submitTopUtilizersRequest(entitySetId, topUtilizersDetails) {
  return {
    type: actionTypes.SUBMIT_TOP_UTILIZERS_REQUEST,
    entitySetId,
    topUtilizersDetails
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

export function downloadTopUtilizersRequest(entitySetId, topUtilizersDetails) {
  return {
    type: actionTypes.DOWNLOAD_TOP_UTILIZERS_REQUEST,
    entitySetId,
    topUtilizersDetails
  };
}

export function downloadTopUtilizersSuccess() {
  return {
    type: actionTypes.DOWNLOAD_TOP_UTILIZERS_SUCCESS
  };
}

export function downloadTopUtilizersFailure() {
  return {
    type: actionTypes.DOWNLOAD_TOP_UTILIZERS_FAILURE
  };
}

export function getTopUtilizersNeighborsRequest(entitySetId, entityIds) {
  return {
    type: actionTypes.GET_TOP_UTILIZERS_NEIGHBORS_REQUEST,
    entitySetId,
    entityIds
  };
}

export function getTopUtilizersNeighborsSuccess(neighbors) {
  return {
    type: actionTypes.GET_TOP_UTILIZERS_NEIGHBORS_SUCCESS,
    neighbors
  };
}

export function getTopUtilizersNeighborsFailure() {
  return {
    type: actionTypes.GET_TOP_UTILIZERS_NEIGHBORS_FAILURE
  };
}

export function addDetailsRow() {
  return {
    type: actionTypes.ADD_DETAILS_ROW
  };
}

export function removeRow(deleteIndex) {
  return {
    type: actionTypes.REMOVE_DETAILS_ROW,
    deleteIndex
  };
}
