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

const USERS = [{
  id: 0,
  email: 'corwin@thedataloom.com',
  role: '(all)',
  permissions: 'Read, Write, Discover, Link',
  expand: [{
    role: 'admin',
    permissions: 'Read, Write, Discover, Link'
  }, {
    role: 'xyz',
    permissions: 'Read, Write'
  }]
}, {
  id: 1,
  email: 'matthew@thedataloom.com',
  role: '(all)',
  permissions: ['read', 'write'],
  expand: [{
    role: 'role',
    permissions: ['read', 'write', 'discover', 'link']
  }]
}, {
  id: 2,
  email: 'katherine@thedataloom.com',
  role: '(all)',
  permissions: ['read'],
  expand: [{
    role: 'role',
    permissions: ['read', 'write', 'discover', 'link']
  }]
}];

const R_HEADERS = ['Roles', 'Permissions'];

class AllPermissions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      entityUserPermissions: []
    };

    this.getEntityUserPermissions = this.getEntityUserPermissions.bind(this);
  }

  componentDidMount() {
    // console.log('CDM properties? ', this.props.properties);

  }

  componentWillReceiveProps(nextProps) {
    console.log('PROPS!:', nextProps);
    this.getEntityUserPermissions();
    this.getRolePermissions();

    if (this.props.allUsersById === undefined && nextProps.allUsersById !== undefined) {
      console.log('WE GOT ALL THE USERS!');
      this.getEntityUserPermissions();
      this.getRolePermissions();
    }

    if (this.props.properties === undefined && nextProps.properties !== undefined) {
      const { properties } = nextProps;
      console.log('WE GOT THE PROPERTIES!!:', properties);
      // Object.keys(properties).forEach((property) => {
      //   this.getPropertyUserPermissions(property);
      //   this.getPropertyRolePermissions(property);
      // });
    }
  }

  getEntityUserPermissions = () => {
    const { userAcls, roleAcls } = this.props;
    const { allUsersById } = this.props;
    const userPermissions = [];
    console.log('userAcls, roleAcls, allUsersById:', userAcls, roleAcls, allUsersById);

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
    this.setEntityUserPermissions(userPermissions);
  }

  setEntityUserPermissions = (permissions) => {
    const formattedPermissions = permissions.slice();

    // Format permissions for table
    formattedPermissions.forEach((permission) => {
      if (permission) {
        if (permission.permissions.length === 0) {
          permission.permissions = '-';
        } else {
          permission.permissions = permission.permissions.join(', ');
        }
      }

    });

    this.setState({ entityUserPermissions: formattedPermissions });
  }

  getRolePermissions = (set) => {
    // const { roleAcls } = this.props;
    const { roleAcls } = this.state;
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

    this.setRolePermissions(rolePermissions);
  }

  setRolePermissions = (permissions) => {
    const formattedPermissions = {};

    // Format data for table
    Object.keys(permissions).forEach((permission) => {
      formattedPermissions[permission] = permissions[permission].join(', ');
    });

    this.setState({ rolePermissions: formattedPermissions });
  }

  render() {
    return (
      <Page>
        <Page.Header>
          <Page.Title>All Permissions</Page.Title>
        </Page.Header>
        <Page.Body>
          <h3>Entity Permissions</h3>
          <UserPermissionsTable users={USERS} headers={U_HEADERS} />
          <RolePermissionsTable roles={this.state.rolePermissions} headers={R_HEADERS} />
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
