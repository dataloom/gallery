import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
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

const orders = {
  FIRST: 'first',
  LAST: 'last'
};

const permissionLevels = {
  hidden: [],
  discover: [Permission.DISCOVER.name],
  link: [Permission.LINK.name],
  read: [Permission.READ.name],
  write: [Permission.WRITE.name],
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

class PermissionsPanel extends React.Component {
// export class PermissionsPanel extends React.Component {
  static propTypes = {
    entitySetId: PropTypes.string,
    propertyTypeId: PropTypes.string
  }

  constructor(props) {
    super(props);
    const options = (this.props.propertyTypeId === undefined) ?
      Object.keys(accessOptions) : Object.keys(permissionOptions);
    this.state = {
      view: views.GLOBAL,
      rolesView: accessOptions.Write,
      emailsView: accessOptions.Write,

      // REDUX
      newRoleValue: '', // redux (esdc resets) props + dispatch
      newEmailValue: '', // redux (esdc resets) props + dispatch
      updateSuccess: false, // now there are multiple: 1 for each E/P loaded. what happens? where is it shown? props + dispatch
      updateError: false, // ditto ^^^ props + dispatch
      loadUsersError: false, // props
      // specific to view
      globalValue: [], // specific to each E/P view. set on properties (as default). refactor to get w/ specific id. may need to separate use cases. props + dispatch
      roleAcls: { Discover: [], Link: [], Read: [], Write: [] }, //  props. refactor to get w/ specific id
      userAcls: { Discover: [], Link: [], Read: [], Write: [], Owner: [] }, // props. refactor to get w/ specific id
      // global
      allUsersById: {}, // props
      allRolesList: new Set() // props. check that it is the same across the enitty set
    };
  }

  componentDidMount() {
    this.loadAcls(false);
  }


//// MOVE TO ENTITYSETDETAIL /////
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
    const { propertyTypeId, entitySetId } = this.props; //can stay as props
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


  //// LOGIC FOR MODAL VIEW ONLY  ///////
  shouldShowSuccess = {
    true: styles.updateSuccess,
    false: styles.hidden
  }

  shouldShowError = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  updatePermissions(rawAction, principal, rawPermissions) {
    const { entitySetId, propertyTypeId } = this.props;
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

  getSelectedClassName = (view) => {
    return (view === this.state.view) ? `${styles.edmNavbarButton} ${styles.edmNavbarButtonSelected}` : styles.edmNavbarButton;
  }

  getFirstLastClassName = (order) => {
    var firstLastClassName;
    if (order) {
      if (order === 'first') {
        firstLastClassName = styles.firstEdmButton;
      }
      else if (order === 'last') {
        firstLastClassName = styles.lastEdmButton;
      }

      return firstLastClassName;
    }

    return null;
  }

  getClassName = (view, order) => {
    const selectedClassName = this.getSelectedClassName(view);
    const firstLastClassName = this.getFirstLastClassName(order);

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

  updateDropdownValue = (e) => {
    this.setState({ globalValue: e.value });
  }

  buttonStyle = (view, viewState, order) => {
    const buttonSelectedStyle = this.buttonSelectedStyle(view, viewState);
    const buttonFirstLastStyle = this.buttonFirstLastStyle(order);

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
      }
      else if (order === 'last') {
        firstLastClassName = styles.lastEdmButton;
      }

      return firstLastClassName;
    }

    return null;
  }

  updateGlobalPermissionState = (permission, checked) => {
    const globalValue = this.state.globalValue.filter((permissionOption) => {
      return permissionOption !== permission;
    });
    if (checked) globalValue.push(permission);
    this.setState({ globalValue });
  }

  getGlobalView = () => {
    const optionNames = (this.props.propertyTypeId) ? Object.keys(permissionOptions) : Object.keys(accessOptions);
    const options = optionNames
      .filter((name) => {
        return name !== accessOptions.Owner && name !== accessOptions.Write && name !== accessOptions.Hidden;
      })
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

  getPermissionsFromView = (action, view) => {
    return (action === ActionConsts.REMOVE) ? [view.toUpperCase()] : permissionLevels[view.toLowerCase()];
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

  switchView = (view) => {
    this.setState({
      view,
      updateSuccess: false,
      updateError: false
    });
  }

  render() {
    return (
      <div>
        <div className={styles.edmNavbarContainer}>
          <div className={styles.edmNavbar}>
            {this.renderViewButton(views.GLOBAL, orders.FIRST)}
            {this.renderViewButton(views.ROLES)}
            {this.renderViewButton(views.EMAILS, orders.LAST)}
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

function mapStateToProps(state) {
  const entitySetDetail = state.get('entitySetDetail');

  return {
    allUsersById: entitySetDetail.allUsersById
  };
}

function mapDispatchToProps(dispatch, ownProps) {

}

// export default PermissionsPanel;
export default connect(mapStateToProps, mapDispatchToProps)(PermissionsPanel);
