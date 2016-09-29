import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import '../styles.module.css';
import AuthService from '../../../utils/AuthService';

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
      return <Button onClick={this.logout} className={'logoutButton'}>Logout</Button>;
    }
    return null;
  }

  logout() {
    this.props.auth.logout();
    this.context.router.push('/login');
  }

  render() {
    return (
      <div className={'navbarContainer'}>
        <img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg" role="presentation" className={'logo'} />
        <div className={'loom'}>Loom</div>
        {this.showLogoutButton()}
      </div>
    );
  }
}

export default Navbar;
