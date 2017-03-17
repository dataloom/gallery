import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import UserPermissionsTable from './UserPermissionsTable';
import RolePermissionsTable from './RolePermissionsTable';
import Page from '../../../components/page/Page';
import styles from '../styles.module.css';

const U_HEADERS = ['Users', 'Roles', 'Permissions'];
const R_HEADERS = ['Roles', 'Permissions'];

class AllPermissions extends React.Component {
  static propTypes = {
    properties: PropTypes.object.isRequired,
    userAcls: PropTypes.object.isRequired,
    roleAcls: PropTypes.object.isRequired,
    globalValue: PropTypes.array.isRequired,
    allUsersById: PropTypes.array.isRequired
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

  componentDidMount() {
    // WHEN REDUX ACTIONS ARE HOOKED UP, EASY ENOUGH TO CALL AND RELOAD ALL DATA FOR ENTITY
  }

  componentWillReceiveProps() {
    const { properties } = this.props;
    console.log('AP PROPS:', this.props);

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
    const { allUsersById } = this.props;
    const userPermissions = [];

    // For each user, add their permissions
    Object.keys(allUsersById).forEach((userId) => {
      if (userId && allUsersById[userId] && allUsersById[userId].roles.length > 1) { // TODO: ADD CONDITIONAL FOR IF ALUSERSBYID[USERID].ROLES.LENGTH > 0
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

        // if (allUsersById[userId].roles.length > 1) {
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
        // }

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

      this.setState({ propertyPermissions: propertyUserPermissions });                                  // -> REDUX
    }
    else {
      this.setState({ entityUserPermissions: formattedPermissions }, () => {                              // -> REDUX
        console.log('entityUserPermissions:', this.state.entityUserPermissions);
      });
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
      this.setState({ propertyPermissions: propertyRolePermissions });                                  // -> REDUX
    }
    else {
      this.setState({ entityRolePermissions: formattedPermissions }, () => {                              // -> REDUX
        console.log('entityRolePermissions:', this.state.entityRolePermissions);
      });
    }
  }

  renderPropertyTables() {
    const { propertyPermissions } = this.state;
    console.log('propertyPermissions', propertyPermissions);
    const tables = [];

    Object.keys(propertyPermissions).forEach((property) => {
      const { userPermissions, rolePermissions } = propertyPermissions[property];
      console.log('userPermissions, rolePermissions (by property):', propertyPermissions[property], userPermissions, rolePermissions);
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
  const permissionsSummary = state.get('permissionsSummary');

  return {
    allUsersById: permissionsSummary.get('allUsersById').toJS(),
    properties: permissionsSummary.get('properties').toJS(),
    userAcls: permissionsSummary.get('userAcls').toJS(),
    roleAcls: permissionsSummary.get('roleAcls').toJS(),
    globalValue: permissionsSummary.get('globalValue').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPermissions);
