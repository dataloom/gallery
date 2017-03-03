/*
 * @flow
 */

import React from 'react';

import {
  Link
} from 'react-router';

import styles from './sidenav.module.css';

import PageConsts from '../../utils/Consts/PageConsts';

import homeIcon from '../../images/icon-nav-home.svg';
import catalogIcon from '../../images/icon-nav-catalog.svg';
import datasetsIcon from '../../images/icon-nav-datasets.svg';
import visualizeIcon from '../../images/icon-nav-visualize.svg';
import organizationsIcon from '../../images/icon-nav-organizations.svg';
import helpIcon from '../../images/icon-nav-help.svg';

class SideNav extends React.Component {
  getSideNavItemLayout = (route :string, text :string, imgSrc :object) => {

    return (
      <div className={styles.sideNavItem}>
      {/*TODO: MOUNT ROUTE / set link*/}
        <Link
            to={`/${route}`}
            activeClassName={styles.sideNavItemSelected}>
          <div className={styles.sideNavItemIcon}>
            <img src={imgSrc} className={styles.sideNavIcon} role="presentation" />
          </div>
          <div className={styles.sideNavItemText}>{ text }</div>
        </Link>
      </div>
    );
  }

  render() {
    return (
      <nav className={styles.sideNav}>
        { this.getSideNavItemLayout(PageConsts.HOME, 'Home', homeIcon) }
        { this.getSideNavItemLayout(PageConsts.CATALOG, 'Catalog', catalogIcon) }
        { this.getSideNavItemLayout(PageConsts.DATASETS, 'Datasets', datasetsIcon) }
        { this.getSideNavItemLayout(PageConsts.VISUALIZE, 'Visualize', visualizeIcon) }
        {/* Hiding the Data Model link for the demo */}
        {/*{ this.getSideNavItemLayout(PageConsts.DATA_MODEL, 'Data Model', 'circle') }*/}
        { this.getSideNavItemLayout('orgs', 'Organizations', organizationsIcon) }
        { this.getSideNavItemLayout(PageConsts.HELP, 'Help', helpIcon) }
      </nav>
    );
  }
}

export default SideNav;
