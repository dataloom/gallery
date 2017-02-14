/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  DataModels
} from 'loom-data';

import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import Button from '../../../components/buttons/Button';
import InlineEditableControl from '../../../components/controls/InlineEditableControl';
import StyledFlexContainer from '../../../components/flex/StyledFlexContainer';
import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';
import StyledFlexContainerStackedLeftAligned from '../../../components/flex/StyledFlexContainerStackedLeftAligned';

import { isDefined, isNonEmptyString } from '../../../utils/LangUtils';

import {
  createOrganizationRequest,
  updateOrganizationDescriptionRequest,
  updateOrganizationTitleRequest
} from '../actions/OrganizationActionFactory';

import {
  fetchOrgRequest
} from '../actions/OrganizationsActionFactory';

const {
  Organization,
  OrganizationBuilder
} = DataModels;

const MODES = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  VIEW: 'VIEW'
};

function mapStateToProps(state :Immutable.Map, ownProps :Object) {

  // TODO: checking if orgId === 'new' feels wrong. there's probably a better pattern for this use case.
  if (isDefined(ownProps.params) && ownProps.params.orgId === 'new') {
    return {
      isFetchingOrg: false,
      mode: MODES.CREATE,
      organization: Immutable.Map(),
      organizationId: ''
    };
  }

  let mode = MODES.VIEW;
  let organizationId;

  if (isDefined(ownProps.params) && isNonEmptyString(ownProps.params.orgId)) {
    organizationId = ownProps.params.orgId;
  }

  const isFetchingOrg = state.getIn(['organizations', 'isFetchingOrg']);
  const organization = state.getIn(['organizations', 'organizations', organizationId], Immutable.Map());
  if (organization.get('isOwner') === true) {
    mode = MODES.EDIT;
  }

  return {
    isFetchingOrg,
    mode,
    organization,
    organizationId
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    createOrganizationRequest,
    fetchOrgRequest,
    updateOrganizationDescriptionRequest,
    updateOrganizationTitleRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };

}

class OrganizationDetailsComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      createOrganizationRequest: React.PropTypes.func.isRequired,
      fetchOrgRequest: React.PropTypes.func.isRequired,
      updateOrganizationDescriptionRequest: React.PropTypes.func.isRequired,
      updateOrganizationTitleRequest: React.PropTypes.func.isRequired
    }).isRequired,
    isFetchingOrg: React.PropTypes.bool.isRequired,
    mode: React.PropTypes.string.isRequired,
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    organizationId: React.PropTypes.string.isRequired
  }

  componentDidMount() {

    console.log('OrganizationDetailsComponent.componentDidMount()');

    if ((this.props.mode === MODES.VIEW || this.props.mode === MODES.EDIT)) {
      this.props.actions.fetchOrgRequest(this.props.organizationId);
    }
  }

  componentWillReceiveProps(nextProps :Object) {

    console.log('OrganizationDetailsComponent.componentWillReceiveProps()');

    if ((nextProps.mode === MODES.VIEW || nextProps.mode === MODES.EDIT)) {
      if (this.props.organizationId !== nextProps.organizationId) {
        this.props.actions.fetchOrgRequest(nextProps.organizationId);
      }
    }
  }

  updateOrganizationTitle = (title :string) => {

    const orgBuilder :OrganizationBuilder = new OrganizationBuilder();

    if (this.props.mode === MODES.CREATE) {
      const org :Organization = orgBuilder
        .setTitle(title)
        .build();
      this.props.actions.createOrganizationRequest(org);
    }
    else {
      const org :Organization = orgBuilder
        .setId(this.props.organization.get('id'))
        .setTitle(title)
        .build();
      this.props.actions.updateOrganizationTitleRequest(org);
    }
  }

  updateOrganizationDescription = (description :string) => {

    const org :Organization = (new OrganizationBuilder())
      .setId(this.props.organization.get('id'))
      .setTitle(this.props.organization.get('title'))
      .setDescription(description)
      .build();

    this.props.actions.updateOrganizationDescriptionRequest(org);
  }

  renderOrganizationHeaderSection = () => {

    return (
      <StyledFlexContainerStackedLeftAligned>
        { this.renderOrganizationTitleSection() }
        { this.renderOrganizationDescriptionSection() }
      </StyledFlexContainerStackedLeftAligned>
    );
  }

  renderOrganizationTitleSection = () => {

    return (
      <InlineEditableControl
          type="text"
          size="xlarge"
          placeholder="Organization title..."
          value={this.props.organization.get('title')}
          onChange={this.updateOrganizationTitle} />
    );
  }

  renderOrganizationDescriptionSection = () => {

    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    return (
      <InlineEditableControl
          type="textarea"
          size="medium"
          placeholder="Organization description..."
          value={this.props.organization.get('description')}
          onChange={this.updateOrganizationDescription} />
    );
  }

  render() {

    console.log('OrganizationDetailsComponent.render()');

    if (this.props.isFetchingOrg) {
      return <LoadingSpinner />;
    }

    return (
      <StyledFlexContainerStacked>
        { this.renderOrganizationHeaderSection() }
      </StyledFlexContainerStacked>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationDetailsComponent);
