import * as actionTypes from './EdmActionTypes';

export function filteredEdmRequest(edmQuery) {
  return {
    type: actionTypes.FILTERED_EDM_REQUEST,
    edmQuery
  };
}

export function edmObjectResolve(reference) {
  return {
    type: actionTypes.EDM_OBJECT_RESOLVE,
    reference
  };
}

export function allEntityTypesRequest() {
  return {
    type: actionTypes.ALL_ENTITY_TYPES_REQUEST
  };
}

export function allEntityTypesResolve(references) {
  return {
    type: actionTypes.ALL_ENTITY_TYPES_RESOLVE,
    references
  };
}

export function allEntityTypesReject(errorMessage) {
  return {
    type: actionTypes.ALL_ENTITY_TYPES_REJECT,
    errorMessage
  };
}

export function allPropertyTypesRequest() {
  return {
    type: actionTypes.ALL_PROPERTY_TYPES_REQUEST
  };
}

export function allPropertyTypesResolve(references) {
  return {
    type: actionTypes.ALL_PROPERTY_TYPES_RESOLVE,
    references
  };
}

export function allPropertyTypesReject(errorMessage) {
  return {
    type: actionTypes.ALL_PROPERTY_TYPES_REJECT,
    errorMessage
  };
}

export function updateEntitySetMetadataRequest(entitySetId, metadataUpdate) {
  return {
    type: actionTypes.UPDATE_ENTITY_SET_METADATA_REQUEST,
    entitySetId,
    metadataUpdate
  };
}

export function updateEntitySetMetadataResolve() {
  return {
    type: actionTypes.UPDATE_ENTITY_SET_METADATA_RESOLVE
  };
}

export function updateEntitySetMetadataReject(errorMessage) {
  return {
    type: actionTypes.UPDATE_ENTITY_SET_METADATA_REJECT,
    errorMessage
  };
}

export function getAllEntitySetPropertyMetadataRequest(entitySetId) {
  return {
    type: actionTypes.GET_ALL_ENTITY_SET_PROPERTY_METADATA_REQUEST,
    entitySetId
  };
}

export function getAllEntitySetPropertyMetadataResolve(entitySetId, entitySetPropertyMetadata) {
  return {
    type: actionTypes.GET_ALL_ENTITY_SET_PROPERTY_METADATA_SUCCESS,
    entitySetId,
    entitySetPropertyMetadata
  };
}

export function getAllEntitySetPropertyMetadataReject(errorMessage) {
  return {
    type: actionTypes.GET_ALL_ENTITY_SET_PROPERTY_METADATA_FAILURE,
    errorMessage
  };
}

export function updateEntitySetPropertyMetadataRequest(entitySetId, propertyTypeId, update) {
  return {
    type: actionTypes.UPDATE_ENTITY_SET_PROPERTY_METADATA_REQUEST,
    entitySetId,
    propertyTypeId,
    update
  };
}

export function updateEntitySetPropertyMetadataResolve() {
  return {
    type: actionTypes.UPDATE_ENTITY_SET_PROPERTY_METADATA_SUCCESS
  };
}

export function updateEntitySetPropertyMetadataReject(errorMessage) {
  return {
    type: actionTypes.UPDATE_ENTITY_SET_PROPERTY_METADATA_FAILURE,
    errorMessage
  };
}
