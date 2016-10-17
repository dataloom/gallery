import React, { PropTypes } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import AuthService from '../../../utils/AuthService';
import styles from './styles.module.css';
import img from '../../../images/kryptnostic-logo-big.png';

export class Login extends React.Component {
  static propTypes = {
    auth: PropTypes.instanceOf(AuthService)
  }

  constructor() {
    super();
    this.login = this.login.bind(this);
  }

  login() {
    const { auth } = this.props;
    auth.login();
  }

  render() {
    return (
      <div className={styles.root}>
        <img src={img} role="presentation" />
        <h2>Login</h2>
        <ButtonToolbar className={styles.toolbar}>
          <Button bsStyle="primary" onClick={this.login}>Login</Button>
        </ButtonToolbar>
      </div>
    );
  }
}

export default Login;
