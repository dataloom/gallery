import Immutable from 'immutable';

import * as actionTypes from './AppActionTypes';

export const INITIAL_STATE = Immutable.fromJS({
  apps: Immutable.List(),
  errorMessage: ''
});

export default function reducer(state = INITIAL_STATE, action) {

  switch (action.type) {

    case actionTypes.GET_APPS_SUCCESS:
      return state
        .set('apps', Immutable.fromJS(action.apps))
        .set('errorMessage', '');

    case actionTypes.GET_APPS_FAILURE:
      return state
        .set('apps', Immutable.List())
        .set('errorMessage', action.errorMessage);

    case actionTypes.INSTALL_APP_FAILURE:
      return state.set('errorMessage', action.errorMessage);

    default:
      return state;
  }
}
