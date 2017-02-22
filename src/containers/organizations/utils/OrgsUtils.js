/*
 * @flow
 */

import Immutable from 'immutable';

export function getUserNameLabelValue(member :Immutable.Map) :string {

  if (!member || member.isEmpty()) {
    return '';
  }

  // https://auth0.com/docs/api/authentication#user-profile
  const memberId :string = member.get('user_id');
  const nickname :string = member.get('nickname');
  const username :string = member.get('username');
  const email :string = member.get('email');

  let label :string = nickname || username;

  if (email) {
    label = `${label} - ${email}`;
  }

  if (memberId.startsWith('auth0')) {
    label = `${label} - Auth0`;
  }
  else if (memberId.startsWith('facebook')) {
    label = `${label} - Facebook`;
  }
  else if (memberId.startsWith('google')) {
    label = `${label} - Google`;
  }

  return label;
}
