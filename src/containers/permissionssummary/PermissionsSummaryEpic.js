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

function formatPermissions(permissions) {
  const newPermissions = [];
  if (permissions.includes(PERMISSIONS.OWNER)) return [toCamelCase(PERMISSIONS.OWNER)];
  if (permissions.includes(PERMISSIONS.WRITE)) newPermissions.push(toCamelCase(PERMISSIONS.WRITE));
  if (permissions.includes(PERMISSIONS.READ)) newPermissions.push(toCamelCase(PERMISSIONS.READ));
  if (permissions.includes(PERMISSIONS.LINK)) newPermissions.push(toCamelCase(PERMISSIONS.LINK));
  if (permissions.includes(PERMISSIONS.DISCOVER) || permissions.includes('Discover')) newPermissions.push(toCamelCase(PERMISSIONS.DISCOVER));
  return newPermissions;
}

function configureRolePermissions(aces) {
  const rolePermissions = {
    [AUTHENTICATED_USER]: []
  };

  aces.forEach((ace) => {
    if (ace.permissions.length > 0 && ace.principal.type === ROLE) {
      if (ace.principal.id === AUTHENTICATED_USER) {
        rolePermissions[AUTHENTICATED_USER] = formatPermissions(ace.permissions);
      }

      rolePermissions[ace.principal.id] = formatPermissions(ace.permissions);
    }
  });

  return rolePermissions;
}

function getUserIndividualPermissions(userObj, user, aces) {
  aces.forEach((ace) => {
    if (ace.principal.id === user.user_id) {
      userObj.individualPermissions = formatPermissions(ace.permissions);
      userObj.permissions = formatPermissions(ace.permissions);
    }
  });

  return userObj;
}

function getUserRolePermissions(userObj, user, aces, rolePermissions, orgsMembers) {
  const members = Object.values(orgsMembers.toJS()).reduce((a, c) => a.concat(c), []);
  members.forEach((member) => {
    let match = false;
    let i = 0;
    while (!match && i < aces.length) {
      if (member.profile.user_id === user.user_id) {
        match = true;

        member.roles.forEach((role) => {
          userObj.roles.push(
            {
              id: role.principal.id,
              title: role.title
            }
          );

          const permissions = rolePermissions[role.principal.id];
          if (permissions) {
            permissions.forEach((permission) => {
              if (userObj.permissions.indexOf(permission) === -1) {
                userObj.permissions.push(permission);
              }
            });
          }
        });
      }

      i += 1;
    }
  });

  return userObj;
}

function configureUserPermissions(aces, rolePermissions, allUsersById, orgsMembers) {
  const userPermissions = [];

  allUsersById.valueSeq().forEach((user) => {
    const userObj = {};

    if (user) {
      userObj.id = user.user_id;
      userObj.nickname = user.nickname;
      userObj.email = user.email;
      userObj.roles = [];
      userObj.individualPermissions = [];
      userObj.permissions = [];

      getUserIndividualPermissions(userObj, user, aces);
      getUserRolePermissions(userObj, user, aces, rolePermissions, orgsMembers);

      userPermissions.push(userObj);
    }
  });

  return userPermissions;
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
          const orgsMembers = store.getState().getIn(['permissionsSummary', 'orgsMembers']);
          const allUsersById = store.getState().getIn(['permissionsSummary', 'allUsersById']);
          const rolePermissions = configureRolePermissions(acl.aces, allUsersById);
          const userPermissions = configureUserPermissions(acl.aces, rolePermissions, allUsersById, orgsMembers);
          return Observable.of(
            actionFactory.getUserRolePermissionsSuccess(),
            actionFactory.setRolePermissions(action.property, rolePermissions),
            actionFactory.setUserPermissions(action.property, userPermissions)
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
