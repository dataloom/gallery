export const CREATE_APP_REQUEST = 'CREATE_APP_REQUEST';
export const CREATE_APP_FAILURE = 'CREATE_APP_FAILURE';
export const CREATE_APP_SUCCESS = 'CREATE_APP_SUCCESS';
export const CREATE_APP_RESET = 'CREATE_APP_RESET';

export const EDIT_APP_REQUEST = 'EDIT_APP_REQUEST';
export const EDIT_APP_FAILURE = 'EDIT_APP_FAILURE';
export const EDIT_APP_SUCCESS = 'EDIT_APP_SUCCESS';
export const EDIT_APP_RESET = 'EDIT_APP_RESET';

export const EDIT_APP_TYPE_REQUEST = 'EDIT_APP_TYPE_REQUEST';
export const EDIT_APP_TYPE_FAILURE = 'EDIT_APP_TYPE_FAILURE';
export const EDIT_APP_TYPE_SUCCESS = 'EDIT_APP_TYPE_SUCCESS';
export const EDIT_APP_TYPE_RESET = 'EDIT_APP_TYPE_RESET';

export const DELETE_APP_TYPE_FROM_APP_REQUEST = 'DELETE_APP_TYPE_FROM_APP_REQUEST';
export const DELETE_APP_TYPE_FROM_APP_FAILURE = 'DELETE_APP_TYPE_FROM_APP_FAILURE';
export const DELETE_APP_TYPE_FROM_APP_SUCCESS = 'DELETE_APP_TYPE_FROM_APP_SUCCESS';
export const DELETE_APP_TYPE_FROM_APP_RESET = 'DELETE_APP_TYPE_FROM_APP_RESET';

export const ADD_APP_TYPE_TO_APP_REQUEST = 'ADD_APP_TYPE_TO_APP_REQUEST';
export const ADD_APP_TYPE_TO_APP_FAILURE = 'ADD_APP_TYPE_TO_APP_FAILURE';
export const ADD_APP_TYPE_TO_APP_SUCCESS = 'ADD_APP_TYPE_TO_APP_SUCCESS';
export const ADD_APP_TYPE_TO_APP_RESET = 'ADD_APP_TYPE_TO_APP_RESET';

export const DELETE_APP_REQUEST = 'DELETE_APP_REQUEST';
export const DELETE_APP_FAILURE = 'DELETE_APP_FAILURE';
export const DELETE_APP_SUCCESS = 'DELETE_APP_SUCCESS';
export const DELETE_APP_RESET = 'DELETE_APP_RESET';

export const CREATE_APP_TYPE_REQUEST = 'CREATE_APP_TYPE_REQUEST';
export const CREATE_APP_TYPE_FAILURE = 'CREATE_APP_TYPE_FAILURE';
export const CREATE_APP_TYPE_SUCCESS = 'CREATE_APP_TYPE_SUCCESS';
export const CREATE_APP_TYPE_RESET = 'CREATE_APP_TYPE_RESET';

export const GET_APP_TYPES_FOR_APP_TYPE_IDS_REQUEST = 'GET_APP_TYPES_FOR_APP_TYPE_IDS_REQUEST';
export const GET_APP_TYPES_FOR_APP_TYPE_IDS_FAILURE = 'GET_APP_TYPES_FOR_APP_TYPE_IDS_FAILURE';
export const GET_APP_TYPES_FOR_APP_TYPE_IDS_SUCCESS = 'GET_APP_TYPES_FOR_APP_TYPE_IDS_SUCCESS';

export const GET_APPS_REQUEST = 'GET_APPS_REQUEST';
export const GET_APPS_FAILURE = 'GET_APPS_FAILURE';
export const GET_APPS_SUCCESS = 'GET_APPS_SUCCESS';

export const INSTALL_APP_REQUEST = 'INSTALL_APP_REQUEST';
export const INSTALL_APP_FAILURE = 'INSTALL_APP_FAILURE';
export const INSTALL_APP_SUCCESS = 'INSTALL_APP_SUCCESS';

export function addAppTypeToAppRequest(appId, appTypeId) {
  return {
    type: ADD_APP_TYPE_TO_APP_REQUEST,
    appId,
    appTypeId
  };
}

export function addAppTypeToAppSuccess(reference) {
  return {
    type: ADD_APP_TYPE_TO_APP_SUCCESS,
    reference
  };
}

export function addAppTypeToAppFailure(errorMessage) {
  return {
    type: ADD_APP_TYPE_TO_APP_FAILURE,
    errorMessage
  };
}

export function addAppTypeToAppReset() {
  return {
    type: ADD_APP_TYPE_TO_APP_RESET
  };
}

