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
