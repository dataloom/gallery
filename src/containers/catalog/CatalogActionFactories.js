/* @flow */
import * as actionTypes from './CatalogActionTypes';

export function catalogSearchRequest(filterParams:Object) {
  return {
    type: actionTypes.CATALOG_SEARCH_REQUEST,
    filterParams
  };
}

//TODO: Replace with EdmObjectReferences
export function catalogSearchResolve(entitySetIds:string[]) {
  return {
    type: actionTypes.CATALOG_SEARCH_RESOLVE,
    entitySetIds
  };
}

export function catalogSearchReject(errorMessage:string) {
  return {
    type: actionTypes.CATALOG_SEARCH_REJECT,
    errorMessage
  };
}
