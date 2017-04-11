import * as AsyncActionTypes from './AsyncActionTypes';

import type {
  AsyncReference,
  AsyncValue
} from './AsyncStorage';

import {
  createErrorValue,
  createLoadingValue,
  createCompleteValue,
  isValue,
  isReference
} from './AsyncStorage';

/**
 * Depricated.
 * @param reference
 * @param value
 * @return {{type, reference: AsyncReference, value: any}}
 */
export function updateAsyncReference(reference :AsyncReference, value :any) {
  return {
    type: AsyncActionTypes.UPDATE_ASYNC_REFERENCE,
    reference,
    value
  };
}

export function resolveAsyncReference(reference :AsyncReference, value :AsyncValue) {
  if (!isReference(reference)) {
    throw new Error('invalid reference');
  }
  if (!isValue(value)) {
    throw new Error('"value" must be an AsyncValue. Did you mean to use asyncReferenceComplete?');
  }
  return {
    type: AsyncActionTypes.RESOLVE_ASYNC_REFERENCE,
    reference,
    value
  };
}

export function asyncReferenceError(reference :AsyncReference, errorMessage :string) {
  return resolveAsyncReference(reference, createErrorValue(errorMessage));
}

export function asyncReferenceLoading(reference :AsyncReference) {
  return resolveAsyncReference(reference, createLoadingValue());
}

export function asyncReferenceComplete(reference :AsyncReference, value :any) {
  return resolveAsyncReference(reference, createCompleteValue(value));
}

export default {
  updateAsyncReference,
  asyncReferenceError,
  asyncReferenceLoading,
  asyncReferenceComplete
};
