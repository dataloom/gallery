import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';

import { AppApi } from 'lattice';

import * as actionTypes from './AppActionTypes';
import * as actionFactory from './AppActionFactory';


function createAppTypeEpic(action$) {
  return action$
    .ofType(actionTypes.CREATE_APP_TYPE_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(AppApi.createAppType(action.AppType))
        .mergeMap(() => {
          return Observable.of(
            actionFactory.createAppTypeResolve());
        })
        .catch(() => {
          return Observable.of(
            actionFactory.createAppTypeReject()
          );
        });
    });
}

function createAppEpic(action$) {
  return action$
    .ofType(actionTypes.CREATE_APP_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(AppApi.createApp(action.App))
        .mergeMap(() => {
          return Observable.of(
            actionFactory.createAppResolve());
        })
        .catch(() => {
          return Observable.of(
            actionFactory.createAppReject()
          );
        });
    });
}

function getAppTypesForAppTypeIdsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_APP_TYPES_FOR_APP_TYPE_IDS_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(AppApi.getAppTypesForAppTypeIds(action.appTypeIds))
        .mergeMap((appTypeIds) => {
          return Observable.of(
            actionFactory.getAppTypesForAppTypeIdsSuccess(appTypeIds)
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            actionFactory.getAppTypesForAppTypeIdsFailure('Unable to load apps')
          );
        });
    });
}


function getAppsEpic(action$) {
  return action$.ofType(actionTypes.GET_APPS_REQUEST)
    .mergeMap(() => {
      return Observable
        .from(AppApi.getApps())
        .mergeMap((apps) => {
          return Observable.of(
            actionFactory.getAppsSuccess(apps),
            // apps is an array of app objects, so I need to collect the appTypeIds from each
            // check for uniqueness
            // fire off the getting of the App Types
            actionFactory.getAppTypesForAppTypeIds()
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            actionFactory.getAppsFailure('Unable to load apps')
          );
        });
    });
}

function installAppEpic(action$) {
  return action$.ofType(actionTypes.INSTALL_APP_REQUEST)
    .mergeMap((action) => {
      const { appId, organizationId, prefix } = action;
      return Observable
        .from(AppApi.installApp(appId, organizationId, prefix))
        .mergeMap(() => {
          return Observable.of(
            actionFactory.installAppSuccess()
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            actionFactory.installAppFailure('Unable to install app')
          );
        });
    });
}

export default combineEpics(
  getAppsEpic,
  getAppTypesForAppTypeIdsEpic,
  installAppEpic,
  createAppTypeEpic,
  createAppEpic
);
