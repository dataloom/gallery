import Immutable from 'immutable';
import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';
import * as actionTypes from './AppActionTypes';

export const INITIAL_STATE = Immutable.fromJS({
  apps: Immutable.List(),
  errorMessage: '',
  createAppAsyncState: {
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

    case actionTypes.INSTALL_APP_FAILURE:
      return state.set('errorMessage', action.errorMessage);

    case actionTypes.CREATE_APP_REQUEST:
    case actionTypes.CREATE_APP_TYPE_REQUEST:
      return state.mergeDeep({
        createAppAsyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }
      });

    case actionTypes.CREATE_APP_REJECT:
    case actionTypes.CREATE_APP_TYPE_REJECT:
      return state.mergeDeep({
        createAppAsyncState: {
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }
      });

    case actionTypes.CREATE_APP_RESOLVE:
    case actionTypes.CREATE_APP_TYPE_RESOLVE:
      return state.mergeDeep({
        createAppAsyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }
      });

    case actionTypes.CREATE_APP_RESET:
    case actionTypes.CREATE_APP_TYPE_RESET:
      return state.mergeDeep({
        createAppAsyncState: {
          status: ASYNC_STATUS.PENDING,
          errorMessage: ''
        }
      });

    default:
      return state;
  }
}
