/* @flow */
import * as actionTypes from './CatalogActionTypes';

export function createEntitySetListRequest() {
  return {
    type: actionTypes.ENTITY_SET_LIST_REQUEST
  };
}

export function createEntitySetListSuccess(entitySets: EntitySet[]) {
  return {
    type: actionTypes.ENTITY_SET_LIST_SUCCESS,
    entitySets
  }
}

export function createEntitySetListFailure(errorMessage: string) {
  return {
    type: actionTypes.ENTITY_SET_LIST_FAILURE,
    errorMessage
  }
}

export function createUpdateFilters(filterParams: Object) {
  return {
    type: actionTypes.CATALOG_UPDATE_FILTER,
    filterParams
  }
}