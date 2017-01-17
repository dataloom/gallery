/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import FontAwesome from 'react-fontawesome';

import {
  DataModels,
  OrganizationsApi,
  UsersApi
} from 'loom-data';

import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
  InputGroup,
} from 'react-bootstrap';

import {
  connect
} from 'react-redux';

import {
  Link
} from 'react-router';

import {
  bindActionCreators
} from 'redux';

import styles from '../styles/orgs.module.css';
import headerStyles from '../../../components/headernav/headernav.module.css';

import CreateOrganization from './CreateOrganizationComponent';

import LoadingSpinner from '../../../components/loadingspinner/LoadingSpinner';

import AuthService from '../../../utils/AuthService';
import PageConsts from '../../../utils/Consts/PageConsts';
import Utils from '../../../utils/Utils';

import {
  fetchOrgsRequest,
  fetchOrgsSuccess,
  fetchOrgsFailure
} from '../actions/OrganizationsActionFactory';

const { Organization } = DataModels;

function mapStateToProps(state :Map<*, *>) {

  return {
    isFetching: state.getIn(['organizations', 'isFetching']),
    organizations: state.getIn(['organizations', 'organizations']).valueSeq()
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    fetchOrgsRequest,
    fetchOrgsSuccess,
    fetchOrgsFailure
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

// !!!HACK!!! - only temporary until there's an API to talk to
function getOrgInfo() {

  return new Promise((resolve) => {
    setTimeout(() => {
      const organizations = [
        {
          id: 'abcd-1234-efg-456',
          title: 'Kryptnostic Inc.',
          description: 'Fully Homomorphic Encryption For The Win'
        },
        {
          id: 'euhd-4729-aie-639',
          title: 'JustBeamIt',
          description: 'File Transfer Made Easy'
        }
      ];
      resolve(organizations);
    }, 350);
  });
}

class OrganizationList extends React.Component {

  state :{
    showCreateOrganizationComponent :boolean
  };

  static propTypes = {
    actions: React.PropTypes.shape({
      fetchOrgsRequest: React.PropTypes.func.isRequired,
      fetchOrgsSuccess: React.PropTypes.func.isRequired,
      fetchOrgsFailure: React.PropTypes.func.isRequired
    }).isRequired,
    isFetching: React.PropTypes.bool.isRequired,
    organizations: React.PropTypes.instanceOf(Immutable.Iterable).isRequired
  };

  constructor(props) {

    super(props);

    this.state = {
      showCreateOrganizationComponent: false
    };
  }

  componentDidMount() {

    this.props.actions.fetchOrgsRequest();

    getOrgInfo()
    .then((response) => {
      this.props.actions.fetchOrgsSuccess(response);
    })
    .catch(() => {
      this.props.actions.fetchOrgsFailure();
    });
  }

  // handleInviteClick = () => {
  //
  //   if (Utils.isValidEmail(this.props.invitationEmail)) {
  //     this.props.actions.sendInvitation(this.props.invitationEmail);
  //   }
  //   else {
  //     this.setState({
  //       showInvalidEmailMessage: true
  //     });
  //   }
  // }

  // handleEmailOnChange = (event) => {
  //
  //   this.props.actions.updateInviteEmail(event.target.value);
  // }

  showCreateOrganizationComponent = () => {

    this.setState({
      showCreateOrganizationComponent: true
    });
  }

  hideCreateOrganizationComponent = () => {

    this.setState({
      showCreateOrganizationComponent: false
    });
  }

  handleCreateOrganization = () => {

    console.log('creating organization...');
  }

  renderCreateOrganizationComponent = () => {

    const visibilityOptions = [
      'Discoverable',
      'Public',
      'Private'
    ];

    return (
      <CreateOrganization
          visibilityOptions={visibilityOptions}
          onCreate={this.handleCreateOrganization}
          onCancel={this.hideCreateOrganizationComponent} />
    );
  }

  // renderOrganizations = () => {
  //
  //   if (!this.props.organizations || this.props.organizations.length === 0) {
  //     return null;
  //   }
  //
  //   const email = this.props.auth.getProfile().email;
  //   const domain = email.substring(email.lastIndexOf('@') + 1);
  //
  //   return (
  //     <div>
  //       <div className={styles.section}>
  //         <h3>{ domain }</h3>
  //       </div>
  //       { orgs }
  //       <div className={`${styles.section} ${styles.invite}`}>
  //         <h4>Invite</h4>
  //         <FormGroup className={styles.inviteInput}>
  //           <ControlLabel>Email Address</ControlLabel>
  //           <InputGroup>
  //             <FormControl type="email" placeholder="Enter email" onChange={this.handleEmailOnChange} />
  //             <InputGroup.Button>
  //               <Button onClick={this.handleInviteClick}>Invite</Button>
  //             </InputGroup.Button>
  //           </InputGroup>
  //           <HelpBlock className={styles.invalidEmail}>
  //             { (this.props.showInvalidEmailMessage) ? 'Invalid email' : '' }
  //           </HelpBlock>
  //         </FormGroup>
  //       </div>
  //       <div className={styles.section}>
  //         <h4>Requests</h4>
  //       </div>
  //       <div className={styles.section}>
  //         <h4>Users</h4>
  //       </div>
  //     </div>
  //   );
  // }

  renderOrganizationsList = () => {

    const orgs = this.props.organizations.map((org) => {
      return (
        <li key={org.get('id')}>
          <Link to={`/${PageConsts.ORG}/${org.get('id')}`} className={styles.headerNavLink}>
            { org.get('title') }
          </Link>
        </li>
      );
    });

    return (
      <div>
        <ul>
          { orgs }
        </ul>
      </div>
    );
  };

  render() {

    if (this.props.isFetching) {
      return <LoadingSpinner />;
    }

    return (
      <div className={styles.organizationsWrapper}>
        <header className={headerStyles.headerNavWrapper}>
          <nav className={headerStyles.headerNav}>

            <div className={headerStyles.headerNavLeft}>
              <div className={`${headerStyles.headerNavItem} ${styles.organizationsHeading}`}>
                <h3>Organizations</h3>
              </div>
            </div>

            <div className={headerStyles.headerNavRight}>
              <div className={headerStyles.headerNavItem}>
                <Button bsSize="small" onClick={this.showCreateOrganizationComponent}>
                  Create New Organization
                </Button>
              </div>
            </div>

          </nav>
        </header>
        {
          this.state.showCreateOrganizationComponent
            ? this.renderCreateOrganizationComponent()
            : this.renderOrganizationsList()
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationList);
