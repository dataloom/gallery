import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import {
  EntityDataModelApi,
  AnalysisApi
} from 'loom-data';

import * as actionTypes from './TopUtilizersActionTypes';
import * as actionFactory from './TopUtilizersActionFactory';

function getAssociationsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ASSOCIATIONS_REQUEST)
    .mergeMap((action) => {
      // console.log('associations request, ', action);
      return Observable
        .from(
          EntityDataModelApi.getAllAssociationEntityTypes()
        )
        .mergeMap((results) => {
          return Observable
            .of(
              actionFactory.getAssociationsSuccess(results)
            );
        })
        .catch((err) => {
          actionFactory.getAssociationsFailure(err);
        });
    });
}

function getAllEntityTypesEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ENTITY_TYPES_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(
          EntityDataModelApi.getAllEntityTypes()
        )
        .mergeMap((results) => {
          return Observable
            .of(
              actionFactory.getAllEntityTypesSuccess(results)
            );
        })
        .catch((err) => {
          actionFactory.getAllEntityTypesFailure(err);
        });
    });
}

function submitQueryEpic(action$, state) {
  return action$
    .ofType(actionTypes.SUBMIT_TOP_UTILIZERS_REQUEST)
    .mergeMap((action) => {
      const topUtilizersState = state.getState().get('topUtilizers');
      // console.log('topUtilizersState', topUtilizersState.toJS());
      const entitySetId = topUtilizersState.get('entitySetId');
      const topUtilizersDetailsObj = topUtilizersState.get('topUtilizersDetailsList').toJS();
      const topUtilizersDetailsList = Object.values(topUtilizersDetailsObj);
      return Observable
      // TODO: ADD API REQUEST HERE
        .from(
          AnalysisApi.getTopUtilizers(entitySetId, topUtilizersDetailsList, 100)
        )
        .mergeMap((results) => {
          return Observable
            .of(
              actionFactory.onSubmitSuccess(results.entities)
            );
        })
        .catch((err) => {
          actionFactory.onSubmitFailure();
        });
    });
}

export default combineEpics(
  getAssociationsEpic,
  getAllEntityTypesEpic,
  submitQueryEpic
);
