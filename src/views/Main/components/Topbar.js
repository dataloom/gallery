import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import AuthService from '../../../utils/AuthService';
import StringConsts from '../../../utils/Consts/StringConsts';
import PageConsts from '../../../utils/Consts/PageConsts';
import styles from './styles.module.css';

export class Topbar extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    auth: PropTypes.instanceOf(AuthService),
    isAdmin: PropTypes.bool,
    name: PropTypes.string
  }

  navigateToSettings = () => {
    this.context.router.push(`/${PageConsts.SETTINGS}`);
  }

  logout = () => {
    this.props.auth.logout();
    this.context.router.push(`/${PageConsts.LOGIN}`);
  }

  settingsButtonClass = () => {
    return (this.props.isAdmin) ? styles.settingsIcon : styles.hidden;
  }

  extraAdminClass = () => {
    return (this.props.isAdmin) ? StringConsts.EMPTY : styles.noAdminButtonFormatting;
  }

  showButtons() {
    const { auth, name } = this.props;
    if (auth.loggedIn()) {
      const greeting = (name !== undefined && name.length) ?
        `Hi, ${name}!` : 'Hi!';
      return (
        <div className={styles.loggedInItemsContainer}>
          <div className={`${styles.greeting} ${this.extraAdminClass()}`}>{greeting}</div>
          <button onClick={this.navigateToSettings} className={this.settingsButtonClass()}>
            <FontAwesome name="cog" size="3x" />
          </button>
          <button onClick={this.logout} className={`${styles.logoutButton} ${this.extraAdminClass()}`}>Logout</button>
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
