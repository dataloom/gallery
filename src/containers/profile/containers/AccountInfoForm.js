import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import ProfileForm from '../../../components/profile/ProfileForm';

class AccountInfoForm extends React.Component {
  static propTypes = {

  }

  getContent = () => {
    const { userId, jwtToken } = this.props;
    const accountId = {
      key: 'accountId',
      value: userId,
      label: 'Account ID'
    };

    const jwt = {
      key: 'jwtToken',
      value: jwtToken,
      label: 'JWT Token',
      secure: true
    };

    return [accountId, jwt];
  }

  render() {
    return (
      <ProfileForm
          header={'Account Details'}
          content={this.getContent()} />
    );
  }
}

function mapStateToProps() {
  const profile = JSON.parse(window.localStorage.getItem('profile'));

  return {
    userId: profile.user_id,
    jwtToken: window.localStorage.id_token
  };
}

export default connect(mapStateToProps)(AccountInfoForm);
