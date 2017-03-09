import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import Select from 'react-select';
import { PermissionsApi, PrincipalsApi } from 'loom-data';
import StringConsts from '../../../../utils/Consts/StringConsts';
import { Permission } from '../../../../core/permissions/Permission';
import ActionConsts from '../../../../utils/Consts/ActionConsts';
import { USER, ROLE, AUTHENTICATED_USER } from '../../../../utils/Consts/UserRoleConsts';
import UserPermissionsTable from './UserPermissionsTable';
import RolePermissionsTable from './RolePermissionsTable';
import Page from '../../../../components/page/Page';
import PageConsts from '../../../../utils/Consts/PageConsts';
import styles from '../styles.module.css';

const views = {
  GLOBAL: 0,
  ROLES: 1,
  EMAILS: 2
};

const orders = {
  FIRST: 'first',
  LAST: 'last'
}

const permissionLevels = {
  hidden: [],
  discover: [Permission.DISCOVER.name],
  link: [Permission.DISCOVER.name, Permission.LINK.name],
  read: [Permission.DISCOVER.name, Permission.READ.name],
  write: [Permission.DISCOVER.name, Permission.WRITE.name],
  owner: [Permission.DISCOVER.name, Permission.LINK.name, Permission.READ.name, Permission.WRITE.name, Permission.OWNER.name]
};

