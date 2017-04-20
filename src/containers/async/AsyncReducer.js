/*
 * @flow
 */

import Immutable from 'immutable';

import * as AsyncActionTypes from './AsyncActionTypes';

import {
  resolveReference,
  createCompleteValue
} from './AsyncStorage';

import type {
  AsyncContent
} from './AsyncStorage';

export const INITIAL_STATE :AsyncContent = Immutable.fromJS({});

export default function reducer(state :AsyncContent = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case AsyncActionTypes.UPDATE_ASYNC_REFERENCE:
      return resolveReference(state, action.reference, createCompleteValue(action.value));

    case AsyncActionTypes.RESOLVE_ASYNC_REFERENCE:
      return resolveReference(state, action.reference, action.value);

    default:
      return state;
  }
}
