/* @flow */
import Immutable from 'immutable';

import * as actionTypes from './AsyncActionTypes';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({});

export default function reducer(state:Immutable.Map = INITIAL_STATE, action:Object) {
  switch (action.type) {
    case actionTypes.UPDATE_ASYNC_REFERENCE:
      const { reference, value } = action;
      return state.setIn([reference.namespace, reference.id], value);

    default:
      return state;
  }
}