import * as actionTypes from './EntitySetDetailActionTypes';
import * as ndataActionFactories from '../ndata/NdataActionFactories';

export function entitySetDetailRequest(id) {
  return {
    type: actionTypes.ENTITY_SET_REQUEST,
    id
  }
}

export function entitySetDetailResolve(id) {
  return {
    type: actionTypes.ENTITY_SET_RESOLVE,
    id
  }
}

export function entitySetDetailReject(errorMessage) {
  return {
    type: actionTypes.ENTITY_SET_REJECT,
    errorMessage
  }
}