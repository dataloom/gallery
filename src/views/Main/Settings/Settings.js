import React from 'react';
import { UsersApi } from 'loom-data';
import Consts from '../../../utils/AppConsts';
import styles from './styles.module.css';

const hiddenRoles = [Consts.USER, Consts.ADMIN];

const emptyErrorObj = {
  display: styles.hidden,
  value: Consts.EMPTY
}

export class Settings extends React.Component {

  constructor() {
    super();
    this.state = {
      userData: {},
      newRoleValue: '',
      selectedUser: '',
      reservedRoleError: emptyErrorObj
    };
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = (userId, shouldClear) => {
    UsersApi.getAllUsers()
    .then((userData) => {
      const selectedUser = (userId && userId !== undefined) ? userId : Object.keys(userData)[0];
      const newRoleValue = (shouldClear) ? Consts.EMPTY : this.state.newRoleValue;
      this.setState({ userData, selectedUser, newRoleValue });
    });
  }

  roleIsReserved = (role) => {
    if (hiddenRoles.includes(role.trim().toLowerCase())) {
      const reservedRoleError = { display: styles.error, value: role };
      this.setState({ reservedRoleError });
      return true;
    }
    return false;
  }

  updateRoles = (action, role) => {
    if (this.roleIsReserved(role)) return;
    const userId = this.state.selectedUser;
    const newRoleList = [];
    let newRole = role.trim();
    this.state.userData[userId].roles.forEach((oldRole) => {
      if (role.trim().toLowerCase() !== oldRole.trim().toLowerCase()) newRoleList.push(oldRole);
      else newRole = oldRole.trim();
    });
    if (action === Consts.ADD) newRoleList.push(newRole);
    UsersApi.resetUserRoles(userId, newRoleList);
    const userData = this.state.userData;
    userData[userId].roles = newRoleList;
    const newRoleValue = (action === Consts.ADD) ? Consts.EMPTY : this.state.newRoleValue;
    const reservedRoleError = emptyErrorObj;
    this.setState({ userData, newRoleValue, reservedRoleError });
  }

  updateSelectedUser = (user) => {
    this.setState({ selectedUser: user, reservedRoleError: emptyErrorObj });
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
        if (hiddenRoles.includes(role.trim().toLowerCase())) return null;
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
          <div className={this.state.reservedRoleError.display}>
            Error: {this.state.reservedRoleError.value} is a reserved role.
          </div>
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
