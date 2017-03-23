/* @flow */
import { fromJS } from 'immutable';

import * as actionTypes from './AsyncActionTypes';
import {
  resolveReference,
  createCompleteValue
} from './AsyncStorage';
import type { AsyncContent } from './AsyncStorage';

export const INITIAL_STATE :AsyncContent = fromJS({});

export default function reducer(state :AsyncContent = INITIAL_STATE, action :Object) {

  switch (action.type) {
    case actionTypes.UPDATE_ASYNC_REFERENCE:
      return resolveReference(state, action.reference, createCompleteValue(action.value));

    case actionTypes.RESOLVE_ASYNC_REFERENCE:
      return resolveReference(state, action.reference, action.value);

    default:
      return state;
  }
}