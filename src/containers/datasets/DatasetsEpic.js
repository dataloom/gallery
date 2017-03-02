/* @flow */
import { Observable } from 'rxjs';
import { normalize } from 'normalizr';
import Immutable from 'immutable';
import { combineEpics } from 'redux-observable';
import { DataApi, EntityDataModelApi } from 'loom-data';

import axios from 'axios';

import * as actionTypes from './DatasetsActionTypes';
import * as actionFactories from './DatasetsActionFactory';
import { Permission } from '../../core/permissions/Permission';
import * as edmActionFactories from '../edm/EdmActionFactories';import { EntitySetNschema, COLLECTIONS } from '../edm/EdmStorage';

function ownedDatasetsIdsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_OWNED_DATASETS_IDS_REQUEST)
    .mergeMap((action :Action) => {
      return Observable.from(axios({
        method: 'get',
        url: 'http://localhost:8080/datastore/authorizations',
        params: {
          objectType: 'EntitySet',
          permission: Permission.OWNER.name,
          pagingToken: action.pagingToken
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InN1cHBvcnRAa3J5cHRub3N0aWMuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJhcHBfbWV0YWRhdGEiOnsicm9sZXMiOlsiYWRtaW4iLCJBdXRoZW50aWNhdGVkVXNlciIsInVzZXIiXSwib3JnYW5pemF0aW9ucyI6WyI3MjExYjZhZS01Mzc1LTQyZDItYjk4MC0xOGI5MjNmM2NiMmIiLCJhZG1pbiIsIkF1dGhlbnRpY2F0ZWRVc2VyIiwidXNlciJdfSwibmlja25hbWUiOiJzdXBwb3J0Iiwicm9sZXMiOlsiYWRtaW4iLCJBdXRoZW50aWNhdGVkVXNlciIsInVzZXIiXSwidXNlcl9pZCI6ImF1dGgwfDU3ZTRiMmQ4ZDlkMWQxOTQ3NzhmZDViNiIsImlzcyI6Imh0dHBzOi8vbG9vbS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NTdlNGIyZDhkOWQxZDE5NDc3OGZkNWI2IiwiYXVkIjoiUFRteUV4ZEJja0hBaXlPamg0dzJNcVNJVUdXV0VkZjgiLCJleHAiOjE0ODg0MzIzNTksImlhdCI6MTQ4ODM5NjM1OX0.AGeZHc8hfF3zmzOl1IKStSzRlDxgxFULrBVOg1lnuwE'
        }
      }))
    //  return Observable.from(DataApi.getAuthorizedObjects('EntitySet', Permission.OWNER.name, pagingToken))
        .map(response => {
          const edmDetailsSelectors = response.data.authorizedObjects.map((aclKey) => {
            return {
              type: 'EntitySet',
              id: aclKey[0],
              include: ['EntitySet']
            };
          });
          return actionFactories.getOwnedDatasetsDetails(edmDetailsSelectors, response.data.pagingToken);
        })
        // Error Handling
        .catch(error => {
          console.error(error);
          return Observable.of(actionFactories.getOwnedDatasetsIdsReject('Error loading owned entity set ids'))
        });
    });
}

function ownedDatasetsDetailsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_OWNED_DATASETS_DETAILS_REQUEST)
    .mergeMap((action :Action) => {
      let entitySets = [];
      return Observable.from(EntityDataModelApi.getEntityDataModelProjection(action.edmDetailsSelectors))
        .map((response) => {
          entitySets = Object.values(response.entitySets);
          return normalize(entitySets, [EntitySetNschema]);
        })
        .map(Immutable.fromJS)
        .flatMap(normalizedData => {
          return [
            edmActionFactories.updateNormalizedData(normalizedData.get('entities')),
            actionFactories.setOwnedDatasetsDetails(entitySets, action.pagingToken)
          ]
        })
        // Error Handling
        .catch(error => {
          console.error(error);
          return Observable.of(actionFactories.getOwnedDatasetsDetailsReject('Error loading owned entity set details'))
        });
    });
}

export default combineEpics(
  ownedDatasetsIdsEpic,
  ownedDatasetsDetailsEpic
);
