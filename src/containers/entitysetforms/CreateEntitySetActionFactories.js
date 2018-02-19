import * as actionTypes from './CreateEntitySetActionTypes';

export function createEntitySetRequest(entitySet) {
  return {
    type: actionTypes.CREATE_ENTITY_SET_REQUEST,
    entitySet
  };
}

export function createEntitySetReject(errorMessage) {
  return {
    type: actionTypes.CREATE_ENTITY_SET_REJECT,
    errorMessage
  };
}

export function createEntitySetResolve(reference) {
  return {
    type: actionTypes.CREATE_ENTITY_SET_RESOLVE,
    reference
  };
}

export function createEntitySetReset() {
  return {
    type: actionTypes.CREATE_ENTITY_SET_RESET
  };
}

export function createLinkedEntitySetRequest(linkingRequest) {
  return {
    type: actionTypes.CREATE_LINKED_ENTITY_SET_REQUEST,
    linkingRequest
  };
}

export function createLinkedEntitySetResolve() {
  return {
    type: actionTypes.CREATE_LINKED_ENTITY_SET_RESOLVE
  };
}

export function createLinkedEntitySetReject(errorMessage) {
  return {
    type: actionTypes.CREATE_LINKED_ENTITY_SET_REJECT,
    errorMessage
  };
}
