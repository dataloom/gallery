import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import Dropdown from 'react-dropdown';
import { EntityDataModelApi } from 'loom-data';
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

const accessOptions = {
  Hidden: 'Hidden',
  Discoverable: 'Discoverable',
  Public: 'Public'
};

const emails = {
  Hidden: ['first@hidden.com', 'second@hidden.com', 'third@hidden.com', 'fourth@hidden.com', 'fifth@hidden.com', 'sixth@hidden.com', 'seventh@hidden.com', 'eighth@hidden.com', 'ninth@hidden.com', 'tenth@hidden.com', 'eleventh@hidden.com'],
  Discoverable: ['one@discoverable.com', 'two@discoverable.com', 'three@discoverable.com'],
  Public: ['heresAnEmail@public.com']
};

const roles = {
  Hidden: ['role1', 'role2', 'role3'],
  Discoverable: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
  Public: ['Software engineer', 'Product manager', 'BD', 'some job']
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
      rolesView: accessOptions.Public,
      emailsView: accessOptions.Public
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
    return (view === this.state.view) ? styles.selectedButtonStyle : styles.buttonStyle;
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
    return (view === viewState) ? styles.selectedButtonStyle : styles.buttonStyle;
  }

  getGlobalView = () => {
    return (
      <div className={styles.viewWrapper}>
        <div>Choose a default global level of access:</div>
        <div className={styles.spacerSmall} />
        <div className={styles.dropdownWrapper}>
          <Dropdown
            options={Object.keys(accessOptions)}
            onChange={this.onSelect}
            value={Object.keys(accessOptions)[0]}
          />
        </div>
        <div className={styles.spacerSmall} />
        <Button onClick={() => this.updatePermissions(views.GLOBAL)}>Save changes</Button>
      </div>
    );
  }

  changeRolesView = (newView) => {
    this.setState({ rolesView: newView });
  }

  removeRole = (role) => {
    console.log(`removing ${role} from ${this.state.rolesView} list`);
  }

  addRole = () => {
    const role = document.getElementById('newRole').value;
    const view = this.state.rolesView;
    console.log(`adding ${role} to ${view} role list`);
    this.setState({ updateSuccess: true });
  }

  getRolesView = () => {
    const roleList = roles[this.state.rolesView];
    const hiddenBody = roleList.map(role => <div className={styles.tableRows}>
      <div style={{ display: 'inline' }}>
        <Button bsSize="xsmall" bsStyle="danger" onClick={() => this.removeRole(role)}>-</Button>
      </div>
      <div style={{ display: 'inline', paddingLeft: '10px' }}>{role}</div>
    </div>);
    return (
      <div>
        <div>Choose levels of access for specific roles.</div>
        <div style={{ display: 'inline-block', paddingTop: '10px' }}>
          <button
            onClick={() => this.changeRolesView(accessOptions.Public)}
            className={this.buttonStyle(accessOptions.Public, this.state.rolesView)}
          >{accessOptions.Public}</button>
          <button
            onClick={() => this.changeRolesView(accessOptions.Discoverable)}
            className={this.buttonStyle(accessOptions.Discoverable, this.state.rolesView)}
          >{accessOptions.Discoverable}</button>
          <button
            onClick={() => this.changeRolesView(accessOptions.Hidden)}
            className={this.buttonStyle(accessOptions.Hidden, this.state.rolesView)}
          >{accessOptions.Hidden}</button>
        </div>
        <div style={{ margin: '0 auto', height: '200px', width: '300px', overflow: 'scroll', textAlign: 'left', paddingTop: '5px' }}>
          {hiddenBody}
        </div>
        <div style={{ display: 'inline-block' }}>
          <input
            id="newRole"
            type="text"
            style={{ width: '200px' }}
            placeholder={'Enter a new role'}
            className={styles.inputBox}
          />
          <Button className={styles.spacerMargin} onClick={this.addRole}>Save</Button>
        </div>
      </div>
    );
  }

  getDomainView = () => {
    return (
      <div className={styles.viewWrapper}>
        <div>Choose a default level of access for all users in your domain:</div>
        <div className={styles.spacerSmall} />
        <div className={styles.dropdownWrapper}>
          <Dropdown
            options={Object.keys(accessOptions)}
            onChange={this.onSelect}
            value={Object.keys(accessOptions)[0]}
          />
        </div>
        <div className={styles.spacerSmall} />
        <Button onClick={() => this.updatePermissions(views.DOMAIN)}>Save changes</Button>
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
    const email = document.getElementById('newEmail').value;
    const view = this.state.emailsView;
    console.log(`adding ${email} to ${view} email list`);
    this.setState({ updateSuccess: true });
  }

  getEmailsView = () => {
    const emailList = emails[this.state.emailsView];
    const hiddenBody = emailList.map(email => <div className={styles.tableRows}>
      <div style={{ display: 'inline' }}>
        <Button bsSize="xsmall" bsStyle="danger" onClick={() => this.removeEmail(email)}>-</Button>
      </div>
      <div style={{ display: 'inline', paddingLeft: '10px' }}>{email}</div>
    </div>);
    return (
      <div>
        <div>Choose levels of access for specific email addresses.</div>
        <div style={{ display: 'inline-block', paddingTop: '10px' }}>
          <button
            onClick={() => this.changeEmailsView(accessOptions.Public)}
            className={this.buttonStyle(accessOptions.Public, this.state.emailsView)}
          >{accessOptions.Public}</button>
          <button
            onClick={() => this.changeEmailsView(accessOptions.Discoverable)}
            className={this.buttonStyle(accessOptions.Discoverable, this.state.emailsView)}
          >{accessOptions.Discoverable}</button>
          <button
            onClick={() => this.changeEmailsView(accessOptions.Hidden)}
            className={this.buttonStyle(accessOptions.Hidden, this.state.emailsView)}
          >{accessOptions.Hidden}</button>
        </div>
        <div style={{ margin: '0 auto', height: '200px', width: '300px', overflow: 'scroll', textAlign: 'left', paddingTop: '5px' }}>
          {hiddenBody}
        </div>
        <div style={{ display: 'inline-block' }}>
          <input
            id="newEmail"
            type="text"
            style={{ width: '200px' }}
            placeholder={'Enter a new email address'}
            className={styles.inputBox}
          />
          <Button className={styles.spacerMargin} onClick={this.addEmail}>Save</Button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.panelContainer}>
        <div className={styles.panelTitle}>Set permissions for {this.getTitleText()}</div>
        <div className={styles.edmNavbarContainer}>
          <div className={styles.edmNavbar}>
            <button
              onClick={() => this.switchView(views.GLOBAL)}
              className={this.getClassName(views.GLOBAL)}
            >Global</button>
            <button
              onClick={() => this.switchView(views.ROLES)}
              className={this.getClassName(views.ROLES)}
            >Roles</button>
            <button
              onClick={() => this.switchView(views.DOMAIN)}
              className={this.getClassName(views.DOMAIN)}
            >My Domain</button>
            <button
              onClick={() => this.switchView(views.EMAILS)}
              className={this.getClassName(views.EMAILS)}
            >Emails</button>
          </div>
        </div>
        <div className={styles.panelContents}>{this.getPanelViewContents()}</div>
        <div id="updateSuccess" className={this.shouldShowSuccess[this.state.updateSuccess]}>
          Your changes have been saved.
        </div>
        <div id="updateError" className={this.shouldShowError[this.state.updateError]}>
          Unable to save changes.
        </div>
        <Button className={styles.cancelButton} onClick={this.props.exitPanel}>Cancel</Button>
      </div>
    );
  }

}

export default PermissionsPanel;
