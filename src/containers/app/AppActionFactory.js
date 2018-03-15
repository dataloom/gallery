import * as actionTypes from './AppActionTypes';

export function addAppTypeToAppRequest(appId: UUID, appTypeId: UUID) {
  return {
    type: actionTypes.ADD_APP_TYPE_TO_APP_REQUEST,
    appId,
    appTypeId
  };
}

export function deleteAppTypeFromAppRequest(appId: UUID, appTypeId: UUID) {
  return {
    type: actionTypes.DELETE_APP_TYPE_FROM_APP_REQUEST,
    appId,
    appTypeId
  };
}

export function deleteAppRequest(App: UUID) {
  return {
    type: actionTypes.DELETE_APP_REQUEST,
    App
  };
}

export function deleteAppResolve(reference) {
  return {
    type: actionTypes.DELETE_APP_RESOLVE,
    reference
  };
}

export function deleteAppReject(errorMessage) {
  return {
    type: actionTypes.DELETE_APP_REJECT,
    errorMessage
  };
}

export function deleteAppReset() {
  return {
    type: actionTypes.DELETE_APP_RESET
  };
}

export function createAppRequest(App) {
  return {
    type: actionTypes.CREATE_APP_REQUEST,
    App
  };
}

export function createAppReject(errorMessage) {
  return {
    type: actionTypes.CREATE_APP_REJECT,
    errorMessage
  };
}

export function createAppResolve(reference) {
  return {
    type: actionTypes.CREATE_APP_RESOLVE,
    reference
  };
}

export function createAppReset() {
  return {
    type: actionTypes.CREATE_APP_RESET
  };
}

export function createAppTypeRequest(AppType) {
  return {
    type: actionTypes.CREATE_APP_TYPE_REQUEST,
    AppType
  };
}

export function createAppTypeReject(errorMessage) {
  return {
    type: actionTypes.CREATE_APP_TYPE_REJECT,
    errorMessage
  };
}

export function createAppTypeResolve(reference) {
  return {
    type: actionTypes.CREATE_APP_TYPE_RESOLVE,
    reference
  };
}

export function createAppTypeReset() {
  return {
    type: actionTypes.CREATE_APP_TYPE_RESET
  };
}

export function getAppTypesForAppTypeIdsRequest(appTypeIds : UUID[]) {
  return {
    type: actionTypes.GET_APP_TYPES_FOR_APP_TYPE_IDS_REQUEST,
    appTypeIds
  };
}

// is the type correct here? I am inputing an array of app objects
export function getAppTypesForAppTypeIdsSuccess(appTypeIdMap :Map) {
  // console.log('in the action');
  // console.log(appTypeIdMap);
  return {
    type: actionTypes.GET_APP_TYPES_FOR_APP_TYPE_IDS_SUCCESS,
    appTypeIdMap
  };
}

export function getAppTypesForAppTypeIdsFailure(errorMessage :string) {
  return {
    type: actionTypes.GET_APP_TYPES_FOR_APP_TYPE_IDS_FAILURE,
    errorMessage
  };
}

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
