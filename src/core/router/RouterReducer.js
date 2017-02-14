/*
 * @flow
 */

import Immutable from 'immutable';

import { LOCATION_CHANGE } from 'react-router-redux';

/*
 * https://github.com/gajus/redux-immutable/blob/master/README.md#using-with-react-router-redux
 */

const INITIAL_STATE :Immutable.Map = Immutable.fromJS({
  locationBeforeTransitions: null
});

export default function routerReducer(state :Immutable.Map = INITIAL_STATE, action :Object) :Immutable.Map {

  switch (action.type) {

    case LOCATION_CHANGE:
      return state.set('locationBeforeTransitions', action.payload);

    default:
      return state;
  }
}
