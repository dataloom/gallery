import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import AuthService from '../../../utils/AuthService';
import img from '../../../images/kryptnostic-logo-big.png';
import styles from '../styles.module.css';

export class Navbar extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    auth: PropTypes.instanceOf(AuthService)
  }

  constructor() {
    super();
    this.logout = this.logout.bind(this);
  }

  showLogoutButton() {
    if (this.props.auth.loggedIn()) {
      return <Button onClick={this.logout} className={styles.logoutButton}>Logout</Button>;
    }
    return null;
  }

  logout() {
    this.props.auth.logout();
    this.context.router.push('/login');
  }

  render() {
    return (
      <div className={styles.navbarContainer}>
        <img src={img} role="presentation" className={styles.logo} />
        <div className={styles.loom}>Loom</div>
        {this.showLogoutButton()}
      </div>
    );
  }
}

export default Navbar;
