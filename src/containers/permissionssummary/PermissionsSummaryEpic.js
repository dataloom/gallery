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

const permissionOptions = {
  Discover: 'Discover',
  Link: 'Link',
  Read: 'Read',
  Write: 'Write',
  Owner: 'Owner'
};

function getPermission(permissions) {
  const newPermissions = [];
  if (permissions.includes(permissionOptions.Owner.toUpperCase())) return [permissionOptions.Owner];
  if (permissions.includes(permissionOptions.Write.toUpperCase())) newPermissions.push(permissionOptions.Write);
  if (permissions.includes(permissionOptions.Read.toUpperCase())) newPermissions.push(permissionOptions.Read);
  if (permissions.includes(permissionOptions.Link.toUpperCase())) newPermissions.push(permissionOptions.Link);
  if (permissions.includes(permissionOptions.Discover.toUpperCase())) newPermissions.push(permissionOptions.Discover);
  return newPermissions;
}

function configureAcls(aces, property) {
  // const property = property || null;
  let globalValue = [];
  const roleAcls = { Discover: [], Link: [], Read: [], Write: [] };
  const userAcls = { Discover: [], Link: [], Read: [], Write: [], Owner: [] };
  action.aces.forEach((ace) => {
    if (ace.permissions.length > 0) {
      if (ace.principal.type === ROLE) {
        if (ace.principal.id === AUTHENTICATED_USER) {
          // TODO: define getPermissions somewhere in here
          globalValue = getPermission(ace.permissions);
        }
        else {
          getPermission(ace.permissions).forEach((permission) => {
            roleAcls[permission].push(ace.principal.id);
          });
        }
      }
      else {
        getPermission(ace.permissions).forEach((permission) => {
          userAcls[permission].push(ace.principal.id);
        });
      }
    }
  });
  // if (property) {
  //   state.merge({
  //     newRoleValue: '',
  //     newEmailValue: '',
  //     updateError: false
  //   });
  //   const propertyDataMerge = {
  //     properties: {
  //       [property.id]: {
  //         title: property.title,
  //         roleAcls,
  //         userAcls,
  //         globalValue
  //       }
  //     }
  //   };
  //   return state.mergeDeep(propertyDataMerge);
  // }

  return {
    newRoleValue: '',
    newEmailValue: '',
    updateError: false,
    roleAcls,
    userAcls,
    globalValue
  };
}

function intitialLoadEpic(action$ :Observable<Action>, store) :Observable<Action> {
  return action$
  .ofType(actionTypes.INITIAL_LOAD)
  .mergeMap((action) => {
    console.log('inside initialLoadEpic, action:', action);
    return Observable.of(
      actionFactory.getAllUsersAndRoles()
    );
  });
  // catch
}

function loadEntitySetEpic(action$ :Observable<Action>, store) :Observable<Action> {
  return action$
  .ofType(actionTypes.LOAD_ENTITY_SET)
  .mergeMap((action) => {
    console.log('inside loadEntitySetEpic, BEGIN SHITTY REFACTOR! action:', action);

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
    // QUESTION: HOW TO RETURN MULTIPLE OBSERVABLES????
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
            actionFactory.updateAclsRequest(action.property), // TODO: Do we need to keep it? if so: Refactor so it only sets state
            actionFactory.setUserPermissions(action.property, configuredAcls), // TODO: Refactor w/ new data format
            actionFactory.setRolePermissions(action.property, configuredAcls) // TODO: Refactor w/ new data format
          );
        })
        .catch(() => {
          return Observable.of(
            actionFactory.updateStateAclsFailure()
          );
        });
    });
}

function getAllUsersAndRolesEpic(action$, store) {
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
      console.log('inside getAUAR users:', users);

      const allUsersById = users;
      const allRolesList = new Set();
      const myId = JSON.parse(localStorage.profile).user_id;
      Object.keys(users).forEach((userId) => {
        users[userId].roles.forEach((role) => {
          if (role !== AUTHENTICATED_USER) allRolesList.add(role);
        });
      });
      allUsersById[myId] = null;

      const entitySetId = store.getState().get('permissionsSummary').toJS().entitySetId;
      console.log('entitySetId from store:', entitySetId);

      return Observable
        .of(
          actionFactory.setAllUsersAndRoles(allUsersById, allRolesList), // -> TODO: make into success action containing logic above?
          actionFactory.setLoadUsersError(false),
          actionFactory.loadEntitySet(entitySetId)
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
  getAllUsersAndRolesEpic,
  setAllPermissions
);
