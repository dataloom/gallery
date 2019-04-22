/*
 * @flow
 */

import { Models } from 'lattice';
import { newRequestSequence } from 'redux-reqseq';

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

export function showDeleteModal() :Object {

  return {
    type: OrgActionTypes.SHOW_DELETE_MODAL
  };
}

export function hideDeleteModal() :Object {

  return {
    type: OrgActionTypes.HIDE_DELETE_MODAL
  };
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

export function updateOrganizationNameRequest(organization :Organization) :Object {

  return {
    type: OrgActionTypes.UPDATE_ORG_NAME_REQUEST,
    organization
  };
}

export function updateOrganizationNameSuccess() :Object {

  return {
    type: OrgActionTypes.UPDATE_ORG_NAME_SUCCESS
  };
}

export function updateOrganizationNameFailure() :Object {

  return {
    type: OrgActionTypes.UPDATE_ORG_NAME_FAILURE
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

export function loadTrustedOrganizationsRequest(organizationId :UUID) :Object {

  return {
    type: OrgActionTypes.LOAD_TRUSTED_ORGS_REQUEST,
    organizationId
  };
}

export function loadTrustedOrganizationsSuccess(organizations :Object[]) :Object {

  return {
    type: OrgActionTypes.LOAD_TRUSTED_ORGS_SUCCESS,
    organizations
  };
}

export function loadTrustedOrganizationsFailure() :Object {

  return {
    type: OrgActionTypes.LOAD_TRUSTED_ORGS_FAILURE
  };
}

export function trustOrganizationRequest(organizationId :UUID, trustedOrganizationPrincipal :Object, isTrusted :boolean) :Object {

  return {
    type: OrgActionTypes.TRUST_ORG_REQUEST,
    organizationId,
    trustedOrganizationPrincipal,
    isTrusted
  };
}

export function trustOrganizationSuccess() :Object {

  return {
    type: OrgActionTypes.TRUST_ORG_SUCCESS
  };
}

export function trustOrganizationFailure() :Object {

  return {
    type: OrgActionTypes.TRUST_ORG_FAILURE
  };
}

export const ASSEMBLE_ENTITY_SETS :string = 'ASSEMBLE_ENTITY_SETS';
export const assembleEntitySets :RequestSequence = newRequestSequence(ASSEMBLE_ENTITY_SETS);

export const LOAD_ORGANIZATION_ENTITY_SETS :string = 'LOAD_ORGANIZATION_ENTITY_SETS';
export const loadOrganizationEntitySets :RequestSequence = newRequestSequence(LOAD_ORGANIZATION_ENTITY_SETS);

export const GET_ORGANIZATION_INTEGRATION_ACCOUNT :string = 'GET_ORGANIZATION_INTEGRATION_ACCOUNT';
export const getOrganizationIntegrationAccount :RequestSequence = newRequestSequence(GET_ORGANIZATION_INTEGRATION_ACCOUNT);

export const GET_OWNED_ROLES :string = 'GET_OWNED_ROLES';
export const getOwnedRoles :RequestSequence = newRequestSequence(GET_OWNED_ROLES);

export const SYNCHRONIZE_DATA_CHANGES :string = 'SYNCHRONIZE_DATA_CHANGES';
export const synchronizeDataChanges :RequestSequence = newRequestSequence(SYNCHRONIZE_DATA_CHANGES);

export const SYNCHRONIZE_EDM_CHANGES :string = 'SYNCHRONIZE_EDM_CHANGES';
export const synchronizeEdmChanges :RequestSequence = newRequestSequence(SYNCHRONIZE_EDM_CHANGES);
