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

export function popularEntitySetsRequest() {
  return {
    type: actionTypes.POPULAR_ENTITY_SETS_REQUEST
  }
}

export function popularEntitySetsResolve(references:EdmObjectReference[]) {
  return {
    type: actionTypes.POPULAR_ENTITY_SETS_RESOLVE,
    references
  }
}

export function popularEntitySetsReject(errorMessage:string) {
  return {
    type: actionTypes.POPULAR_ENTITY_SETS_REJECT,
    errorMessage
  }
}
