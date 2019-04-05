import React from 'react';

import PropTypes from 'prop-types';
import { hashHistory } from 'react-router';

import AccountMenu from './AccountMenu';
import AuthService from '../../utils/AuthService';
import PageConsts from '../../utils/Consts/PageConsts';
import logo from '../../images/ol_logo_v2.png';
import styles from './headernav.module.css';

class HeaderNav extends React.Component {

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
            <img className={styles.logo} src={logo} alt="OpenLattice Logo" />
            <div className={styles.openLattice}>OPENLATTICE</div>
          </div>

          <div className={styles.headerNavRight}>
            <div className={styles.headerNavItem}>
              { greeting }
            </div>
            <div className={styles.headerNavItem}>
              <AccountMenu onLogoutClick={this.onLogoutClick} />
            </div>
          </div>

        </nav>
      </header>
    );
  }
}

HeaderNav.propTypes = {
  auth: PropTypes.instanceOf(AuthService),
  isAdmin: PropTypes.bool,
  name: PropTypes.string,
  fullName: PropTypes.string,
  googleId: PropTypes.string
};

export default HeaderNav;
