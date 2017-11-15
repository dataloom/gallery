import * as actionTypes from './AppActionTypes';

export function getApps() {
  return {
    type: actionTypes.GET_APPS_REQUEST
  };
}

export function getAppsSuccess(apps :Object[]) {
  return {
    type: actionTypes.GET_APPS_SUCCESS,
    apps
  };
}

export function getAppsFailure(errorMessage :string) {
  return {
    type: actionTypes.GET_APPS_FAILURE,
    errorMessage
  };
}

export function installAppRequest(appId :UUID, organizationId :UUID, prefix :string) {
  return {
    type: actionTypes.INSTALL_APP_REQUEST,
    appId,
    organizationId,
    prefix
  };
}

export function installAppSuccess() {
  return {
    type: actionTypes.INSTALL_APP_SUCCESS
  };
}

export function installAppFailure(errorMessage :string) {
  return {
    type: actionTypes.INSTALL_APP_FAILURE,
    errorMessage
  };
}
