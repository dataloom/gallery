/*
 * @flow
 */

import React from 'react';

import FontAwesome from 'react-fontawesome';

import {
  Link
} from 'react-router';

import styles from './sidenav.module.css';

import PageConsts from '../../utils/Consts/PageConsts';

class SideNav extends React.Component {

  getSideNavItemLayout = (route :string, text :string, faIconType :string) => {

    return (
      <Link
        to={`/${route}`}
        activeClassName={styles.sideNavItemSelected}
      >
        <div className={styles.sideNavItem}>
          <div className={styles.sideNavItemIcon}>
            <FontAwesome name={faIconType} size="2x" />
          </div>
          <div className={styles.sideNavItemText}>{ text }</div>
        </div>
      </Link>
    );
  }

  render() {
    return (
      <nav className={styles.sideNav}>
        { this.getSideNavItemLayout(PageConsts.HOME, 'Home', 'home') }
        { this.getSideNavItemLayout(PageConsts.CATALOG, 'Catalog', 'book') }
        { this.getSideNavItemLayout(PageConsts.VISUALIZE, 'Visualize', 'eye') }
        { this.getSideNavItemLayout(PageConsts.SCHEMAS, 'Schemas', 'circle') }
      </nav>
    );
  }
}

export default SideNav;