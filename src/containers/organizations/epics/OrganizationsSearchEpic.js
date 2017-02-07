/*
 * @flow
 */

import {
  SearchApi
} from 'loom-data';

import {
  combineEpics
} from 'redux-observable';

import {
  Observable
} from 'rxjs';

import * as OrgsActionTypes from '../actions/OrganizationsActionTypes';
import * as OrgsActionFactory from '../actions/OrganizationsActionFactory';

function searchOrgs(action :Action) :Observable<Action> {

  const searchOptions = {
    keyword: action.searchQuery
  };

  return Observable
    .from(SearchApi.search(searchOptions))
    .mergeMap(() => {
      const results = [];
      return Observable.of(
        OrgsActionFactory.searchOrgsSuccess(results)
      );
    })
    .catch(() => {
      return Observable.of(
        OrgsActionFactory.searchOrgsFailure()
      );
    });
}

function searchOrgsEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgsActionTypes.SEARCH_ORGS_REQUEST)
    .mergeMap(searchOrgs)
    .catch(() => {
      return Observable.of(
        OrgsActionFactory.searchOrgsFailure()
      );
    });
}

export default combineEpics(
  searchOrgsEpic
);
