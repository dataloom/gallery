import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

import styles from './sidenav.module.css';

import PageConsts from '../../utils/Consts/PageConsts';

import homeIcon from '../../images/icon-nav-home.svg';
import catalogIcon from '../../images/icon-nav-catalog.svg';
import datasetsIcon from '../../images/icon-nav-datasets.svg';
import visualizeIcon from '../../images/icon-nav-visualize.svg';
import organizationsIcon from '../../images/icon-nav-organizations.svg';

const HELP_URL = 'https://help.openlattice.com/';
const SUPPORT_URL = 'https://support.openlattice.com/';


class SideNav extends React.Component {
  getSideNavItemLayout = (route, text, imgSrc) => {

    return (
      <div className={styles.sideNavItem}>
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

  getSideNavHelpItemLayout = (route, text) => {

    return (
      <div className={styles.sideNavItem}>
        <a href={route} target="_blank">
          <div className={styles.sideNavItemIcon}>
            <FontAwesome name="flag" size="2x" />
          </div>
          <div className={styles.sideNavItemText}>{ text }</div>
        </a>
      </div>
    );
  }

  getSpacer = () => {
    return <div className={styles.spacer} />;
  }

  getSupportLink = () => {
    return (
      <div className={styles.support}>
        <a href={SUPPORT_URL} target="_blank">Report Issue</a>
      </div>
    );
  }

  render() {
    return (
      <nav className={styles.sideNav}>
        { this.getSideNavItemLayout(PageConsts.HOME, 'Home', homeIcon) }
        { this.getSideNavItemLayout(PageConsts.CATALOG, 'Catalog', catalogIcon) }
        { this.getSideNavItemLayout(PageConsts.DATASETS, ' Your Datasets', datasetsIcon) }
        {/* Hiding the Data Model link for the demo */}
        {/* { this.getSideNavItemLayout(PageConsts.DATA_MODEL, 'Data Model', 'circle') } */}
        { this.getSideNavItemLayout('orgs', 'Organizations', organizationsIcon) }
        { this.getSideNavHelpItemLayout(HELP_URL, 'Help') }
        { this.getSpacer() }
        { this.getSupportLink() }
      </nav>
    );
  }
}

export default SideNav;
