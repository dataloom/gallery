import React from 'react';
import { UsersApi } from 'loom-data';
import styles from './styles.module.css';

export class Settings extends React.Component {

  constructor() {
    super();
    this.state = {
      roleData: {},
      userData: {},
      selectedRole: '',
      newRoleValue: '',
      newEmailValue: '',
      selectedUser: ''
    };
  }

  componentDidMount() {
  //  this.loadRoles();
    this.loadUsers();
  }

  loadRoles = () => {
    UsersApi.getAllUsersForAllRoles()
    .then((roleData) => {
      this.setState({
        roleData,
        selectedRole: Object.keys(roleData)[0]
      });
    });
  }

  loadUsers = (userId) => {
    UsersApi.getAllUsers()
    .then((userData) => {
      const selectedUser = (userId && userId !== undefined) ? userId : Object.keys(userData)[0];
      this.setState({ userData, selectedUser });
    });
  }

  deleteRole = (role) => {
    console.log(`deleting ${role}`);
  }

  deleteEmail = (email) => {
    console.log(`deleting ${email} from ${this.state.selectedRole}`);
  }

  removeRole = (role) => {
    console.log(`removing ${role} from ${this.state.selectedUser.email}`);
  }

  addRole = () => {
    const role = this.state.newRoleValue;
    const userId = this.state.selectedUser;
    const newRoleList = this.state.userData[userId].roles;
    let roleAlreadyInList = false;
    newRoleList.forEach((oldRole) => {
      if (role.trim().toLowerCase() === oldRole.trim().toLowerCase()) roleAlreadyInList = true;
    });
    if (!roleAlreadyInList) newRoleList.push(role.trim());
    UsersApi.resetUserRoles(userId, newRoleList)
    .then(() => {
      this.loadUsers(userId);
    });
  }

  // updateSelectedRole = (role) => {
  //   this.setState({ selectedRole: role });
  // }

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
                  this.removeRole(role);
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
              <button className={styles.simpleButton} onClick={this.addRole}>Add</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
