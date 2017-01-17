/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';

import {
  DataModels
} from 'loom-data';

import {
  connect
} from 'react-redux';

import {
  bindActionCreators
} from 'redux';

import styles from '../styles/orgs.module.css';
import headerStyles from '../../../components/headernav/headernav.module.css';

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
    isFetching: state.getIn(['organizations', 'isFetching']),
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

// !!!HACK!!! - only temporary until there's an API to talk to
function getOrgInfo(orgId) {

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
      let result = null;
      organizations.forEach((org) => {
        if (org.id === orgId) result = org;
      });
      resolve(result);
    }, 350);
  });
}

class OrganizationDetails extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      fetchOrgRequest: React.PropTypes.func.isRequired,
      fetchOrgSuccess: React.PropTypes.func.isRequired,
      fetchOrgFailure: React.PropTypes.func.isRequired
    }).isRequired,
    params: React.PropTypes.shape({
      orgId: React.PropTypes.string.isRequired
    }).isRequired,
    isFetching: React.PropTypes.bool.isRequired,
    organization: React.PropTypes.shape(Organization).isRequired
  }

  componentDidMount() {

    this.props.actions.fetchOrgRequest();

    getOrgInfo(this.props.params.orgId)
      .then((response) => {
        this.props.actions.fetchOrgSuccess(response);
      })
      .catch(() => {
        this.props.actions.fetchOrgFailure();
      });
  }

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
                <h3>
                  { this.props.organization.get('title') }
                </h3>
              </div>
            </div>
          </nav>
        </header>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationDetails);
