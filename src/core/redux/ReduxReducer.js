/*
 * @flow
 */

import Immutable from 'immutable';

import {
  combineReducers
} from 'redux-immutable';

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({});

// TODO - remove this from here once we start using reducers
function appReducer(state :Map<*, *> = INITIAL_STATE, action :Object) :Map<*, *> {

  switch (action.type) {

    default:
      return state;
  }
}

export default function reduxReducer() {

  return combineReducers({
    app: appReducer
  });
}
