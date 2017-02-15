/*
 * @flow
 */

import { DataModels } from 'loom-data';

import * as OrgActionTypes from '../actions/OrganizationActionTypes';

const { Organization } = DataModels;

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

export function updateOrganizationTitleSuccess() :Object {

  return {
    type: OrgActionTypes.UPDATE_ORG_TITLE_SUCCESS
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

export function addRoleToOrganizationRequest(orgId :UUID, role :string) :Object {

  return {
    type: OrgActionTypes.ADD_ROLE_TO_ORG_REQUEST,
    orgId,
    role
  };
}

export function addRoleToOrganizationSuccess(orgId :UUID, role :string) :Object {

  return {
    type: OrgActionTypes.ADD_ROLE_TO_ORG_SUCCESS,
    orgId,
    role
  };
}

export function addRoleToOrganizationFailure() :Object {

  return {
    type: OrgActionTypes.ADD_ROLE_TO_ORG_FAILURE
  };
}

export function removeRoleFromOrganizationRequest(orgId :UUID, role :string) :Object {

  return {
    type: OrgActionTypes.REMOVE_ROLE_FROM_ORG_REQUEST,
    orgId,
    role
  };
}

export function removeRoleFromOrganizationSuccess(orgId :UUID, role :string) :Object {

  return {
    type: OrgActionTypes.REMOVE_ROLE_FROM_ORG_SUCCESS,
    orgId,
    role
  };
}

export function removeRoleFromOrganizationFailure() :Object {

  return {
    type: OrgActionTypes.REMOVE_ROLE_FROM_ORG_FAILURE
  };
}
