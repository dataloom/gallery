import type { EdmObjectReference } from '../edm/EdmStorage';
import * as actionTypes from './CreateEntitySetActionTypes';

export function createEntitySetRequest(entitySet:DataModels.EntitySet) {
  return {
    type: actionTypes.CREATE_ENTITY_SET_REQUEST,
    entitySet
  }
}

export function createEntitySetReject(errorMessage:string) {
  return {
    type: actionTypes.CREATE_ENTITY_SET_REJECT,
    errorMessage
  }
}

export function createEntitySetResolve(reference:EdmObjectReference) {
  return {
    type: actionTypes.CREATE_ENTITY_SET_RESOLVE,
    reference
  }
}