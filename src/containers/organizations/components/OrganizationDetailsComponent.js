import React from 'react';

import DocumentTitle from 'react-document-title';
import Immutable from 'immutable';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import Button from '../../../components/buttons/Button';
import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';

import OrganizationAddMembersSectionComponent from './OrganizationAddMembersSectionComponent';
import OrganizationDescriptionSectionComponent from './OrganizationDescriptionSectionComponent';
import OrganizationEntitySetsSectionComponent from './OrganizationEntitySetsSectionComponent';
import OrganizationNameSectionComponent from './OrganizationNameSectionComponent';
import OrganizationDomainsSectionComponent from './OrganizationDomainsSectionComponent';
import OrganizationIntegrationDetailsSectionComponent from './OrganizationIntegrationDetailsSectionComponent';
import OrganizationMembersSectionComponent from './OrganizationMembersSectionComponent';
import OrganizationRolesSectionComponent from './OrganizationRolesSectionComponent';
import OrganizationTitleSectionComponent from './OrganizationTitleSectionComponent';
import OrganizationTrustedOrgsSectionComponent from './OrganizationTrustedOrgsSectionComponent';
import OrganizationDeleteConfirmationModal from './OrganizationDeleteConfirmationModal';

import { isDefined, isNonEmptyString } from '../../../utils/LangUtils';

import {
  deleteOrganizationRequest,
  getOrganizationIntegrationAccount,
  fetchMembersRequest,
  loadTrustedOrganizationsRequest,
  loadOrganizationEntitySets,
  showDeleteModal,
  hideDeleteModal
} from '../actions/OrganizationActionFactory';

import {
  fetchOrganizationRequest,
  fetchOrganizationsRequest
} from '../actions/OrganizationsActionFactory';

const LoadingSpinnerWrapper = styled.div`
  width: 100%;
`;

const DeleteButtonSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

const MODES = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  VIEW: 'VIEW'
};

