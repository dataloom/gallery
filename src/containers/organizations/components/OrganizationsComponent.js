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
  DropdownButton,
  MenuItem,
} from 'react-bootstrap';

import {
  connect
} from 'react-redux';

import {
  Link,
  hashHistory
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
    isFetchingOrgs: state.getIn(['organizations', 'isFetchingOrgs']),
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
    children: React.PropTypes.node,
    isFetchingOrgs: React.PropTypes.bool.isRequired,
    organizations: React.PropTypes.instanceOf(Immutable.Iterable).isRequired,
    params: React.PropTypes.shape({
      orgId: React.PropTypes.string
    }).isRequired
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

    if (!this.state.showCreateOrganizationComponent) {
      return null;
    }

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

  renderOrganizationsDropdown = () => {

    const currentOrgId = this.props.params.orgId;
    const currentOrg = this.props.organizations.get(currentOrgId);

    let dropdownTitle = 'Your Organizations';
    if (currentOrg !== undefined && currentOrg !== null) {
      dropdownTitle = currentOrg.get('title');
    }

    const orgs = this.props.organizations.map((org) => {
      const orgId = org.get('id');
      const orgTitle = org.get('title');
      return (
        <MenuItem key={orgId} eventKey={orgId}>
          { orgTitle }
        </MenuItem>
      );
    });

    return (
      <DropdownButton
          id="your-orgs"
          title={dropdownTitle}
          onSelect={(selectedOrgId) => {
            if (currentOrgId !== selectedOrgId) {
              hashHistory.push(`/${PageConsts.ORG}/${selectedOrgId}`);
            }
          }}>
        { orgs }
      </DropdownButton>
    );
  };

  render() {

    if (this.props.isFetchingOrgs) {
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
        <div className={styles.organizationDetailsWrapper}>
          { this.renderOrganizationsDropdown() }
          { React.Children.toArray(this.props.children) }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationList);
