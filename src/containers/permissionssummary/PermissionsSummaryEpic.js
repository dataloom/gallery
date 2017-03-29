import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';

import { PermissionsApi, PrincipalsApi } from 'loom-data';
import { AUTHENTICATED_USER } from '../../utils/Consts/UserRoleConsts';
import * as entitySetDetailActionFactory from '../entitysetdetail/EntitySetDetailActionFactories';
import * as edmActionFactories from '../edm/EdmActionFactories';
import * as actionTypes from './PermissionsSummaryActionTypes';
import * as actionFactory from './PermissionsSummaryActionFactory';
import * as permissionsActionFactory from '../permissions/PermissionsActionFactory';

function configureAcls(aces, property) {

}

function intitialLoadEpic(action$ :Observable<Action>, store) :Observable<Action> {
  return action$
  .ofType(actionTypes.INITIAL_LOAD)
  .mergeMap((action) => {
    console.log('inside initialLoadEpic, action:', action);
    return Observable.of(
      // actionFactory.loadEntitySet(action.id),
      actionFactory.getAllUsersAndRoles()
    );
  });
  // catch
}

function loadEntitySetEpic(action$ :Observable<Action>, store) :Observable<Action> {
  return action$
  .ofType(actionTypes.LOAD_ENTITY_SET)
  .mergeMap((action) => {
    console.log('inside loadEntitySetEpic, action:', action);

    const { id } = action;
    const actions = [
      entitySetDetailActionFactory.entitySetDetailRequest(id),
      permissionsActionFactory.getEntitySetsAuthorizations([id]),
    // TODO: Move filter creation in helper function in EdmApi
      edmActionFactories.filteredEdmRequest(
        [{
          type: 'EntitySet',
          id,
          include: ['EntitySet', 'EntityType', 'PropertyTypeInEntitySet']
        }]
      )
    ];

    // TODO: refactor all previous epics into logic performed here / other epics
    // TODO: on completion, for entity and each property: dispatch actionFactory.updateAclsEpicRequest(entitySetId, property)
  });
}

function updateStateAclsEpic(action$ :Observable<Action>) :Observable<Action> {
  return action$
    .ofType(actionTypes.LOAD_ACLS_REQUEST, actionTypes.UPDATE_ACLS_EPIC_REQUEST)
    .mergeMap((action :Action) => {
      console.log('hit loadaclsrequest, action:', action);

      const aclKey = [action.entitySetId];
      if (action.property && action.property.id) aclKey.push(action.property.id);
      return Observable
        .from(
          PermissionsApi.getAcl(aclKey)
        )
        .mergeMap((acl) => {
          // TODO: Reconfigure permissions actions to take data directly rather than from state
          const configuredAcls = configureAcls(acl.aces, action.property);
          return Observable.of(
            actionFactory.updateAclsRequest(action.property), // TODO: Refactor so it only sets state
            actionFactory.setUserPermissions(configuredAcls), /////////////////////////////////////////////////////////////YOU ARE HERE
            actionFactory.setRolePermissions(action.property)
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
    .ofType(actionTypes.LOAD_ACLS_REQUEST, actionTypes.GET_ALL_USERS_AND_ROLES)
    .mergeMap(() => {
      console.log('hit loadAllUsersAndRoles');
      return Observable
        .from(
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

function setAllPermissions(action$ :Observable<Action>, store) {
  let entitySetId, property;
  return action$
  .ofType(actionTypes.SET_ALL_PERMISSIONS)
  .mergeMap((action) => {
    console.log('inside first mergeMap, action:', action);
    entitySetId = action.entitySetId;
    property = action.property;
    return Observable.zip(
      Observable.of(actionFactory.getAllUsersAndRoles()),
      Observable.of(actionFactory.updateAclsEpicRequest(entitySetId, property))
    )
    .mergeMap(() => {
      return Observable.of(
        actionFactory.setUserPermissions(property), // IS THIS PASSING IN PROPERTY W/ LATEST DATA
        actionFactory.setRolePermissions(property)
      );
    })
  })
  .startWith(actionFactory.loadAclsRequest(entitySetId, property))
  .catch((err) => {
    console.log('error setting permissions:', err);
  });
}

export default combineEpics(
  intitialLoadEpic,
  loadEntitySetEpic,
  updateStateAclsEpic,
  loadAllUsersAndRolesEpic,
  setAllPermissions
);
