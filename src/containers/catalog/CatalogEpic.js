/* @flow */
import { normalize } from 'normalizr';
import Immutable from 'immutable';
import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';

import { EntityDataModelApi, SearchApi, DataModel } from 'loom-data';

import * as actionTypes from './CatalogActionTypes';
import * as actionFactories from './CatalogActionFactories';
import * as edmActionFactories from '../edm/EdmActionFactories';
import { EntitySetNschema, createEntitySetReference } from '../edm/EdmStorage';

// TODO: Move processing and storage into EDM
function convertSearchResult(rawResult):DataModel.EntitySet {
  return rawResult.entitySet
}

// TODO: Save property types
function searchCatalog(filterParams) {
  let numHits = 0;
  return Observable.from(SearchApi.searchEntitySetMetaData(filterParams))
    .map(rawResult => {
      numHits = rawResult.numHits;
      return rawResult.hits.map(convertSearchResult);
    })
    .map(result => normalize(result, [EntitySetNschema]))
    .map(Immutable.fromJS)
    .flatMap(normalizedData => [
      edmActionFactories.updateNormalizedData(normalizedData.get('entities')),
      actionFactories.catalogSearchResolve(normalizedData.get('result'), numHits)
    ])
    // Error Handling
    .catch(() => {
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

function allEntitySetsEpic(action$) {
  return action$.ofType(actionTypes.ALL_ENTITY_SETS_REQUEST)
    .mergeMap(action => {
      return Observable.from(EntityDataModelApi.getAllEntitySets())
      .map(result => normalize(result, [EntitySetNschema]))
      .map(Immutable.fromJS)
      .flatMap(normalizedData => {
        return [
          edmActionFactories.updateNormalizedData(normalizedData.get('entities')),
          actionFactories.allEntitySetsResolve(normalizedData.get('result').map(createEntitySetReference))
        ]
      })
      // Error Handling
      .catch(() => {
        return Observable.of(
          actionFactories.allEntitySetsReject('Error loading entity sets')
        );
      });
    });
}

export default combineEpics(searchCatalogEpic, allEntitySetsEpic);
