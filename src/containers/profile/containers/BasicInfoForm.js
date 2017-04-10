import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import * as actionFactory from '../ProfileActionFactory';
import ProfileForm from '../components/ProfileForm';
import styles from '../styles.module.css';

class BasicInfoForm extends React.Component {
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired
  }

  getContent = () => {
    const { firstName, lastName, email } = this.props;
    const firstNameDetails = {
      key: 'firstName',
      value: firstName,
      label: 'First name'
    };

    const lastNameDetails = {
      key: 'lastName',
      value: lastName,
      label: 'Last name',
      note: null
    };

    const emailDetails = {
      key: 'email',
      value: email,
      label: 'Email address'
    };

    return [firstNameDetails, lastNameDetails, emailDetails];
  }

  render() {
    return (
      <ProfileForm
          header={'Basic Info'}
          content={this.getContent()}
          handleChange={this.props.handleChange} />
    );
  }
}

function mapStateToProps(state) {
  const profile = JSON.parse(window.localStorage.getItem('profile'));

  return {
    firstName: profile.given_name,
    lastName: profile.family_name,
    email: profile.email
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    handleChange: actionFactory.handleChange
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BasicInfoForm);
