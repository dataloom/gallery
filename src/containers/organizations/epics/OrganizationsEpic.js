import {
  Types,
  AuthorizationApi,
  OrganizationsApi,
  SearchApi
} from 'lattice';

import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

import * as PermissionsActionFactory from '../../permissions/PermissionsActionFactory';

import * as OrgsActionTypes from '../actions/OrganizationsActionTypes';
import * as OrgsActionFactory from '../actions/OrganizationsActionFactory';

const { PermissionTypes } = Types;

/*
 * TODO: figure out how to set a timeout when loading takes too long, we terminate and dispatch fetchFailed actions
 */

function fetchOrganizationEpic(action$) {

  return action$
    .ofType(OrgsActionTypes.FETCH_ORG_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(OrganizationsApi.getOrganization(action.orgId))
        .mergeMap((organization) => {
          return Observable.of(
            OrgsActionFactory.fetchOrganizationSuccess(organization),
            OrgsActionFactory.fetchOrganizationsAuthorizationsRequest([organization]),
            PermissionsActionFactory.getAclRequest([action.orgId])
          );
        })
        .catch(() => {
          // TODO: navigate away from /orgs/{orgId}
          return Observable.of(
            OrgsActionFactory.fetchOrganizationFailure(action.orgId)
          );
        });
    });
}

function fetchOrganizationsEpic(action$) {

  return action$
    .ofType(OrgsActionTypes.FETCH_ORGS_REQUEST)
    .mergeMap(() => {
      return Observable
        .from(OrganizationsApi.getAllOrganizations())
        .mergeMap((organizations) => {
          return Observable.of(
            OrgsActionFactory.fetchOrganizationsSuccess(organizations),
            OrgsActionFactory.fetchOrganizationsAuthorizationsRequest(organizations)
          );
        })
        .catch(() => {
          return Observable.of(
            OrgsActionFactory.fetchOrganizationsFailure()
          );
        });
    });
}

function fetchOrganizationsAuthorizationsEpic(action$) {

  return action$
    .ofType(OrgsActionTypes.FETCH_ORGS_AUTHORIZATIONS_REQUEST)
    .mergeMap((action) => {
      const accessChecks = action.organizations.map((org) => {
        return {
          aclKey: [org.id],
          permissions: Object.keys(PermissionTypes)
        };
      });
      return Observable
        .from(AuthorizationApi.checkAuthorizations(accessChecks))
        .mergeMap((authorizations) => {
          return Observable.of(
            OrgsActionFactory.fetchOrganizationsAuthorizationsSuccess(authorizations)
          );
        })
        .catch(() => {
          return Observable.of(
            OrgsActionFactory.fetchOrganizationsAuthorizationsFailure()
          );
        });
    });
}

function searchOrganizationsEpic(action$) {

  return action$
    .ofType(OrgsActionTypes.SEARCH_ORGS_REQUEST)
    .mergeMap((action) => {
      // TODO: add paging support for Organizations search results
      const searchOptions = {
        start: 0,
        maxHits: 10,
        searchTerm: action.searchQuery
      };
      return Observable
        .from(SearchApi.searchOrganizations(searchOptions))
        .mergeMap((searchResults) => {
          // TODO: fetch any organizations from the search results that are not in the redux store
          return Observable.of(
            OrgsActionFactory.searchOrganizationsSuccess(searchResults)
          );
        })
        .catch(() => {
          return Observable.of(
            OrgsActionFactory.searchOrganizationsFailure()
          );
        });
    });
}

export default combineEpics(
  fetchOrganizationEpic,
  fetchOrganizationsEpic,
  fetchOrganizationsAuthorizationsEpic,
  searchOrganizationsEpic
);
