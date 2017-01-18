/*
 * @flow
 */

import React from 'react';

import {
  Link
} from 'react-router';

import styles from './headernav.module.css';

import AuthService from '../../utils/AuthService';
import PageConsts from '../../utils/Consts/PageConsts';

class HeaderNav extends React.Component {

  onLogoutClick = () => {
    this.props.auth.logout();
  }

  render() {

    const greeting = (this.props.name !== undefined && this.props.name.length)
      ? `Hi, ${this.props.name}!`
      : 'Hi!';

    const settingsNavItemClassNames = (this.props.isAdmin)
      ? styles.headerNavItem
      : `${styles.headerNavItem} ${styles.hidden}`;

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
            <div className={`${settingsNavItemClassNames}`}>
              <Link to={`/${PageConsts.SETTINGS}`} className={styles.headerNavLink}>Settings</Link>
            </div>
            <div className={styles.headerNavItem}>
              <Link
                  to={`/${PageConsts.LOGIN}`}
                  className={styles.headerNavLink}
                  onClick={this.onLogoutClick}>
                Logout
              </Link>
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
  name: React.PropTypes.string
};

export default HeaderNav;
