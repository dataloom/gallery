/*
 * @flow
 */

import { List, Map } from 'immutable';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

export function getUserNameLabelValue(member :Map) :string {

  if (!member || member.isEmpty()) {
    return '';
  }

  const profile = member.get('profile', member) || member;

  // https://auth0.com/docs/api/authentication#user-profile
  const memberId :string = profile.get('user_id');
  const nickname :string = profile.get('nickname');
  const username :string = profile.get('username');
  const email :string = profile.get('email');

  let label :string = nickname || username;

  if (email) {
    label = `${label} - ${email}`;
  }

  if (isString(memberId) && !isEmpty(memberId)) {
    if (memberId.startsWith('auth0')) {
      label = `${label} - Auth0`;
    }
    else if (memberId.startsWith('facebook')) {
      label = `${label} - Facebook`;
    }
    else if (memberId.startsWith('google')) {
      label = `${label} - Google`;
    }
  }

  return label;
}

// auth is auth0 auth object
export function sortOrganizations(visibleOrgIds, organizations, auth) {
  const yourOrgs = [];
  const memberOfOrgs = [];
  const publicOrgs = [];

  const currentUserId :string = auth.getProfile().user_id;

  visibleOrgIds.forEach((orgId :UUID) => {

    const organization :Map = organizations.get(orgId, Map());

    let isMemberOfOrg :boolean = false;
    organization.get('members', List()).forEach((memberObj :Object) => {
      if (memberObj.get('id') === currentUserId) {
        isMemberOfOrg = true;
      }
    });

    if (!organization.isEmpty()) {
      if (organization.get('isOwner') === true) {
        yourOrgs.push(organization);
      }
      else if (isMemberOfOrg) {
        memberOfOrgs.push(organization);
      }
      else {
        publicOrgs.push(organization);
      }
    }
  });

  return {
    yourOrgs,
    memberOfOrgs,
    publicOrgs
  };
}
