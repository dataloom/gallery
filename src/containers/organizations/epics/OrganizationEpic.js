import { Models, OrganizationsApi } from 'lattice';

import { push } from 'react-router-redux';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

import * as OrgActionTypes from '../actions/OrganizationActionTypes';
import * as OrgActionFactory from '../actions/OrganizationActionFactory';

const { OrganizationBuilder } = Models;

function createNewOrganizationEpic(action$) {

  return action$
    .ofType(OrgActionTypes.CREATE_ORG_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(OrganizationsApi.createOrganization(action.organization))
        .mergeMap((orgId) => {
          const org = (new OrganizationBuilder())
            .setId(orgId)
            .setTitle(action.organization.title)
            .setPrincipal(action.organization.principal)
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

function deleteOrganizationEpic(action$) {

  return action$
    .ofType(OrgActionTypes.DELETE_ORG_REQUEST)
    .mergeMap((action) => {
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

function updateOrganizationDescriptionEpic(action$) {

  return action$
    .ofType(OrgActionTypes.UPDATE_ORG_DESCRIPTION_REQUEST)
    .mergeMap((action) => {
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

function updateOrganizationTitleEpic(action$) {

  return action$
    .ofType(OrgActionTypes.UPDATE_ORG_TITLE_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(OrganizationsApi.updateTitle(action.organization.id, action.organization.title))
        .map(() => {
          return OrgActionFactory.updateOrganizationTitleSuccess(action.organization.id, action.organization.title);
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.updateOrganizationTitleFailure()
          );
        });
    });
}


function addDomainToOrganizationEpic(action$) {

  return action$
    .ofType(OrgActionTypes.ADD_DOMAIN_TO_ORG_REQUEST)
    .mergeMap((action) => {
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

function removeDomainFromOrganizationEpic(action$) {

  return action$
    .ofType(OrgActionTypes.REMOVE_DOMAIN_FROM_ORG_REQUEST)
    .mergeMap((action) => {
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

function addRoleToOrganizationEpic(action$) {

  return action$
    .ofType(OrgActionTypes.ADD_ROLE_TO_ORG_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(OrganizationsApi.createRole(action.role))
        .mergeMap((roleId) => {
          return Observable.of(
            OrgActionFactory.addRoleToOrganizationSuccess(action.role, roleId)
          );
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.addRoleToOrganizationFailure(action.role)
          );
        });
    });
}

function removeRoleFromOrganizationEpic(action$) {

  return action$
    .ofType(OrgActionTypes.REMOVE_ROLE_FROM_ORG_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(OrganizationsApi.deleteRole(action.orgId, action.roleId))
        .mergeMap(() => {
          return Observable.of(
            OrgActionFactory.removeRoleFromOrganizationSuccess(action.orgId, action.roleId)
          );
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.removeRoleFromOrganizationFailure(action.orgId, action.roleId)
          );
        });
    });
}

function addMemberToOrganizationEpic(action$) {

  return action$
    .ofType(OrgActionTypes.ADD_MEMBER_TO_ORG_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(OrganizationsApi.addMemberToOrganization(action.orgId, action.memberId))
        .mergeMap(() => {
          return Observable.of(
            OrgActionFactory.addMemberToOrganizationSuccess(action.orgId, action.memberId),
            OrgActionFactory.fetchMembersRequest(action.orgId)
          );
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.addMemberToOrganizationFailure()
          );
        });
    });
}

function removeMemberFromOrganizationEpic(action$) {

  return action$
    .ofType(OrgActionTypes.REMOVE_MEMBER_FROM_ORG_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(OrganizationsApi.removeMemberFromOrganization(action.orgId, action.memberId))
        .mergeMap(() => {
          return Observable.of(
            OrgActionFactory.removeMemberFromOrganizationSuccess(action.orgId, action.memberId),
            OrgActionFactory.fetchMembersRequest(action.orgId)
          );
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.removeMemberFromOrganizationFailure()
          );
        });
    });
}

function addRoleToMemberEpic(action$) {

  return action$
    .ofType(OrgActionTypes.ADD_ROLE_TO_MEMBER_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(OrganizationsApi.addRoleToMember(action.orgId, action.roleId, action.memberId))
        .mergeMap(() => {
          return Observable.of(
            OrgActionFactory.addRoleToMemberSuccess(action.orgId, action.roleId, action.memberId),
            OrgActionFactory.fetchMembersRequest(action.orgId) // reload user
          );
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.addRoleToMemberFailure(action.orgId, action.roleId, action.memberId)
          );
        });
    });
}

function removeRoleFromMemberEpic(action$) {

  return action$
    .ofType(OrgActionTypes.REMOVE_ROLE_FROM_MEMBER_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(OrganizationsApi.removeRoleFromMember(action.orgId, action.roleId, action.memberId))
        .mergeMap(() => {
          return Observable.of(
            OrgActionFactory.removeRoleFromMemberSuccess(action.orgId, action.roleId, action.memberId),
            OrgActionFactory.fetchMembersRequest(action.orgId) // reload user
          );
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.removeRoleFromMemberFailure(action.orgId, action.roleId, action.memberId)
          );
        });
    });
}

function fetchMembersEpic(action$) {
  return action$
    .ofType(OrgActionTypes.FETCH_MEMBERS_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(OrganizationsApi.getAllMembers(action.orgId))
        .mergeMap((members) => {
          return Observable.of(
            OrgActionFactory.fetchMembersSuccess(members)
          );
        })
        .catch(() => {
          return Observable.of(
            OrgActionFactory.fetchMembersFailure()
          );
        });
    });
}

function fetchRolesEpic(action$) {
  return action$
    .ofType(OrgActionTypes.FETCH_ROLES_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(OrganizationsApi.getAllRoles(action.orgId))
        .mergeMap((roles) => {
          return Observable.of(
            OrgActionFactory.fetchRolesSuccess(roles)
          );
        })
        .catch((e) => {
          return Observable.of(
            OrgActionFactory.fetchRolesFailure()
          );
        });
    });
}

export default combineEpics(
  createNewOrganizationEpic,
  deleteOrganizationEpic,
  updateOrganizationDescriptionEpic,
  updateOrganizationTitleEpic,
  addDomainToOrganizationEpic,
  removeDomainFromOrganizationEpic,
  addRoleToOrganizationEpic,
  removeRoleFromOrganizationEpic,
  addMemberToOrganizationEpic,
  removeMemberFromOrganizationEpic,
  addRoleToMemberEpic,
  removeRoleFromMemberEpic,
  fetchMembersEpic,
  fetchRolesEpic
);
