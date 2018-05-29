import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Immutable, { List, Map, fromJS } from 'immutable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import StringConsts from '../../utils/Consts/StringConsts';
import ActionConsts from '../../utils/Consts/ActionConsts';
import DeleteButton from '../../components/buttons/DeleteButton';
import styles from './styles.module.css';

import { Permission } from '../../core/permissions/Permission';
import { USER, ROLE, AUTHENTICATED_USER, ADMIN } from '../../utils/Consts/UserRoleConsts';
import { getAllUsers } from './PermissionsPanelActionFactory';
import { getAclRequest, updateAclRequest } from '../permissions/PermissionsActionFactory';
import { fetchOrganizationsRequest } from '../organizations/actions/OrganizationsActionFactory';


const views = {
  GLOBAL: 'Everyone',
  ROLES: 'Roles',
  EMAILS: 'Emails'
};

const orders = {
  FIRST: 'first',
  LAST: 'last'
};

const permissionsByLabel = {
  Discover: Permission.DISCOVER.name,
  Link: Permission.LINK.name,
  Read: Permission.READ.name,
  Write: Permission.WRITE.name,
  Owner: Permission.OWNER.name
};

class PermissionsPanel extends React.Component {
  static propTypes = {
    allSelected: PropTypes.bool,
    entitySetId: PropTypes.string,
    propertyTypeId: PropTypes.string,
    aclKeysToUpdate: PropTypes.array,
    actions: PropTypes.shape({
      getAllUsers: PropTypes.func.isRequred,
      getAclRequest: PropTypes.func.isRequired,
      fetchOrganizationsRequest: PropTypes.func.isRequired,
      updateAclRequest: PropTypes.func.isRequired
    }),
    users: PropTypes.instanceOf(Immutable.Map).isRequired,
    aclKeyPermissions: PropTypes.instanceOf(Immutable.Map).isRequired,
    organizations: PropTypes.instanceOf(Immutable.Map).isRequired,
    rolesById: PropTypes.instanceOf(Immutable.Map).isRequired,
    loadUsersError: PropTypes.string.isRequired,
    loadRolesError: PropTypes.string.isRequired,
    isOrganization: PropTypes.bool
  }

  static defaultProps = {
    allSelected: false,
    isOrganization: false
  }

  constructor(props) {
    super(props);
    this.state = {
      view: views.EMAILS,
      rolesView: Permission.OWNER.getFriendlyName(),
      newRoleValue: '',
      newEmailValue: '',
      selectedPermissionForEmailsView: Permission.OWNER.getFriendlyName()
    };
  }

  componentDidMount() {

    this.loadAllAcls(this.props.aclKeysToUpdate);
  }

  componentWillReceiveProps(nextProps) {

    // this feels hacky
    const prevAclKeys = fromJS(this.props.aclKeysToUpdate);
    const nextAclKeys = fromJS(nextProps.aclKeysToUpdate);
    if (!prevAclKeys.equals(nextAclKeys)) {
      this.loadAllAcls(nextProps.aclKeysToUpdate);
    }
  }

  getAclKey = () => {
    const { entitySetId, propertyTypeId } = this.props;
    const aclKey = propertyTypeId ? [entitySetId, propertyTypeId] : [entitySetId];
    return fromJS(aclKey);
  }

  loadAllAcls = (aclKeys) => {

    this.props.actions.getAllUsers();

    if (!this.props.isOrganization) {
      this.props.actions.fetchOrganizationsRequest();
    }

    aclKeys.forEach((aclKey) => {
      this.props.actions.getAclRequest(aclKey);
    });
  }

  switchView = (view) => {
    this.setState({ view });
  }

  getSelectedClassName = (view) => {
    return (view === this.state.view)
      ? `${styles.edmNavbarButton} ${styles.edmNavbarButtonSelected}` : styles.edmNavbarButton;
  }

  getFirstLastClassName = (order) => {
    if (order === 'first') return styles.firstEdmButton;
    if (order === 'last') return styles.lastEdmButton;
    return null;
  }

