/*
 * @flow
 */

import {
  DataModels,
  Types,
  OrganizationsApi
} from 'loom-data';

import { push } from 'react-router-redux';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

import * as OrgActionTypes from '../actions/OrganizationActionTypes';
import * as OrgActionFactory from '../actions/OrganizationActionFactory';

const {
  Organization,
  OrganizationBuilder
} = DataModels;

const {
  PrincipalTypes
} = Types;

function createNewOrganizationEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgActionTypes.CREATE_ORG_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(OrganizationsApi.createOrganization(action.organization))
        .mergeMap((orgId) => {
          const org :Organization = (new OrganizationBuilder())
            .setId(orgId)
            .setTitle(action.organization.title)
            .build();
          return Observable.of(
            push(`/orgs/${orgId}`), // this must happen first, otherwise things break elsewhere
            OrgActionFactory.createOrganizationSuccess(org)
          );
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.createOrganizationFailure()
          );
        });
    });
}

function updateOrganizationDescriptionEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgActionTypes.UPDATE_ORG_DESCRIPTION_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(OrganizationsApi.updateDescription(action.organization.id, action.organization.description))
        .map(() => {
          return OrgActionFactory.updateOrganizationDescriptionSuccess();
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.updateOrganizationDescriptionFailure()
          );
        });
    });
}

function updateOrganizationTitleEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgActionTypes.UPDATE_ORG_TITLE_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(OrganizationsApi.updateTitle(action.organization.id, action.organization.title))
        .map(() => {
          return OrgActionFactory.updateOrganizationTitleSuccess();
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.updateOrganizationTitleFailure()
          );
        });
    });
}


function addDomainToOrganizationEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgActionTypes.ADD_DOMAIN_TO_ORG_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(OrganizationsApi.addAutoApprovedEmailDomain(action.orgId, action.emailDomain))
        .map(() => {
          return OrgActionFactory.addDomainToOrganizationSuccess(action.orgId, action.emailDomain);
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.addDomainToOrganizationFailure()
          );
        });
    });
}

function removeDomainFromOrganizationEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgActionTypes.REMOVE_DOMAIN_FROM_ORG_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(OrganizationsApi.removeAutoApprovedEmailDomain(action.orgId, action.emailDomain))
        .map(() => {
          return OrgActionFactory.removeDomainFromOrganizationSuccess(action.orgId, action.emailDomain);
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.removeDomainFromOrganizationFailure()
          );
        });
    });
}

export function addRoleToOrganizationEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgActionTypes.ADD_ROLE_TO_ORG_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(OrganizationsApi.addPrincipal(action.orgId, PrincipalTypes.ROLE, action.role))
        .mergeMap(() => {
          return Observable.of(
            OrgActionFactory.addRoleToOrganizationSuccess(action.orgId, action.role)
          );
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.addRoleToOrganizationFailure()
          );
        });
    });
}

export function removeRoleFromOrganizationEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgActionTypes.REMOVE_ROLE_FROM_ORG_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(OrganizationsApi.removePrincipal(action.orgId, PrincipalTypes.ROLE, action.role))
        .mergeMap(() => {
          return Observable.of(
            OrgActionFactory.removeRoleFromOrganizationSuccess(action.orgId, action.role)
          );
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.removeRoleFromOrganizationFailure()
          );
        });
    });
}

export function addMemberToOrganizationEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgActionTypes.ADD_MEMBER_TO_ORG_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(OrganizationsApi.addPrincipal(action.orgId, PrincipalTypes.USER, action.memberId))
        .mergeMap(() => {
          return Observable.of(
            OrgActionFactory.addMemberToOrganizationSuccess(action.orgId, action.memberId)
          );
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.addMemberToOrganizationFailure()
          );
        });
    });
}

export function removeMemberFromOrganizationEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgActionTypes.REMOVE_MEMBER_FROM_ORG_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(OrganizationsApi.removePrincipal(action.orgId, PrincipalTypes.USER, action.memberId))
        .mergeMap(() => {
          return Observable.of(
            OrgActionFactory.removeMemberFromOrganizationSuccess(action.orgId, action.memberId)
          );
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.removeMemberFromOrganizationFailure()
          );
        });
    });
}

export function deleteOrganizationEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgActionTypes.DELETE_ORG_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(OrganizationsApi.deleteOrganization(action.orgId))
        .mergeMap(() => {
          return Observable.of(
            push('/orgs'),
            OrgActionFactory.deleteOrganizationSuccess(action.orgId)
          );
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.deleteOrganizationFailure(action.orgId)
          );
        });
    });
}

export default combineEpics(
  createNewOrganizationEpic,
  updateOrganizationDescriptionEpic,
  updateOrganizationTitleEpic,
  addDomainToOrganizationEpic,
  removeDomainFromOrganizationEpic,
  addRoleToOrganizationEpic,
  removeRoleFromOrganizationEpic,
  addMemberToOrganizationEpic,
  removeMemberFromOrganizationEpic,
  deleteOrganizationEpic
);
