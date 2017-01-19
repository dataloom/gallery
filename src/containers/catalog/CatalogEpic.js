/* @flow */
import { normalize } from 'normalizr';
import Immutable from 'immutable';
import { Observable } from 'rxjs';

import { SearchApi } from 'loom-data';

import * as actionTypes from './CatalogActionTypes';
import * as actionFactories from './CatalogActionFactories';
import * as ndataActionFactories from '../edm/NdataActionFactories';
import { Permission } from '../../core/permissions/Permission';
import type { EntitySet } from '../../components/entityset/EntitySetStorage';
import { EntitySetNschema } from '../../components/entityset/EntitySetStorage';

function convertSearchResult(rawResult): EntitySet {
  let permission = rawResult.acls.map(Permission.enumValueOf).reduce(Permission.maxPermission);
  return Object.assign({}, rawResult.entitySet, {
    permission,
    propertyTypes: rawResult.propertyTypes
  });
}

function searchCatalog(filterParams) {
  return Observable.from(SearchApi.search(filterParams))
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
    .map(action => action.filterParams)
    .mergeMap(searchCatalog);
}

export default searchCatalogEpic;