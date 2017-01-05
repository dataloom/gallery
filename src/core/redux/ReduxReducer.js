/*
 * @flow
 */

import Immutable from 'immutable';

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({});

export default function appReducer(state :Map<*, *> = INITIAL_STATE, action :Object) :Map<*, *> {

  switch (action.type) {

    default:
      return state;
  }
}
