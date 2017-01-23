/* @flow */
import { Map } from 'immutable';
import type { EdmObjectReference } from './EdmStorage';
import type { EdmQueryParam } from '../Api';
import * as actionTypes from './EdmActionTypes';

export function updateNormalizedData(normalizedData: Map<string, Map<string, *>>) {
  return {
    type: actionTypes.UPDATE_NORMALIZED_DATA,
    normalizedData
  };
}

export function filteredEdmRequest(edmQuery:EdmQueryParam[]) {
  return {
    type: actionTypes.FILTERED_EDM_REQUEST,
    edmQuery
  }
}

export function edmObjectResolve(reference:EdmObjectReference) {
  return {
    type: actionTypes.EDM_OBJECT_RESOLVE,
    reference
  }
}

export function allEntityTypesRequest() {
  return {
    type: actionTypes.ALL_ENTITY_TYPES_REQUEST
  }
}
export function allEntityTypesResolve(references:EdmObjectReference[]) {
  return {
    type: actionTypes.ALL_ENTITY_TYPES_RESOLVE,
    references
  }
}
export function allEntityTypesReject(errorMessage:string) {
  return {
    type: actionTypes.ALL_ENTITY_TYPES_REJECT,
    errorMessage
  }
}

export function allPropertyTypesRequest() {
  return {
    type: actionTypes.ALL_PROPERTY_TYPES_REQUEST
  }
}
export function allPropertyTypesResolve(references:EdmObjectReference[]) {
  return {
    type: actionTypes.ALL_PROPERTY_TYPES_RESOLVE,
    references
  }
}
export function allPropertyTypesReject(errorMessage:string) {
  return {
    type: actionTypes.ALL_PROPERTY_TYPES_REJECT,
    errorMessage
  }
}