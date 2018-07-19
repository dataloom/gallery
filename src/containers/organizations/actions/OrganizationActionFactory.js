/*
 * @flow
 */

import { Models } from 'lattice';

import * as OrgActionTypes from '../actions/OrganizationActionTypes';

const {
  Organization,
  Role
} = Models;

/*
 * simple actions
 */

export function clearUserSearchResults() :Object {

  return {
    type: OrgActionTypes.CLEAR_USER_SEARCH_RESULTS
  };
}

export function displayDeleteModal() :Object {

  return {
    type: OrgActionTypes.DISPLAY_DELETE_MODAL
  }
}

export function hideDeleteModal() :Object {

  return {
    type: OrgActionTypes.HIDE_DELETE_MODAL
  }
}

/*
 * HTTP request actions
 */

export function createOrganizationRequest(organization :Organization) :Object {

  return {
    type: OrgActionTypes.CREATE_ORG_REQUEST,
    organization
  };
}

export function createOrganizationSuccess(organization :Organization) :Object {

  return {
    type: OrgActionTypes.CREATE_ORG_SUCCESS,
    organization
  };
}

export function createOrganizationFailure() :Object {

  return {
    type: OrgActionTypes.CREATE_ORG_FAILURE
  };
}

export function deleteOrganizationRequest(orgId :UUID) :Object {

  return {
    type: OrgActionTypes.DELETE_ORG_REQUEST,
    orgId
  };
}

export function deleteOrganizationSuccess(orgId :UUID) :Object {

  return {
    type: OrgActionTypes.DELETE_ORG_SUCCESS,
    orgId
  };
}

export function deleteOrganizationFailure(orgId :UUID) :Object {

  return {
    type: OrgActionTypes.DELETE_ORG_FAILURE,
    orgId
  };
}

export function updateOrganizationDescriptionRequest(organization :Organization) :Object {

  return {
    type: OrgActionTypes.UPDATE_ORG_DESCRIPTION_REQUEST,
    organization
  };
}

export function updateOrganizationDescriptionSuccess() :Object {

  return {
    type: OrgActionTypes.UPDATE_ORG_DESCRIPTION_SUCCESS
  };
}

export function updateOrganizationDescriptionFailure() :Object {

  return {
    type: OrgActionTypes.UPDATE_ORG_DESCRIPTION_FAILURE
  };
}

export function updateOrganizationTitleRequest(organization :Organization) :Object {

  return {
    type: OrgActionTypes.UPDATE_ORG_TITLE_REQUEST,
    organization
  };
}

export function updateOrganizationTitleSuccess(orgId :UUID, title :string) :Object {

  return {
    type: OrgActionTypes.UPDATE_ORG_TITLE_SUCCESS,
    orgId,
    title
  };
}

export function updateOrganizationTitleFailure() :Object {

  return {
    type: OrgActionTypes.UPDATE_ORG_TITLE_FAILURE
  };
}

export function addDomainToOrganizationRequest(orgId :UUID, emailDomain :string) :Object {

  return {
    type: OrgActionTypes.ADD_DOMAIN_TO_ORG_REQUEST,
    orgId,
    emailDomain
  };
}

export function addDomainToOrganizationSuccess(orgId :UUID, emailDomain :string) :Object {

  return {
    type: OrgActionTypes.ADD_DOMAIN_TO_ORG_SUCCESS,
    orgId,
    emailDomain
  };
}

export function addDomainToOrganizationFailure() :Object {

  return {
    type: OrgActionTypes.ADD_DOMAIN_TO_ORG_FAILURE
  };
}

export function removeDomainFromOrganizationRequest(orgId :UUID, emailDomain :string) :Object {

  return {
    type: OrgActionTypes.REMOVE_DOMAIN_FROM_ORG_REQUEST,
    orgId,
    emailDomain
  };
}

export function removeDomainFromOrganizationSuccess(orgId :UUID, emailDomain :string) :Object {

  return {
    type: OrgActionTypes.REMOVE_DOMAIN_FROM_ORG_SUCCESS,
    orgId,
    emailDomain
  };
}

export function removeDomainFromOrganizationFailure() :Object {

  return {
    type: OrgActionTypes.REMOVE_DOMAIN_FROM_ORG_FAILURE
  };
}

export function addRoleToOrganizationRequest(role :Role) :Object {

  return {
    type: OrgActionTypes.ADD_ROLE_TO_ORG_REQUEST,
    role
  };
}

export function addRoleToOrganizationSuccess(role :Role, roleId :UUID) :Object {

  return {
    type: OrgActionTypes.ADD_ROLE_TO_ORG_SUCCESS,
    role,
    roleId
  };
}