export function deleteAppTypeFromAppRequest(appId, appTypeId) {
  return {
    type: DELETE_APP_TYPE_FROM_APP_REQUEST,
    appId,
    appTypeId
  };
}

export function deleteAppTypeFromAppSuccess(reference) {
  return {
    type: DELETE_APP_TYPE_FROM_APP_SUCCESS,
    reference
  };
}

export function deleteAppTypeFromAppFailure(errorMessage) {
  return {
    type: DELETE_APP_TYPE_FROM_APP_FAILURE,
    errorMessage
  };
}

export function deleteAppTypeFromAppReset() {
  return {
    type: DELETE_APP_TYPE_FROM_APP_RESET
  };
}

export function deleteAppRequest(app) {
  return {
    type: DELETE_APP_REQUEST,
    app
  };
}

export function deleteAppSuccess(reference) {
  return {
    type: DELETE_APP_SUCCESS,
    reference
  };
}

export function deleteAppFailure(errorMessage) {
  return {
    type: DELETE_APP_FAILURE,
    errorMessage
  };
}

export function deleteAppReset() {
  return {
    type: DELETE_APP_RESET
  };
}

export function createAppRequest(app) {
  return {
    type: CREATE_APP_REQUEST,
    app
  };
}

export function createAppFailure(errorMessage) {
  return {
    type: CREATE_APP_FAILURE,
    errorMessage
  };
}

export function createAppSuccess(reference) {
  return {
    type: CREATE_APP_SUCCESS,
    reference
  };
}

export function createAppReset() {
  return {
    type: CREATE_APP_RESET
  };
}

export function createAppTypeRequest(appType) {
  return {
    type: CREATE_APP_TYPE_REQUEST,
    appType
  };
}

export function createAppTypeFailure(errorMessage) {
  return {
    type: CREATE_APP_TYPE_FAILURE,
    errorMessage
  };
}

export function createAppTypeSuccess(reference) {
  return {
    type: CREATE_APP_TYPE_SUCCESS,
    reference
  };
}

export function createAppTypeReset() {
  return {
    type: CREATE_APP_TYPE_RESET
  };
}

export function editAppRequest(appId, appData) {
  return {
    type: EDIT_APP_REQUEST,
    appId,
    appData
  };
}

export function editAppFailure(errorMessage) {
  return {
    type: EDIT_APP_FAILURE,
    errorMessage
  };
}

export function editAppSuccess(reference) {
  return {
    type: EDIT_APP_SUCCESS,
    reference
  };
}

export function editAppReset() {
  return {
    type: EDIT_APP_RESET
  };
}

export function editAppTypeRequest(appTypeId, appTypeData) {
  return {
    type: EDIT_APP_TYPE_REQUEST,
    appTypeId,
    appTypeData
  };
}

export function editAppTypeFailure(errorMessage) {
  return {
    type: EDIT_APP_TYPE_FAILURE,
    errorMessage
  };
}

export function editAppTypeSuccess(reference) {
  return {
    type: EDIT_APP_TYPE_SUCCESS,
    reference
  };
}

export function editAppTypeReset() {
  return {
    type: EDIT_APP_TYPE_RESET
  };
}

export function getAppTypesForAppTypeIdsRequest(appTypeIds) {
  return {
    type: GET_APP_TYPES_FOR_APP_TYPE_IDS_REQUEST,
    appTypeIds
  };
}

// is the type correct here? I am inputing an array of app objects
export function getAppTypesForAppTypeIdsSuccess(appTypeIdMap) {
  // console.log('in the action');
  // console.log(appTypeIdMap);
  return {
    type: GET_APP_TYPES_FOR_APP_TYPE_IDS_SUCCESS,
    appTypeIdMap
  };
}

export function getAppTypesForAppTypeIdsFailure(errorMessage) {
  return {
    type: GET_APP_TYPES_FOR_APP_TYPE_IDS_FAILURE,
    errorMessage
  };
}

export function getAppsRequest() {
  return {
    type: GET_APPS_REQUEST
  };
}

export function getAppsSuccess(apps) {
  return {
    type: GET_APPS_SUCCESS,
    apps
  };
}

export function getAppsFailure(errorMessage) {
  return {
    type: GET_APPS_FAILURE,
    errorMessage
  };
}

export function installAppRequest(appId, organizationId, prefix) {
  return {
    type: INSTALL_APP_REQUEST,
    appId,
    organizationId,
    prefix
  };
}

export function installAppSuccess() {
  return {
    type: INSTALL_APP_SUCCESS
  };
}

export function installAppFailure(errorMessage) {
  return {
    type: INSTALL_APP_FAILURE,
    errorMessage
  };
}
