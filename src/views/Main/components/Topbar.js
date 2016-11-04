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

  constructor(props) {
    super(props);
    this.state = ({ user: this.props.auth.getProfile().given_name });
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ user: this.props.auth.getProfile().given_name });
    }, 200);
  }

  showGreetingAndLogoutButton() {
    if (this.props.auth.loggedIn()) {
      const greeting = (this.state.user !== undefined && this.state.user.length) ? `Hi, ${this.state.user}!` : 'Hi!';
      return (
        <div className={styles.loggedInItemsContainer}>
          <div className={styles.greeting}>{greeting}</div>
          <button onClick={this.logout} className={styles.logoutButton}>Logout</button>
        </div>
      );
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
