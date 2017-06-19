/*
 * @flow
 */

import * as actionTypes from './EdmActionTypes';

export function filteredEdmRequest(edmQuery :Object[]) {
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

export function allEntityTypesReject(errorMessage :string) {
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

export function allPropertyTypesReject(errorMessage :string) {
  return {
    type: actionTypes.ALL_PROPERTY_TYPES_REJECT,
    errorMessage
  };
}

export function updateEntitySetMetadataRequest(entitySetId :string, metadataUpdate :Object) {
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

export function updateEntitySetMetadataReject(errorMessage :string) {
  return {
    type: actionTypes.UPDATE_ENTITY_SET_METADATA_REJECT,
    errorMessage
  };
}
