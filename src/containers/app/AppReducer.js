import Immutable from 'immutable';
import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';
import * as actionTypes from './AppActionTypes';

export const INITIAL_STATE = Immutable.fromJS({
  apps: Immutable.List(),
  appTypes: Immutable.Map(),
  errorMessage: '',
  createAppAsyncState: {
    status: ASYNC_STATUS.PENDING,
    errorMessage: ''
  },
  createAppTypeAsyncState: {
    status: ASYNC_STATUS.PENDING,
    errorMessage: ''
  },
  editAppAsyncState: {
    status: ASYNC_STATUS.PENDING,
    errorMessage: ''
  },
  editAppTypeAsyncState: {
    status: ASYNC_STATUS.PENDING,
    errorMessage: ''
  }
});

export default function reducer(state = INITIAL_STATE, action) {

  switch (action.type) {

    case actionTypes.GET_APPS_SUCCESS:
      return state
        .set('apps', Immutable.fromJS(action.apps))
        .set('errorMessage', '');

    case actionTypes.GET_APPS_FAILURE:
      return state
        .set('apps', Immutable.List())
        .set('errorMessage', action.errorMessage);

    case actionTypes.GET_APP_TYPES_FOR_APP_TYPE_IDS_SUCCESS:
      return state
        .set('appTypes', Immutable.fromJS(action.appTypeIdMap))
        .set('errorMessage', '');

    case actionTypes.GET_APP_TYPES_FOR_APP_TYPE_IDS_FAILURE:
      return state
        .set('appTypes', Immutable.Map())
        .set('errorMessage', action.errorMessage);

    case actionTypes.INSTALL_APP_FAILURE:
      return state
        .set('errorMessage', action.errorMessage);

    case actionTypes.DELETE_APP_REQUEST:
      return state;

    case actionTypes.DELETE_APP_RESOLVE:
      return state;

    case actionTypes.DELETE_APP_REJECT:
      return state;

    case actionTypes.DELETE_APP_RESET:
      return state;

    case actionTypes.CREATE_APP_REQUEST:
      return state.mergeDeep({
        createAppAsyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }
      });

    case actionTypes.CREATE_APP_RESOLVE:
      return state.mergeDeep({
        createAppAsyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }
      });

    case actionTypes.CREATE_APP_REJECT:
      return state.mergeDeep({
        createAppAsyncState: {
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }
      });

    case actionTypes.CREATE_APP_RESET:
      return state.mergeDeep({
        createAppAsyncState: {
          status: ASYNC_STATUS.PENDING,
          errorMessage: ''
        }
      });

    case actionTypes.CREATE_APP_TYPE_REQUEST:
      return state.mergeDeep({
        createAppTypeAsyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }
      });
    case actionTypes.CREATE_APP_TYPE_RESOLVE:
      return state.mergeDeep({
        createAppTypeAsyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }
      });

    case actionTypes.CREATE_APP_TYPE_REJECT:
      return state.mergeDeep({
        createAppTypeAsyncState: {
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }
      });

    case actionTypes.CREATE_APP_TYPE_RESET:
      return state.mergeDeep({
        createAppTypeAsyncState: {
          status: ASYNC_STATUS.PENDING,
          errorMessage: ''
        }
      });
    case actionTypes.EDIT_APP_REQUEST:
      return state.mergeDeep({
        editAppAsyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }
      });

    case actionTypes.EDIT_APP_RESOLVE:
      return state.mergeDeep({
        editAppAsyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }
      });

    case actionTypes.EDIT_APP_REJECT:
      return state.mergeDeep({
        editAppAsyncState: {
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }
      });

    case actionTypes.EDIT_APP_RESET:
      return state.mergeDeep({
        editAppAsyncState: {
          status: ASYNC_STATUS.PENDING,
          errorMessage: ''
        }
      });

    case actionTypes.EDIT_APP_TYPE_REQUEST:
      return state.mergeDeep({
        editAppTypeAsyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }
      });

    case actionTypes.EDIT_APP_TYPE_RESOLVE:
      return state.mergeDeep({
        editAppTypeAsyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }
      });

    case actionTypes.EDIT_APP_TYPE_REJECT:
      return state.mergeDeep({
        editAppTypeAsyncState: {
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }
      });

    case actionTypes.EDIT_APP_TYPE_RESET:
      return state.mergeDeep({
        editAppTypeAsyncState: {
          status: ASYNC_STATUS.PENDING,
          errorMessage: ''
        }
      });

    default:
      return state;
  }
}
