import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';

import { AppApi } from 'lattice';

import * as actionTypes from './AppActionTypes';
import * as actionFactory from './AppActionFactory';


function createAppType(AppType) {
  return Observable.from(AppApi.createAppType(AppType))
    .map((response) => {
      return Object.assign({}, AppType, {
        id: response[AppType.name]
      });
    })
    .mergeMap((savedAppType) => {
      const reference = {
        id: savedAppType.id
      };
      return Observable.of(
        actionFactories.createAppTypeResolve(reference),
      );
    })
    .catch(() => {
      return Observable.of(
        actionFactories.createAppTypeReject('Error saving app type')
      );
    });
}


// TODO: Cancellation and Error handling
function createAppTypeEpic(action$) {
  return action$.ofType(actionTypes.CREATE_APP_TYPE_REQUEST)
  // Run search
    .map(action => action.AppType)
    .mergeMap(createAppType);
}


function createApp(App) {
  return Observable.from(AppApi.createApp(App))
    .map((response) => {
      return Object.assign({}, App, {
        id: response[App.name]
      });
    })
    .mergeMap((savedApp) => {
      const reference = {
        id: savedApp.id
      };
      return Observable.of(
        actionFactories.createAppResolve(reference),
      );
    })
    .catch(() => {
      return Observable.of(
        actionFactories.createAppReject('Error saving app')
      );
    });
}


// TODO: Cancellation and Error handling
function createAppEpic(action$) {
  return action$.ofType(actionTypes.CREATE_APP_REQUEST)
  // Run search
    .map(action => action.App)
    .mergeMap(createApp);
}


function getAppsEpic(action$) {
  return action$.ofType(actionTypes.GET_APPS_REQUEST)
    .mergeMap(() => {
      return Observable
        .from(AppApi.getApps())
        .mergeMap((apps) => {
          return Observable.of(
            actionFactory.getAppsSuccess(apps)
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
  installAppEpic,
  createAppTypeEpic,
  createAppEpic
);
