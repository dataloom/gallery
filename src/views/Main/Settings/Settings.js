import React, { PropTypes } from 'react';
import styles from './styles.module.css';

const roles = {
  baseRole: ['user1@base.com', 'user2@base.com', 'user3@base.com'],
  middleRole: ['middle1@middle.com', 'middle2@middle.com', 'middle3@middle.com', 'mid4@middle.com', 'mid5@middle.com'],
  anotherRole: [],
  topRole: ['top@top.com', 'anotherTop@top.com'],
  something: [],
  anotherOne: [],
  one: [],
  two: [],
  three: [],
  four: [],
  five: [],
  six: [],
  seven: []
}

export class Settings extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedRole: Object.keys(roles)[0],
      newRoleValue: '',
      newEmailValue: ''
    }
  }

  deleteRole = (role) => {
    console.log(`deleting ${role}`);
  }

  deleteEmail = (email) => {
    console.log(`deleting ${email} from ${this.state.selectedRole}`);
  }

  updateSelectedRole = (role) => {
    this.setState({ selectedRole: role });
  }

  renderRoles() {
    return Object.keys(roles).map((role) => {
      const className = (role === this.state.selectedRole) ? `${styles.listItem} ${styles.selected}` : styles.listItem;
      return (
        <div className={className} key={Object.keys(roles).indexOf(role)}>
          <div className={styles.inline}>
            <button
              onClick={() => {
                this.deleteRole(role);
              }}
              className={styles.deleteButton}
            >-</button>
          </div>
          <button
            className={styles.roleRowButton}
            onClick={() => {
              this.updateSelectedRole(role);
            }}
          >
            <div className={`${styles.inline} ${styles.padLeft}`}>{role}</div>
          </button>
        </div>
      );
    });
  }

  renderEmails = () => {
    const emails = roles[this.state.selectedRole];
    return emails.map((email) => {
      return (
        <div className={styles.listItem} key={emails.indexOf(email)}>
          <div className={styles.inline}>
            <button
              onClick={() => {
                this.deleteEmail(email);
              }}
              className={styles.deleteButton}
            >-</button>
          </div>
          <div className={`${styles.inline} ${styles.padLeft}`}>{email}</div>
        </div>
      );
    });
  }

  updateNewRoleValue = (e) => {
    this.setState({ newRoleValue: e.target.value });
  }

  updateNewEmailValue = (e) => {
    this.setState({ newEmailValue: e.target.value });
  }

  createRole = () => {
    console.log(`creating new role: ${this.state.newRoleValue}`);
    this.setState({ newRoleValue: '' });
  }

  addEmail = () => {
    console.log(`setting user with email ${this.state.newEmailValue} as role ${this.state.selectedRole}`);
    this.setState({ newEmailValue: '' });
  }

  render() {
    return (
      <div>
        <h2 className={styles.title}>Settings</h2>
        <div className={styles.spacer} />
        <div className={styles.setRolesContainer}>
          <div className={styles.headerText}>Manage roles in your domain.</div>
          <div className={styles.roleManagementContainer}>
            <div className={styles.divider} />
            <div className={styles.roleListContainer}>
              {this.renderRoles()}
            </div>
            <div className={styles.addRoleContainer}>
              <input
                type="text"
                className={styles.addInput}
                placeholder={'Add role'}
                value={this.state.newRoleValue}
                onChange={this.updateNewRoleValue}
              />
              <button className={styles.simpleButton} onClick={this.createRole}>Create role</button>
            </div>
            <div className={styles.emailListContainer}>
              {this.renderEmails()}
            </div>
            <div className={styles.addEmailContainer}>
              <input
                type="text"
                className={styles.addInput}
                placeholder={'Add an email for the selected role'}
                value={this.state.newEmailValue}
                onChange={this.updateNewEmailValue}
              />
              <button className={styles.simpleButton} onClick={this.addEmail}>Add</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
