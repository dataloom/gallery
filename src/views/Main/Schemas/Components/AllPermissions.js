import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import Select from 'react-select';
import { PermissionsApi, PrincipalsApi } from 'loom-data';
import StringConsts from '../../../../utils/Consts/StringConsts';
import { Permission } from '../../../../core/permissions/Permission';
import ActionConsts from '../../../../utils/Consts/ActionConsts';
import { USER, ROLE, AUTHENTICATED_USER } from '../../../../utils/Consts/UserRoleConsts';
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
  }

  componentDidMount() {
    this.loadAcls(false, this.getUserPermissions);
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
      this.setState({
        allUsersById,
        allRolesList,
        loadUsersError: false
      }, () => {console.log('ALL USERS, ALL ROLES:', this.state.allUsersById, this.state.allRolesList)});
    }).catch(() => {
      this.setState({ loadUsersError: true });
    });
  }

  getUserPermissions() {

    // for each userbyid
      // add permissions array: users[userId].permissions = [];
    //for each userAcl key, if there's a match, push userAcl key to permissions array;

    //setstate
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
    }, () => {console.log('USERACLS, ROLESACLS:', this.state.userAcls, this.state.roleAcls)});
  }

  loadAcls = (updateSuccess, cb) => {
    const { entitySetId } = this.state;
    const { propertyTypeId } = this.props;
    // const { propertyTypeId, entitySetId } = this.props;
    const aclKey = [entitySetId];
    if (propertyTypeId) aclKey.push(propertyTypeId);
    this.loadAllUsersAndRoles();
    // HERE IT CAN PERFORM LOGIC FOR BOTH ENTITY AND PROPERTY -> ADD METHODS TO 1. CREATE LIST OF ALL PROPERTIES AND 2. ADD PROPERTY ACES -> PASS INTO ALLPERMISSIONS
    PermissionsApi.getAcl(aclKey)
    .then((acls) => {
      console.log('ACLS:', acls);
      this.updateStateAcls(acls.aces, updateSuccess);
    }).catch(() => {
      this.setState({ updateError: true });
    });

    cb();
  }

  shouldShowSuccess = {
    true: styles.updateSuccess,
    false: styles.hidden
  }

  shouldShowError = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  switchView = (view) => {
    this.setState({
      view,
      updateSuccess: false,
      updateError: false
    });
  }

  getSelectedClassName = (view) => {
    return (view === this.state.view) ? `${styles.edmNavbarButton} ${styles.edmNavbarButtonSelected}` : styles.edmNavbarButton;
  }

  getFirstLastClassName = (order) => {
    var firstLastClassName;
    if (order) {
      if (order === 'first') {
        firstLastClassName = styles.firstEdmButton;
      } else if (order === 'last') {
        firstLastClassName = styles.lastEdmButton;
      };

      return firstLastClassName;
    }

    return null;
  }

  getClassName = (view, order) => {
    var selectedClassName = this.getSelectedClassName(view);
    var firstLastClassName = this.getFirstLastClassName(order);

    return `${selectedClassName} ${firstLastClassName}`;
  }

  getPanelViewContents = () => {
    switch (this.state.view) {
      case views.ROLES:
        return this.getRolesView();
      case views.EMAILS:
        return this.getEmailsView();
      case views.GLOBAL:
      default:
        return this.getGlobalView();
    }
  }

  getPermissionsFromView = (action, view) => {
    return (action === ActionConsts.REMOVE) ? [view.toUpperCase()] : permissionLevels[view.toLowerCase()];
  }

  updatePermissions(rawAction, principal, rawPermissions) {
    const { entitySetId } = this.state;
    const { propertyTypeId } = this.props;
    // const { propertyTypeId, entitySetId } = this.props;
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

  updateDropdownValue = (e) => {
    this.setState({ globalValue: e.value });
  }

  buttonStyle = (view, viewState, order) => {
    var buttonSelectedStyle = this.buttonSelectedStyle(view, viewState);
    var buttonFirstLastStyle = this.buttonFirstLastStyle(order);

    return `${buttonSelectedStyle} ${buttonFirstLastStyle}`;
  }

  buttonSelectedStyle = (view, viewState) => {
    return (view === viewState) ? `${styles.edmNavbarButton} ${styles.edmNavbarButtonSelected}` : styles.edmNavbarButton;
  }

  buttonFirstLastStyle = (order) => {
    var firstLastClassName;
    if (order) {
      if (order === 'first') {
        firstLastClassName = styles.firstEdmButton;
      } else if (order === 'last') {
        firstLastClassName = styles.lastEdmButton;
      };

      return firstLastClassName;
    }

    return null;
  }

  updateGlobalPermissionState = (permission, checked) => {
    const globalValue = this.state.globalValue.filter(permissionOption => permissionOption !== permission);
    if (checked) globalValue.push(permission);
    this.setState({ globalValue });
  }

  getGlobalView = () => {
    const optionNames = (this.props.propertyTypeId) ? Object.keys(permissionOptions) : Object.keys(accessOptions);
    const options = optionNames
      .filter(name => name !== accessOptions.Owner && name !== accessOptions.Write && name !== accessOptions.Hidden)
      .map((option) => {
        const checkboxName = `global-${option}`;
        return (
          <div key={option}>
            <label htmlFor={checkboxName} className={styles.globalLabel}>{option}</label>
            <input
                id={checkboxName}
                type="checkbox"
                checked={this.state.globalValue.includes(option)}
                onChange={(e) => {
                  this.updateGlobalPermissionState(option, e.target.checked);
                }} />
          </div>
        );
      });
    return (
      <div>
        <div className={this.shouldShowError[this.state.loadUsersError]}>Unable to load permissions.</div>
        <div>Choose the default permissions for all authenticated users:</div>
        <div className={styles.spacerSmall} />
        <div className={styles.dropdownWrapper}>
          {options}
        </div>
        <div className={styles.spacerSmall} />
        <Button
            bsStyle="primary"
            onClick={this.updateGlobalPermissions}>Save changes</Button>
      </div>
    );
  }

  changeRolesView = (newView) => {
    this.setState({ rolesView: newView });
  }

  updateRoles = (action, role, view) => {
    const principal = {
      type: ROLE,
      id: role
    };

    // Only if changes were made, save changes
    if (role) {
      const permissions = this.getPermissionsFromView(action, view);
      this.updatePermissions(action, principal, permissions);
    }
  }

  handleNewRoleChange = (e) => {
    const newRoleValue = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.setState({ newRoleValue });
  }

  viewPermissionTypeButton = (permission, fn, currView, order) => {
    if (permission === accessOptions.Hidden && this.props.propertyTypeId !== undefined) return null;
    return (
      <button
          onClick={() => {
            fn(permission);
          }}
          className={this.buttonStyle(permission, currView, order)}>
        <div className={styles.edmNavItemText}>{permission}</div>
      </button>
    );
  }

  getRoleOptions = (roleList) => {
    const roleOptionsSet = this.state.allRolesList;
    const roleOptions = [];
    roleList.forEach((role) => {
      roleOptionsSet.delete(role);
    });
    roleOptionsSet.forEach((role) => {
      roleOptions.push({ value: role, label: role });
    });
    return roleOptions;
  }

  getRolesView = () => {
    const { roleAcls, rolesView, newRoleValue } = this.state;
    const roleList = roleAcls[rolesView];
    const roleOptions = this.getRoleOptions(roleList);
    const hiddenBody = roleList.map((role) => {
      return (
        <div className={styles.tableRows} key={roleList.indexOf(role)}>
          <div className={styles.inline}>
            <button
                onClick={() => {
                  this.updateRoles(ActionConsts.REMOVE, role, rolesView);
                }}
                className={styles.deleteButton}>-</button>
          </div>
          <div className={`${styles.inline} ${styles.padLeft}`}>{role}</div>
        </div>
      );
    });
    return (
      <div>
        <div className={this.shouldShowError[this.state.loadUsersError]}>Unable to load roles.</div>
        <div>Choose default permissions for specific roles.</div>
        <div className={`${styles.inline} ${styles.padTop}`}>
          {this.viewPermissionTypeButton(accessOptions.Write, this.changeRolesView, rolesView, orders.FIRST)}
          {this.viewPermissionTypeButton(accessOptions.Read, this.changeRolesView, rolesView)}
          {this.viewPermissionTypeButton(accessOptions.Link, this.changeRolesView, rolesView)}
          {this.viewPermissionTypeButton(accessOptions.Discover, this.changeRolesView, rolesView, orders.LAST)}
        </div>
        <div className={styles.permissionsBodyContainer}>
          {hiddenBody}
        </div>
        <div className={styles.inline}>
          <Select
              value={newRoleValue}
              options={roleOptions}
              onChange={this.handleNewRoleChange}
              className={`${styles.inputBox} ${styles.permissionInputWidth}`} />
            <Button
              bsStyle="primary"
              className={`${styles.spacerMargin}`}
              onClick={() => {
                this.updateRoles(ActionConsts.SET, newRoleValue, rolesView);
              }}>Save</Button>
        </div>
      </div>
    );
  }

  changeEmailsView = (newView) => {
    this.setState({ emailsView: newView });
  }

  updateEmails = (action, userId, view) => {
    const principal = {
      type: USER,
      id: userId
    };
    const permissions = this.getPermissionsFromView(action, view);
    this.updatePermissions(action, principal, permissions);
  }

  handleNewEmailChange = (e) => {
    const newEmailValue = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.setState({ newEmailValue });
  }

  getEmailOptions = (userIdList) => {
    const emailOptions = [];
    Object.keys(this.state.allUsersById).forEach((id) => {
      if (!userIdList.includes(id) && this.state.allUsersById[id] && this.state.allUsersById[id].email) {
        emailOptions.push({ label: this.state.allUsersById[id].email, value: id });
      }
    });
    return emailOptions;
  }

  getEmailsView = () => {
    const { userAcls, emailsView, newEmailValue } = this.state;
    const userIdList = userAcls[emailsView].filter((userId) => {
      return (this.state.allUsersById[userId] && this.state.allUsersById[userId].email);
    });

    const emailOptions = this.getEmailOptions(userIdList);
    const emailListBody = userIdList.map((userId) => {
      return (
        <div className={styles.tableRows} key={userId}>
          <div className={styles.inline}>
            <button
                onClick={() => {
                  this.updateEmails(ActionConsts.REMOVE, userId, emailsView);
                }}
                className={styles.deleteButton}>-</button>
          </div>
          <div className={`${styles.inline} ${styles.padLeft}`}>{this.state.allUsersById[userId].email}</div>
        </div>
      );
    });

    return (
      <div>
        <div className={this.shouldShowError[this.state.loadUsersError]}>Unable to load users.</div>
        <div>Choose permissions for specific users.</div>
        <div className={`${styles.padTop} ${styles.inline}`}>
          {this.viewPermissionTypeButton(accessOptions.Owner, this.changeEmailsView, emailsView, orders.FIRST)}
          {this.viewPermissionTypeButton(accessOptions.Write, this.changeEmailsView, emailsView)}
          {this.viewPermissionTypeButton(accessOptions.Read, this.changeEmailsView, emailsView)}
          {this.viewPermissionTypeButton(accessOptions.Link, this.changeEmailsView, emailsView)}
          {this.viewPermissionTypeButton(accessOptions.Discover, this.changeEmailsView, emailsView, orders.LAST)}
        </div>
        <div className={styles.permissionsBodyContainer}>
          {emailListBody}
        </div>
        <div className={styles.inline}>
          <Select
              value={newEmailValue}
              options={emailOptions}
              onChange={this.handleNewEmailChange}
              className={`${styles.inputBox} ${styles.permissionInputWidth}`} />
            <Button
              bsStyle="primary"
              className={`${styles.spacerMargin}`}
              onClick={() => {
                this.updateEmails(ActionConsts.SET, newEmailValue, emailsView);
              }}>Save</Button>
        </div>
      </div>
    );
  }

  renderViewButton = (view, order) => {
    return (
      <button
          onClick={() => {
            this.switchView(view);
          }}
          className={this.getClassName(view, order)}>
        <div className={styles.edmNavItemText}>{viewLabels[view]}</div>
      </button>
    );
  }

  render() {
    return(
      <div>AllPermissions</div>
    )
  }
}
