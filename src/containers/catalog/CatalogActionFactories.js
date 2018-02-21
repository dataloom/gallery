import * as actionTypes from './CatalogActionTypes';

export function catalogSearchRequest(filterParams) {
  return {
    type: actionTypes.CATALOG_SEARCH_REQUEST,
    filterParams
  };
}

// TODO: Replace with EdmObjectReferences
export function catalogSearchResolve(entitySetIds, numHits) {
  return {
    type: actionTypes.CATALOG_SEARCH_RESOLVE,
    entitySetIds,
    numHits
  };
}

export function catalogSearchReject(errorMessage) {
  return {
    type: actionTypes.CATALOG_SEARCH_REJECT,
    errorMessage
  };
}

export function clearCatalog() {
  return {
    type: actionTypes.CATALOG_CLEAR
  };
}
