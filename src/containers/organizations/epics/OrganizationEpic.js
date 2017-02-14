/*
 * @flow
 */

import {
  DataModels,
  OrganizationsApi,
} from 'loom-data';

import { push, replace } from 'react-router-redux';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

import * as OrgActionTypes from '../actions/OrganizationActionTypes';
import * as OrgActionFactory from '../actions/OrganizationActionFactory';

const {
  Organization,
  OrganizationBuilder
} = DataModels;

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
            OrgActionFactory.createOrganizationSuccess(org),
            push(`/orgs/${orgId}`)
          );
        });
    })
    .catch(() => {
      return Observable.of(
        OrgActionFactory.createOrganizationFailure()
      );
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
        });
    })
    .catch(() => {
      return Observable.of(
        OrgActionFactory.updateOrganizationDescriptionFailure()
      );
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
        });
    })
    .catch(() => {
      return Observable.of(
        OrgActionFactory.updateOrganizationTitleFailure()
      );
    });
}

export default combineEpics(
  createNewOrganizationEpic,
  updateOrganizationDescriptionEpic,
  updateOrganizationTitleEpic
);
