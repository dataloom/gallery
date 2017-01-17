/*
 * @flow
 */

import Immutable from 'immutable';

import {
  FETCH_ORG_REQUEST,
  FETCH_ORG_FAILURE,
  FETCH_ORG_SUCCESS,
  FETCH_ORGS_REQUEST,
  FETCH_ORGS_FAILURE,
  FETCH_ORGS_SUCCESS
} from '../actions/OrganizationsActionTypes';

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  isFetching: false,
  organizations: {}
});

export default function organizationsReducer(state :Map<*, *> = INITIAL_STATE, action :Object) :Map<*, *> {

  switch (action.type) {

    case FETCH_ORG_REQUEST:
    case FETCH_ORGS_REQUEST:
      return state.set('isFetching', true);

    case FETCH_ORG_SUCCESS: {

      const org = action.organization;
      return state
        .set('isFetching', false)
        .setIn(['organizations', org.id], Immutable.fromJS(org));
    }

    case FETCH_ORGS_SUCCESS: {

      const orgs = {};
      action.organizations.forEach((org) => {
        orgs[org.id] = org;
      });

      return state
        .set('isFetching', false)
        .set('organizations', Immutable.fromJS(orgs));
    }

    case FETCH_ORG_FAILURE:
    case FETCH_ORGS_FAILURE:
      return INITIAL_STATE;

    default:
      return state;
  }
}
