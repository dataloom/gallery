import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import Select from 'react-select';
import { PermissionsApi, PrincipalsApi } from 'loom-data';
import StringConsts from '../../../../utils/Consts/StringConsts';
import { Permission } from '../../../../core/permissions/Permission';
import ActionConsts from '../../../../utils/Consts/ActionConsts';
import { USER, ROLE, AUTHENTICATED_USER } from '../../../../utils/Consts/UserRoleConsts';
import { Table, Column, Cell } from 'fixed-data-table';
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
    .then(() => {
      this.getUserPermissions();
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

  getUserPermissions = () => {
    const { allUsersById, userAcls, roleAcls } = this.state;

    // For each user, add their permissions
    Object.keys(allUsersById).forEach((user) => {
      if (user && allUsersById[user]) {
        allUsersById[user].permissions = [];

        // Add individual permissions
        Object.keys(userAcls).forEach((permissionKey) => {
          if (userAcls[permissionKey].indexOf(user) !== -1) {
            allUsersById[user].permissions.push(permissionKey);
          }
        });

        // Add any additional permissions based on user's roles' permissions
        if (allUsersById[user].roles.length > 0) {
          Object.keys(roleAcls).forEach((permissionKey) => {
            allUsersById[user].roles.forEach((role) => {
              if (roleAcls[permissionKey].indexOf(role) !== -1 && allUsersById[user].permissions.indexOf(permissionKey) === -1) {
                allUsersById[user].permissions.push(permissionKey);
              }
            })
          });
        }
      }
    });

    this.setState({allUsersById});
  }

  getDataForTable = () => {
    const { allUsersById } = this.state;
    var tableData = [];

    Object.keys(allUsersById).forEach((user) => {
      if (user && allUsersById[user]) {
        const userObject = allUsersById[user];
        var userData = [];
        if (userObject.email && userObject.permissions && userObject.permissions.length !== 0) {
          var rolesStr = userObject.roles.join(', ');
          var permissionsStr = userObject.permissions.join(', ');
          userData.push(userObject.email, rolesStr, permissionsStr);
          tableData.push(userData);
        }
      }
    });

    return tableData;
  }


  renderTable = () => {
    const data = this.getDataForTable();
    const numRows = data.length;
    const tableHeight = () => {
      if (numRows <= 10) {
        console.log('less than 10');
        return ((numRows + 1) * 50)
      } else {
        return (500)
      }
    }

    const DataCell = ({rowIndex, col, data}) => {
      var cellData = data[rowIndex][col];

      return (
        <Cell>
          {cellData}
        </Cell>
      );
    }

    if (numRows > 0) {
      return (
        <Table
          rowHeight={50}
          rowsCount={numRows}
          width={1000}
          height={tableHeight() + 2}
          headerHeight={50}
          data={data}
          className={styles.dataTable}>
          <Column
            header={<Cell>Email</Cell>}
            data={data}
            cell={<DataCell data={data} col={0}/>}
            width={200}
          />
          <Column
            header={<Cell>Roles</Cell>}
            data={data}
            cell={<DataCell data={data} col={1}/>}
            width={500}
          />
          <Column
            header={<Cell>Permissions</Cell>}
            data={data}
            cell={<DataCell data={data} col={2}/>}
            width={300}
          />
        </Table>
      )
    } else {
      return (
        <div>No permissions granted</div>
      )
    }
  }

  getPermissionsFromView = (action, view) => {
    return (action === ActionConsts.REMOVE) ? [view.toUpperCase()] : permissionLevels[view.toLowerCase()];
  }

  updatePermissions(rawAction, principal, rawPermissions) {
    const { entitySetId } = this.state;
    const { propertyTypeId } = this.props;
    const aclKey = [entitySetId];
    if (propertyTypeId) aclKey.push(propertyTypeId);

    let action = rawAction;
    let permissions = rawPermissions;
    if (action === ActionConsts.SET && permissions.length === 0) {
      action = ActionConsts.REMOVE;
      permissions = permissionLevels.owner;
    }
    const aces = [{ principal, permissions }];
    const acl = { aclKey, aces };
    const req = { action, acl };
    PermissionsApi.updateAcl(req)
    .then(() => {
      this.loadAcls(true);
    }).catch(() => {
      this.setState({
        updateError: true
      });
    });
  }

  updateGlobalPermissions = () => {
    const optionNames = (this.props.propertyTypeId) ? Object.keys(permissionOptions) : Object.keys(accessOptions);
    const selectedPermissions = this.state.globalValue.map((name) => {
      return name.toUpperCase();
    });

    const principal = {
      type: ROLE,
      id: AUTHENTICATED_USER
    };

    this.updatePermissions(ActionConsts.SET, principal, selectedPermissions);
  }


  render() {
    return(
      <Page>
        <Page.Header>
        <Page.Title>All Permissions</Page.Title>
        </Page.Header>
        <Page.Body>
          <h3>Individual Permissions</h3>
          {this.renderTable()}
        </Page.Body>
      </Page>
    )
  }
}
