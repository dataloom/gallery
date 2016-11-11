import React, { PropTypes } from 'react';
import AuthService from '../../../utils/AuthService';
import Consts from '../../../utils/AppConsts';
import styles from './styles.module.css';
import settingsIcon from '../../../../src/images/settings-icon.png';

export class Topbar extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    auth: PropTypes.instanceOf(AuthService)
  }

  constructor(props) {
    super(props);
    this.state = ({ user: this.props.auth.getProfile().given_name });
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ user: this.props.auth.getProfile().given_name });
    }, 200);
  }

  navigateToSettings = () => {
    this.context.router.push(`/${Consts.SETTINGS}`);
  }

  logout = () => {
    this.props.auth.logout();
    this.context.router.push(`/${Consts.LOGIN}`);
  }

  showGreetingAndLogoutButton() {
    if (this.props.auth.loggedIn()) {
      const greeting = (this.state.user !== undefined && this.state.user.length) ? `Hi, ${this.state.user}!` : 'Hi!';
      return (
        <div className={styles.loggedInItemsContainer}>
          <div className={styles.greeting}>{greeting}</div>
          {/* <button onClick={this.navigateToSettings} className={styles.settingsIcon}>
            <img src={settingsIcon} role="presentation" className={styles.settingsIconImg} />
          </button> */}
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
        {this.showGreetingAndLogoutButton()}
      </div>
    );
  }
}

export default Topbar;
