import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import Dropdown from 'react-dropdown';
import { EntityDataModelApi } from 'loom-data';
import Consts from '../../../../utils/AppConsts';
import styles from '../styles.module.css';
import '../../../../styles/dropdown.css';

const views = {
  GLOBAL: 0,
  ROLES: 1,
  DOMAIN: 2,
  EMAILS: 3
};

const accessOptions = [
  'Hidden',
  'Discoverable',
  'Public'
];

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
      updateError: false
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

  getGlobalView = () => {
    return (
      <div className={styles.viewWrapper}>
        <div>Choose a default global level of access:</div>
        <div className={styles.spacerSmall} />
        <div className={styles.dropdownWrapper}>
          <Dropdown
            options={accessOptions}
            onChange={this.onSelect}
            value={accessOptions[0]}
          />
        </div>
        <div className={styles.spacerSmall} />
        <Button onClick={() => this.updatePermissions(views.GLOBAL)}>Save changes</Button>
      </div>
    );
  }

  getRolesView = () => {
    return (
      <div>roles view</div>
    );
  }

  getDomainView = () => {
    return (
      <div className={styles.viewWrapper}>
        <div>Choose a default level of access for all users in your domain:</div>
        <div className={styles.spacerSmall} />
        <div className={styles.dropdownWrapper}>
          <Dropdown
            options={accessOptions}
            onChange={this.onSelect}
            value={accessOptions[0]}
          />
        </div>
        <div className={styles.spacerSmall} />
        <Button onClick={() => this.updatePermissions(views.DOMAIN)}>Save changes</Button>
      </div>
    );
  }

  getEmailsView = () => {
    return (
      <div>emails view</div>
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
        <div id="updateSuccess" className={this.shouldShowSuccess[this.state.updateSuccess]}
        >Your changes have been saved.</div>
        <div id="updateError" className={this.shouldShowError[this.state.updateError]}
        >Unable to save changes.</div>
        <Button className={styles.cancelButton} onClick={this.props.exitPanel}>Cancel</Button>
      </div>
    );
  }

}

export default PermissionsPanel;