const viewLabels = {
  0: 'Everyone',
  1: 'Roles',
  2: 'Emails'
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

var U_HEADERS = ['Emails', 'Roles', 'Entity Permissions', 'Property A permissions', 'Property B Permissions' ];

var USERS = [{
  id: 0,
  email: 'corwin@thedataloom.com',
  role: '(all)',
  entityPermissions: 'Read, Write, Discover, Link',
  propertyAPermissions: 'Read, Write',
  propertyBPermissions: '-',
  expand: [{
    role: 'admin',
    entityPermissions: 'Read, Write, Discover, Link',
    propertyAPermissions: 'Read, Write',
    propertyBPermissions: '-'
  }, {
    role: 'xyz',
    entityPermissions: 'Read, Write',
    propertyAPermissions: 'Read, Write',
    propertyBPermissions: 'Read, Write'
  }]
}, {
  id: 1,
  email: 'matthew@thedataloom.com',
  role: '(all)',
  entityPermissions: ['read', 'write'],
  propertyAPermissions: ['read'],
  propertyBPermissions: ['read'],
  expand: [{
    role: 'role',
    entityPermissions: ['read', 'write', 'discover', 'link'],
    propertyAPermissions: ['read', 'write'],
    propertyBPermissions: []
  }]
}, {
  id: 2,
  email: 'katherine@thedataloom.com',
  role: '(all)',
  entityPermissions: ['read'],
  propertyAPermissions: ['read'],
  propertyBPermissions: ['read'],
  expand: [{
    role: 'role',
    entityPermissions: ['read', 'write', 'discover', 'link'],
    propertyAPermissions: ['read', 'write'],
    propertyBPermissions: []
  }]
}];

var R_HEADERS = ['Roles', 'Permissions'];

var ROLES = {
  admin: 'Read, Write',
  owner: 'All the things'
};


export default class AllPermissions extends React.Component {
  static propTypes = {
    entitySetId: PropTypes.string,
    propertyTypeId: PropTypes.string,
  }

  constructor(props) {
    super(props);
    const options = (this.props.propertyTypeId === undefined) ?
      Object.keys(accessOptions) : Object.keys(permissionOptions);
    this.state = {
      view: views.GLOBAL,
      updateSuccess: false,
      updateError: false,
      globalValue: [],
      roleAcls: { Discover: [], Link: [], Read: [], Write: [] },
      userAcls: { Discover: [], Link: [], Read: [], Write: [], Owner: [] },
      rolesView: accessOptions.Write,
      emailsView: accessOptions.Write,
      newRoleValue: '',
      newEmailValue: '',
      allUsersById: {},
      allRolesList: new Set(),
      loadUsersError: false,
      entitySetId: JSON.parse(localStorage.entitySet).id,
      propertyTypeIds: JSON.parse(localStorage.propertyTypeIds)
    };

    this.getUserPermissions = this.getUserPermissions.bind(this);
  }

  componentDidMount() {
    // this.getUserPermissions();
    // this.getRolePermissions();

    this.loadAcls(false);
  }

  loadAllUsersAndRoles = () => {
    let allUsersById = {};
    const allRolesList = new Set();
    const myId = JSON.parse(localStorage.profile).user_id;
    PrincipalsApi.getAllUsers()
    .then((users) => {
      allUsersById = users;
      Object.keys(users).forEach((userId) => {
        users[userId].roles.forEach((role) => {
          if (role !== AUTHENTICATED_USER) allRolesList.add(role);
        });
      });
      allUsersById[myId] = null;

      return new Promise((resolve, reject) => {
        this.setState(
          {
            allUsersById,
            allRolesList,
            loadUsersError: false
          },
          () => {
            resolve(this.state.allUsersById);
          }
        );
      });
    })
    ///////////TODO: REMOVE ONCE THIS LOGIC IS ON ESDC: CAN CALL ONCE ALLPERMISSIONS IS MOUNTED AND PROPS PASSED IN
    .then(() => {
      this.getUserPermissions();
      this.getRolePermissions();
    })
    .catch(() => {
      this.setState({ loadUsersError: true });
    });
  }

  getPermission = (permissions) => {
    const newPermissions = [];
    if (permissions.includes(permissionOptions.Owner.toUpperCase())) return [permissionOptions.Owner];
    if (permissions.includes(permissionOptions.Write.toUpperCase())) newPermissions.push(permissionOptions.Write);
    if (permissions.includes(permissionOptions.Read.toUpperCase())) newPermissions.push(permissionOptions.Read);
    if (permissions.includes(permissionOptions.Link.toUpperCase())) newPermissions.push(permissionOptions.Link);
    if (permissions.includes(permissionOptions.Discover.toUpperCase())) newPermissions.push(permissionOptions.Discover);
    return newPermissions;
  }

  updateStateAcls = (aces, updateSuccess) => {
    let globalValue = [];
    const roleAcls = { Discover: [], Link: [], Read: [], Write: [] };
    const userAcls = { Discover: [], Link: [], Read: [], Write: [], Owner: [] };
    aces.forEach((ace) => {
      if (ace.permissions.length > 0) {
        if (ace.principal.type === ROLE) {
          if (ace.principal.id === AUTHENTICATED_USER) {
            globalValue = this.getPermission(ace.permissions);
          }
          else {
            this.getPermission(ace.permissions).forEach((permission) => {
              roleAcls[permission].push(ace.principal.id);
            });
          }
        }
        else {
          this.getPermission(ace.permissions).forEach((permission) => {
            userAcls[permission].push(ace.principal.id);
          });
        }
      }
    });
    this.setState({
      globalValue,
      roleAcls,
      userAcls,
      updateSuccess,
      newRoleValue: '',
      newEmailValue: '',
      updateError: false
    });
  }

  loadAcls = (updateSuccess) => {
    const { entitySetId } = this.state;
    const { propertyTypeId } = this.props;
    const aclKey = [entitySetId];
    if (propertyTypeId) aclKey.push(propertyTypeId);
    this.loadAllUsersAndRoles();
    // HERE IT CAN PERFORM LOGIC FOR BOTH ENTITY AND PROPERTY -> ADD METHODS TO 1. CREATE LIST OF ALL PROPERTIES AND 2. ADD PROPERTY ACES -> PASS INTO ALLPERMISSIONS
    PermissionsApi.getAcl(aclKey)
    .then((acls) => {
      this.updateStateAcls(acls.aces, updateSuccess);
    })
    .catch(() => {
      this.setState({ updateError: true });
    });
  }



///////////////// LOGIC FOR ALLPERMISSIONS ////////////////////////
  getUserPermissions = () => {
    // const { allUsersById, userAcls, roleAcls } = this.props;
    const { allUsersById, userAcls, roleAcls } = this.state;
    var userPermissions = [];

    // For each user, add their permissions
    Object.keys(allUsersById).forEach((userId) => {
      if (userId && allUsersById[userId]) {
        var user = {
          id: userId,
          email: allUsersById[userId].email,
          role: '(all)',
          entityPermissions: [],
          propertyPermissions: [],
          expand: []
        };

        // TODO: FOR EACH PROPERTY, ADD PROPERTY KEY + VALUES (PERMISSIONS);

        // Add individual permissions
        Object.keys(userAcls).forEach((permissionKey) => {
          if (userAcls[permissionKey].indexOf(userId) !== -1) {
            user.entityPermissions.push(permissionKey);
          }
        });

        // Add any additional permissions based on user's roles' permissions
        //TODO: CHECK WHY MORE PERMISSIONS ARE SHOWING UP THAN THE ENTITY ITSELF HAS... IS IT PULLING ALL PERMISSIONS ACROSS ENTITY SETS?
        if (allUsersById[userId].roles.length > 0) {
          Object.keys(roleAcls).forEach((permissionKey) => {
            allUsersById[userId].roles.forEach((role) => {
              if (roleAcls[permissionKey].indexOf(role) !== -1 && user.entityPermissions.indexOf(permissionKey) === -1) {
                user.entityPermissions.push(permissionKey);
              }
            })
          });
        }

        userPermissions.push(user);
      }
    });

    this.setUserPermissions(userPermissions);
  }

  setUserPermissions = (permissions) => {
    var formattedPermissions = permissions.slice();

    // Format permissions for table
    formattedPermissions.forEach((permission) => {
      if (permission) {
        if (permission.entityPermissions.length === 0) {
          permission.entityPermissions = '-';
        } else {
          permission.entityPermissions = permission.entityPermissions.join(', ');
        }
      }

    });

    this.setState({userPermissions: formattedPermissions});
  }

  getRolePermissions = () => {
    // const { roleAcls } = this.props;
    const { roleAcls } = this.state;
    var rolePermissions = {};

    // Get all roles and their respective permissions
    Object.keys(roleAcls).forEach((permission) => {
      roleAcls[permission].forEach((role) => {
        if (!rolePermissions.hasOwnProperty(role)) {
          rolePermissions[role] = [];
        }

        if (rolePermissions[role].indexOf(permission) === -1) {
          rolePermissions[role].push(permission);
        }
      })
    });

    this.setRolePermissions(rolePermissions);
  }

  setRolePermissions = (permissions) => {
    var formattedPermissions = {};

    // Format data for table
    Object.keys(permissions).forEach((permission) => {
      formattedPermissions[permission] = permissions[permission].join(', ');
    });

    this.setState({rolePermissions: formattedPermissions});
  }

  render() {
    return(
      <Page>
        <Page.Header>
        <Page.Title>All Permissions</Page.Title>
        </Page.Header>
        <Page.Body>
          <h3>Individual Permissions</h3>
          <UserPermissionsTable users={USERS} headers={U_HEADERS} />
          <h3>Role Permissions</h3>
          <RolePermissionsTable roles={this.state.rolePermissions} headers={R_HEADERS} />
        </Page.Body>
      </Page>
    )
  }
}
