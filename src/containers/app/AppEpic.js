import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';

import { AppApi } from 'lattice';

import * as actionFactory from './AppActionFactory';


function createAppTypeEpic(action$) {
  return action$
    .ofType(actionFactory.CREATE_APP_TYPE_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(AppApi.createAppType(action.appType))
        .mergeMap(() => {
          return Observable.of(
            actionFactory.createAppTypeSuccess(),
            actionFactory.getAppsRequest());
        })
        .catch(() => {
          return Observable.of(
            actionFactory.createAppTypeFailure('unable to create app type')
          );
        });
    });
}

function createAppEpic(action$) {
  return action$
    .ofType(actionFactory.CREATE_APP_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(AppApi.createApp(action.app))
        .mergeMap(() => {
          return Observable.of(
            actionFactory.createAppSuccess(),
            actionFactory.getAppsRequest());
        })
        .catch(() => {
          return Observable.of(
            actionFactory.createAppFailure('unable to create app')
          );
        });
    });
}

function editAppEpic(action$) {
  return action$
    .ofType(actionFactory.EDIT_APP_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(AppApi.updateAppMetadata(action.appId, action.appData))
        .mergeMap(() => {
          return Observable.of(
            actionFactory.editAppSuccess(),
            actionFactory.getAppsRequest());
        })
        .catch(() => {
          return Observable.of(
            actionFactory.editAppFailure('unable to edit app')
          );
        });
    });
}

function editAppTypeEpic(action$) {
  return action$
    .ofType(actionFactory.EDIT_APP_TYPE_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(AppApi.updateAppTypeMetadata(action.appTypeId, action.appTypeData))
        .mergeMap(() => {
          return Observable.of(
            actionFactory.editAppTypeSuccess(),
            actionFactory.getAppsRequest());
        })
        .catch(() => {
          return Observable.of(
            actionFactory.editAppTypeFailure('unable to edit app type')
          );
        });
    });
}

function addAppTypeToAppEpic(action$) {
  return action$
    .ofType(actionFactory.ADD_APP_TYPE_TO_APP_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(AppApi.addAppTypeToApp(action.appId, action.appTypeId))
        .mergeMap(() => {
          return Observable.of(
            actionFactory.addAppTypeToAppSuccess(),
            actionFactory.getAppsRequest());
        })
        .catch(() => {
          return Observable.of(
            actionFactory.addAppTypeToAppFailure('unable to add app type')
          );
        });
    });
}

function deleteAppTypeFromAppEpic(action$) {
  return action$
    .ofType(actionFactory.DELETE_APP_TYPE_FROM_APP_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(AppApi.removeAppTypeFromApp(action.appId, action.appTypeId))
        .mergeMap(() => {
          return Observable.of(
            actionFactory.deleteAppTypeFromAppSuccess(),
            actionFactory.getAppsRequest());
        })
        .catch(() => {
          return Observable.of(
            actionFactory.deleteAppTypeFromAppFailure('unable to delete app type')
          );
        });
    });
}

function deleteAppEpic(action$) {
  return action$
    .ofType(actionFactory.DELETE_APP_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(AppApi.deleteApp(action.app))
        .mergeMap(() => {
          return Observable.of(
            actionFactory.deleteAppSuccess(),
            actionFactory.getAppsRequest());
        })
        .catch(() => {
          return Observable.of(
            actionFactory.deleteAppFailure('unable to delete app')
          );
        });
    });
}

function getAppTypesForAppTypeIdsEpic(action$) {
  return action$
    .ofType(actionFactory.GET_APP_TYPES_FOR_APP_TYPE_IDS_REQUEST)
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
        .catch(() => {
          return Observable.of(
            actionFactory.getAppTypesForAppTypeIdsFailure('Unable to load app types')
          );
        });
    });
}


function getAppsRequestEpic(action$) {
  return action$.ofType(actionFactory.GET_APPS_REQUEST)
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
        .catch(() => {
          return Observable.of(
            actionFactory.getAppsFailure('Unable to load apps')
          );
        });
    });
}

function installAppEpic(action$) {
  return action$.ofType(actionFactory.INSTALL_APP_REQUEST)
    .mergeMap((action) => {
      const { appId, organizationId, prefix } = action;
      return Observable
        .from(AppApi.installApp(appId, organizationId, prefix))
        .mergeMap(() => {
          return Observable.of(
            actionFactory.installAppSuccess()
          );
        })
        .catch(() => {
          return Observable.of(
            actionFactory.installAppFailure('Unable to install app')
          );
        });
    });
}

export default combineEpics(
  getAppsRequestEpic,
  getAppTypesForAppTypeIdsEpic,
  installAppEpic,
  createAppTypeEpic,
  createAppEpic,
  deleteAppEpic,
  deleteAppTypeFromAppEpic,
  addAppTypeToAppEpic,
  editAppEpic,
  editAppTypeEpic
);
