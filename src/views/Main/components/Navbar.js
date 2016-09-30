import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import AuthService from '../../../utils/AuthService';
import Consts from '../../../utils/AppConsts';

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
        <img src={Consts.LOGO_URL} role="presentation" className={'logo'} />
        <div className={'loom'}>Loom</div>
        {this.showLogoutButton()}
      </div>
    );
  }
}

export default Navbar;
