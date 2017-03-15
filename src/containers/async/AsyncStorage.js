/* @flow */
import { PropTypes } from 'react';
import { Map } from 'immutable';
import isString from 'lodash/isString';
import includes from 'lodash/includes';
import isUndefined from 'lodash/isUndefined';

export const STATE = Object.freeze({
  EMPTY_REFERENCE: Symbol('empty reference'),
  LOADING: Symbol('loading'),
  COMPLETE: Symbol('complete'),
  ERROR: Symbol('error'),
  NOT_FOUND: Symbol('404'),
  ACCESS_DENIED: Symbol('403')
});

/* Validation */
export type AsyncReference = {
  namespace :string,
  id :string
};

export const AsyncReferencePropType = PropTypes.shape({
  namespace: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
});

export type AsyncValue = {
  state :Symbol,
  value :any
};

export function referenceOrValuePropType(propType) {
  return PropTypes.onOfType([
    propType,
    AsyncReference
  ]);
}

export function isReference(reference :any) :boolean {
  return !!reference && isString(reference.namespace) && isString(reference.id);
}
export function isValue(value :any) :boolean {
  return (!!value &&
    includes(STATE, value.state) &&
    !isUndefined(value.value));
}

/*
 * Async Values
 */

export function createEmptyValue() :AsyncValue {
  return {
    state: STATE.EMPTY_REFERENCE,
    value: null
  };
}
export function createLoadingValue() :AsyncValue {
  return {
    state: STATE.LOADING,
    value: null
  };
}
export function createCompleteValue(value :any) :AsyncValue {
  return {
    state: STATE.COMPLETE,
    value
  };
}
export function createCompleteErrorValue(error :any) :AsyncValue {
  return {
    state: STATE.ERROR,
    value: error
  };
}

/*
 * Referencing and dereferencing
 */
function getReferencePath(reference :AsyncReference) {
  return [reference.namespace, reference.id];
}

export type AsyncContent = Map<String, Map<String, AsyncValue>>

export function resolveReference(
    asyncContent :AsyncContent,
    reference :AsyncReference,
    value :AsyncValue) :AsyncContent {

  if (!asyncContent) {
    throw new Error('"asyncContent" can\'t be null');
  }
  if (!isReference(reference)) {
    throw new Error(`"reference" must be valid AsyncReference, recieved ${reference}`);
  }
  if (!isValue(value)) {
    throw new Error(`"value" must be valid AsyncValue, received ${value}`);
  }

  const path = getReferencePath(reference);

  return asyncContent.setIn(path, value);
}

export function dereference(asyncContent :AsyncContent, reference :AsyncReference) :AsyncValue[] {
  if (!asyncContent) {
    throw new Error('"asyncContent" can\'t be null');
  }
  if (!isReference(reference)) {
    throw new Error(`"reference" must be valid reference, recieved ${reference}`);
  }

  const path = getReferencePath(reference);

  if (!asyncContent.hasIn(path)) {
    return createEmptyValue();
  }

  return asyncContent.getIn(path);
}
