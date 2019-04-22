/*
 * @flow
 */
import { newRequestSequence } from 'redux-reqseq';

import {
  Models
} from 'lattice';

import * as OrgsActionTypes from './OrganizationsActionTypes';

const Organization = Models.Organization;

export function fetchOrganizationRequest(orgId :UUID) :Object {

  return {
    type: OrgsActionTypes.FETCH_ORG_REQUEST,
    orgId
  };
}

export function fetchOrganizationSuccess(organization :Organization) :Object {

  return {
    type: OrgsActionTypes.FETCH_ORG_SUCCESS,
    organization
  };
}

export function fetchOrganizationFailure(orgId :UUID) :Object {

  return {
    type: OrgsActionTypes.FETCH_ORG_FAILURE,
    orgId
  };
}

export function fetchOrganizationsRequest() :Object {

  return {
    type: OrgsActionTypes.FETCH_ORGS_REQUEST
  };
}

export function fetchOrganizationsSuccess(organizations :Organization[]) :Object {

  return {
    type: OrgsActionTypes.FETCH_ORGS_SUCCESS,
    organizations
  };
}

export function fetchOrganizationsFailure() :Object {

  return {
    type: OrgsActionTypes.FETCH_ORGS_FAILURE
  };
}

export function fetchOrganizationsAuthorizationsRequest(organizations :Organization[]) :Object {

  return {
    type: OrgsActionTypes.FETCH_ORGS_AUTHORIZATIONS_REQUEST,
    organizations
  };
}

export function fetchOrganizationsAuthorizationsSuccess(authorizations :Authorization[]) :Object {

  return {
    type: OrgsActionTypes.FETCH_ORGS_AUTHORIZATIONS_SUCCESS,
    authorizations
  };
}

export function fetchOrganizationsAuthorizationsFailure() :Object {

  return {
    type: OrgsActionTypes.FETCH_ORGS_AUTHORIZATIONS_FAILURE
  };
}


export function searchOrganizationsRequest(searchQuery :string) :Object {

  return {
    type: OrgsActionTypes.SEARCH_ORGS_REQUEST,
    searchQuery
  };
}

export function searchOrganizationsSuccess(searchResults :any) :Object {

  return {
    type: OrgsActionTypes.SEARCH_ORGS_SUCCESS,
    searchResults
  };
}

export function searchOrganizationsFailure() :Object {

  return {
    type: OrgsActionTypes.SEARCH_ORGS_FAILURE
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

export function showAllOrganizations() :Object {

  return {
    type: OrgsActionTypes.SHOW_ALL_ORGS
  };
}

export const FETCH_WRITABLE_ORGANIZATIONS :string = 'FETCH_WRITABLE_ORGANIZATIONS';
export const fetchWritableOrganizations :RequestSequence = newRequestSequence(FETCH_WRITABLE_ORGANIZATIONS);
