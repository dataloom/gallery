import AsyncActionTypes from './AsyncActionTypes';
import type { AsyncReference } from './AsyncStorage';
import { STATUS } from './AsyncStorage';

export function updateAsyncReference(reference :AsyncReference, value :any) {
  return {
    type: AsyncActionTypes.UPDATE_ASYNC_REFERENCE,
    reference,
    value
  }
}

export function asyncReferenceError(reference :AsyncReference, errorMessage :string) {
  return updateAsyncReference(reference, {errorMessage});
}

export function asyncReferenceLoading(reference :AsyncReference) {
  return updateAsyncReference(reference, STATUS.LOADING);
}

export default {
  updateAsyncReference,
  asyncReferenceError,
  asyncReferenceLoading
}