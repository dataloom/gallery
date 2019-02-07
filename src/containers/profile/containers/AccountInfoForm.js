import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProfileForm from '../../../components/profile/ProfileForm';

import { getDbAccessCredential } from '../ProfileActionFactory';

class AccountInfoForm extends React.Component {
  static propTypes = {

  }

  componentDidMount() {
    const { actions } = this.props;
    actions.getDbAccessCredential();
  }

  getContent = () => {
    const { dbAccessCredential, userId, jwtToken } = this.props;
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

    const dbCreds = {
      key: 'dbCreds',
      value: dbAccessCredential,
      label: 'DB Access Credential',
      secure: true
    }

    return [accountId, jwt, dbCreds];
  }

  render() {
    return (
      <ProfileForm
          header={'Account Details'}
          content={this.getContent()} />
    );
  }
}

function mapStateToProps(state) {
  const profile = JSON.parse(window.localStorage.getItem('profile'));

  return {
    userId: profile.user_id,
    jwtToken: window.localStorage.id_token,
    dbAccessCredential: state.getIn(['profile', 'dbAccessCredential'])
  };
}

function mapDispatchToProps(dispatch :Function) :Object {
  const actions :{ [string] :Function } = { getDbAccessCredential };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountInfoForm);
