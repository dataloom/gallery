import Immutable from 'immutable';

import {
  Models,
  Types
} from 'lattice';

import {
  getDbAccessCredential
} from './ProfileActionFactory';

const INITIAL_STATE = Immutable.fromJS({
  dbAccessUsername: '',
  dbAccessCredential: ''
});

export default function profileReducer(state = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case getDbAccessCredential.case(action.type): {
      return getDbAccessCredential.reducer(state, action, {
        SUCCESS: () => state
          .set('dbAccessUsername', action.value.username)
          .set('dbAccessCredential', action.value.credential),
        FAILURE: () => state.set('dbAccessCredential', '')
      });
    }

    default:
      return state;
  }
}
