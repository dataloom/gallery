/*
 * @flow
 */

import Immutable from 'immutable';

import {
  SET_IS_LOADING,
  UPDATE_INVITE_EMAIL,
  SHOW_INVALID_EMAIL_MSG
} from './OrganizationsActionTypes';

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  isLoading: true,
  invitationEmail: '',
  showInvalidEmailMessage: false
});

export default function organizationsReducer(state :Map<*, *> = INITIAL_STATE, action :Object) :Map<*, *> {

  console.log(action);

  switch (action.type) {

    case SET_IS_LOADING:
      return state.set('isLoading', action.isLoading);

    case UPDATE_INVITE_EMAIL:
      return state
        .set('invitationEmail', action.email)
        .set('showInvalidEmailMessage', false);

    case SHOW_INVALID_EMAIL_MSG:
      return state.set('showInvalidEmailMessage', true);

    default:
      return state;
  }
}
