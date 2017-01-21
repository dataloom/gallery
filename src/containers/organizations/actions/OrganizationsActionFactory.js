/*
 * @flow
 */

import {
  DataModels
} from 'loom-data';

import {
  FETCH_ORG_REQUEST,
  FETCH_ORG_SUCCESS,
  FETCH_ORG_FAILURE,

  FETCH_ORGS_REQUEST,
  FETCH_ORGS_SUCCESS,
  FETCH_ORGS_FAILURE,

  CREATE_NEW_ORG_REQUEST,
  CREATE_NEW_ORG_SUCCESS,
  CREATE_NEW_ORG_FAILURE
} from './OrganizationsActionTypes';

const Organization = DataModels.Organization;

export function fetchOrgRequest() :Object {

  return {
    type: FETCH_ORG_REQUEST
  };
}

export function fetchOrgSuccess(organization :Organization) :Object {

  return {
    type: FETCH_ORG_SUCCESS,
    organization
  };
}

export function fetchOrgFailure() :Object {

  return {
    type: FETCH_ORG_FAILURE
  };
}


export function fetchOrgsRequest() :Object {

  return {
    type: FETCH_ORGS_REQUEST
  };
}

export function fetchOrgsSuccess(organizations :Organization[]) :Object {

  return {
    type: FETCH_ORGS_SUCCESS,
    organizations
  };
}

export function fetchOrgsFailure() :Object {

  return {
    type: FETCH_ORGS_FAILURE
  };
}

export function createNewOrgRequest(org :Organization) :Object {

  return {
    type: CREATE_NEW_ORG_REQUEST,
    org
  };
}

export function createNewOrgSuccess(orgId :UUID) :Object {

  return {
    type: CREATE_NEW_ORG_SUCCESS,
    orgId
  };
}

export function createNewOrgFailure() :Object {

  return {
    type: CREATE_NEW_ORG_FAILURE
  };
}
