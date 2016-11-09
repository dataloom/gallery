import React, { PropTypes } from 'react';
import Dropdown from 'react-dropdown';
import { PermissionsApi } from 'loom-data';
import Utils from '../../../../utils/Utils';
import Consts from '../../../../utils/AppConsts';
import styles from '../styles.module.css';
import '../../../../styles/dropdown.css';

const views = {
  GLOBAL: 0,
  ROLES: 1,
  DOMAIN: 2,
  EMAILS: 3
};

const permissionLevels = {
  hidden: [],
  discover: [Consts.DISCOVER],
  read: [Consts.DISCOVER, Consts.READ],
  write: [Consts.DISCOVER, Consts.READ, Consts.WRITE]
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

const propertyAccessOptions = {
  Discover: 'Discover',
  Read: 'Read',
  Write: 'Write'
};

const emails = {
  Hidden: ['asfkadlskfnlaskdfjlskadjfalskjfalksjflskdjfalksjfaslkdfjlaksdfj', 'first@hidden.com', 'second@hidden.com', 'third@hidden.com', 'fourth@hidden.com', 'fifth@hidden.com', 'sixth@hidden.com', 'seventh@hidden.com', 'eighth@hidden.com', 'ninth@hidden.com', 'tenth@hidden.com', 'eleventh@hidden.com'],
  Discover: ['one@discoverable.com', 'two@discoverable.com', 'three@discoverable.com'],
  Read: ['heresAnEmail@public.com'],
  Write: ['writer@writer.com', 'anotehrWriter@writer.com']
};

const roles = {
  Hidden: ['Software engineer', 'Product manager', 'BD', 'some job'],
  Discover: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
  Read: ['reader1'],
  Write: ['role1', 'role2', 'role3', 'user']
};

export class PermissionsPanel extends React.Component {
  static propTypes = {
    entitySetName: PropTypes.string,
    entityType: PropTypes.object,
    propertyTypeName: PropTypes.string,
    propertyTypeNamespace: PropTypes.string,
    exitPanel: PropTypes.func
  }

  constructor() {
    super();
    this.state = {
      view: views.GLOBAL,
      updateSuccess: false,
      updateError: false,
      rolesView: accessOptions.Write,
      emailsView: accessOptions.Write,
      newRoleValue: '',
      newEmailValue: ''
    };
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
    if (this.props.propertyTypeName) {
      return `property type: ${this.props.propertyTypeNamespace}.${this.props.propertyTypeName}`;
    }
    return `entity set: ${this.props.entitySetName}`;
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

  updatePermissions = (view) => {
    this.setState({ updateSuccess: true });
  }

  buttonStyle = (view, viewState) => {
    return (view === viewState) ? `${styles.buttonStyle} ${styles.selectedButtonStyle}` : styles.buttonStyle;
  }

  getGlobalView = () => {
    const options = (this.props.propertyTypeName === undefined) ?
      Object.keys(accessOptions) : Object.keys(propertyAccessOptions);
    return (
      <div className={styles.viewWrapper}>
        <div>Choose the default permissions for everyone:</div>
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
            this.updatePermissions(views.GLOBAL);
          }}
          className={styles.simpleButton}
        >Save changes</button>
      </div>
    );
  }

  changeRolesView = (newView) => {
    this.setState({ rolesView: newView });
  }

  updateRoles = (action, roleToRemove) => {
    const role = (action === Consts.REMOVE) ? roleToRemove : this.state.newRoleValue;
    const view = (action === Consts.REMOVE) ? Consts.HIDDEN : this.state.rolesView;
    const updateFn = (this.props.propertyTypeName) ?
      PermissionsApi.updateAclsForPropertyTypesInEntitySets : PermissionsApi.updateAclsForEntitySets;
    const req = {
      role,
      action: Consts.SET,
      name: this.props.entitySetName,
      permissions: permissionLevels[view.toLowerCase()]
    };
    if (this.props.propertyTypeName) {
      req.property = {
        namespace: this.props.propertyTypeNamespace,
        name: this.props.propertyTypeName
      };
    }
    updateFn([req]).then(() => {
      this.setState({
        updateSuccess: true,
        newRoleValue: ''
      });
    });
  }

  handleNewRoleChange = (e) => {
    this.setState({ newRoleValue: e.target.value });
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

  getRolesView = () => {
    const roleList = roles[this.state.rolesView];
    const hiddenBody = roleList.map((role) => {
      return (
        <div className={styles.tableRows} key={roleList.indexOf(role)}>
          <div className={styles.inline}>
            <button
              onClick={() => {
                this.updateRoles(Consts.REMOVE, role);
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
        <div>Choose default permissions for specific roles.</div>
        <div className={`${styles.inline} ${styles.padTop}`}>
          {this.viewPermissionTypeButton(accessOptions.Write, this.changeRolesView, this.state.rolesView)}
          {this.viewPermissionTypeButton(accessOptions.Read, this.changeRolesView, this.state.rolesView)}
          {this.viewPermissionTypeButton(accessOptions.Discover, this.changeRolesView, this.state.rolesView)}
          {this.viewPermissionTypeButton(accessOptions.Hidden, this.changeRolesView, this.state.rolesView)}
        </div>
        <div className={styles.permissionsBodyContainer}>
          {hiddenBody}
        </div>
        <div className={styles.inline}>
          <input
            type="text"
            value={this.state.newRoleValue}
            onChange={this.handleNewRoleChange}
            placeholder={'Enter a new role'}
            className={`${styles.inputBox} ${styles.permissionInputWidth}`}
          />
        <button
          className={`${styles.simpleButton} ${styles.spacerMargin}`}
          onClick={() => {
            this.updateRoles(Consts.SET)
          }}
        >Save</button>
        </div>
      </div>
    );
  }

  getDomainView = () => {
    const options = (this.props.propertyTypeName === undefined) ?
      Object.keys(accessOptions) : Object.keys(propertyAccessOptions);
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
            this.updatePermissions(views.DOMAIN);
          }}
          className={styles.simpleButton}
        >Save changes</button>
      </div>
    );
  }

  changeEmailsView = (newView) => {
    this.setState({ emailsView: newView });
  }

  removeEmail = (email) => {
    console.log(`removing ${email} from ${this.state.emailsView} list`);
  }

  addEmail = () => {
    const email = this.state.newEmailValue;
    const view = this.state.emailsView;
    console.log(`adding ${email} to ${view} email list`);
    this.setState({
      updateSuccess: true,
      newEmailValue: ''
    });
  }

  handleNewEmailChange = (e) => {
    this.setState({ newEmailValue: e.target.value });
  }

  getEmailsView = () => {
    const emailList = emails[this.state.emailsView];
    const hiddenBody = emailList.map((email) => {
      return (
        <div className={styles.tableRows} key={emailList.indexOf(email)}>
          <div className={styles.inline}>
            <button
              onClick={() => {
                this.removeEmail(email);
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
        <div>Choose permissions for specific users.</div>
        <div className={`${styles.padTop} ${styles.inline}`}>
          {this.viewPermissionTypeButton(accessOptions.Write, this.changeEmailsView, this.state.emailsView)}
          {this.viewPermissionTypeButton(accessOptions.Read, this.changeEmailsView, this.state.emailsView)}
          {this.viewPermissionTypeButton(accessOptions.Discover, this.changeEmailsView, this.state.emailsView)}
          {this.viewPermissionTypeButton(accessOptions.Hidden, this.changeEmailsView, this.state.emailsView)}
        </div>
        <div className={styles.permissionsBodyContainer}>
          {hiddenBody}
        </div>
        <div className={styles.inline}>
          <input
            type="text"
            value={this.state.newEmailValue}
            onChange={this.handleNewEmailChange}
            placeholder={'Enter a new email address'}
            className={`${styles.inputBox} ${styles.permissionInputWidth}`}
          />
          <button className={`${styles.simpleButton} ${styles.spacerMargin}`} onClick={this.addEmail}>Save</button>
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
        <div id="updateSuccess" className={this.shouldShowSuccess[this.state.updateSuccess]}>
          Your changes have been saved.
        </div>
        <div id="updateError" className={this.shouldShowError[this.state.updateError]}>
          Unable to save changes.
        </div>
        <button className={styles.cancelButton} onClick={this.props.exitPanel}>x</button>
      </div>
    );
  }
}

export default PermissionsPanel;
