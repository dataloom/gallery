/*
 * @flow
 */

import {
  DataModels
} from 'loom-data';

import * as OrgsActionTypes from './OrganizationsActionTypes';

const Organization = DataModels.Organization;

export function fetchOrgRequest(orgId :UUID) :Object {

  return {
    type: OrgsActionTypes.FETCH_ORG_REQUEST,
    orgId
  };
}

export function fetchOrgSuccess(organization :Organization) :Object {

  return {
    type: OrgsActionTypes.FETCH_ORG_SUCCESS,
    organization
  };
}

export function fetchOrgFailure() :Object {

  return {
    type: OrgsActionTypes.FETCH_ORG_FAILURE
  };
}


export function fetchOrgsRequest() :Object {

  return {
    type: OrgsActionTypes.FETCH_ORGS_REQUEST
  };
}

export function fetchOrgsSuccess(organizations :Organization[]) :Object {

  return {
    type: OrgsActionTypes.FETCH_ORGS_SUCCESS,
    organizations
  };
}

export function fetchOrgsFailure() :Object {

  return {
    type: OrgsActionTypes.FETCH_ORGS_FAILURE
  };
}

export function createNewOrgRequest(org :Organization) :Object {

  return {
    type: OrgsActionTypes.CREATE_NEW_ORG_REQUEST,
    org
  };
}

export function createNewOrgSuccess(orgId :UUID) :Object {

  return {
    type: OrgsActionTypes.CREATE_NEW_ORG_SUCCESS,
    orgId
  };
}

export function createNewOrgFailure() :Object {

  return {
    type: OrgsActionTypes.CREATE_NEW_ORG_FAILURE
  };
}

export function joinOrgRequest(orgId :UUID) :Object {

  return {
    type: OrgsActionTypes.JOIN_ORG_REQUEST,
    orgId
  };
}

export function joinOrgSuccess() :Object {

  return {
    type: OrgsActionTypes.JOIN_ORG_SUCCESS
  };
}

export function joinOrgFailure() :Object {

  return {
    type: OrgsActionTypes.JOIN_ORG_FAILURE
  };
}

export function addRoleToOrgRequest(orgId :UUID, role :string) :Object {

  return {
    type: OrgsActionTypes.ADD_ROLE_TO_ORG_REQUEST,
    orgId,
    role
  };
}

export function addRoleToOrgSuccess(orgId :UUID, role :string) :Object {

  return {
    type: OrgsActionTypes.ADD_ROLE_TO_ORG_SUCCESS,
    orgId,
    role
  };
}

export function addRoleToOrgFailure() :Object {

  return {
    type: OrgsActionTypes.ADD_ROLE_TO_ORG_FAILURE
  };
}

export function removeRoleFromOrgRequest(orgId :UUID, role :string) :Object {

  return {
    type: OrgsActionTypes.REMOVE_ROLE_FROM_ORG_REQUEST,
    orgId,
    role
  };
}

export function removeRoleFromOrgSuccess(orgId :UUID, role :string) :Object {

  return {
    type: OrgsActionTypes.REMOVE_ROLE_FROM_ORG_SUCCESS,
    orgId,
    role
  };
}

export function removeRoleFromOrgFailure() :Object {

  return {
    type: OrgsActionTypes.REMOVE_ROLE_FROM_ORG_FAILURE
  };
}
