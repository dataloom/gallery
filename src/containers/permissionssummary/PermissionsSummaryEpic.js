import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';

import { PermissionsApi, PrincipalsApi } from 'loom-data';
import { AUTHENTICATED_USER } from '../../utils/Consts/UserRoleConsts';
import * as actionTypes from './PermissionsSummaryActionTypes';
import * as actionFactories from './PermissionsSummaryActionFactory';
import * as permissionsActionFactory from '../permissions/PermissionsActionFactory';

function updateStateAclsEpic(action$ :Observable<Action>) :Observable<Action> {
  return action$
    .ofType(actionTypes.LOAD_ACLS_REQUEST)
    .mergeMap((action :Action) => {
      const aclKey = [action.entitySetId];
      if (action.property && action.property.id) aclKey.push(action.property.id);
      return Observable
        .from(
          PermissionsApi.getAcl(aclKey)
        )
        .mergeMap((acl) => {
          return Observable.of(
            actionFactories.updateStateAclsSuccess(acl.aces, action.property) // TODO: do all the stuff with the data & then set state
          );
        })
        .catch(() => {
          return Observable.of(
            actionFactories.updateStateAclsFailure()
          );
        });
    });
}

function loadAllUsersAndRolesEpic(action$) {
  return action$
    .ofType(actionTypes.LOAD_ACLS_REQUEST)
    .mergeMap(() => {
      return Observable
        .from(
          PrincipalsApi.getAllUsers()
        );
    })
    .mergeMap((users) => {
      const allUsersById = users;
      const allRolesList = new Set();
      const myId = JSON.parse(localStorage.profile).user_id;
      Object.keys(users).forEach((userId) => {
        users[userId].roles.forEach((role) => {
          if (role !== AUTHENTICATED_USER) allRolesList.add(role);
        });
      });
      allUsersById[myId] = null;
      return Observable
        .of(
          actionFactories.setAllUsersAndRoles(allUsersById, allRolesList),
          actionFactories.setLoadUsersError(false)
        );
    })
    .catch(() => {
      actionFactories.setLoadUsersError(true);
    });
}

export default combineEpics(
  updateStateAclsEpic,
  loadAllUsersAndRolesEpic
);
