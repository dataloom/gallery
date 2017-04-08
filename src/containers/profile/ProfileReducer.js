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

    case actionTypes.HANDLE_CHANGE:
      console.log('hit HANDLE_CHANGE reducer case, action:', action);
      return state.merge({
        [action.label]: action.value
      });

    default:
      return state;
  }
}
