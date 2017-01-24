import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
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

const permissionLevels = {
  hidden: [],
  discover: [Permission.DISCOVER.name],
  read: [Permission.DISCOVER.name, Permission.READ.name],
  write: [Permission.DISCOVER.name, Permission.READ.name, Permission.WRITE.name]
};

const viewLabels = {
  0: 'Everyone',
  1: 'Roles',
  2: 'Emails'
};

const accessOptions = {
  Hidden: 'Hidden',
  Discover: 'Discover',
  Read: 'Read',
  Write: 'Write'
};

const permissionOptions = {
  Discover: 'Discover',
  Read: 'Read',
  Write: 'Write'
};

export class PermissionsPanel extends React.Component {
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
      globalValue: options[0],
      roleAcls: { Discover: [], Read: [], Write: [] },
      userAcls: { Discover: [], Read: [], Write: [] },
      rolesView: accessOptions.Write,
      emailsView: accessOptions.Write,
      newRoleValue: '',
      newEmailValue: '',
      allUsersById: {},
      allRolesList: new Set(),
      loadUsersError: false
    };
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
      this.setState({
        allUsersById,
        allRolesList,
        loadUsersError: false
      });
    }).catch(() => {
      this.setState({ loadUsersError: true });
    });
  }

  getPermission = (permissions) => {
    if (permissions.includes(permissionOptions.Write.toUpperCase())) return permissionOptions.Write;
    if (permissions.includes(permissionOptions.Read.toUpperCase())) return permissionOptions.Read;
    return permissionOptions.Discover;
  }

  updateStateAcls = (aces, updateSuccess) => {
    let globalValue = accessOptions[0];
    const roleAcls = { Discover: [], Read: [], Write: [] };
    const userAcls = { Discover: [], Read: [], Write: [] };
    aces.forEach((ace) => {
      if (ace.permissions.length > 0) {
        if (ace.principal.type === ROLE) {
          if (ace.principal.id === AUTHENTICATED_USER) {
            globalValue = this.getPermission(ace.permissions);
          }
          else {
            roleAcls[this.getPermission(ace.permissions)].push(ace.principal.id);
          }
        }
        else {
          userAcls[this.getPermission(ace.permissions)].push(ace.principal.id);
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
    const { propertyTypeId, entitySetId } = this.props;
    const aclKey = [entitySetId];
    if (propertyTypeId) aclKey.push(propertyTypeId);
    this.loadAllUsersAndRoles();
    PermissionsApi.getAcl(aclKey)
    .then((acls) => {
      this.updateStateAcls(acls.aces, updateSuccess);
    }).catch(() => {
      this.setState({ updateError: true });
    });
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

  getClassName = (view) => {
    return (view === this.state.view) ? `${styles.edmNavbarButton} ${styles.edmNavbarButtonSelected}` : styles.edmNavbarButton;
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

  updatePermissions(action, principal, view) {
    const { entitySetId, propertyTypeId } = this.props;
    const permissions = (action === ActionConsts.REMOVE) ?
      [view.toUpperCase()] : permissionLevels[view.toLowerCase()];
    const aclKey = [entitySetId];
    if (propertyTypeId) aclKey.push(propertyTypeId);
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
    this.updateRoles(ActionConsts.SET, AUTHENTICATED_USER, this.state.globalValue);
  }

  updateDropdownValue = (e) => {
    this.setState({ globalValue: e.value });
  }

  buttonStyle = (view, viewState) => {
    return (view === viewState) ? `${styles.edmNavbarButton} ${styles.edmNavbarButtonSelected}` : styles.edmNavbarButton;
  }

  getGlobalView = () => {
    const optionNames = (this.props.propertyTypeId === undefined) ?
      Object.keys(accessOptions) : Object.keys(permissionOptions);
    const options = optionNames.map((name) => {
      return {
        value: name,
        label: name
      };
    });
    return (
      <div>
        <div className={this.shouldShowError[this.state.loadUsersError]}>Unable to load permissions.</div>
        <div>Choose the default permissions for all authenticated users:</div>
        <div className={styles.spacerSmall} />
        <div className={styles.dropdownWrapper}>
          <Select
              options={options}
              onChange={this.updateDropdownValue}
              value={this.state.globalValue} />
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
    this.updatePermissions(action, principal, view);
  }

  handleNewRoleChange = (e) => {
    const newRoleValue = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.setState({ newRoleValue });
  }

  viewPermissionTypeButton = (permission, fn, currView) => {
    if (permission === accessOptions.Hidden && this.props.propertyTypeId !== undefined) return null;
    return (
      <button
          onClick={() => {
            fn(permission);
          }}
          className={this.buttonStyle(permission, currView)}>
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
          {this.viewPermissionTypeButton(accessOptions.Write, this.changeRolesView, rolesView)}
          {this.viewPermissionTypeButton(accessOptions.Read, this.changeRolesView, rolesView)}
          {this.viewPermissionTypeButton(accessOptions.Discover, this.changeRolesView, rolesView)}
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
    this.updatePermissions(action, principal, view);
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
          {this.viewPermissionTypeButton(accessOptions.Write, this.changeEmailsView, emailsView)}
          {this.viewPermissionTypeButton(accessOptions.Read, this.changeEmailsView, emailsView)}
          {this.viewPermissionTypeButton(accessOptions.Discover, this.changeEmailsView, emailsView)}
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

  renderViewButton = (view) => {
    return (
      <button
          onClick={() => {
            this.switchView(view);
          }}
          className={this.getClassName(view)}>
        <div className={styles.edmNavItemText}>{viewLabels[view]}</div>
      </button>
    );
  }

  render() {
    return (
      <div>
        <div className={styles.edmNavbarContainer}>
          <div className={styles.edmNavbar}>
            {this.renderViewButton(views.GLOBAL)}
            {this.renderViewButton(views.ROLES)}
            {this.renderViewButton(views.EMAILS)}
          </div>
        </div>
        <div className={styles.panelContents}>{this.getPanelViewContents()}</div>
        <div className={this.shouldShowSuccess[this.state.updateSuccess]}>
          Your changes have been saved.
        </div>
        <div className={this.shouldShowError[this.state.updateError]}>
          Unable to save changes.
        </div>
      </div>
    );
  }
}

export default PermissionsPanel;
