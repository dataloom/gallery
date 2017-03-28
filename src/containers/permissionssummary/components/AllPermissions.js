import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { PermissionsPropType, getPermissions, DEFAULT_PERMISSIONS } from '../../permissions/PermissionsStorage';
import { getEdmObject } from '../../edm/EdmStorage';
import * as psActionFactory from '../PermissionsSummaryActionFactory';
import * as actionFactories from '../../entitysetdetail/EntitySetDetailActionFactories';
import * as edmActionFactories from '../../edm/EdmActionFactories';
import * as PermissionsActionFactory from '../../permissions/PermissionsActionFactory';
import UserPermissionsTable from './UserPermissionsTable';
import RolePermissionsTable from './RolePermissionsTable';
import Page from '../../../components/page/Page';

const U_HEADERS = ['Users', 'Roles', 'Permissions'];
const R_HEADERS = ['Roles', 'Permissions'];

class AllPermissions extends React.Component {
  static propTypes = {
    properties: PropTypes.object.isRequired,
    userAcls: PropTypes.object.isRequired,
    roleAcls: PropTypes.object.isRequired,
    globalValue: PropTypes.array.isRequired,
    allUsersById: PropTypes.object.isRequired,
    entityUserPermissions: PropTypes.array.isRequired,
    entityRolePermissions: PropTypes.object.isRequired,
    propertyPermissions: PropTypes.object.isRequired,
    setEntityUserPermissions: PropTypes.func.isRequired,
    setEntityRolePermissions: PropTypes.func.isRequired,
    setPropertyUserPermissions: PropTypes.func.isRequired,
    setPropertyRolePermissions: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      entityUserPermissions: [],
      entityRolePermissions: {},
      propertyPermissions: {}
    };

