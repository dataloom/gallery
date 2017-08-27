/*
 * @flow
 */

import * as actionTypes from './HomeActionTypes';

export function homeEntitySetsRequest(start :number, maxHits :number) {
  return {
    type: actionTypes.HOME_ENTITY_SETS_REQUEST,
    start,
    maxHits
  };
}

export function homeEntitySetsSuccess(entitySetIds :string[], numHits :number) {
  return {
    type: actionTypes.HOME_ENTITY_SETS_SUCCESS,
    entitySetIds,
    numHits
  };
}

export function homeEntitySetsFailure(errorMessage :string) {
  return {
    type: actionTypes.HOME_ENTITY_SETS_FAILURE,
    errorMessage
  };
}
