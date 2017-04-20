import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import {
  EntityDataModelApi
} from 'loom-data';

import * as actionTypes from './TopUtilizersActionTypes';
import * as actionFactory from './TopUtilizersActionFactory';

function getAllEntityTypesEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ENTITY_TYPES_REQUEST)
    .mergeMap((action) => {
      console.log('entity types request, ', action);
      return Observable
        .from(
          EntityDataModelApi.getAllEntityTypes()
        )
        .mergeMap((results) => {
          console.log('get entity type results:', results);
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
      let topUtilizersDetailsList = state.get('topUtilizersDetailsList').toJS();
      topUtilizersDetailsList = Object.values(topUtilizersDetailsList);
      return Observable
        .from(
          // API.findTopUtilizers(state.get('entitySetId'), 100, topUtilizersDetailsList)
        )
        .mergeMap((results) => {
          return Observable
            .of(
              actionFactory.onSubmitSuccess(results)
            );
        })
        .catch((err) => {
          actionFactory.onSubmitFailure();
        });
    });
}

export default combineEpics(
  getAllEntityTypesEpic,
  submitQueryEpic
);
