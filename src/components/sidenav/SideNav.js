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
import StringConsts from '../../utils/Consts/StringConsts';

class SideNav extends React.Component {

  state :{
    selectedRoute :string;
  }

  constructor() {

    super();

    this.state = {
      selectedRoute: this.getCurrentRoute()
    };
  }

  getCurrentRoute = () => {

    const hashRegex = /#\/([a-zA-Z]+)(?!\?.*)?/;
    const route = window.location.hash.match(hashRegex)[1];

    switch (route) {
      case (PageConsts.HOME):
        return PageConsts.HOME;
      case (PageConsts.CATALOG):
        return PageConsts.CATALOG;
      case (PageConsts.VISUALIZE):
        return PageConsts.VISUALIZE;
      case (PageConsts.SCHEMAS):
        return PageConsts.SCHEMAS;
      default:
        return StringConsts.EMPTY;
    }
  }

  updateState = (selectedRoute :string) => {

    this.props.updateTopbarFn();
    this.setState({ selectedRoute });
  }

  getSideNavItemLayout = (route :string, text :string, faIconType :string) => {

    const sideNavItemClassNames = (route === this.state.selectedRoute)
      ? `${styles.sideNavItem} ${styles.sideNavItemSelected}`
      : `${styles.sideNavItem}`;

    return (
      <Link
        to={`/${route}`}
        className={styles.sideNavLink}
        onClick={() => {
          this.updateState(route);
        }}
      >
        <div className={sideNavItemClassNames}>
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

SideNav.propTypes = {
  updateTopbarFn: React.PropTypes.func.isRequired
};

export default SideNav;
