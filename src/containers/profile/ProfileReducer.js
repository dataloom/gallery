import Immutable from 'immutable';
import * as actionTypes from './ProfileActionTypes';

export const INITIAL_STATE:Immutble.Map<*, *> = Immutable.fromJS({
  firstName: 'Corwin',
  lastName: 'Crownover',
  email: 'corwin.crownover@gmail.com'
});

export default function reducer(state :Immutble.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case actionTypes.ON_PROFILE_SUBMIT:
      console.log('hit onProfileSubmit reducer case, action:', action);

    default:
      return state;
  }
}
