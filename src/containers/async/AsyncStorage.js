/* @flow */
import { PropTypes } from 'react';
import { Map } from 'immutable';
import isString from 'lodash/isString';
import includes from 'lodash/includes';
import isUndefined from 'lodash/isUndefined';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import isArrayLikeObject from 'lodash/isArrayLikeObject';
import isPlainObject from 'lodash/isPlainObject';

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
  return PropTypes.oneOfType([
    propType,
    AsyncReferencePropType
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
export function isEmptyValue(value :any) :boolean {
  return isValue(value) && value.state === STATE.EMPTY_REFERENCE;
}
export function isLoadingValue(value :any) :boolean {
  return isValue(value) && value.state === STATE.LOADING;
}
export function isCompleteValue(value :any) :boolean {
  return isValue(value) && value.state === STATE.COMPLETE;
}
export function isErrorValue(value :any) :boolean {
  return isValue(value) && value.state === STATE.ERROR;
}
/*
 * Async Reference
 */
export function createReference(namespace :string, id :string) {
  if (!isString(namespace) && !isEmpty(namespace)) {
    throw Error(`'namespace' must be non-empty string, received: "${namespace}"`);
  }
  if (!isString(id) && !isEmpty(id)) {
    throw Error(`'id' must be non-empty string, received: "${id}"`);
  }

  return {
    namespace,
    id
  };
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
export function createErrorValue(error :any) :AsyncValue {
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

/**
 * If value is a reference, dereference.
 * If value is array like object, run smartDereference on each item.
 * If value is a plain object, run smartDereference on each value
 * @param asyncContent
 * @param valueOrReference
 * @return {*}
 */
export function smartDereference(asyncContent :AsyncContent, valueOrReference :any) :any {
  if (isReference(valueOrReference)) {
    return dereference(asyncContent, valueOrReference);
  }
  else if (isArrayLikeObject(valueOrReference)) {
    return map(valueOrReference, (vor) => {
      return smartDereference(asyncContent, vor);
    });
  }
  else if (isPlainObject(valueOrReference)) {
    return mapValues(valueOrReference, (value) => {
      return smartDereference(asyncContent, value);
    });
  }
  return valueOrReference;
}
