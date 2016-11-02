import React, { PropTypes } from 'react';
import AuthService from '../../../utils/AuthService';
import Consts from '../../../utils/AppConsts';
import styles from './styles.module.css';

export class Topbar extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    auth: PropTypes.instanceOf(AuthService)
  }

  showLogoutButton() {
    if (this.props.auth.loggedIn()) {
      return <button onClick={this.logout} className={styles.logoutButton}>Logout</button>;
    }
    return null;
  }

  logout = () => {
    this.props.auth.logout();
    this.context.router.push(`/${Consts.LOGIN}`);
  }

  getButtonClass = (state) => {
    return (state === this.state.selected) ? styles.navButtonSelected : styles.navButton;
  }

  updateState = (newState) => {
    this.setState({ selected: newState });
    this.context.router.push(`/${newState}`);
  }

  render() {
    return (
      <div className={styles.topbarContainer}>
        <div className={styles.loom}>Loom</div>
        {this.showLogoutButton()}
      </div>
    );
  }
}

export default Topbar;
