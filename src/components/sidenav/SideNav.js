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
        <div className={styles.sideNavItem}>
          <Link
            to={`/${route}`}
            activeClassName={styles.sideNavItemSelected}>
          <div className={styles.sideNavItemIcon}>
            <FontAwesome name={faIconType} size="2x" />
          </div>
          <div className={styles.sideNavItemText}>{ text }</div>
          </Link>
        </div>
    );
  }

  render() {
    return (
      <nav className={styles.sideNav}>
        { this.getSideNavItemLayout(PageConsts.HOME, 'Home', 'home') }
        { this.getSideNavItemLayout(PageConsts.CATALOG, 'Catalog', 'book') }
        { this.getSideNavItemLayout(PageConsts.DATASOURCES, 'Datasources', 'database') }
        { this.getSideNavItemLayout(PageConsts.VISUALIZE, 'Visualize', 'eye') }
        {/* Hiding the Data Model link for the demo */}
        {/*{ this.getSideNavItemLayout(PageConsts.DATA_MODEL, 'Data Model', 'circle') }*/}
        { this.getSideNavItemLayout(PageConsts.ORG, 'Organizations', 'sitemap') }
      </nav>
    );
  }
}

export default SideNav;