function mapStateToProps(state, ownProps) {

  const isCreatingOrg = state.getIn(['organizations', 'isCreatingOrg']);
  const isFetchingOrg = state.getIn(['organizations', 'isFetchingOrg']);
  const isConfirmingDeletion = state.getIn(['organizations', 'isConfirmingDeletion']);

  // TODO: checking if orgId === 'new' feels wrong. there's probably a better pattern for this use case.
  if (isDefined(ownProps.params) && ownProps.params.orgId === 'new') {
    return {
      isCreatingOrg,
      isFetchingOrg: false,
      isConfirmingDeletion,
      mode: MODES.CREATE,
      organization: Immutable.fromJS({
        isOwner: true
      }),
      organizationId: '',
      members: Immutable.List()
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

  const members = state.getIn(['organizations', 'members'], Immutable.List());

  return {
    isCreatingOrg,
    isFetchingOrg,
    isConfirmingDeletion,
    mode,
    organization,
    organizationId,
    members
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {
    deleteOrganizationRequest,
    fetchMembersRequest,
    getOrganizationIntegrationAccount,
    loadTrustedOrganizationsRequest,
    fetchOrganizationRequest,
    fetchOrganizationsRequest,
    loadOrganizationEntitySets,
    showDeleteModal,
    hideDeleteModal
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationDetailsComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      deleteOrganizationRequest: React.PropTypes.func.isRequired,
      fetchMembersRequest: React.PropTypes.func.isRequired,
      fetchOrganizationRequest: React.PropTypes.func.isRequired,
      loadTrustedOrganizationsRequest: React.PropTypes.func.isRequired,
      loadOrganizationEntitySets: React.PropTypes.func.isRequired,
      showDeleteModal: React.PropTypes.func.isRequired,
      hideDeleteModal: React.PropTypes.func.isRequired
    }).isRequired,
    isCreatingOrg: React.PropTypes.bool.isRequired,
    isFetchingOrg: React.PropTypes.bool.isRequired,
    isConfirmingDeletion: React.PropTypes.bool.isRequired,
    mode: React.PropTypes.string.isRequired,
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    organizationId: React.PropTypes.string.isRequired
  }

  componentDidMount() {

    const { actions, mode, organization, organizationId } = this.props;

    if (mode === MODES.VIEW || mode === MODES.EDIT) {
      actions.fetchOrganizationRequest(organizationId);
      actions.fetchMembersRequest(organizationId);
      actions.fetchOrganizationsRequest();
      actions.loadOrganizationEntitySets(organizationId);

      if (organization.get('isOwner')) {
        actions.loadTrustedOrganizationsRequest(organizationId);
        actions.getOrganizationIntegrationAccount(organizationId);
      }
    }
  }

  componentWillReceiveProps(nextProps :Object) {
    const { actions, organizationId, organization } = this.props;

    if (nextProps.mode === MODES.VIEW || nextProps.mode === MODES.EDIT) {
      if (organizationId !== nextProps.organizationId) {
        actions.fetchOrganizationRequest(nextProps.organizationId);
        actions.fetchMembersRequest(nextProps.organizationId);
        actions.loadOrganizationEntitySets(nextProps.organizationId);
      }

      if (organization !== nextProps.organization && nextProps.organization.get('isOwner')) {
        actions.loadTrustedOrganizationsRequest(organizationId);
        actions.getOrganizationIntegrationAccount(organizationId);
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

  renderOrganizationNameSection = () => {

    // hide in create mode
    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    return (
      <OrganizationNameSectionComponent organization={this.props.organization} />
    );


  }

  renderOrganizationIntegrationAccountSection = () => {

    // hide in create mode or if user is not an organization owner
    if (this.props.mode === MODES.CREATE || !this.props.organization.get('isOwner')) {
      return null;
    }

    return (
      <OrganizationIntegrationDetailsSectionComponent organization={this.props.organization} />
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

  renderOrganizationTrustedOrgsSection = () => {

    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    if (this.props.organization.get('isOwner')) {
      return <OrganizationTrustedOrgsSectionComponent organization={this.props.organization} />
    }

    return null;
  }

  renderOrganizationMembersSection = () => {

    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    return (
      <OrganizationMembersSectionComponent organization={this.props.organization} users={this.props.members} />
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

  renderOrganizationEntitySetsSection = () => {

    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    return (
      <OrganizationEntitySetsSectionComponent organization={this.props.organization} />
    );
  }

  handleOnClickDeleteButton = () => {
    this.props.actions.showDeleteModal();
  }

  handleCancelDelete = () => {
    this.props.actions.hideDeleteModal();
  }

  handleConfirmDelete = () => {
    this.props.actions.deleteOrganizationRequest(this.props.organizationId);
  }

  renderOrganizationDeleteButton = () => {

    const isOwner = this.props.organization.get('isOwner', false);

    if (this.props.mode === MODES.CREATE || !isOwner) {
      return null;
    }

    return (
      <DeleteButtonSection>
        <Button scStyle="red" onClick={this.handleOnClickDeleteButton}>
          Delete Organization
        </Button>
      </DeleteButtonSection>
    );
  }

  renderLoadingSpinner = () => {

    return (
      <LoadingSpinnerWrapper>
        <LoadingSpinner />
      </LoadingSpinnerWrapper>
    );
  }

  render() {

    const title = this.props.organization.get('title', 'Organizations');
    const { isConfirmingDeletion } = this.props;

    if (this.props.isCreatingOrg) {
      return (
        <DocumentTitle title={title}>
          <StyledFlexContainerStacked>
            { this.renderOrganizationTitleSection() }
            { this.renderLoadingSpinner() }
          </StyledFlexContainerStacked>
        </DocumentTitle>
      );
    }

    if (this.props.isFetchingOrg) {
      return (
        <DocumentTitle title={title}>
          <StyledFlexContainerStacked>
            { this.renderLoadingSpinner() }
          </StyledFlexContainerStacked>
        </DocumentTitle>
      );
    }
    return (
      <DocumentTitle title={title}>
        <StyledFlexContainerStacked>
          { this.renderOrganizationTitleSection() }
          { this.renderOrganizationDescriptionSection() }
          { this.renderOrganizationNameSection() }
          { this.renderOrganizationIntegrationAccountSection() }
          { this.renderOrganizationDomainsSection() }
          { this.renderOrganizationRolesSection() }
          { this.renderOrganizationTrustedOrgsSection() }
          { this.renderOrganizationMembersSection() }
          { this.renderOrganizationAddMembersSection() }
          { this.renderOrganizationEntitySetsSection() }
          { this.renderOrganizationDeleteButton() }
          <OrganizationDeleteConfirmationModal
              isConfirmingDeletion={isConfirmingDeletion}
              handleCancelDelete={this.handleCancelDelete}
              handleConfirmDelete={this.handleConfirmDelete} />
        </StyledFlexContainerStacked>
      </DocumentTitle>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationDetailsComponent);
