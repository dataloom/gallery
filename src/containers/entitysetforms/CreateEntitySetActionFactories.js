/*
 * @flow
 */

import * as actionTypes from './CreateEntitySetActionTypes';

export function createEntitySetRequest(entitySet) {
  return {
    type: actionTypes.CREATE_ENTITY_SET_REQUEST,
    entitySet
  }
}

export function createEntitySetReject(errorMessage :string) {
  return {
    type: actionTypes.CREATE_ENTITY_SET_REJECT,
    errorMessage
  }
}

export function createEntitySetResolve(reference) {
  return {
    type: actionTypes.CREATE_ENTITY_SET_RESOLVE,
    reference
  }
}

export function createEntitySetReset() {
  return {
    type: actionTypes.CREATE_ENTITY_SET_RESET,
  }
}
