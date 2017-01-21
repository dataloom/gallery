/*
 * @flow
 */

import Immutable from 'immutable';

import {
  Types
} from 'loom-data';

import {
  FETCH_ORG_REQUEST,
  FETCH_ORG_FAILURE,
  FETCH_ORG_SUCCESS,
  FETCH_ORGS_REQUEST,
  FETCH_ORGS_FAILURE,
  FETCH_ORGS_SUCCESS
} from '../actions/OrganizationsActionTypes';

import {
  CHECK_AUTHORIZATION_RESOLVE
} from '../../permissions/PermissionsActionTypes';

import {
  ASYNC_STATUS
} from '../../../components/asynccontent/AsyncContent';

const {
  PermissionTypes
} = Types;

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  asyncState: {
    status: ASYNC_STATUS.PENDING,
    errorMessage: ''
  },
  isFetchingOrg: false,
  isFetchingOrgs: false,
  organizations: {}
});

export default function organizationsReducer(state :Map<*, *> = INITIAL_STATE, action :Object) :Map<*, *> {

  switch (action.type) {

    case FETCH_ORG_REQUEST:
      return state.set('isFetchingOrg', true);

    case FETCH_ORGS_REQUEST:
      return state
        .set('isFetchingOrgs', true)
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }));

    case FETCH_ORG_SUCCESS: {

      const org = action.organization;
      return state
        .set('isFetchingOrg', false)
        .setIn(['organizations', org.id], Immutable.fromJS(org));
    }

    case FETCH_ORGS_SUCCESS: {

      const orgs = {};
      action.organizations.forEach((org) => {
        orgs[org.id] = org;
        orgs[org.id].isOwner = false;
      });

      return state
        .set('isFetchingOrgs', false)
        .set('organizations', Immutable.fromJS(orgs))
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }));
    }

    case FETCH_ORG_FAILURE:
    case FETCH_ORGS_FAILURE:
      return INITIAL_STATE
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.ERROR,
          errorMessage: 'Failed to load Organizations'
        }));

    case CHECK_AUTHORIZATION_RESOLVE: {

      let newState :Map<*, *> = state;

      const authorizations = action.authorizations;
      authorizations.forEach((auth) => {

        if (!auth.aclKey || auth.aclKey.length !== 1) {
          return;
        }

        const orgId = auth.aclKey[0];
        const org = state.getIn(['organizations', orgId]);

        if (!org) {
          return;
        }

        const orgDeco = org.set('isOwner', (auth.permissions[PermissionTypes.OWNER] === true));
        newState = newState.setIn(['organizations', orgId], orgDeco);
      });

      return newState;
    }

    default:
      return state;
  }
}
