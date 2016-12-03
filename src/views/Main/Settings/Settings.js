import React from 'react';
import { UsersApi } from 'loom-data';
import StringConsts from '../../../utils/Consts/StringConsts';
import PermissionsConsts from '../../../utils/Consts/PermissionsConsts';
import UserRoleConsts from '../../../utils/Consts/UserRoleConsts';

import styles from './styles.module.css';

const hiddenRoles = [UserRoleConsts.DEFAULT_USER_ROLE, UserRoleConsts.ADMIN];

const emptyErrorObj = {
  display: styles.hidden,
  value: StringConsts.EMPTY
};

export class Settings extends React.Component {

  constructor() {
    super();
    this.state = {
      userData: {},
      newRoleValue: '',
      selectedUser: '',
      reservedRoleError: emptyErrorObj,
      loadUsersError: styles.hidden,
      updateError: styles.hidden
    };
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = (userId, shouldClear) => {
    UsersApi.getAllUsers()
    .then((userData) => {
      const selectedUser = (userId && userId !== undefined) ? userId : Object.keys(userData)[0];
      const newRoleValue = (shouldClear) ? StringConsts.EMPTY : this.state.newRoleValue;
      this.setState({
        userData,
        selectedUser,
        newRoleValue,
        loadUsersError: styles.hidden
      });
    }).catch(() => {
      this.setState({ loadUsersError: styles.error });
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
    const { userData, selectedUser } = this.state;
    if (this.roleIsReserved(role)) return;
    const userId = selectedUser;
    const newRoleList = [];
    let newRole = role.trim();
    userData[userId].roles.forEach((oldRole) => {
      if (role.trim().toLowerCase() !== oldRole.trim().toLowerCase()) newRoleList.push(oldRole);
      else newRole = oldRole.trim();
    });
    if (action === PermissionsConsts.ADD) newRoleList.push(newRole);
    UsersApi.resetUserRoles(userId, newRoleList)
    .then(() => {
      this.setState({ updateError: styles.hidden });
    })
    .catch(() => {
      this.setState({ updateError: styles.error });
    });
    userData[userId].roles = newRoleList;
    const newRoleValue = (action === PermissionsConsts.ADD) ? StringConsts.EMPTY : this.state.newRoleValue;
    const reservedRoleError = emptyErrorObj;
    this.setState({ userData, newRoleValue, reservedRoleError });
  }

  updateSelectedUser = (userId) => {
    UsersApi.getUser(userId)
    .then((user) => {
      const userData = this.state.userData;
      userData[userId] = user;
      this.setState({
        userData,
        selectedUser: userId,
        reservedRoleError: emptyErrorObj,
        loadUsersError: styles.hidden
      });
    }).catch(() => {
      this.setState({ loadUsersError: styles.error });
    });
  }

  updateNewRoleValue = (e) => {
    this.setState({ newRoleValue: e.target.value });
  }

  renderUsers() {
    const { userData, selectedUser } = this.state;
    if (Object.keys(userData).length) {
      return Object.keys(userData).map((userId) => {
        const user = userData[userId];
        const className = (userId === selectedUser) ?
          `${styles.listItem} ${styles.selected}` : styles.listItem;
        if (user.email && user.email !== undefined) {
          return (
            <div className={className} key={Object.keys(userData).indexOf(userId)}>
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
    const { userData, selectedUser } = this.state;
    if (Object.keys(userData).length) {
      const roles = userData[selectedUser].roles;
      return roles.map((role) => {
        if (hiddenRoles.includes(role.trim().toLowerCase())) return null;
        return (
          <div className={styles.listItem} key={roles.indexOf(role)}>
            <div className={styles.inline}>
              <button
                onClick={() => {
                  this.updateRoles(PermissionsConsts.REMOVE, role);
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
    const { reservedRoleError, newRoleValue } = this.state;
    return (
      <div>
        <h2 className={styles.title}>Settings</h2>
        <div className={styles.spacer} />
        <div className={styles.setRolesContainer}>
          <div className={styles.headerText}>Manage roles in your domain.</div>
          <div className={reservedRoleError.display}>
            Error: {reservedRoleError.value} is a reserved role.
          </div>
          <div className={this.state.loadUsersError}>Error: unable to load users.</div>
          <div className={this.state.updateError}>Error: unable to update user.</div>
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
                value={newRoleValue}
                onChange={this.updateNewRoleValue}
              />
              <button
                className={styles.simpleButton}
                onClick={() => {
                  this.updateRoles(PermissionsConsts.ADD, newRoleValue);
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
