import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';

import { SearchApi } from 'lattice';

import * as actionTypes from './CatalogActionTypes';
import * as actionFactories from './CatalogActionFactories';

import { updateEntitySets } from '../edm/EdmActionFactory';

// TODO: Move processing and storage into EDM
function convertSearchResult(rawResult) {
  return rawResult.entitySet;
}

// TODO: Save property types
function searchCatalog(filterParams) {
  let numHits = 0;
  return Observable
    .from(SearchApi.searchEntitySetMetaData(filterParams))
    .map((rawResult) => {
      numHits = rawResult.numHits;
      return rawResult.hits.map(convertSearchResult);
    })
    .mergeMap((results) => {
      const entitySetIds = [];
      results.forEach((entitySet) => {
        if (entitySet) {
          entitySetIds.push(entitySet.id);
        }
      });
      return Observable.of(
        actionFactories.catalogSearchResolve(entitySetIds, numHits),
        updateEntitySets(results)
      );
    })
    .catch((e) => {
      console.error(e);
      return Observable.of(
        actionFactories.catalogSearchReject('Error loading search results')
      );
    });
}

// TODO: Cancellation and Error handling
function searchCatalogEpic(action$) {
  return action$.ofType(actionTypes.CATALOG_SEARCH_REQUEST)
    // Run search
    .map(action => action.filterParams)
    .mergeMap(searchCatalog);
}

export default combineEpics(
  searchCatalogEpic
);
