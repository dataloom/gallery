/* @flow */
import * as actionTypes from './CatalogActionTypes';

export function catalogSearchRequest() {
  return {
    type: actionTypes.CATALOG_SEARCH_REQUEST
  };
}

//TODO: Determine the right place to normalize entitySets
export function catalogSearchResolve(entitySetIds, normalizedData) {
  return {
    type: actionTypes.CATALOG_SEARCH_RESOLVE,
    normalizedData,
    entitySetIds
  }
}

export function catalogSearchReject(errorMessage: string) {
  return {
    type: actionTypes.CATALOG_SEARCH_REJECT,
    errorMessage
  }
}

export function createUpdateFilters(filterParams: Object) {
  return {
    type: actionTypes.CATALOG_UPDATE_FILTER,
    filterParams
  }
}