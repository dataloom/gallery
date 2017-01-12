import React, { PropTypes } from 'react';
import Dropdown from 'react-dropdown';
import Select from 'react-select';
import { PermissionsApi, UsersApi } from 'loom-data';
import StringConsts from '../../utils/Consts/StringConsts';
import { Permission } from '../../core/permissions/Permission';
import PermissionsConsts from '../../utils/Consts/PermissionConsts';
import UserRoleConsts from '../../utils/Consts/UserRoleConsts';
import styles from './permissions.module.css';
import Utils from '../../utils/Utils';

const views = {
  GLOBAL: 0,
  ROLES: 1,
  DOMAIN: 2,
  EMAILS: 3
};

const permissionLevels = {
  hidden: [],
  discover: [Permission.DISCOVER],
  read: [Permission.DISCOVER, Permission.READ],
  write: [Permission.DISCOVER, Permission.READ, Permission.WRITE]
};

const viewLabels = {
  0: 'Everyone',
  1: 'Roles',
  2: 'My Domain',
  3: 'Emails'
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
    entitySetName: PropTypes.string,
    propertyTypeName: PropTypes.string,
    propertyTypeNamespace: PropTypes.string,
    exitPanel: PropTypes.func
  }

  constructor(props) {
    super(props);
    const options = (this.props.propertyTypeName === undefined) ?
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
      allUsersList: {},
      allRolesList: new Set(),
      loadUsersError: false
    };
  }

  componentDidMount() {
    this.loadAcls();
  }

  loadAllUsersAndRoles = () => {
    const allUsersList = {};
    const allRolesList = new Set();
    UsersApi.getAllUsers()
    .then((users) => {
      Object.keys(users).forEach((userId) => {
        const user = users[userId];
        if (user.email && user.email !== undefined) allUsersList[user.email] = userId;
        user.roles.forEach((role) => {
          if (role !== UserRoleConsts.DEFAULT_USER_ROLE) allRolesList.add(role);
        });
      });
      this.setState({
        allUsersList,
        allRolesList,
        loadUsersError: false
      });
    }).catch(() => {
      this.setState({ loadUsersError: true });
    });
  }

  getPermission(permissions) {
    if (permissions.includes(permissionOptions.Write.toUpperCase())) return permissionOptions.Write;
    if (permissions.includes(permissionOptions.Read.toUpperCase())) return permissionOptions.Read;
    return permissionOptions.Discover;
  }

  updateStateAcls = (acls, updateSuccess) => {
    let globalValue = accessOptions[0];
    const roleAcls = { Discover: [], Read: [], Write: [] };
    const userAcls = { Discover: [], Read: [], Write: [] };
    acls.forEach((acl) => {
      if (acl.principal.type === UserRoleConsts.ROLE) {
        if (acl.principal.name === UserRoleConsts.DEFAULT_USER_ROLE) {
          globalValue = this.getPermission(acl.permissions);
        }
        else {
          roleAcls[this.getPermission(acl.permissions)].push(acl.principal.name);
        }
      }
      else {
        userAcls[this.getPermission(acl.permissions)].push(acl.principal.name);
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
    const { propertyTypeName, propertyTypeNamespace, entitySetName } = this.props;
    this.loadAllUsersAndRoles();
    if (propertyTypeName) {
      const fqn = Utils.getFqnObj(propertyTypeNamespace, propertyTypeName);
      PermissionsApi.getOwnerAclsForPropertyTypeInEntitySet(entitySetName, fqn)
      .then((acls) => {
        this.updateStateAcls(acls, updateSuccess);
      }).catch(() => {
        this.setState({
          updateError: true
        });
      });
    }
    else {
      PermissionsApi.getOwnerAclsForEntitySet(entitySetName)
      .then((acls) => {
        this.updateStateAcls(acls, updateSuccess);
      }).catch(() => {
        this.setState({ updateError: true });
      });
    }
  }

  shouldShowSuccess = {
    true: styles.updateSuccess,
    false: styles.hidden
  }

  shouldShowError = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  getTitleText = () => {
    const { propertyTypeName, propertyTypeNamespace, entitySetName } = this.props;
    if (propertyTypeName) {
      return `property type: ${propertyTypeNamespace}.${propertyTypeName}`;
    }
    return `entity set: ${entitySetName}`;
  }

  switchView = (view) => {
    this.setState({
      view,
      updateSuccess: false,
      updateError: false
    });
  }

  getClassName = (view) => {
    return (view === this.state.view) ? `${styles.buttonStyle} ${styles.selectedButtonStyle}` : styles.buttonStyle;
  }

  getPanelViewContents = () => {
    switch (this.state.view) {
      case views.GLOBAL:
        return this.getGlobalView();
      case views.ROLES:
        return this.getRolesView();
      case views.DOMAIN:
        return this.getDomainView();
      case views.EMAILS:
        return this.getEmailsView();
      default:
        return this.getGlobalView();
    }
  }

  updatePermissions(action, principal, view) {
    const { entitySetName, propertyTypeName, propertyTypeNamespace } = this.props;
    const name = entitySetName;
    const permissions = (action === PermissionsConsts.REMOVE) ?
      [view.toUpperCase()] : permissionLevels[view.toLowerCase()];
    const updateFn = (propertyTypeName) ?
      PermissionsApi.updateAclsForPropertyTypesInEntitySets : PermissionsApi.updateAclsForEntitySets;
    const req = { principal, action, name, permissions };
    if (propertyTypeName) req.property = Utils.getFqnObj(propertyTypeNamespace, propertyTypeName);
    updateFn([req])
    .then(() => {
      this.loadAcls(true);
    }).catch(() => {
      this.setState({
        updateError: true
      });
    });
  }

  updateGlobalPermissions = () => {
    this.updateRoles(PermissionsConsts.SET, UserRoleConsts.DEFAULT_USER_ROLE, this.state.globalValue);
  }

  updateDropdownValue = (e) => {
    this.setState({ globalValue: e.value });
  }

  buttonStyle = (view, viewState) => {
    return (view === viewState) ? `${styles.buttonStyle} ${styles.selectedButtonStyle}` : styles.buttonStyle;
  }

  getGlobalView = () => {
    const options = (this.props.propertyTypeName === undefined) ?
      Object.keys(accessOptions) : Object.keys(permissionOptions);
    return (
      <div className={styles.viewWrapper}>
        <div className={this.shouldShowError[this.state.loadUsersError]}>Unable to load permissions.</div>
        <div>Choose the default permissions for everyone:</div>
        <div className={styles.spacerSmall} />
        <div className={styles.dropdownWrapper}>
          <Dropdown
            options={options}
            onChange={this.updateDropdownValue}
            value={this.state.globalValue}
          />
        </div>
        <div className={styles.spacerSmall} />
        <button
          onClick={() => {
            this.updateGlobalPermissions();
          }}
          className={styles.simpleButton}
        >Save changes</button>
      </div>
    );
  }

  changeRolesView = (newView) => {
    this.setState({ rolesView: newView });
  }

  updateRoles = (action, role, view) => {
    const principal = {
      type: UserRoleConsts.ROLE,
      name: role
    };
    this.updatePermissions(action, principal, view);
  }

  handleNewRoleChange = (e) => {
    const newRoleValue = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.setState({ newRoleValue });
  }

  viewPermissionTypeButton = (permission, fn, currView) => {
    if (permission === accessOptions.Hidden && this.props.propertyTypeName !== undefined) return null;
    return (
      <button
        onClick={() => {
          fn(permission);
        }}
        className={this.buttonStyle(permission, currView)}
      >{permission}</button>
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
                this.updateRoles(PermissionsConsts.REMOVE, role, rolesView);
              }}
              className={styles.deleteButton}
            >-</button>
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
            className={`${styles.inputBox} ${styles.permissionInputWidth}`}
          />
          <button
            className={`${styles.simpleButton} ${styles.spacerMargin}`}
            onClick={() => {
              this.updateRoles(PermissionsConsts.SET, newRoleValue, rolesView);
            }}
          >Save</button>
        </div>
      </div>
    );
  }

  getDomainView = () => {
    const options = (this.props.propertyTypeName === undefined) ?
      Object.keys(accessOptions) : Object.keys(permissionOptions);
    return (
      <div className={styles.viewWrapper}>
        <div>Choose the default permissions for all users in your domain:</div>
        <div className={styles.spacerSmall} />
        <div className={styles.dropdownWrapper}>
          <Dropdown
            options={options}
            onChange={this.onSelect}
            value={options[0]}
          />
        </div>
        <div className={styles.spacerSmall} />
        <button
          onClick={() => {
            this.updateGlobalPermissions(views.DOMAIN);
          }}
          className={styles.simpleButton}
        >Save changes</button>
      </div>
    );
  }

  changeEmailsView = (newView) => {
    this.setState({ emailsView: newView });
  }

  updateEmails = (action, email, view) => {
    const principal = {
      type: UserRoleConsts.USER,
      id: this.state.allUsersList[email]
    };
    this.updatePermissions(action, principal, view);
  }

  handleNewEmailChange = (e) => {
    const newEmailValue = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.setState({ newEmailValue });
  }

  getEmailOptions = (emailList) => {
    const emailOptions = [];
    const emailOptionList = Object.keys(this.state.allUsersList);
    emailList.forEach((email) => {
      if (emailOptionList.includes(email)) {
        const index = emailOptionList.indexOf(email);
        emailOptionList.splice(index, 1);
      }
    });
    emailOptionList.forEach((email) => {
      emailOptions.push({ value: email, label: email });
    });
    return emailOptions;
  }

  getEmailsView = () => {
    const { userAcls, emailsView, newEmailValue } = this.state;
    const emailList = userAcls[emailsView];
    const emailOptions = this.getEmailOptions(emailList);
    const hiddenBody = emailList.map((email) => {
      return (
        <div className={styles.tableRows} key={emailList.indexOf(email)}>
          <div className={styles.inline}>
            <button
              onClick={() => {
                this.updateEmails(PermissionsConsts.REMOVE, email, emailsView);
              }}
              className={styles.deleteButton}
            >-</button>
          </div>
          <div className={`${styles.inline} ${styles.padLeft}`}>{email}</div>
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
          {hiddenBody}
        </div>
        <div className={styles.inline}>
          <Select
            value={newEmailValue}
            options={emailOptions}
            onChange={this.handleNewEmailChange}
            className={`${styles.inputBox} ${styles.permissionInputWidth}`}
          />
          <button
            className={`${styles.simpleButton} ${styles.spacerMargin}`}
            onClick={() => {
              this.updateEmails(PermissionsConsts.SET, newEmailValue, emailsView);
            }}
          >Save</button>
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
        className={this.getClassName(view)}
      >{viewLabels[view]}</button>
    );
  }

  render() {
    return (
      <div className={styles.panelContainer}>
        <div className={styles.panelTitle}>Set permissions for {this.getTitleText()}</div>
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
        <button className={styles.cancelButton} onClick={this.props.exitPanel}>x</button>
      </div>
    );
  }
}

export default PermissionsPanel;
