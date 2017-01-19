/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import classnames from 'classnames';

import {
  DataModels,
  OrganizationApi
} from 'loom-data';

import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
  InputGroup,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';

import {
  connect
} from 'react-redux';

import {
  hashHistory
} from 'react-router';

import {
  bindActionCreators
} from 'redux';

import styles from '../styles/orgs.module.css';

import LoadingSpinner from '../../../components/loadingspinner/LoadingSpinner';

import {
  fetchOrgRequest,
  fetchOrgSuccess,
  fetchOrgFailure
} from '../actions/OrganizationsActionFactory';

const { Organization } = DataModels;

function mapStateToProps(state :Map<*, *>, ownProps :Object) {

  const orgId :string = ownProps.params.orgId;
  const emptyOrg = Immutable.fromJS({});

  return {
    isFetchingOrg: state.getIn(['organizations', 'isFetchingOrg']),
    organization: state.getIn(['organizations', 'organizations', orgId], emptyOrg)
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    fetchOrgRequest,
    fetchOrgSuccess,
    fetchOrgFailure
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationDetails extends React.Component {

  state :{
    isInvalidEmail :boolean
  }

  static propTypes = {
    actions: React.PropTypes.shape({
      fetchOrgRequest: React.PropTypes.func.isRequired,
      fetchOrgSuccess: React.PropTypes.func.isRequired,
      fetchOrgFailure: React.PropTypes.func.isRequired
    }).isRequired,
    isFetchingOrg: React.PropTypes.bool.isRequired,
    params: React.PropTypes.shape({
      orgId: React.PropTypes.string.isRequired
    }).isRequired,
    organization: React.PropTypes.shape(Organization).isRequired
  }

  constructor(props :Object) {

    super(props);

    this.state = {
      isInvalidEmail: false
    };
  }

  componentDidMount() {

    if (this.props.organization.isEmpty()) {

      this.props.actions.fetchOrgRequest();

      OrganizationApi.getOrganization(this.props.params.orgId)
        .then((response) => {
          this.props.actions.fetchOrgSuccess(response);
          hashHistory.push('/org');
        })
        .catch(() => {
          this.props.actions.fetchOrgFailure();
        });
    }
  }

  renderInvitationSection = () => {

    return (
      <div className={styles.detailSection}>
        <h4>Invite</h4>
        <FormGroup className={styles.inviteInput}>
          <ControlLabel>Email Address</ControlLabel>
          <InputGroup>
            <FormControl type="text" placeholder="Enter email" onChange={() => {}} />
            <InputGroup.Button>
              <Button onClick={() => {}}>Invite</Button>
            </InputGroup.Button>
          </InputGroup>
          <HelpBlock className={styles.invalidEmail}>
            { (this.props.isInvalidEmail) ? 'Invalid email' : '' }
          </HelpBlock>
        </FormGroup>
      </div>
    );
  }

  renderDomainsSection = () => {

    const domains = this.props.organization.get('emails', []).map((domain :string) => {
      return (
        <ListGroupItem key={domain}>{ domain }</ListGroupItem>
      );
    });

    return (
      <div className={classnames(styles.detailSection, styles.domains)}>
        <h4>Domains</h4>
        <ListGroup>
          { domains }
        </ListGroup>
      </div>
    );
  }

  render() {

    if (this.props.isFetchingOrg) {
      return <LoadingSpinner />;
    }

    return (
      <div className={classnames(styles.flexComponent)}>
        <div className={styles.detailSection}>
          <h3>
            { this.props.organization.get('title') }
          </h3>
          <h4>
            { this.props.organization.get('description') }
          </h4>
        </div>
        { this.renderInvitationSection() }
        { this.renderDomainsSection() }
        <div className={styles.detailSection}>
          <h4>Requests</h4>
        </div>
        <div className={styles.detailSection}>
          <h4>Users</h4>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationDetails);
