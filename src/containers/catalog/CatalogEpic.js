/* @flow */
import { combineEpics } from 'redux-observable';
import { normalize } from 'normalizr';
import Immutable from 'immutable';
import { Observable } from 'rxjs';

import { SearchApi } from 'loom-data';

import * as actionTypes from './CatalogActionTypes';
import * as actionFactories from './CatalogActionFactories';
import * as ndataActionFactories from '../ndata/NdataActionFactories';
import { Permission } from '../../core/permissions/Permission';
import type { EntitySet } from '../../components/entityset/EntitySetStorage';
import { EntitySetNschema } from '../../components/entityset/EntitySetStorage';

function filterEpic(action$) {
  return action$.ofType(actionTypes.CATALOG_UPDATE_FILTER)
    .forEach(action => console.log(action.filterParams));
}

function convertSearchResult(rawResult): EntitySet {
  let permission = rawResult.acls.map(Permission.enumValueOf).reduce(Permission.maxPermission);
  return Object.assign({}, rawResult.entitySet, {
    permission,
    propertyTypes: rawResult.propertyTypes
  });
}

function searchCatalog(keyword, propertyTypeIds, entitySetTypeId) {
  return Observable.from(SearchApi.searchGET(keyword, entitySetTypeId, propertyTypeIds))
    .map(rawResult => rawResult.map(convertSearchResult))
    .map(result => normalize(result, [EntitySetNschema]))
    .map(Immutable.fromJS)
    .flatMap(normalizedData => [
      ndataActionFactories.updateNormalizedData(normalizedData.get('entities')),
      actionFactories.catalogSearchResolve(normalizedData.get('result'))
    ])
    // Error Handling
    .catch(error => {
      console.error(error);
      return Observable.of(actionFactories.catalogSearchReject("Error loading search results"))
    });
}

// TODO: Cancellation and Error handling
function searchCatalogEpic(action$) {
  return action$.ofType(actionTypes.CATALOG_SEARCH_REQUEST)
    // Run search
    .mergeMap(action => {
      const {keyword, propertyTypeIds, entitySetTypeId} = action.filterParams;
      return searchCatalog(keyword, propertyTypeIds, entitySetTypeId);
    });
}

export default combineEpics(filterEpic, searchCatalogEpic);