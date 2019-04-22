import { EntityDataModelApi, PermissionsApi, PrincipalsApi } from 'lattice';

import {
  List,
  Map,
  Set,
  fromJS
} from 'immutable'

import {
  all,
  call,
  put,
  select,
  takeEvery
} from 'redux-saga/effects';

import { ROLE, AUTHENTICATED_USER } from '../../utils/Consts/UserRoleConsts';
import { PERMISSIONS } from '../permissions/PermissionsStorage';
import * as actionFactory from './PermissionsSummaryActionFactory';

import {
  GET_ROLES_FOR_USERS,
  getRolesForUsers
} from './PermissionsSummaryActionFactory';


/* HELPER FUNCTIONS */
function toCamelCase(s) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

function includesPermission(permissions, permission) {
  return permissions.includes(permission) || permissions.includes(toCamelCase(permission));
}

function formatPermissions(permissions) {
  const newPermissions = [];
  if (includesPermission(permissions, PERMISSIONS.OWNER)) return [toCamelCase(PERMISSIONS.OWNER)];
  if (includesPermission(permissions, PERMISSIONS.WRITE)) newPermissions.push(toCamelCase(PERMISSIONS.WRITE));
  if (includesPermission(permissions, PERMISSIONS.READ)) newPermissions.push(toCamelCase(PERMISSIONS.READ));
  if (includesPermission(permissions, PERMISSIONS.MATERIALIZE)) newPermissions.push(toCamelCase(PERMISSIONS.MATERIALIZE));
  if (includesPermission(permissions, PERMISSIONS.LINK)) newPermissions.push(toCamelCase(PERMISSIONS.LINK));
  if (includesPermission(permissions, PERMISSIONS.DISCOVER) || permissions.includes('Discover')) newPermissions.push(toCamelCase(PERMISSIONS.DISCOVER));
  return newPermissions;
}

function configureRolePermissions(aces, roleTitlesById) {
  const rolePermissions = {
    [AUTHENTICATED_USER]: []
  };

  aces.forEach((ace) => {
    if (ace.permissions.length > 0 && ace.principal.type === ROLE) {
      if (ace.principal.id === AUTHENTICATED_USER) {
        rolePermissions[AUTHENTICATED_USER] = formatPermissions(ace.permissions);
      }

      const roleTitle = roleTitlesById.get(ace.principal.id, ace.principal.id);

      rolePermissions[roleTitle] = formatPermissions(ace.permissions);
    }
  });

  return rolePermissions;
}

function configureUserPermissions(aces, rolePermissions, allUsersById, aclExplanation, roleTitlesById) {
  let usersWithPermissions = Map();

  let userPermissionsById = Map();
  aces.filter(({ principal }) => principal.type === 'USER').forEach(({ principal, permissions }) => {
    const { id } = principal;
    userPermissionsById = userPermissionsById.set(id, Set.of(...permissions));

    const userObj = {};
    const user = allUsersById.get(id);
    if (user) {
      const formattedPermissions = formatPermissions(permissions);

      userObj.id = user.get('user_id');
      userObj.nickname = user.get('nickname');
      userObj.email = user.get('email');
      userObj.roles = [];
      userObj.individualPermissions = formattedPermissions;
      userObj.permissions = formattedPermissions;
    }

    usersWithPermissions = usersWithPermissions.set(id, userObj);
  });

  aclExplanation.forEach(({ principal, principalPaths }) => {
    const { id, type } = principal;
    if (type === 'USER') {
      let userPermissions = userPermissionsById.get(id, Set());
      let userRoles = Set();

      principalPaths.forEach((principalPath) => {
        principalPath.forEach((parentPrincipal) => {
          if (parentPrincipal.type === 'ROLE') {
            const roleId = parentPrincipal.id;
            const roleTitle = roleTitlesById.get(roleId, roleId);
            const parentRolePermissions = rolePermissions[roleTitle] || [];

            userPermissions = userPermissions.union(Set.of(...parentRolePermissions));

            userRoles = userRoles.add({
              id: roleId,
              title: roleTitle
            });
          }
        });
      });

      const userObj = usersWithPermissions.get(id, {});
      const user = allUsersById.get(id);
      if (user) {
        userObj.id = user.get('user_id');
        userObj.nickname = user.get('nickname');
        userObj.email = user.get('email');
        userObj.roles = userRoles.toJS();
        userObj.individualPermissions = formatPermissions(userPermissionsById.get(id, Set()).toJS());
        userObj.permissions = formatPermissions(userPermissions.toJS());
      }

      usersWithPermissions = usersWithPermissions.set(id, userObj);
    }
  });

  return usersWithPermissions.valueSeq().toJS();
}

