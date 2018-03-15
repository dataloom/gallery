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
            actionFactory.createAppTypeResolve(),
            actionFactory.getApps());
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
            actionFactory.createAppResolve(),
            actionFactory.getApps());
        })
        .catch(() => {
          return Observable.of(
            actionFactory.createAppReject()
          );
        });
    });
}

function deleteAppEpic(action$) {
  return action$
    .ofType(actionTypes.DELETE_APP_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(AppApi.deleteApp(action.App))
        .mergeMap(() => {
          return Observable.of(
            actionFactory.deleteAppResolve(),
            actionFactory.getApps());
        })
        .catch(() => {
          return Observable.of(
            actionFactory.deleteAppReject()
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
        .mergeMap((appTypeIdMap) => {
          // console.log('i am in the epic');
          // console.log(appTypeIdMap);
          // I am getting the mapping {356c427a-0c29-4716-8ca3-90a04bba40ac: Object}
          return Observable.of(
            actionFactory.getAppTypesForAppTypeIdsSuccess(appTypeIdMap)
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            actionFactory.getAppTypesForAppTypeIdsFailure('Unable to load app types')
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
          const ids = new Set([]);
          // collects all the unique appTypeIds from apps
          for (let i = 0; i < apps.length; i += 1) {
            for (let j = 0; j < apps[i].appTypeIds.length; j += 1) {
              ids.add(apps[i].appTypeIds[j]);
            }
          }
          const appTypeIds = Array.from(ids);
          return Observable.of(
            actionFactory.getAppsSuccess(apps),
            actionFactory.getAppTypesForAppTypeIdsRequest(appTypeIds)
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
  createAppEpic,
  deleteAppEpic
);
