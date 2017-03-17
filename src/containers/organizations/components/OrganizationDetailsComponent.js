/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';
import StyledFlexContainerStackedLeftAligned from '../../../components/flex/StyledFlexContainerStackedLeftAligned';

import OrganizationAddMembersSectionComponent from './OrganizationAddMembersSectionComponent';
import OrganizationDescriptionSectionComponent from './OrganizationDescriptionSectionComponent';
import OrganizationDomainsSectionComponent from './OrganizationDomainsSectionComponent';
import OrganizationMembersSectionComponent from './OrganizationMembersSectionComponent';
import OrganizationRolesSectionComponent from './OrganizationRolesSectionComponent';
import OrganizationTitleSectionComponent from './OrganizationTitleSectionComponent';

import { isDefined, isNonEmptyString } from '../../../utils/LangUtils';

import {
  fetchOrganizationRequest
} from '../actions/OrganizationsActionFactory';

const LoadingSpinnerWrapper = styled.div`
  width: 100%;
`;

const MODES = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  VIEW: 'VIEW'
};

function mapStateToProps(state :Immutable.Map, ownProps :Object) {

  const isCreatingOrg = state.getIn(['organizations', 'isCreatingOrg']);
  const isFetchingOrg = state.getIn(['organizations', 'isFetchingOrg']);

  // TODO: checking if orgId === 'new' feels wrong. there's probably a better pattern for this use case.
  if (isDefined(ownProps.params) && ownProps.params.orgId === 'new') {
    return {
      isCreatingOrg,
      isFetchingOrg: false,
      mode: MODES.CREATE,
      organization: Immutable.fromJS({
        isOwner: true
      }),
      organizationId: ''
    };
  }

  let mode = MODES.VIEW;
  let organizationId;

  if (isDefined(ownProps.params) && isNonEmptyString(ownProps.params.orgId)) {
    organizationId = ownProps.params.orgId;
  }

  const organization = state.getIn(['organizations', 'organizations', organizationId], Immutable.Map());
  if (organization.get('isOwner') === true) {
    mode = MODES.EDIT;
  }

  return {
    isCreatingOrg,
    isFetchingOrg,
    mode,
    organization,
    organizationId
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    fetchOrganizationRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationDetailsComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      fetchOrganizationRequest: React.PropTypes.func.isRequired
    }).isRequired,
    isCreatingOrg: React.PropTypes.bool.isRequired,
    isFetchingOrg: React.PropTypes.bool.isRequired,
    mode: React.PropTypes.string.isRequired,
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    organizationId: React.PropTypes.string.isRequired
  }

  componentDidMount() {

    if ((this.props.mode === MODES.VIEW || this.props.mode === MODES.EDIT)) {
      this.props.actions.fetchOrganizationRequest(this.props.organizationId);
    }
  }

  componentWillReceiveProps(nextProps :Object) {

    if ((nextProps.mode === MODES.VIEW || nextProps.mode === MODES.EDIT)) {
      if (this.props.organizationId !== nextProps.organizationId) {
        this.props.actions.fetchOrganizationRequest(nextProps.organizationId);
      }
    }
  }

  renderOrganizationTitleSection = () => {

    return (
      <OrganizationTitleSectionComponent organization={this.props.organization} />
    );
  }

  renderOrganizationDescriptionSection = () => {

    // hide in create mode
    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    return (
      <OrganizationDescriptionSectionComponent organization={this.props.organization} />
    );
  }

  renderOrganizationDomainsSection = () => {

    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    return (
      <OrganizationDomainsSectionComponent organization={this.props.organization} />
    );
  }

  renderOrganizationRolesSection = () => {

    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    return (
      <OrganizationRolesSectionComponent organization={this.props.organization} />
    );
  }

  renderOrganizationMembersSection = () => {

    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    return (
      <OrganizationMembersSectionComponent organization={this.props.organization} />
    );
  }

  renderOrganizationAddMembersSection = () => {

    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    return (
      <OrganizationAddMembersSectionComponent organization={this.props.organization} />
    );
  }

  renderLoadingSpinnerOverlay = () => {

    return (
      <LoadingSpinnerWrapper>
        <LoadingSpinner />
      </LoadingSpinnerWrapper>
    );
  }

  render() {

    if (this.props.isCreatingOrg) {
      return (
        <StyledFlexContainerStacked>
          { this.renderOrganizationTitleSection() }
          { this.renderLoadingSpinnerOverlay() }
        </StyledFlexContainerStacked>
      );
    }

    if (this.props.isFetchingOrg) {
      return (
        <StyledFlexContainerStacked>
          { this.renderLoadingSpinnerOverlay() }
        </StyledFlexContainerStacked>
      );
    }

    return (
      <StyledFlexContainerStacked>
        { this.renderOrganizationTitleSection() }
        { this.renderOrganizationDescriptionSection() }
        { this.renderOrganizationDomainsSection() }
        { this.renderOrganizationRolesSection() }
        { this.renderOrganizationMembersSection() }
        { this.renderOrganizationAddMembersSection() }
      </StyledFlexContainerStacked>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationDetailsComponent);