function getAclKey(action) {
  const property = action.property;
  const aclKey = [action.entitySetId];
  if (property && property.id) aclKey.push(action.property.id);
  return aclKey;
}

function getUsersFromAces(aces) {
  return aces.map(({ principal }) => principal).filter(({ type }) => type === 'USER');
}

function getUsersAndRoles(users) {
  const allUsersById = fromJS(users);
  const allRolesList = new Set();
  Object.keys(users).forEach((userId) => {
    users[userId].roles.forEach((role) => {
      if (role !== AUTHENTICATED_USER) allRolesList.add(fromJS(role));
    });
  });
  return {
    allUsersById,
    allRolesList
  };
}

function getRoleTitlesById(organizations) {
  let roleTitlesById = Map();

  organizations.forEach((organization) => {
    const orgTitle = organization.get('title');
    organization.get('roles', List()).forEach((role) => {
      const roleId = role.getIn(['principal', 'id']);
      const roleTitle = `${role.get('title')} (${orgTitle})`;
      roleTitlesById = roleTitlesById.set(roleId, roleTitle);
    });
  });

  return roleTitlesById;
}

/* SAGAS */

function* tryGetAclExplanation(aclKey :UUID[]) :Generator<*, *, *> {

  try {
    return yield call(PermissionsApi.getAclExplanation, aclKey);
  }
  catch (error) {
    console.error(`Unable to load acl explanation for acl ${aclKey}`);
    return [];
  }
}

function* getRolesForUsersWorker(action :Object) :Generator<*, *, *> {

  try {
    yield put(getRolesForUsers.request(action.id));

    const entitySet = action.value;

    const [users, edmProjection] = yield all([
      call(PrincipalsApi.getAllUsers),
      call(EntityDataModelApi.getEntityDataModelProjection, [{
        type: 'EntitySet',
        id: entitySet.id,
        include: ['PropertyTypeInEntitySet']
      }])
    ]);

    const { allUsersById, allRolesList } = getUsersAndRoles(users);
    const { propertyTypes } = edmProjection;

    const allAclKeys = [
      [entitySet.id],
      ...Object.keys(propertyTypes).map(id => ([entitySet.id, id]))
    ];

    const aclAndExplanationRequests = [
      ...allAclKeys.map(aclKey => call(PermissionsApi.getAcl, aclKey)),
      ...allAclKeys.map(aclKey => call(tryGetAclExplanation, aclKey))
    ];

    const aclsAndExplanations = yield all(aclAndExplanationRequests);

    const allOrgs = yield select(state => state.getIn(['organizations', 'organizations']));
    const roleTitlesById = getRoleTitlesById(allOrgs);

    let userPermissions = Map();
    let rolePermissions = Map();

    allAclKeys.forEach((aclKey, index) => {
      const acl = aclsAndExplanations[index];
      const aclExplanation = aclsAndExplanations[allAclKeys.length + index];

      rolePermissions = rolePermissions.set(aclKey, configureRolePermissions(acl.aces, roleTitlesById));
      userPermissions = userPermissions.set(aclKey, configureUserPermissions(
        acl.aces,
        rolePermissions.get(aclKey),
        allUsersById,
        aclExplanation,
        roleTitlesById
      ));

    });

    yield put(getRolesForUsers.success(action.id, {
      allUsersById,
      allRolesList,
      rolePermissions,
      userPermissions,
      propertyTypes
    }));

  }
  catch (error) {
    console.error(error);
    yield put(getRolesForUsers.failure(action.id, error));
  }
  finally {
    yield put(getRolesForUsers.finally(action.id));
  }
}

export function* getRolesForUsersWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_ROLES_FOR_USERS, getRolesForUsersWorker);
}
