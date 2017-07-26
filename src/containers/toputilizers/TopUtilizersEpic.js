import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import {
  EntityDataModelApi,
  AnalysisApi
} from 'loom-data';

import { SearchApi } from 'lattice';

import * as actionTypes from './TopUtilizersActionTypes';
import * as actionFactory from './TopUtilizersActionFactory';
import FileService from '../../utils/FileService';
import FileConsts from '../../utils/Consts/FileConsts';

function getEntitySetEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ENTITY_SET_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(
          EntityDataModelApi.getEntitySet(action.entitySetId)
        )
        .mergeMap((results) => {
          return Observable
            .of(
              actionFactory.getEntitySetSuccess(results),
              actionFactory.getAssociationsRequest(results.entityTypeId)
            );
        })
        .catch((err) => {
          return Observable.of(
            actionFactory.getEntitySetFailure(err)
          );
        });
    });
}

function getAssociationsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ASSOCIATIONS_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(
          EntityDataModelApi.getAllAvailableAssociationTypes(action.entityTypeId)
        )
        .mergeMap((results) => {
          return Observable
            .of(
              actionFactory.getAssociationsSuccess(results)
            );
        })
        .catch((err) => {
          return Observable.of(
            actionFactory.getAssociationsFailure(err)
          );
        });
    });
}

function getAssociationDetailsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ASSOCIATION_DETAILS_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(
          EntityDataModelApi.getAssociationTypeDetails(action.associationId)
        )
        .mergeMap((associationDetails) => {
          return Observable
            .of(
              actionFactory.getAssociationDetailsSuccess(action.associationId, associationDetails)
            );
        })
        .catch((err) => {
          return Observable.of(
            actionFactory.getAssociationDetailsFailure(err)
          );
        });
    });
}

function submitQueryEpic(action$) {
  return action$
    .ofType(actionTypes.SUBMIT_TOP_UTILIZERS_REQUEST)
    .mergeMap((action) => {
      const topUtilizersDetailsList = action.topUtilizersDetails.valueSeq();
      return Observable
        .from(
          AnalysisApi.getTopUtilizers(action.entitySetId, 100, topUtilizersDetailsList)
        )
        .mergeMap((results) => {
          const entityIds = results.map((result) => {
            return result.id[0];
          });
          return Observable
            .of(
              actionFactory.submitTopUtilizersSuccess(results),
              actionFactory.getTopUtilizersNeighborsRequest(action.entitySetId, entityIds)
            );
        })
        .catch((err) => {
          return Observable.of(
            actionFactory.submitTopUtilizersFailure(err)
          );
        });
    });
}

function downloadTopUtilizersEpic(action$) {
  return action$
    .ofType(actionTypes.DOWNLOAD_TOP_UTILIZERS_REQUEST)
    .mergeMap((action) => {
      const topUtilizersDetailsList = action.topUtilizersDetails.valueSeq();
      return Observable
        .from(
          AnalysisApi.getTopUtilizers(action.entitySetId, 100, topUtilizersDetailsList, FileConsts.CSV)
        )
        .mergeMap((topUtilizersData) => {
          FileService.saveFile(topUtilizersData, 'Top Utilizers', FileConsts.CSV, () => {
            return Observable
              .of(
                actionFactory.downloadTopUtilizersSuccess()
              );
          });
        })
        .catch((err) => {
          return Observable.of(
            actionFactory.downloadTopUtilizersFailure(err)
          );
        });
    });
}

function getTopUtilizersNeighborsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_TOP_UTILIZERS_NEIGHBORS_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(
          SearchApi.searchEntityNeighborsBulk(action.entitySetId, action.entityIds)
        )
        .mergeMap((neighbors) => {
          return Observable
            .of(
              actionFactory.getTopUtilizersNeighborsSuccess(neighbors)
            );
        })
        .catch((err) => {
          return Observable.of(
            actionFactory.getTopUtilizersNeighborsFailure(err)
          );
        });
    });
}

export default combineEpics(
  getEntitySetEpic,
  getAssociationsEpic,
  getAssociationDetailsEpic,
  submitQueryEpic,
  downloadTopUtilizersEpic,
  getTopUtilizersNeighborsEpic
);
