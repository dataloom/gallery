import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';

import { PermissionsApi, PrincipalsApi } from 'loom-data';
import { AUTHENTICATED_USER } from '../../utils/Consts/UserRoleConsts';
import * as actionTypes from './PermissionsSummaryActionTypes';
import * as actionFactory from './PermissionsSummaryActionFactory';
import * as permissionsActionFactory from '../permissions/PermissionsActionFactory';

function updateStateAclsEpic(action$ :Observable<Action>, store) :Observable<Action> {
  return action$
    .ofType(actionTypes.LOAD_ACLS_REQUEST)
    .mergeMap((action :Action) => {
      const aclKey = [action.entitySetId];
      if (action.property && action.property.id) aclKey.push(action.property.id);
      return Observable
        .of(
          // QUESTION: Create own success action here that sets state vs. only listening to permissions' success action?
          permissionsActionFactory.getAclRequest(aclKey)
        )
        .mergeMap(() => {
          const acl = store.get('acl'); // QUESTION: Does this update to correct value once store is updated from previous call?
          console.log('acl from epic call:', acl);
          return Observable.of(
            actionFactory.updateAclsRequest(acl.aces, action.property) // TODO: call this get acl success ?
          );
        })
        .catch(() => {
          return Observable.of(
            actionFactory.updateStateAclsFailure()
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
          // TODO: Replace api call. Chain action to other epic: principalsActionFactory.getAllUsersRequest()
          PrincipalsApi.getAllUsers()
        );
    })
    .mergeMap((users) => {
      // TODO: move this logic to setAllUsersAndRoles reducer?
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
          actionFactory.setAllUsersAndRoles(allUsersById, allRolesList), // -> TODO: make into success action containing logic above?
          actionFactory.setLoadUsersError(false)
        );
    })
    .catch(() => {
      actionFactory.setLoadUsersError(true);
    });
}

export default combineEpics(
  updateStateAclsEpic,
  loadAllUsersAndRolesEpic
);
