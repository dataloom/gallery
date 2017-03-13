/* @flow */
import * as actionTypes from './CatalogActionTypes';

export function catalogSearchRequest(filterParams:Object) {
  return {
    type: actionTypes.CATALOG_SEARCH_REQUEST,
    filterParams
  };
}

//TODO: Replace with EdmObjectReferences
export function catalogSearchResolve(entitySetIds:string[], numHits:string) {
  return {
    type: actionTypes.CATALOG_SEARCH_RESOLVE,
    entitySetIds,
    numHits
  };
}

export function catalogSearchReject(errorMessage:string) {
  return {
    type: actionTypes.CATALOG_SEARCH_REJECT,
    errorMessage
  };
}

export function allEntitySetsRequest() {
  return {
    type: actionTypes.ALL_ENTITY_SETS_REQUEST
  }
}

export function allEntitySetsResolve(references:EdmObjectReference[]) {
  return {
    type: actionTypes.ALL_ENTITY_SETS_RESOLVE,
    references
  }
}

export function allEntitySetsReject(errorMessage:string) {
  return {
    type: actionTypes.ALL_ENTITY_SETS_REJECT,
    errorMessage
  }
}
