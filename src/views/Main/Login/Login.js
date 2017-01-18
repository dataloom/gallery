import React, { PropTypes } from 'react';
import AuthService from '../../../utils/AuthService';
import styles from './styles.module.css';

// Blank component that triggers the login lock
export class Login extends React.Component {
  static propTypes = {
    auth: PropTypes.instanceOf(AuthService)
  }

  constructor() {
    super();
  }

  componentDidMount() {
    this.props.auth.login();
  }

  componentWillUnmount() {
    this.props.auth.hideLoginPrompt();
  }

  render() {
    return <div className={styles.root}/>;
  }
}

export default Login;
