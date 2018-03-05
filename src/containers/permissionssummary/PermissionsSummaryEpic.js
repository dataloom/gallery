import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { PermissionsApi, PrincipalsApi, EntityDataModelApi, OrganizationsApi } from 'lattice';

import { ROLE, AUTHENTICATED_USER } from '../../utils/Consts/UserRoleConsts';
import * as actionTypes from './PermissionsSummaryActionTypes';
import * as actionFactory from './PermissionsSummaryActionFactory';
import * as orgsActionTypes from '../organizations/actions/OrganizationsActionTypes';
import { PERMISSIONS } from '../permissions/PermissionsStorage';

/* HELPER FUNCTIONS */
function toCamelCase(s) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

function getPermission(permissions) {
  const newPermissions = [];
  if (permissions.includes(PERMISSIONS.OWNER)) return [toCamelCase(PERMISSIONS.OWNER)];
  if (permissions.includes(PERMISSIONS.WRITE)) newPermissions.push(toCamelCase(PERMISSIONS.WRITE));
  if (permissions.includes(PERMISSIONS.READ)) newPermissions.push(toCamelCase(PERMISSIONS.READ));
  if (permissions.includes(PERMISSIONS.LINK)) newPermissions.push(toCamelCase(PERMISSIONS.LINK));
  if (permissions.includes(PERMISSIONS.DISCOVER) || permissions.includes('Discover')) newPermissions.push(toCamelCase(PERMISSIONS.DISCOVER));
  return newPermissions;
}

function configureUserPermissions(aces, rolePermissions, allUsersById) {
  const userPermissions = [];
  try {
    allUsersById.valueSeq().forEach((user) => {
      const userObj = {};

      if (user) {
        userObj.id = user.user_id;
        userObj.nickname = user.nickname;
        userObj.email = user.email;
        userObj.roles = [];
        userObj.individualPermissions = [];
        userObj.permissions = [];

        // Get individual permissions
        aces.forEach((ace) => {
          if (ace.principal.id === user.user_id) {
            userObj.individualPermissions = getPermission(ace.permissions);
            userObj.permissions = getPermission(ace.permissions);
          }
        });

        // Add additional permissions based on user's roles, including AuthenticatedUser
        user.roles.forEach((role) => {
          const permissions = rolePermissions[role];

          if (permissions && permissions.length > 0) {
            permissions.forEach((permission) => {
              if (userObj.permissions.indexOf(permission) === -1) {
                userObj.permissions.concat(getPermission([permission]));
              }
            });
          }
        });
        userPermissions.push(userObj);
      }
    });
  }
  catch (e) {
    console.error(e);
  }

  return userPermissions;
}

function configurePermissions(aces, allUsersById) {

  const rolePermissions = {
    [AUTHENTICATED_USER]: []
  };

  aces.forEach((ace) => {
    if (ace.permissions.length > 0 && ace.principal.type === ROLE) {
      if (ace.principal.id === AUTHENTICATED_USER) {
        rolePermissions[AUTHENTICATED_USER] = getPermission(ace.permissions);
      }

      rolePermissions[ace.principal.id] = getPermission(ace.permissions);
    }
  });

  const userPermissions = configureUserPermissions(aces, rolePermissions, allUsersById);

  return {
    rolePermissions,
    userPermissions
  };
}

function getAclKey(action) {
  const property = action.property;
  const aclKey = [action.entitySetId];
  if (property && property.id) aclKey.push(action.property.id);
  return aclKey;
}

function getUsersAndRoles(users) {
  const allUsersById = users;
  const allRolesList = new Set();
  Object.keys(users).forEach((userId) => {
    users[userId].roles.forEach((role) => {
      if (role !== AUTHENTICATED_USER) allRolesList.add(role);
    });
  });
  return {
    allUsersById,
    allRolesList
  };
}

function createAclsObservables(entitySetId, properties) {
  const loadAclsObservables = properties.map(property =>
    Observable.of(actionFactory.getUserRolePermissionsRequest(entitySetId, property))
  );
  loadAclsObservables.unshift(Observable.of(actionFactory.getUserRolePermissionsRequest(entitySetId)));
  return loadAclsObservables;
}


