import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import AuthService from '../../../utils/AuthService';
import Consts from '../../../utils/AppConsts';
import styles from './styles.module.css';

export class Navbar extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    auth: PropTypes.instanceOf(AuthService)
  }

  constructor() {
    super();
    this.state = {
      selected: this.getCurrentState()
    };
  }

  getCurrentState = () => {
    const hashRegex = /#\/([a-zA-Z]+)(?!\?.*)?/;
    const route = window.location.hash.match(hashRegex)[1];
    switch (route) {
      case (Consts.HOME):
        return Consts.HOME;
      case (Consts.CATALOG):
        return Consts.CATALOG;
      default:
        return Consts.HOME;
    }
  }

  showLogoutButton() {
    if (this.props.auth.loggedIn()) {
      return <Button onClick={this.logout} className={styles.logoutButton}>Logout</Button>;
    }
    return null;
  }

  logout = () => {
    this.props.auth.logout();
    this.context.router.push(`/${Consts.LOGIN}`);
  }

  getButtonClass = (state) => {
    return (state === this.state.selected) ? `${styles.navButton} ${styles.navButtonSelected}` : `${styles.navButton}`;
  }

  updateState = (newState) => {
    this.setState({ selected: newState });
    this.context.router.push(`/${newState}`);
  }

  render() {
    return (
      <div className={styles.navbarContainer}>
        <button
          className={this.getButtonClass(Consts.HOME)}
          onClick={() => {
            this.updateState(Consts.HOME);
          }}
        >Home</button>
        <button
          className={this.getButtonClass(Consts.CATALOG)}
          onClick={() => {
            this.updateState(Consts.CATALOG);
          }}
        >Catalog</button>
      </div>
    );
  }
}

export default Navbar;