export function addRoleToOrganizationFailure(role :Role) :Object {

  return {
    type: OrgActionTypes.ADD_ROLE_TO_ORG_FAILURE,
    role
  };
}

export function removeRoleFromOrganizationRequest(orgId :UUID, roleId :UUID) :Object {

  return {
    type: OrgActionTypes.REMOVE_ROLE_FROM_ORG_REQUEST,
    orgId,
    roleId
  };
}

export function removeRoleFromOrganizationSuccess(orgId :UUID, roleId :UUID) :Object {

  return {
    type: OrgActionTypes.REMOVE_ROLE_FROM_ORG_SUCCESS,
    orgId,
    roleId
  };
}

export function removeRoleFromOrganizationFailure(orgId :UUID, roleId :UUID) :Object {

  return {
    type: OrgActionTypes.REMOVE_ROLE_FROM_ORG_FAILURE,
    orgId,
    roleId
  };
}

export function addMemberToOrganizationRequest(orgId :UUID, memberId :string) :Object {

  return {
    type: OrgActionTypes.ADD_MEMBER_TO_ORG_REQUEST,
    orgId,
    memberId
  };
}

export function addMemberToOrganizationSuccess(orgId :UUID, memberId :string) :Object {

  return {
    type: OrgActionTypes.ADD_MEMBER_TO_ORG_SUCCESS,
    orgId,
    memberId
  };
}

export function addMemberToOrganizationFailure() :Object {

  return {
    type: OrgActionTypes.ADD_MEMBER_TO_ORG_FAILURE
  };
}

export function removeMemberFromOrganizationRequest(orgId :UUID, memberId :string) :Object {

  return {
    type: OrgActionTypes.REMOVE_MEMBER_FROM_ORG_REQUEST,
    orgId,
    memberId
  };
}

export function removeMemberFromOrganizationSuccess(orgId :UUID, memberId :string) :Object {

  return {
    type: OrgActionTypes.REMOVE_MEMBER_FROM_ORG_SUCCESS,
    orgId,
    memberId
  };
}

export function removeMemberFromOrganizationFailure() :Object {

  return {
    type: OrgActionTypes.REMOVE_MEMBER_FROM_ORG_FAILURE
  };
}

export function addRoleToMemberRequest(orgId :UUID, roleId :UUID, memberId :string) :Object {

  return {
    type: OrgActionTypes.ADD_ROLE_TO_MEMBER_REQUEST,
    orgId,
    roleId,
    memberId
  };
}

export function addRoleToMemberSuccess(orgId :UUID, roleId :UUID, memberId :string) :Object {

  return {
    type: OrgActionTypes.ADD_ROLE_TO_MEMBER_SUCCESS,
    orgId,
    roleId,
    memberId
  };
}

export function addRoleToMemberFailure(orgId :UUID, roleId :UUID, memberId :string) :Object {

  return {
    type: OrgActionTypes.ADD_ROLE_TO_MEMBER_FAILURE,
    orgId,
    roleId,
    memberId
  };
}

export function removeRoleFromMemberRequest(orgId :UUID, roleId :UUID, memberId :string) :Object {

  return {
    type: OrgActionTypes.REMOVE_ROLE_FROM_MEMBER_REQUEST,
    orgId,
    roleId,
    memberId
  };
}

export function removeRoleFromMemberSuccess(orgId :UUID, roleId :UUID, memberId :string) :Object {

  return {
    type: OrgActionTypes.REMOVE_ROLE_FROM_MEMBER_SUCCESS,
    orgId,
    roleId,
    memberId
  };
}

export function removeRoleFromMemberFailure(orgId :UUID, roleId :UUID, memberId :string) :Object {

  return {
    type: OrgActionTypes.REMOVE_ROLE_FROM_MEMBER_FAILURE,
    orgId,
    roleId,
    memberId
  };
}

export function fetchMembersRequest(orgId :UUID) :Object {

  return {
    type: OrgActionTypes.FETCH_MEMBERS_REQUEST,
    orgId
  };
}

export function fetchMembersSuccess(members :Object[]) :Object {

  return {
    type: OrgActionTypes.FETCH_MEMBERS_SUCCESS,
    members
  };
}

export function fetchMembersFailure() :Object {

  return {
    type: OrgActionTypes.FETCH_MEMBERS_FAILURE
  };
}

export function fetchRolesRequest(orgId :UUID) :Object {

  return {
    type: OrgActionTypes.FETCH_ROLES_REQUEST,
    orgId
  };
}

export function fetchRolesSuccess(roles :Object[]) :Object {

  return {
    type: OrgActionTypes.FETCH_ROLES_SUCCESS,
    roles
  };
}

export function fetchRolesFailure() :Object {

  return {
    type: OrgActionTypes.FETCH_ROLES_FAILURE
  };
}
