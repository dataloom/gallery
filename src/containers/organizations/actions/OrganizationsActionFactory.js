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

export function searchOrgsRequest(searchQuery :string) :Object {

  return {
    type: OrgsActionTypes.SEARCH_ORGS_REQUEST,
    searchQuery
  };
}

export function searchOrgsSuccess(searchResults :any) :Object {

  return {
    type: OrgsActionTypes.SEARCH_ORGS_SUCCESS,
    searchResults
  };
}

export function searchOrgsFailure() :Object {

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

export function addMemberToOrgRequest(orgId :UUID, memberId :string) :Object {

  return {
    type: OrgsActionTypes.ADD_MEMBER_TO_ORG_REQUEST,
    orgId,
    memberId
  };
}

export function addMemberToOrgSuccess(orgId :UUID, memberId :string) :Object {

  return {
    type: OrgsActionTypes.ADD_MEMBER_TO_ORG_SUCCESS,
    orgId,
    memberId
  };
}

export function addMemberToOrgFailure() :Object {

  return {
    type: OrgsActionTypes.ADD_MEMBER_TO_ORG_FAILURE
  };
}

export function removeMemberFromOrgRequest(orgId :UUID, memberId :string) :Object {

  return {
    type: OrgsActionTypes.REMOVE_MEMBER_FROM_ORG_REQUEST,
    orgId,
    memberId
  };
}

export function removeMemberFromOrgSuccess(orgId :UUID, memberId :string) :Object {

  return {
    type: OrgsActionTypes.REMOVE_MEMBER_FROM_ORG_SUCCESS,
    orgId,
    memberId
  };
}

export function removeMemberFromOrgFailure() :Object {

  return {
    type: OrgsActionTypes.REMOVE_MEMBER_FROM_ORG_FAILURE
  };
}