    this.getUserPermissions = this.getUserPermissions.bind(this);
  }

  //TODO: Reformat to use new roles service once live
  componentDidMount() {
    this.props.loadEntitySet();
    // TODO: Make sure data gets loaded on refresh once async actions are hooked up to redux
    // this.props.loadAclsRequest(this.props.entitySet.id);
    //
    // this.props.entitySet.entityType.properties.forEach((property) => {
    //   this.props.loadAclsRequest(this.props.entitySet.id, property);
    // });

    const { properties } = this.props;
    console.log('props:', this.props);

    // Get user and role permissions for entity set
    this.getUserPermissions();
    this.getRolePermissions();

    // Get user and role permissions for each property
    Object.keys(properties).forEach((property) => {
      this.getUserPermissions(properties[property]);
      this.getRolePermissions(properties[property]);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entitySet === undefined && nextProps.entitySet !== undefined) {
      // this.props.setEntitySet(nextProps.entitySet);
      this.props.loadAclsRequest(nextProps.entitySet.id);

      nextProps.entitySet.entityType.properties.forEach((property) => {
        this.props.loadAclsRequest(nextProps.entitySet.id, property);
      });
    }
  }

  getUserPermissions = (property) => {
    console.log('property:', property);
    const { userAcls, roleAcls, globalValue } = property || this.props;
    const { allUsersById } = this.props;
    const userPermissions = [];
    console.log('allusers, userAcls, roleAcls, globalValue:', allUsersById, userAcls, roleAcls, globalValue);

    // For each user, add their permissions
    Object.keys(allUsersById).forEach((userId) => {
      if (userId && allUsersById[userId]) {
        const user = {
          id: userId,
          nickname: allUsersById[userId].nickname,
          email: allUsersById[userId].email,
          roles: [],
          permissions: [],
          individualPermissions: []
        };

        // Get all user permissions (sum of individual + roles + default);
        Object.keys(userAcls).forEach((permissionKey) => {
          if (userAcls[permissionKey].indexOf(userId) !== -1) {
            user.permissions.push(permissionKey);
            // Save individual permissions separately
            user.individualPermissions.push(permissionKey);
          }
        });

        // Add additional permissions based on the roles the user has
        if (allUsersById[userId].roles.length > 1) {
          Object.keys(roleAcls).forEach((permissionKey) => {
            allUsersById[userId].roles.forEach((role) => {
              if (roleAcls[permissionKey].indexOf(role) !== -1 && user.permissions.indexOf(permissionKey) === -1) {
                user.permissions.push(permissionKey);
              }
              if (user.roles.indexOf(role) === -1 && role !== 'AuthenticatedUser') {
                user.roles.push(role);
              }
            });
          });
        }

        // Add additional permissions based on default for all users
        if (globalValue) {
          globalValue.forEach((permission) => {
            if (user.permissions.indexOf(permission) === -1) {
              user.permissions.push(permission);
            }
          });
        }
        userPermissions.push(user);
      }
    });
    this.setUserPermissions(userPermissions, property);
  }

  setUserPermissions = (permissions, property) => {
    if (property) {
      this.props.setPropertyUserPermissions(permissions, property);
    }
    else {
      this.props.setEntityUserPermissions(permissions);
    }
  }

  getRolePermissions = (property) => {
    const { roleAcls, globalValue } = property || this.props;
    const rolePermissions = {};

    // Get all roles and their respective permissions
    Object.keys(roleAcls).forEach((permission) => {
      roleAcls[permission].forEach((role) => {
        if (!Object.prototype.hasOwnProperty.call(rolePermissions, role)) {
          rolePermissions[role] = [];
        }

        if (rolePermissions[role].indexOf(permission) === -1) {
          rolePermissions[role].push(permission);
        }
      });
    });
    rolePermissions.AuthenticatedUser = globalValue;
    this.setRolePermissions(rolePermissions, property);
  }

  setRolePermissions = (permissions, property) => {
    if (property) {
      this.props.setPropertyRolePermissions(permissions, property);
    }
    else {
      this.props.setEntityRolePermissions(permissions);
    }
  }

  renderPropertyTables() {
    const { propertyPermissions } = this.props;
    const tables = [];

    Object.keys(propertyPermissions).forEach((property) => {
      const { userPermissions, rolePermissions } = propertyPermissions[property];
      const header = <h3 key={`header-${property}`}>{property}</h3>;
      const roleTable = (<RolePermissionsTable
          rolePermissions={rolePermissions}
          headers={R_HEADERS}
          key={`role-${property}`} />);
      const userTable = (<UserPermissionsTable
          property={property}
          userPermissions={userPermissions}
          rolePermissions={rolePermissions}
          headers={U_HEADERS}
          key={`user-${property}`} />);

      tables.push(header, roleTable, userTable);
    });
    return tables;
  }

  render() {
    return (
      <Page>
        <Page.Header>
          <Page.Title>All Permissions</Page.Title>
        </Page.Header>
        <Page.Body>
          <h3>Entity Permissions</h3>
          <RolePermissionsTable
              rolePermissions={this.props.entityRolePermissions}
              headers={R_HEADERS} />
          <UserPermissionsTable
              userPermissions={this.props.entityUserPermissions}
              rolePermissions={this.props.entityRolePermissions}
              headers={U_HEADERS} />
          {this.renderPropertyTables()}
        </Page.Body>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  const entitySetDetail = state.get('entitySetDetail');
  const normalizedData = state.get('normalizedData');
  const permissionsSummary = state.get('permissionsSummary');
  let entitySet;
  const reference = entitySetDetail.get('entitySetReference');
  if (reference) {
    entitySet = getEdmObject(normalizedData.toJS(), reference.toJS());
  }

  return {
    allUsersById: permissionsSummary.get('allUsersById').toJS(),
    properties: permissionsSummary.get('properties').toJS(),
    userAcls: permissionsSummary.get('userAcls').toJS(),
    roleAcls: permissionsSummary.get('roleAcls').toJS(),
    globalValue: permissionsSummary.get('globalValue').toJS(),
    entityUserPermissions: permissionsSummary.get('entityUserPermissions').toJS(),
    entityRolePermissions: permissionsSummary.get('entityRolePermissions').toJS(),
    propertyPermissions: permissionsSummary.get('propertyPermissions').toJS(),
    entitySet
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const id = ownProps.params.id;

  return {
    loadEntitySet: () => {
      dispatch(actionFactories.entitySetDetailRequest(id));
      dispatch(PermissionsActionFactory.getEntitySetsAuthorizations([id]));
      // TODO: Move filter creation in helper function in EdmApi
      dispatch(edmActionFactories.filteredEdmRequest(
        [{
          type: 'EntitySet',
          id,
          include: ['EntitySet', 'EntityType', 'PropertyTypeInEntitySet']
        }]
      ));
    },
    setEntitySet: (entitySet) => {
      dispatch(psActionFactory.setEntitySet(entitySet));
    },
    loadAclsRequest: (entitySetId, property) => {
      dispatch(psActionFactory.loadAclsRequest(entitySetId, property));
    },
    setEntityUserPermissions: (permissions) => {
      dispatch(psActionFactory.setEntityUserPermissions(permissions));
    },
    setEntityRolePermissions: (permissions) => {
      dispatch(psActionFactory.setEntityRolePermissions(permissions));
    },
    setPropertyUserPermissions: (permissions, property) => {
      dispatch(psActionFactory.setPropertyUserPermissions(permissions, property));
    },
    setPropertyRolePermissions: (permissions, property) => {
      dispatch(psActionFactory.setPropertyRolePermissions(permissions, property));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPermissions);
