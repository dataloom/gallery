import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import ProfileForm from '../../../components/profile/ProfileForm';

class BasicInfoForm extends React.Component {
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
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
      label: 'Last name'
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
          content={this.getContent()} />
    );
  }
}

function mapStateToProps() {
  const profile = JSON.parse(window.localStorage.getItem('profile'));

  return {
    firstName: profile.given_name,
    lastName: profile.family_name,
    email: profile.email
  };
}

export default connect(mapStateToProps)(BasicInfoForm);