  renderError = (errorMessage) => {
    if (!errorMessage.length) return null;
    return <div className={styles.errorMsg}>{errorMessage}</div>;
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

  updatePermissions(action, principal, permissions) {
    this.props.aclKeysToUpdate.forEach((aclKey) => {
      const aces = [{ principal, permissions }];
      const acl = { aclKey, aces };
      const req = { action, acl };
      this.props.actions.updateAclRequest(req);
    });
  }

  buttonStyle = (view, viewState, order) => {
    const buttonSelectedStyle = view === viewState
      ? `${styles.edmNavbarButton} ${styles.edmNavbarButtonSelected}` : styles.edmNavbarButton;
    const buttonFirstLastStyle = this.buttonFirstLastStyle(order);
    return `${buttonSelectedStyle} ${buttonFirstLastStyle}`;
  }

  buttonFirstLastStyle = (order) => {
    if (order === 'first') return styles.firstEdmButton;
    if (order === 'last') return styles.lastEdmButton;
    return null;
  }

  updateGlobalPermissions = (permission, checked) => {
    const principal = {
      type: ROLE,
      id: AUTHENTICATED_USER
    };
    const action = checked ? ActionConsts.ADD : ActionConsts.REMOVE;
    this.updatePermissions(action, principal, [permission]);
  }

  getGlobalView = () => {
    const { aclKeyPermissions } = this.props;
    const rolePermissions = aclKeyPermissions.getIn([this.getAclKey(), ROLE], Map());
    const selectedGlobalValues = rolePermissions.keySeq().filter((permission) => {
      return rolePermissions.get(permission).includes(AUTHENTICATED_USER);
    });

    const options = [Permission.DISCOVER, Permission.LINK, Permission.READ]
      .map((permission) => {
        const checkboxName = `global-${permission}`;
        return (
          <div key={permission.name}>
            <label htmlFor={checkboxName} className={styles.globalLabel}>{permission.getFriendlyName()}</label>
            <input
                id={checkboxName}
                type="checkbox"
                checked={selectedGlobalValues.includes(permission.name)}
                onChange={(e) => {
                  this.updateGlobalPermissions(permission.name, e.target.checked);
                }} />
          </div>
        );
      });
    return (
      <div>
        {this.renderError(this.props.loadRolesError)}
        <div>Choose the default permissions for all authenticated users:</div>
        <div className={styles.spacerSmall} />
        <div className={styles.dropdownWrapper}>
          {options}
        </div>
        <div className={styles.spacerSmall} />
      </div>
    );
  }

  changeRolesView = (rolesView) => {
    const newRoleValue = '';
    this.setState({ rolesView, newRoleValue });
  }

  updateRoles = (action, role, view) => {
    const principal = {
      type: ROLE,
      id: role
    };

    // Only if changes were made, save changes
    if (role) {
      const permissions = [permissionsByLabel[view]];
      this.updatePermissions(action, principal, permissions);
    }
  }

  handleNewRoleChange = (e) => {
    const newRoleValue = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.setState({ newRoleValue });
  }

  viewPermissionTypeButton = (permission, fn, currentlySelectedPermission, order) => {
    return (
      <button
          key={permission}
          onClick={() => {
            fn(permission);
          }}
          className={this.buttonStyle(permission, currentlySelectedPermission, order)}>
        <div className={styles.edmNavItemText}>{permission}</div>
      </button>
    );
  }

  renderPermissionButtons = (permissions, fn, currentlySelectedPermission) => {
    return permissions.map((permission, index) => {
      let order;
      if (index === 0) order = orders.FIRST;
      else if (index === permissions.length - 1) order = orders.LAST;
      return this.viewPermissionTypeButton(permission.getFriendlyName(), fn, currentlySelectedPermission, order);
    });
  }

  formatRoleTitle = (roleId, orgId) => {
    const { organizations, rolesById } = this.props;
    const roleTitle = rolesById.getIn([roleId, 'title'], '');
    const orgTitle = organizations.getIn([orgId, 'title'], '');
    return `${roleTitle} (${orgTitle})`;
  }

  getRoleOptions = (roleList) => {
    const roleOptions = [];
    this.props.organizations.forEach((organization) => {
      organization.get('roles').forEach((rolePrincipal) => {
        const roleId = rolePrincipal.getIn(['principal', 'id'], '');
        if (!roleList.includes(roleId) && roleId !== ADMIN && roleId !== AUTHENTICATED_USER) {
          const label = this.formatRoleTitle(roleId, organization.get('id'));
          roleOptions.push({ value: roleId, label });
        }
      });
    });
    return roleOptions;
  }

  getRolesView = () => {
    const { rolesView, newRoleValue } = this.state;
    const { aclKeyPermissions, rolesById } = this.props;

    const roleList = aclKeyPermissions
      .getIn([this.getAclKey(), ROLE, permissionsByLabel[rolesView]], List())
      .filter((roleId) => {
        return (roleId !== ADMIN && roleId !== AUTHENTICATED_USER);
      });

    const roleOptions = this.getRoleOptions(roleList);
    const hiddenBody = roleList.map((roleId) => {
      const role = rolesById.get(roleId);
      const roleTitle = this.formatRoleTitle(roleId, role.get('organizationId'));
      return (
        <div className={styles.tableRows} key={roleList.indexOf(roleId)}>
          <div className={styles.inline}>
            <DeleteButton
                onClick={() => {
                  this.updateRoles(ActionConsts.REMOVE, roleId, rolesView);
                }} />
          </div>
          <div className={`${styles.inline} ${styles.padLeft}`}>{roleTitle}</div>
        </div>
      );
    });
    return (
      <div>
        {this.renderError(this.props.loadRolesError)}
        <div>Choose default permissions for specific roles.</div>
        <div className={`${styles.inline} ${styles.padTop}`}>
          {this.renderPermissionButtons(
            [Permission.WRITE, Permission.READ, Permission.LINK, Permission.DISCOVER],
            this.changeRolesView,
            rolesView
          )}
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
              disabled={this.state.newRoleValue.length === 0}
              onClick={() => {
                this.updateRoles(ActionConsts.ADD, newRoleValue, rolesView);
              }}>Add</Button>
        </div>
      </div>
    );
  }

  changeEmailsView = (permission) => {
    this.setState({
      newEmailValue: '',
      selectedPermissionForEmailsView: permission
    });
  }

  updateEmails = (action, userId, view) => {
    const principal = {
      type: USER,
      id: userId
    };
    const permission = permissionsByLabel[view];
    const permissions = (permission === Permission.OWNER.name && action === ActionConsts.ADD)
      ? [permission, Permission.WRITE.name, Permission.READ.name, Permission.LINK.name, Permission.DISCOVER.name]
      : [permission];
    this.updatePermissions(action, principal, permissions);
  }

  handleNewEmailChange = (e) => {
    const newEmailValue = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.setState({ newEmailValue });
  }

  getEmailOptions = (userIdList) => {
    const emailOptions = [];

    this.props.users.valueSeq().forEach((user) => {
      if (user) {
        const id = user.get('user_id');
        const email = user.get('email');
        if (!userIdList.includes(id) && !!email) {
          emailOptions.push({ label: email, value: id });
        }
      }
    });
    return emailOptions;
  }

  getEmailsView = () => {

    const { newEmailValue, selectedPermissionForEmailsView } = this.state;
    const { aclKeyPermissions, aclKeysToUpdate, allSelected } = this.props;

    const getUserWithPermissions = (aclKey, selectedPermission) => {
      const selectedPermissionLabel = permissionsByLabel[selectedPermission];
      return aclKeyPermissions
        .getIn([aclKey, USER, selectedPermissionLabel], List())
        .filter((userId) => {
          // filter out user ids with OWNER permissions, since OWNER implies having all other permissions
          const owners = aclKeyPermissions.getIn([aclKey, USER, Permission.OWNER.name], List());
          if (selectedPermission !== Permission.OWNER.getFriendlyName() && owners.includes(userId)) {
            return false;
          }
          const user = this.props.users.get(userId);
          return (!!user && !!user.get('email'));
        });
    };

    let userIdList;
    const selectedAclKey = this.getAclKey();

    if (selectedAclKey.size === 1 && allSelected) {
      const userIdToCountMap = {};
      aclKeysToUpdate.forEach((aclKey) => {
        const iAclKey = fromJS(aclKey); // because keys in aclKeyPermissions are Immutable objects
        const userIds = getUserWithPermissions(iAclKey, selectedPermissionForEmailsView);
        userIds.forEach((userId) => {
          const count = userIdToCountMap[userId];
          userIdToCountMap[userId] = (typeof count === 'number' && count > 0) ? (count + 1) : 1;
        });
      });
      userIdList = fromJS(userIdToCountMap)
        .filter(count => count === aclKeysToUpdate.length)
        .keySeq()
        .toList();
    }
    else {
      userIdList = getUserWithPermissions(selectedAclKey, selectedPermissionForEmailsView);
    }

    const emailOptions = this.getEmailOptions(userIdList);
    const emailListBody = userIdList.map((userId) => {
      return (
        <div className={styles.tableRows} key={userId}>
          <div className={styles.inline}>
            <DeleteButton
                onClick={() => {
                  this.updateEmails(ActionConsts.REMOVE, userId, selectedPermissionForEmailsView);
                }} />
          </div>
          <div className={`${styles.inline} ${styles.padLeft}`}>{this.props.users.getIn([userId, 'email'], '')}</div>
        </div>
      );
    });

    return (
      <div>
        {this.renderError(this.props.loadUsersError)}
        <div>Choose permissions for specific users.</div>
        <div className={`${styles.padTop} ${styles.inline}`}>
          {this.renderPermissionButtons(
            [Permission.OWNER, Permission.WRITE, Permission.READ, Permission.LINK, Permission.DISCOVER],
            this.changeEmailsView,
            selectedPermissionForEmailsView
          )}
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
              disabled={this.state.newEmailValue.length === 0}
              onClick={() => {
                this.updateEmails(ActionConsts.ADD, newEmailValue, selectedPermissionForEmailsView);
              }}>Add</Button>
        </div>
      </div>
    );
  }

  renderViewButton = (view, order) => {
    const selectedClassName = this.getSelectedClassName(view);
    const firstLastClassName = this.getFirstLastClassName(order);

    return (
      <button
          onClick={() => {
            this.switchView(view);
          }}
          className={`${selectedClassName} ${firstLastClassName}`}>
        <div className={styles.edmNavItemText}>{view}</div>
      </button>
    );
  }

  render() {
    const { isOrganization } = this.props;

    return (
      <div>
        <div className={styles.edmNavbarContainer}>
          <div className={styles.edmNavbar}>
            { isOrganization ? null : this.renderViewButton(views.GLOBAL, orders.FIRST) }
            { isOrganization ? null : this.renderViewButton(views.ROLES) }
            {this.renderViewButton(views.EMAILS, orders.LAST)}
          </div>
        </div>
        <div className={styles.panelContents}>{this.getPanelViewContents()}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const permissions = state.get('permissionsPanel');
  const myId = JSON.parse(localStorage.profile).user_id;

  let rolesById = Map();
  state.getIn(['organizations', 'organizations'], Map()).valueSeq().forEach((org) => {
    org.get('roles').forEach((role) => {
      rolesById = rolesById.set(role.getIn(['principal', 'id'], ''), role);
    });
  });

  return {
    users: permissions.get('users', Map()).delete(myId),
    rolesById,
    aclKeyPermissions: permissions.get('aclKeyPermissions', Map()),
    loadUsersError: permissions.get('loadUsersError'),
    loadRolesError: permissions.get('loadRolesError'),
    organizations: state.getIn(['organizations', 'organizations'], Map())
  };
}

function mapDispatchToProps(dispatch :Function) :Object {
  const actions = {
    getAllUsers,
    getAclRequest,
    updateAclRequest,
    fetchOrganizationsRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PermissionsPanel);
