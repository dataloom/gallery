import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import AuthService from '../../../utils/AuthService';
import StringConsts from '../../../utils/Consts/StringConsts';
import PageConsts from '../../../utils/Consts/PageConsts';
import styles from './styles.module.css';
import homeIcon from '../../../../src/images/home-icon.png';
import catalogIcon from '../../../../src/images/catalog-icon.png';

export class Navbar extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    auth: PropTypes.instanceOf(AuthService),
    updateTopbarFn: PropTypes.func
  }

  constructor() {
    super();
    this.state = {
      selected: this.getCurrentState()
    };
  }

  componentDidMount() {
    this.props.updateTopbarFn();
  }

  getCurrentState = () => {
    const hashRegex = /#\/([a-zA-Z]+)(?!\?.*)?/;
    const route = window.location.hash.match(hashRegex)[1];
    switch (route) {
      case (PageConsts.HOME):
        return PageConsts.HOME;
      case (PageConsts.CATALOG):
        return PageConsts.CATALOG;
      default:
        return StringConsts.EMPTY;
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
    this.context.router.push(`/${PageConsts.LOGIN}`);
  }

  getButtonClass = (state) => {
    return (state === this.state.selected) ? `${styles.navButton} ${styles.navButtonSelected}` : `${styles.navButton}`;
  }

  updateState = (newState) => {
    this.props.updateTopbarFn();
    this.setState({ selected: newState });
    this.context.router.push(`/${newState}`);
  }

  render() {
    return (
      <div className={styles.navbarContainer}>
        <button
          className={this.getButtonClass(PageConsts.HOME)}
          onClick={() => {
            this.updateState(PageConsts.HOME);
          }}
        >
          <img src={homeIcon} role="presentation" className={styles.navButtonIcon} />
          <div className={styles.navButtonText}>Home</div>
        </button>
        <button
          className={this.getButtonClass(PageConsts.CATALOG)}
          onClick={() => {
            this.updateState(PageConsts.CATALOG);
          }}
        >
          <img src={catalogIcon} role="presentation" className={styles.navButtonIcon} />
          <div className={styles.navButtonText}>Catalog</div>
        </button>
      </div>
    );
  }
}

export default Navbar;
