/*
 * @flow
 */

import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';

import { AppApi } from 'lattice';

import * as actionTypes from './AppActionTypes';
import * as actionFactories from './AppActionFactories';

function getAppsEpic(action$) {
  return action$.ofType(actionTypes.GET_APPS_REQUEST)
    .mergeMap(() => {
      return Observable
        .from(AppApi.getApps())
        .mergeMap((apps) => {
          return Observable.of(
            actionFactories.getAppsSuccess(apps)
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            actionFactories.getAppsFailure('Error loading apps')
          );
        });
    });
}

function installAppEpic(action$) {
  return action$.ofType(actionTypes.INSTALL_APP_REQUEST)
    .mergeMap((action :Action) => {
      const { appId, organizationId, prefix } = action;
      return Observable
        .from(AppApi.installApp(appId, organizationId, prefix))
        .mergeMap(() => {
          return Observable.of(
            actionFactories.installAppSuccess()
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            actionFactories.installAppFailure('Error installing app')
          );
        });
    });
}

export default combineEpics(
  getAppsEpic,
  installAppEpic
);
