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

  getUserDetailsList = () => {
    const { firstName, lastName, email } = this.props;
    // TODO: Pass info: state key, value, placeholderText (optional) , descriptionText (optional)
    return {
      firstName,
      lastName,
      email
    };
  }

  render() {
    return (
      <ProfileForm
          values={this.getUserDetailsList()}
          handleChange={this.props.handleChange} />
    );
  }
}

// TODO: Hook up to real data
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
    handleChange: actionFactory.handleChange
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BasicInfoForm);
