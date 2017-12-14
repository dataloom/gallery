import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import {
  PrincipalsApi
} from 'lattice';

import * as actionTypes from './PermissionsPanelActionTypes';
import * as actionFactory from './PermissionsPanelActionFactory';

function loadAllRolesEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ALL_ROLES_REQUEST)
    .mergeMap(() => {
      return Observable
        .from(PrincipalsApi.getAllRoles())
        .mergeMap((roles) => {
          return Observable.of(
            actionFactory.getAllRolesSuccess(roles)
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            actionFactory.getAllRolesFailure('Error loading roles')
          );
        });
    });
}

function loadAllUsersEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ALL_USERS_REQUEST)
    .mergeMap(() => {
      return Observable
        .from(PrincipalsApi.getAllUsers())
        .mergeMap((users) => {
          return Observable.of(
            actionFactory.getAllUsersSuccess(users)
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            actionFactory.getAllUsersFailure('Error loading users')
          );
        });
    });
}

export default combineEpics(
  loadAllRolesEpic,
  loadAllUsersEpic
);
