/* @flow */
import { Map } from 'immutable';
import * as actionTypes from './EdmActionTypes';

export function updateNormalizedData(normalizedData: Map<string, Map<string, *>>) {
  return {
    type: actionTypes.UPDATE_NORMALIZED_DATA,
    normalizedData
  };
}

export function filteredEdmRequest(edmQuery) {
  return {
    type: actionTypes.FILTERED_EDM_REQUEST,
    edmQuery
  }
}

export function edmObjectResolve(reference) {
  return {
    type: actionTypes.EDM_OBJECT_RESOLVE,
    reference
  }
}