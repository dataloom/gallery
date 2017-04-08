import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import * as actionFactory from '../ProfileActionFactory';
import EditProfile from '../components/EditProfile';
import styles from '../styles.module.css';

class EditProfileContainer extends React.Component {
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  getUserDetailsObj = () => {
    const { firstName, lastName, email } = this.props;
    return {
      firstName,
      lastName,
      email
    };
  }

  render() {
    return (
      <EditProfile
          userDetails={this.getUserDetailsObj()}
          onSubmit={this.props.onSubmit}
          handleChange={this.props.handleChange} />
    );
  }
}

function mapStateToProps(state) {
  const profile = state.get('profile');

  return {
    firstName: profile.get('firstName'),
    lastName: profile.get('lastName'),
    email: profile.get('email')
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    handleChange: actionFactory.handleChange,
    onSubmit: actionFactory.onProfileSubmit
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileContainer);
