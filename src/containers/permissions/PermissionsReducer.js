/* @flow */
import { Map, fromJS } from 'immutable';
import isEmpty from 'lodash/isEmpty';

import * as actionTypes from './PermissionsActionTypes';
import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent'

export const LOADING_ERROR = Symbol('loading error');


const INITIAL_STATE :Map<*, *> = fromJS({
  authorizations: {},
  requestPermissionsModal: {
    show: false,
    entitySetId: null,
    pidToRequestedPermissions: {},
    reason: '',
    asyncStatus: ASYNC_STATUS.PENDING
  }
});

export default function reducer(state :Map<*, *> = INITIAL_STATE, action :Object) {
  let authorizations;

  switch (action.type) {
    case actionTypes.CHECK_AUTHORIZATION_REJECT:
      authorizations = state.get('authorizations');
      action.accessChecks.forEach((accessCheck) => {
        authorizations = authorizations.setIn(accessCheck.aclKey.concat(['permissions']), LOADING_ERROR)
      });
      return state.set('authorizations', authorizations);

    case actionTypes.CHECK_AUTHORIZATION_RESOLVE:
      authorizations = state.get('authorizations');
      action.authorizations.forEach((authorization) => {
        authorizations = authorizations.setIn(
          authorization.aclKey.concat(['permissions']),
          fromJS(authorization.permissions));
      });
      return state.set('authorizations', authorizations);

    case actionTypes.REQUEST_PERMISSIONS_MODAL_SHOW:
      return state.mergeIn(['requestPermissionsModal'], {
        show: true,
        entitySetId: action.entitySetId,
        asyncStatus: ASYNC_STATUS.PENDING
      });

    case actionTypes.REQUEST_PERMISSIONS_MODAL_HIDE:
      return state.mergeIn(['requestPermissionsModal'], {
        show: false,
        reason: '',
        pidToRequestedPermissions: Map()
        // Don't set entitySetId to false. Allows modal to fade away with content
      });

    case actionTypes.REQUEST_PERMISSIONS_MODAL_SUCCESS:
      return state.mergeIn(['requestPermissionsModal'], {
        asyncStatus: ASYNC_STATUS.SUCCESS
      });

    case actionTypes.REQUEST_PERMISSIONS_MODAL_FAILURE:
      return state.mergeIn(['requestPermissionsModal'], {
        asyncStatus: ASYNC_STATUS.ERROR
      });

    case actionTypes.REQUEST_PERMISSIONS_UPDATE_REASON:
      return state.setIn(['requestPermissionsModal', 'reason'], action.reason);

    case actionTypes.REQUEST_PERMISSIONS_UPDATE_REQUEST:
      const { propertyTypeId, requestedPermissions } = action;
      const path = ['requestPermissionsModal', 'pidToRequestedPermissions', propertyTypeId];

      if (isEmpty(requestedPermissions)) {
        return state.deleteIn(path);
      } else {
        return state.setIn(path, requestedPermissions);
      }

    case actionTypes.SUBMIT_AUTHN_REQUEST:
      return state.mergeIn(['requestPermissionsModal'], {
        reason: '',
        pidToRequestedPermissions: Map(),
        asyncStatus: ASYNC_STATUS.LOADING
      });

    default:
      return state;
  }
}
