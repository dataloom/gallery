/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';
import classnames from 'classnames';

import {
  DataModels,
  OrganizationsApi,
  UsersApi
} from 'loom-data';

import {
  Button,
  DropdownButton,
  MenuItem
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


const ReactSelectOptionPropType = React.PropTypes.shape({
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired
});

function mapStateToProps(state :Map<*, *>, ownProps :Object) {

  const organizations = state.getIn(['organizations', 'organizations'], Immutable.Map());
  const orgCount = organizations.size;

  let selectedOrgOption = {
    label: '',
    value: ''
  };

  const selectOrgOptions = organizations.map((org) => {
    const selectOption = {
      label: org.get('title'),
      value: org.get('id')
    };
    if (ownProps.params.orgId === org.get('id')) {
      selectedOrgOption = selectOption;
    }
    return selectOption;
  }).valueSeq().toJS();

  return {
    isFetchingOrgs: state.getIn(['organizations', 'isFetchingOrgs']),
    orgCount,
    selectOrgOptions,
    selectedOrgOption
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
    orgCount: React.PropTypes.number.isRequired,
    selectOrgOptions: React.PropTypes.arrayOf(ReactSelectOptionPropType).isRequired,
    selectedOrgOption: ReactSelectOptionPropType.isRequired
  };

  constructor(props) {

    super(props);

    this.state = {
      selectedOrganization: null,
      showCreateOrganizationComponent: false
    };
  }

  componentDidMount() {

    this.fetchOrganizations();
  }

  fetchOrganizations = () => {

    this.props.actions.fetchOrgsRequest();

    OrganizationsApi.getAllOrganizations()
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

    this.setState({
      showCreateOrganizationComponent: false
    });

    hashHistory.push('/org');
  }

  renderCreateOrganizationComponent = () => {

    return (
      <CreateOrganization
          onCreate={this.handleCreateOrganization}
          onCancel={this.hideCreateOrganizationComponent} />
    );
  }

  renderOrganizationDetailsComponent = () => {

    if (this.props.orgCount === 0) {
      return (
        <div className={classnames(styles.flexComponent, styles.flexCenter)}>
          <h4>{ 'No organizations. Create a new Organization!' }</h4>
          { this.renderCreateOrganizationButton() }
        </div>
      );
    }

    return (
      <div className={classnames(styles.flexComponent, styles.orgDetailsWrapper)}>
        { this.renderOrganizationsSelect() }
        { React.Children.toArray(this.props.children) }
      </div>
    );
  }

  renderCreateOrganizationButton = () => {

    return (
      <Button bsSize="small" onClick={this.showCreateOrganizationComponent}>
        Create New Organization
      </Button>
    );
  }

  renderOrganizationsSelect = () => {

    const updateSelectedOrganization = (newSelectedOrgOption :Object) => {

      if (!newSelectedOrgOption) {
        hashHistory.push('/org');
      }
      else if (this.props.selectedOrgOption.value !== newSelectedOrgOption.value) {
        hashHistory.push(`/org/${newSelectedOrgOption.value}`);
      }
    };

    return (
      <Select
          clearable
          searchable
          placeholder="Your Organizations"
          options={this.props.selectOrgOptions}
          value={this.props.selectedOrgOption}
          onChange={updateSelectedOrganization} />
    );
  };

  render() {

    if (this.props.isFetchingOrgs) {
      return <LoadingSpinner />;
    }

    return (
      <div className={styles.flexComponent}>
        <header className={headerStyles.headerNavWrapper}>
          <nav className={headerStyles.headerNav}>

            <div className={headerStyles.headerNavLeft}>
              <div className={`${headerStyles.headerNavItem} ${styles.organizationsHeading}`}>
                <h3>Organizations</h3>
              </div>
            </div>

            <div className={headerStyles.headerNavRight}>
              <div className={headerStyles.headerNavItem}>
                { this.renderCreateOrganizationButton() }
              </div>
            </div>

          </nav>
        </header>
        <div className={`${styles.flexComponent} ${styles.componentPadding}`}>
          {
            this.state.showCreateOrganizationComponent
            ? this.renderCreateOrganizationComponent()
            : this.renderOrganizationDetailsComponent()
          }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationList);
