/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import Select from 'react-select';
import classnames from 'classnames';

import {
  OrganizationsApi
} from 'loom-data';

import {
  Button
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

import CreateOrganization from './CreateOrganizationComponent';

import Page from '../../../components/page/Page';

import {
  fetchOrgsRequest
} from '../actions/OrganizationsActionFactory';

import {
  fetchAllUsersRequest
} from '../actions/UsersActionFactory';

import AsyncContent, {
  AsyncStatePropType
} from '../../../components/asynccontent/AsyncContent';

const ReactSelectOptionPropType = React.PropTypes.shape({
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired
});

function mapStateToProps(state :Map<*, *>, ownProps :Object) {

  const asyncState = state.getIn(['organizations', 'asyncState']).toJS();
  const organizations = state.getIn(['organizations', 'organizations'], Immutable.Map());
  const orgCount = organizations.size;

  let selectedOrgOption = null;
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
    asyncState,
    orgCount,
    selectOrgOptions,
    selectedOrgOption
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    fetchOrgsRequest,
    fetchAllUsersRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class Organizations extends React.Component {

  state :{
    showCreateOrganizationComponent :boolean
  };

  static propTypes = {
    actions: React.PropTypes.shape({
      fetchOrgsRequest: React.PropTypes.func.isRequired,
      fetchAllUsersRequest: React.PropTypes.func.isRequired
    }).isRequired,
    asyncState: AsyncStatePropType.isRequired,
    children: React.PropTypes.node,
    orgCount: React.PropTypes.number.isRequired,
    selectOrgOptions: React.PropTypes.arrayOf(ReactSelectOptionPropType).isRequired,
    selectedOrgOption: ReactSelectOptionPropType
  };

  constructor(props) {

    super(props);

    this.state = {
      selectedOrganization: null,
      showCreateOrganizationComponent: false
    };
  }

  componentDidMount() {

    this.props.actions.fetchOrgsRequest();
    this.props.actions.fetchAllUsersRequest();
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
  }

  renderCreateOrganizationButton = () => {

    return (
      <Button bsStyle="primary" onClick={this.showCreateOrganizationComponent}>
        Create New Organization
      </Button>
    );
  }

  renderOrganizationsSelect = () => {

    const updateSelectedOrganization = (newSelectedOrgOption :Object) => {

      if (!newSelectedOrgOption) {
        hashHistory.push('/org');
      }
      else if (!this.props.selectedOrgOption || this.props.selectedOrgOption.value !== newSelectedOrgOption.value) {
        hashHistory.push(`/org/${newSelectedOrgOption.value}`);
      }
    };

    return (
      <Select
          className={classnames(styles.organizationsSelect)}
          clearable
          searchable
          options={this.props.selectOrgOptions}
          value={this.props.selectedOrgOption}
          onChange={updateSelectedOrganization} />
    );
  };

  renderCreateOrganizationComponent = () => {

    return (
      <CreateOrganization
          onCreate={this.handleCreateOrganization}
          onCancel={this.hideCreateOrganizationComponent} />
    );
  }

  renderOrganizationDetailsComponent = () => {

    return (
      <AsyncContent {...this.props.asyncState} content={this.content()} />
    );
  }

  content = () => {

    if (this.props.orgCount === 0) {
      return (
        <div>
          <h4>{ 'No organizations are available. Create a new Organization!' }</h4>
        </div>
      );
    }
    else if (!this.props.selectedOrgOption) {
      return (
        <div>
          <h4>{ 'Select an Organization to view.' }</h4>
        </div>
      );
    }

    return (
      <div>
        { React.Children.toArray(this.props.children) }
      </div>
    );
  }

  render() {

    return (
      <Page>
        <Page.Header>
          <Page.Title>Organizations</Page.Title>
          <div className={classnames(styles.headerContent)}>
            { this.renderOrganizationsSelect() }
            { this.renderCreateOrganizationButton() }
          </div>
        </Page.Header>
        <Page.Body>
          {
            this.state.showCreateOrganizationComponent
              ? this.renderCreateOrganizationComponent()
              : this.renderOrganizationDetailsComponent()
          }
        </Page.Body>
      </Page>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Organizations);
