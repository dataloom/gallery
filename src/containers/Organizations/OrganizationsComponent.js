/*
 * @flow
 */

import React from 'react';

import FontAwesome from 'react-fontawesome';

import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
  InputGroup
} from 'react-bootstrap';

import {
  connect
} from 'react-redux';

import {
  bindActionCreators
} from 'redux';

import styles from './organizations.module.css';

import {
  setIsLoading,
  updateInviteEmail,
  sendInvitation,
  showInvalidEmailMessage
} from './OrganizationsActionFactory';

import AuthService from '../../utils/AuthService';
import Utils from '../../utils/Utils';

function mapStateToProps(state :Map<*, *>) {

  // TODO - perhaps return the entire "orgs" object?
  return {
    isLoading: state.getIn(['orgs', 'isLoading']),
    invitationEmail: state.getIn(['orgs', 'invitationEmail']),
    showInvalidEmailMessage: state.getIn(['orgs', 'showInvalidEmailMessage'])
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    setIsLoading,
    updateInviteEmail,
    sendInvitation,
    showInvalidEmailMessage
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

// !!!HACK!!! - only temporary until there's an API to talk to
function getOrgInfo() {

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Kryptnostic, Inc.');
    }, 250);
  });
}

class Organizations extends React.Component {

  componentDidMount() {

    this.props.actions.setIsLoading(true);

    getOrgInfo()
      .then((response) => {
        console.log(response);
        this.props.actions.setIsLoading(false);
      });
  }

  handleInviteClick = () => {

    if (Utils.isValidEmail(this.props.invitationEmail)) {
      this.props.actions.sendInvitation(this.props.invitationEmail);
    }
    else {
      this.props.actions.showInvalidEmailMessage();
    }
  }

  handleEmailOnChange = (event) => {

    this.props.actions.updateInviteEmail(event.target.value);
  }

  renderLoading = () => {

    return (
      <div className={styles.organizationsWrapper}>
        <div className={styles.loadingSpinner} data-loader={'circle-side'} />
      </div>
    );
  }

  renderComponent = () => {

    const email = this.props.auth.getProfile().email;
    const domain = email.substring(email.lastIndexOf('@') + 1);

    return (
      <div className={styles.organizationsWrapper}>
        <div className={styles.section}>
          <h3>{ domain }</h3>
        </div>
        <div className={`${styles.section} ${styles.invite}`}>
          <h4>Invite</h4>
          <FormGroup className={styles.inviteInput}>
            <ControlLabel>Email Address</ControlLabel>
            <InputGroup>
              <FormControl type="email" placeholder="Enter email" onChange={this.handleEmailOnChange} />
              <InputGroup.Button>
                <Button onClick={this.handleInviteClick}>Invite</Button>
              </InputGroup.Button>
            </InputGroup>
            <HelpBlock className={styles.invalidEmail}>
              { (this.props.showInvalidEmailMessage) ? 'Invalid email' : '' }
            </HelpBlock>
          </FormGroup>
        </div>
        <div className={styles.section}>
          <h4>Requests</h4>
        </div>
        <div className={styles.section}>
          <h4>Users</h4>
        </div>
      </div>
    );
  }

  render() {

    if (this.props.isLoading) {
      return this.renderLoading();
    }

    return this.renderComponent();
  }
}

Organizations.propTypes = {
  auth: React.PropTypes.instanceOf(AuthService),
  isLoading: React.PropTypes.bool.isRequired,
  invitationEmail: React.PropTypes.string.isRequired,
  showInvalidEmailMessage: React.PropTypes.bool.isRequired,
  actions: React.PropTypes.shape({
    setIsLoading: React.PropTypes.func.isRequired,
    updateInviteEmail: React.PropTypes.func.isRequired,
    sendInvitation: React.PropTypes.func.isRequired,
    showInvalidEmailMessage: React.PropTypes.func.isRequired
  })
};

export default connect(mapStateToProps, mapDispatchToProps)(Organizations);
