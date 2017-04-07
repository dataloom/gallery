import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import * as actionFactory from '../ProfileActionFactory';
import EditProfile from '../components/EditProfile';
import styles from '../styles.module.css';

class EditProfileContainer extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  }

  render() {
    return (
      <EditProfile
          onSubmit={this.props.onSubmit} />
    );
  }
}

function mapStateToProps(state) {
  const profile = state.get('profile');

  return {
    test: 'sup'
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    onSubmit: actionFactory.onProfileSubmit
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileContainer);
