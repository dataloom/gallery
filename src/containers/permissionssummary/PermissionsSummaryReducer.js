import Immutable, { List, Map, fromJS } from 'immutable';
import * as actionTypes from './PermissionsSummaryActionTypes';
import {
  getRolesForUsers
} from './PermissionsSummaryActionFactory';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  allUsersById: {},
  allRolesList: [],
  entityUserPermissions: [],
  entityRolePermissions: {},
  propertyPermissions: {},
  isGettingUsersRoles: true,
  isGettingAcls: false,
  isGettingPermissions: false,
  isGettingOrganizations: false,
  isGettingRoles: false,
  isGettingMembers: false
});

export default function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case actionTypes.RESET_PERMISSIONS:
      return INITIAL_STATE;

    case getRolesForUsers.case(action.type): {
      return getRolesForUsers.reducer(state, action, {
        REQUEST: () => state.set('isGettingAcls', true).set('isGettingPermissions', true),
        SUCCESS: () => {
          const {
            allUsersById,
            allRolesList,
            rolePermissions,
            userPermissions,
            propertyTypes
          } = action.value;

          let entityUserPermissions = List();
          let entityRolePermissions = List();
          let propertyPermissions = Map();

          userPermissions.entrySeq().forEach(([aclKey, permissions]) => {
            const propertyTypeId = aclKey[1];
            if (propertyTypeId) {
              const propertyTypeTitle = propertyTypes[propertyTypeId].title;
              propertyPermissions = propertyPermissions.setIn([propertyTypeTitle, 'userPermissions'], fromJS(permissions));
            }
            else {
              entityUserPermissions = fromJS(permissions);
            }
          });

          rolePermissions.entrySeq().forEach(([aclKey, permissions]) => {
            const propertyTypeId = aclKey[1];
            if (propertyTypeId) {
              const propertyTypeTitle = propertyTypes[propertyTypeId].title;
              propertyPermissions = propertyPermissions.setIn([propertyTypeTitle, 'rolePermissions'], fromJS(permissions));
            }
            else {
              entityRolePermissions = fromJS(permissions);
            }
          });

          return state
            .set('allUsersById', allUsersById)
            .set('allRolesList', allRolesList)
            .set('entityUserPermissions', entityUserPermissions)
            .set('entityRolePermissions', entityRolePermissions)
            .set('propertyPermissions', propertyPermissions);
        },
        FINALLY: () => state
          .set('isGettingAcls', false)
          .set('isGettingPermissions', false)
          .set('isGettingUsersRoles', false)
      });
    }

    default:
      return state;
  }
}
