import React, { PropTypes } from 'react';
import AuthService from '../../../utils/AuthService';
import Consts from '../../../utils/AppConsts';
import styles from './styles.module.css';
import settingsIcon from '../../../../src/images/settings-icon.png';

export class Topbar extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    auth: PropTypes.instanceOf(AuthService),
    isAdmin: PropTypes.bool,
    name: PropTypes.string
  }

  navigateToSettings = () => {
    this.context.router.push(`/${Consts.SETTINGS}`);
  }

  logout = () => {
    this.props.auth.logout();
    this.context.router.push(`/${Consts.LOGIN}`);
  }

  settingsButtonClass = () => {
    return (this.props.isAdmin) ? styles.settingsIcon : styles.hidden;
  }

  showButtons() {
    if (this.props.auth.loggedIn()) {
      const greeting = (this.props.name !== undefined && this.props.name.length) ?
        `Hi, ${this.props.name}!` : 'Hi!';
      return (
        <div className={styles.loggedInItemsContainer}>
          <div className={styles.greeting}>{greeting}</div>
          <button onClick={this.navigateToSettings} className={this.settingsButtonClass()}>
            <img src={settingsIcon} role="presentation" className={styles.settingsIconImg} />
          </button>
          <button onClick={this.logout} className={styles.logoutButton}>Logout</button>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className={styles.topbarContainer}>
        <div className={styles.loom}>LOOM</div>
        {this.showButtons()}
      </div>
    );
  }
}

export default Topbar;
