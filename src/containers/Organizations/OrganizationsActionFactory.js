/*
 * @flow
 */

import {
  SET_IS_LOADING,
  UPDATE_INVITE_EMAIL,
  SEND_INVITATION,
  SHOW_INVALID_EMAIL_MSG
} from './OrganizationsActionTypes';

export function setIsLoading(isLoading :bool) :Object {

  return {
    type: SET_IS_LOADING,
    isLoading
  };
}

export function updateInviteEmail(email :string) :Object {

  return {
    type: UPDATE_INVITE_EMAIL,
    email
  };
}

export function sendInvitation(email :string) :Object {

  return {
    type: SEND_INVITATION,
    email
  };
}

export function showInvalidEmailMessage() :Object {

  return {
    type: SHOW_INVALID_EMAIL_MSG
  };
}
