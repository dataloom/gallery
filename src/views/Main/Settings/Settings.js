import React from 'react';
import { UsersApi } from 'loom-data';
import Consts from '../../../utils/AppConsts';
import styles from './styles.module.css';

export class Settings extends React.Component {

  constructor() {
    super();
    this.state = {
      userData: {},
      newRoleValue: '',
      selectedUser: ''
    };
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = (userId, shouldClear) => {
    console.log('load users');
    UsersApi.getAllUsers()
    .then((userData) => {
      const selectedUser = (userId && userId !== undefined) ? userId : Object.keys(userData)[0];
      const newRoleValue = (shouldClear) ? Consts.EMPTY : this.state.newRoleValue;
      console.log(userData[selectedUser]);
      this.setState({ userData, selectedUser, newRoleValue });
    });
  }

  updateRoles = (action, role) => {
    const userId = this.state.selectedUser;
    const newRoleList = [];
    this.state.userData[userId].roles.forEach((oldRole) => {
      if (role.trim().toLowerCase() !== oldRole.trim().toLowerCase()) newRoleList.push(oldRole);
    });
    if (action === Consts.ADD) newRoleList.push(role);
    UsersApi.resetUserRoles(userId, newRoleList)
    .then(() => {
      setTimeout(() => {
        this.loadUsers(userId, action === Consts.ADD);
      }, 500);
    });
  }

  updateSelectedUser = (user) => {
    this.setState({ selectedUser: user });
  }

  updateNewRoleValue = (e) => {
    this.setState({ newRoleValue: e.target.value });
  }

  renderUsers() {
    if (Object.keys(this.state.userData).length) {
      return Object.keys(this.state.userData).map((userId) => {
        const user = this.state.userData[userId];
        const className = (userId === this.state.selectedUser) ?
          `${styles.listItem} ${styles.selected}` : styles.listItem;
        if (user.email && user.email !== undefined) {
          return (
            <div className={className} key={Object.keys(this.state.userData).indexOf(userId)}>
              <button
                className={styles.roleRowButton}
                onClick={() => {
                  this.updateSelectedUser(userId);
                }}
              >
                <div className={`${styles.inline} ${styles.padLeft}`}>{user.email}</div>
              </button>
            </div>
          );
        }
        return null;
      });
    }
    return null;
  }

  renderRolesForUser() {
    if (Object.keys(this.state.userData).length) {
      const roles = this.state.userData[this.state.selectedUser].roles;
      return roles.map((role) => {
        return (
          <div className={styles.listItem} key={roles.indexOf(role)}>
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
    }
    return null;
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
            <div className={styles.userListContainer}>
              {this.renderUsers()}
            </div>
            <div className={styles.roleListContainer}>
              {this.renderRolesForUser()}
            </div>
            <div className={styles.addEmailContainer}>
              <input
                type="text"
                className={styles.addInput}
                placeholder={'Add a role to the selected user'}
                value={this.state.newRoleValue}
                onChange={this.updateNewRoleValue}
              />
              <button
                className={styles.simpleButton}
                onClick={() => {
                  this.updateRoles(Consts.ADD, this.state.newRoleValue);
                }}
              >Add</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