/* EPICS */
function getOrgsMembersEpic(action$, store) {
  return action$
    .ofType(orgsActionTypes.FETCH_ORGS_SUCCESS)
    .map(() => {
      const orgs = store.getState().getIn(['organizations', 'organizations']);
      const orgIds = orgs.keySeq().toJS();
      return orgIds;
    })
    .mergeMap(val => val)
    .mergeMap(orgId =>
      Observable.from(
          OrganizationsApi.getAllMembers(orgId)
        )
        .map(members => Object.assign({}, { orgId, members }))
    )
    .mergeMap(membersObj =>
      Observable.of(
        actionFactory.setOrgsMembers(membersObj)
      )
    )
    .catch(() =>
      Observable.of(actionFactory.setOrgsMembersFailure())
    );
}

function getOrgsRolesEpic(action$, store) {
  return action$
    .ofType(orgsActionTypes.FETCH_ORGS_SUCCESS)
    .map(() => {
      const orgs = store.getState().getIn(['organizations', 'organizations']);
      const orgIds = orgs.keySeq().toJS();
      return orgIds;
    })
    .mergeMap(val => val)
    .mergeMap(orgId =>
      Observable.from(
          OrganizationsApi.getAllRoles(orgId)
        )
    )
    .mergeMap(roles =>
      Observable.of(
        actionFactory.setOrgsRoles(roles)
      )
    )
    .catch(() =>
      Observable.of(actionFactory.setOrgsRolesFailure())
    );
}


// TODO: Use spinner when loading, based on status ^
function getAllUsersAndRolesEpic(action$) {
  let entitySet;
  return action$
    .ofType(actionTypes.GET_ALL_USERS_AND_ROLES_REQUEST)
    .mergeMap((action) => {
      entitySet = action.entitySet;
      return Observable
        .from(
          PrincipalsApi.getAllUsers()
        )
        .mergeMap((users) => {
          const { allUsersById, allRolesList } = getUsersAndRoles(users);
          return Observable
            .of(
              actionFactory.getAllUsersAndRolesSuccess(allUsersById, allRolesList),
              actionFactory.getAcls(entitySet)
            );
        })
        .catch(() =>
          Observable.of(
            actionFactory.getAllUsersAndRolesFailure()
          )
        );
    });
}


function getAclsEpic(action$) {
  return action$
  .ofType(actionTypes.GET_ACLS)
  .mergeMap((action) => {
    const edmQuery = [{
      type: 'EntitySet',
      id: action.entitySet.id,
      include: ['PropertyTypeInEntitySet']
    }];
    return Observable
      .from(
        EntityDataModelApi.getEntityDataModelProjection(edmQuery)
      )
      .mergeMap(edmDetails =>
        createAclsObservables(action.entitySet.id, Object.values(edmDetails.propertyTypes))
      )
      .mergeMap(observables =>
        observables
      )
      .catch(() =>
        // TODO: add real error handling
        ({ type: 'noop' })
      );
  })
  .catch(() =>
    // TODO: add real error handling
    ({ type: 'noop' })
  );
}

function getUserRolePermissionsEpic(action$, store) {
  return action$
    .ofType(actionTypes.GET_USER_ROLE_PERMISSIONS_REQUEST)
    .mergeMap((action) => {
      const aclKey = getAclKey(action);
      return Observable
        .from(
          PermissionsApi.getAcl(aclKey)
        )
        .mergeMap((acl) => {
          const orgsRoles = store.getState().getIn(['permissionsSummary', 'orgsRoles']);
          const orgsMembers = store.getState().getIn(['permissionsSummary', 'orgsMembers']);

          // TODO: Pass in orgs' members & roles details to either configureAcls
          // or setRole/UserPermissions actions as needed
          const allUsersById = store.getState().getIn(['permissionsSummary', 'allUsersById']);
          const permissions = configurePermissions(acl.aces, allUsersById);
          return Observable.of(
            actionFactory.getUserRolePermissionsSuccess(),
            actionFactory.setRolePermissions(action.property, permissions.rolePermissions),
            actionFactory.setUserPermissions(action.property, permissions.userPermissions)
          );
        })
        .catch(() =>
          Observable.of(
            actionFactory.getUserRolePermissionsFailure()
          )
        );
    });
}

export default combineEpics(
  getOrgsMembersEpic,
  getOrgsRolesEpic,
  getAclsEpic,
  getUserRolePermissionsEpic,
  getAllUsersAndRolesEpic
);
