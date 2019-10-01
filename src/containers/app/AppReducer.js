import Immutable from 'immutable';
import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';
import * as actionFactory from './AppActionFactory';

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
  },
});

export default function reducer(state = INITIAL_STATE, action) {

  switch (action.type) {

    case actionFactory.GET_APPS_SUCCESS:
      return state
        .set('apps', Immutable.fromJS(action.apps))
        .set('errorMessage', '');

    case actionFactory.GET_APPS_FAILURE:
      return state
        .set('apps', Immutable.List())
        .set('errorMessage', action.errorMessage);

    case actionFactory.GET_APP_TYPES_FOR_APP_TYPE_IDS_SUCCESS:
      return state
        .set('appTypes', Immutable.fromJS(action.appTypeIdMap))
        .set('errorMessage', '');

    case actionFactory.GET_APP_TYPES_FOR_APP_TYPE_IDS_FAILURE:
      return state
        .set('appTypes', Immutable.Map())
        .set('errorMessage', action.errorMessage);

    case actionFactory.INSTALL_APP_FAILURE:
      return state
        .set('errorMessage', action.errorMessage);

    case actionFactory.CREATE_APP_REQUEST:
      return state.mergeDeep({
        createAppAsyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }
      });

    case actionFactory.CREATE_APP_SUCCESS:
      return state.mergeDeep({
        createAppAsyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }
      });

    case actionFactory.CREATE_APP_FAILURE:
      return state.mergeDeep({
        createAppAsyncState: {
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }
      });

    case actionFactory.CREATE_APP_RESET:
      return state.mergeDeep({
        createAppAsyncState: {
          status: ASYNC_STATUS.PENDING,
          errorMessage: ''
        }
      });

    case actionFactory.CREATE_APP_TYPE_REQUEST:
      return state.mergeDeep({
        createAppTypeAsyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }
      });
    case actionFactory.CREATE_APP_TYPE_SUCCESS:
      return state.mergeDeep({
        createAppTypeAsyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }
      });

    case actionFactory.CREATE_APP_TYPE_FAILURE:
      return state.mergeDeep({
        createAppTypeAsyncState: {
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }
      });

    case actionFactory.CREATE_APP_TYPE_RESET:
      return state.mergeDeep({
        createAppTypeAsyncState: {
          status: ASYNC_STATUS.PENDING,
          errorMessage: ''
        }
      });
    case actionFactory.EDIT_APP_REQUEST:
      return state.mergeDeep({
        editAppAsyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }
      });

    case actionFactory.EDIT_APP_SUCCESS:
      return state.mergeDeep({
        editAppAsyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }
      });

    case actionFactory.EDIT_APP_FAILURE:
      return state.mergeDeep({
        editAppAsyncState: {
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }
      });

    case actionFactory.EDIT_APP_RESET:
      return state.mergeDeep({
        editAppAsyncState: {
          status: ASYNC_STATUS.PENDING,
          errorMessage: ''
        }
      });

    case actionFactory.EDIT_APP_TYPE_REQUEST:
      return state.mergeDeep({
        editAppTypeAsyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }
      });

    case actionFactory.EDIT_APP_TYPE_SUCCESS:
      return state.mergeDeep({
        editAppTypeAsyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }
      });

    case actionFactory.EDIT_APP_TYPE_FAILURE:
      return state.mergeDeep({
        editAppTypeAsyncState: {
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }
      });

    case actionFactory.EDIT_APP_TYPE_RESET:
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
