/*
 * @flow
 */

import React from 'react';

import { hashHistory } from 'react-router';

import PageConsts from '../../../utils/Consts/PageConsts';
import AuthService from '../../../utils/AuthService';
import styles from './styles.module.css';

export default class Login extends React.Component {

  static propTypes = {
    auth: React.PropTypes.instanceOf(AuthService)
  }

  componentDidMount() {

    if (!this.props.auth.loggedIn()) {
      this.props.auth.login();
    }
    else {
      hashHistory.push(`/${PageConsts.HOME}`);
    }
  }

  componentWillUnmount() {

    this.props.auth.hideLoginPrompt();
  }

  render() {

    return (
      <div className={styles.root} />
    );
  }
}
