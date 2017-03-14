import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import UserPermissionsTable from './UserPermissionsTable';
import RolePermissionsTable from './RolePermissionsTable';
import Page from '../../../../components/page/Page';
import styles from '../styles.module.css';

const U_HEADERS = ['Users', 'Roles', 'Permissions'];
const R_HEADERS = ['Roles', 'Permissions'];

class AllPermissions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      entityUserPermissions: [],
      entityRolePermissions: [],
      propertyPermissions: {}
    };

    this.getUserPermissions = this.getUserPermissions.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { properties } = this.props;

    // Get user and role permissions for entity set
    this.getUserPermissions();
    this.getRolePermissions();

    // Get user and role permissions for each property
    Object.keys(properties).forEach((property) => {
      this.getUserPermissions(properties[property]);
      this.getRolePermissions(properties[property]);
    });
  }

  getUserPermissions = (property) => {
    const { userAcls, roleAcls, globalValue } = property || this.props;
    console.log('USER ACLS, ROLE ACLS:', userAcls, roleAcls); // doesn't contain authenticateduser
    const { allUsersById } = this.props;
    const userPermissions = [];

    // For each user, add their permissions
    Object.keys(allUsersById).forEach((userId) => {
      if (userId && allUsersById[userId]) {
        const user = {
          id: userId,
          nickname: allUsersById[userId].nickname,
          email: allUsersById[userId].email,
          roles: [],
          permissions: [] // add from authenticateduser
        };

        // Add any additional permissions based on the roles the user has
        Object.keys(userAcls).forEach((permissionKey) => {
          if (userAcls[permissionKey].indexOf(userId) !== -1) {
            user.permissions.push(permissionKey);
          }
        });

        if (allUsersById[userId].roles.length > 0) {
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

        // Add permissions based on default for all users
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
    const formattedPermissions = permissions.slice();

    // Format permissions for table
    formattedPermissions.forEach((user) => {
      if (user) {
        if (user.permissions.length === 0) {
          user.permissions = 'none';
        }
        else {
          user.permissions = user.permissions.join(', ');
        }
      }
    });

    if (property) {
      const propertyUserPermissions = this.state.propertyPermissions;
      propertyUserPermissions[property.title] = {};
      propertyUserPermissions[property.title].userPermissions = formattedPermissions;

      this.setState({ propertyPermissions: propertyUserPermissions });
    }
    else {
      this.setState({ entityUserPermissions: formattedPermissions });
    }
  }

  getRolePermissions = (property) => {
    const { roleAcls } = property || this.props;
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

    rolePermissions.AuthenticatedUser = this.props.globalValue;


    // if (!Object.keys(rolePermissions).hasOwnProperty('AuthenticatedUser')) {
    //   rolePermissions.AuthenticatedUser = ['none'];
    // }
    // else {
    // }

    this.setRolePermissions(rolePermissions, property);
  }

  setRolePermissions = (permissions, property) => {
    const formattedPermissions = {};

    // Format data for table
    Object.keys(permissions).forEach((role) => {
      formattedPermissions[role] = permissions[role].join(', ');
    });

    if (property) {
      const propertyRolePermissions = this.state.propertyPermissions;
      propertyRolePermissions[property.title].rolePermissions = formattedPermissions;
      this.setState({ propertyPermissions: propertyRolePermissions });
    }
    else {
      this.setState({ entityRolePermissions: formattedPermissions });
    }
  }

  renderPropertyTables() {
    const { propertyPermissions } = this.state;
    const tables = [];

    Object.keys(propertyPermissions).forEach((property) => {
      const { userPermissions, rolePermissions } = propertyPermissions[property];
      const header = <h3>{property}</h3>;
      const roleTable = (<RolePermissionsTable
          rolePermissions={rolePermissions}
          headers={R_HEADERS} />);
      const userTable = (<UserPermissionsTable
          userPermissions={userPermissions}
          rolePermissions={rolePermissions}
          headers={U_HEADERS} />);

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
              rolePermissions={this.state.entityRolePermissions}
              headers={R_HEADERS} />
          <UserPermissionsTable
              userPermissions={this.state.entityUserPermissions}
              rolePermissions={this.state.entityRolePermissions}
              headers={U_HEADERS} />
          {this.renderPropertyTables()}
        </Page.Body>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  const entitySetDetail = state.get('entitySetDetail');
  return {
    allUsersById: entitySetDetail.get('allUsersById').toJS(),
    properties: entitySetDetail.get('properties').toJS(),
    userAcls: entitySetDetail.get('userAcls').toJS(),
    roleAcls: entitySetDetail.get('roleAcls').toJS(),
    globalValue: entitySetDetail.get('globalValue').toJS()
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPermissions);
