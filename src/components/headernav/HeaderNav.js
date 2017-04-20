/*
 * @flow
 */

import React from 'react';
import { hashHistory } from 'react-router';
import Avatar from 'react-avatar';

import AccountMenu from './AccountMenu';
import AuthService from '../../utils/AuthService';
import PageConsts from '../../utils/Consts/PageConsts';
import styles from './headernav.module.css';

class HeaderNav extends React.Component {

  getAvatar = () => {
    const { fullName, googleId } = this.props;
    return <Avatar name={fullName} googleId={googleId} size={30} round />;
  }

  onLogoutClick = () => {
    this.props.auth.logout();
    hashHistory.push(`/${PageConsts.LOGIN}`);
  }

  render() {

    const greeting = (this.props.name && this.props.name.length)
      ? `Hi, ${this.props.name}!`
      : 'Hi!';

    return (
      <header className={styles.headerNavWrapper}>
        <nav className={styles.headerNav}>

          <div className={styles.headerNavLeft}>
            <h2 className={`${styles.headerNavItem} ${styles.loom}`}>LOOM</h2>
          </div>

          <div className={styles.headerNavRight}>
            <div className={styles.headerNavItem}>
              { greeting }
            </div>
            <div className={styles.headerNavItem}>
              <AccountMenu avatar={this.getAvatar()} onLogoutClick={this.onLogoutClick} />
            </div>
          </div>

        </nav>
      </header>
    );
  }
}

HeaderNav.propTypes = {
  auth: React.PropTypes.instanceOf(AuthService),
  isAdmin: React.PropTypes.bool,
  name: React.PropTypes.string,
  fullName: React.PropTypes.string,
  googleId: React.PropTypes.string
};

export default HeaderNav;
