import React, { PropTypes } from 'react';
import { PermissionsApi, PrincipalsApi } from 'loom-data';
import { Permission } from '../../../../core/permissions/Permission';
import ActionConsts from '../../../../utils/Consts/ActionConsts';
import { ROLE, AUTHENTICATED_USER } from '../../../../utils/Consts/UserRoleConsts';
import UserPermissionsTable from './UserPermissionsTable';
import RolePermissionsTable from './RolePermissionsTable';
import Page from '../../../../components/page/Page';
import { connect } from 'react-redux';
import styles from '../styles.module.css';

const views = {
  GLOBAL: 0,
  ROLES: 1,
  EMAILS: 2
};

const accessOptions = {
  Hidden: 'Hidden',
  Discover: 'Discover',
  Link: 'Link',
  Read: 'Read',
  Write: 'Write',
  Owner: 'Owner'
};

const permissionOptions = {
  Discover: 'Discover',
  Link: 'Link',
  Read: 'Read',
  Write: 'Write',
  Owner: 'Owner'
};

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

  componentDidMount() {
    // console.log('CDM properties? ', this.props.properties);

  }

  componentWillReceiveProps(nextProps) {
    const { properties } = this.props;
    this.getUserPermissions();
    this.getRolePermissions();
    // console.log('props properties:');
    Object.keys(properties).forEach((property) => {
        this.getUserPermissions(properties[property]);
        this.getRolePermissions(properties[property]);
    })
  }

  getUserPermissions = (property) => {
    const { userAcls, roleAcls } = property ? property : this.props;
    const { allUsersById } = this.props;
    const userPermissions = [];
    // console.log('userAcls, roleAcls, allUsersById:', userAcls, roleAcls, allUsersById);

    // For each user, add their permissions
    Object.keys(allUsersById).forEach((userId) => {
      if (userId && allUsersById[userId]) {
        const user = {
          id: userId,
          email: allUsersById[userId].email,
          roles: [],
          permissions: [],
          expand: [] // set of {role, permissions}
        };

        // Add individual permissions
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
            });
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
          user.permissions = '-';
        } else {
          user.permissions = user.permissions.join(', ');
        }
      }
    });

    if (property) {
      const propertyUserPermissions = this.state.propertyPermissions;
      propertyUserPermissions[property.title] = {};
      propertyUserPermissions[property.title].userPermissions = formattedPermissions;

      this.setState({ propertyPermissions: propertyUserPermissions }, () => {
        console.log('PROPERTY PERMISSIONS:', this.state.propertyPermissions);
      });
    } else {
      this.setState({ entityUserPermissions: formattedPermissions });
    }
  }

  getRolePermissions = (property) => {
    const { roleAcls } = property ? property : this.props;
    const rolePermissions = {};

    // Get all roles and their respective permissions
    Object.keys(roleAcls).forEach((permission) => {
      roleAcls[permission].forEach((role) => {
        if (!rolePermissions.hasOwnProperty(role)) {
          rolePermissions[role] = [];
        }

        if (rolePermissions[role].indexOf(permission) === -1) {
          rolePermissions[role].push(permission);
        }
      });
    });

    this.setRolePermissions(rolePermissions, property);
  }

  setRolePermissions = (permissions, property) => {
    const formattedPermissions = {};

    // Format data for table
    Object.keys(permissions).forEach((permission) => {
      formattedPermissions[permission] = permissions[permission].join(', ');
    });

    // TODO: SET unique name for each property
    // if (property) {
    //   const propertyRolePermissions = this.state.propertyPermissions;
    //   propertyRolePermissions[property.title].rolePermissions = formattedPermissions;
    //   this.setState({ [property.title]: formattedPermissions }, () => {console.log('PROP ROLES SET:', this.state)})
    // } else {
    //   this.setState({ entityRolePermissions: formattedPermissions });
    // }
  }

  renderPropertyTables() {
    // for each property -> render title + user + role tables for the data
  }

  render() {
    return (
      <Page>
        <Page.Header>
          <Page.Title>All Permissions</Page.Title>
        </Page.Header>
        <Page.Body>
          <h3>Entity Permissions</h3>
          <UserPermissionsTable users={this.state.entityUserPermissions} headers={U_HEADERS} />
          <RolePermissionsTable roles={this.state.entityRolePermissions} headers={R_HEADERS} />
          <h3>Property A Permissions</h3>
          <UserPermissionsTable users={this.state.entityUserPermissions} headers={U_HEADERS} />
          <RolePermissionsTable roles={this.state.entityRolePermissions} headers={R_HEADERS} />
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
    roleAcls: entitySetDetail.get('roleAcls').toJS()
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPermissions);
