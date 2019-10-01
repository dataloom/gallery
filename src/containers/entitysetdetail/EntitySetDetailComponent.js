import React from 'react';

import classnames from 'classnames';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';
import styled from 'styled-components';

import { EntityDataModelApi } from 'lattice';
import { Button, Modal, SplitButton, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import InlineEditableControl from '../../components/controls/InlineEditableControl';
import StyledFlexContainer from '../../components/flex/StyledFlexContainer';
import StyledFlexContainerStacked from '../../components/flex/StyledFlexContainerStacked';
import Page from '../../components/page/Page';
import PageConsts from '../../utils/Consts/PageConsts';
import PermissionsPanel from '../permissionspanel/PermissionsPanel';
import PropertyTypeList from '../edm/components/PropertyTypeList';
import ActionDropdown from '../edm/components/ActionDropdown';
import AddDataForm from '../entitysetforms/AddDataForm';
import EntitySetPermissionsRequestList from '../permissions/components/EntitySetPermissionsRequestList';
import IntegrationDetailsModal from './IntegrationDetailsModal';
import BasicButton from '../../components/buttons/BasicButton';
import InfoButton from '../../components/buttons/InfoButton';

import * as NeuronActionFactory from '../../core/neuron/NeuronActionFactory';
import * as edmActionFactories from '../edm/EdmActionFactories';
import * as PermissionsActionFactory from '../permissions/PermissionsActionFactory';
import * as OrganizationsActionFactory from '../organizations/actions/OrganizationsActionFactory';
import * as psActionFactories from '../permissionssummary/PermissionsSummaryActionFactory';

import {
  PermissionsPropType,
  getPermissions,
  DEFAULT_PERMISSIONS,
  PERMISSIONS
} from '../permissions/PermissionsStorage';

import styles from './entitysetdetail.module.css';

const TitleControlsContainer = styled(StyledFlexContainer)`
  justify-content: space-between;
`;

const ControlsContainer = styled(StyledFlexContainerStacked)`
  align-items: flex-end;
  flex: 1 0 auto;
`;

const SelectWrapper = styled.div`
  min-width: 300px;
`;

const SaveButton = styled(InfoButton)`
  width: 100px;
  height: 38px;
  margin-left: 15px;
`;

const CancelButton = styled(BasicButton)`
  width: 100px;
  height: 38px;
  margin-left: 15px;
  padding: 0;
`;

const EditIcon = styled.div`
  border-style: solid;
  border-width: 1px;
  height: 32px;
  width: 32px;
  margin-left: 10px;
  font-size: 14px;
  padding: 0;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-color: #cfd8dc;

  &:hover {
    cursor: pointer;
  }
`;

const StyledOrganizationContainer = styled(StyledFlexContainer)`
  align-items: center;
`;

const UpdateTypes = {
  ES_ONLY: 0,
  ALL: 1,
  NON_PII: 2
};

class EntitySetDetailComponent extends React.Component {
  static propTypes = {
    asyncState: AsyncStatePropType.isRequired,
    router: PropTypes.object.isRequired,

    // Async content
    entitySetPermissions: PermissionsPropType.isRequired,

    // Loading
    // loadEntitySet: PropTypes.func.isRequired,
    updateMetadata: PropTypes.func.isRequired,
    resetPermissions: PropTypes.func.isRequired,
    loadOwnedPropertyTypes: PropTypes.func.isRequired,

    entitySet: PropTypes.instanceOf(Immutable.Map).isRequired,
    entitySetId: PropTypes.string.isRequired,
    entityType: PropTypes.instanceOf(Immutable.Map).isRequired,
    organization: PropTypes.instanceOf(Immutable.Map).isRequired,
    writableOrganizations: PropTypes.instanceOf(Immutable.List).isRequired,
    propertyTypes: PropTypes.instanceOf(Immutable.List).isRequired,
    propertyTypeIds: PropTypes.instanceOf(Immutable.List).isRequired,
    ownedPropertyTypes: PropTypes.instanceOf(Immutable.List).isRequired,
    entitySetPropertyMetadata: PropTypes.instanceOf(Immutable.Map).isRequired,
    subscribeToEntitySetAclKeyRequest: PropTypes.func.isRequired,
    unsubscribeFromEntitySetAclKeyRequest: PropTypes.func.isRequired,
    loadEntitySetPropertyMetadata: PropTypes.func.isRequired,
    updateEntitySetPropertyMetadata: PropTypes.func.isRequired,
    fetchOrganization: PropTypes.func.isRequired,
    fetchWritableOrganizations: PropTypes.func.isRequired,
    size: PropTypes.number
  };

  constructor(props) {

    super(props);

    let modalAclKey = [];
    const entitySetId = this.props.entitySet.get('id');
    if (entitySetId) {
      modalAclKey = [entitySetId];
    }

    let modalTitle = '';
    const entitySetTitle = this.props.entitySet.get('title');
    if (entitySetTitle) {
      modalTitle = this.getPermissionsModalTitle(entitySetTitle, UpdateTypes.ES_ONLY);
    }

    this.state = {
      editingPermissions: false,
      editingOrganization: false,
      confirmingDelete: false,
      addingData: false,
      deleteError: false,
      isIntegrationDetailsOpen: false,
      permissionsModalTitle: modalTitle,
      permissionsModalAclKey: modalAclKey,
      permissionsUpdateType: UpdateTypes.ES_ONLY,
      newOrganizationId: null
    };
  }

  componentDidMount() {
    const { entitySet } = this.props;

    this.props.resetPermissions();
    // this.props.loadEntitySet();

    this.props.subscribeToEntitySetAclKeyRequest([this.props.entitySetId]);
    this.props.loadEntitySetPropertyMetadata(this.props.entitySetId);
    this.props.fetchWritableOrganizations();

    const organizationId = entitySet.get('organizationId');
    if (organizationId) {
      this.props.fetchOrganization(organizationId);
    }

  }

  componentWillUnmount() {

    this.props.unsubscribeFromEntitySetAclKeyRequest([this.props.entitySetId]);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entitySet) {

      if (!this.props.entitySet || this.props.entitySet.get('id') !== nextProps.entitySet.get('id')) {
        this.setState({
          permissionsModalTitle: this.getPermissionsModalTitle(nextProps.entitySet.get('title'), UpdateTypes.ES_ONLY),
          permissionsModalAclKey: [nextProps.entitySet.get('id')]
        });
      }


      const nextOrganizationId = nextProps.entitySet.get('organizationId');

      if (!this.props.entitySet || this.props.entitySet.get('organizationId') !== nextOrganizationId) {
        if (nextOrganizationId && nextProps.organization.get('id') !== nextOrganizationId) {
          this.props.fetchOrganization(nextOrganizationId);
        }
      }

      let shouldLoad = false;
      // TODO: consider another way of doing this to avoid forEach() and includes()
      nextProps.propertyTypeIds.forEach((propertyTypeId) => {
        if (!this.props.propertyTypeIds.includes(propertyTypeId)) {
          shouldLoad = true;
        }
      });

      if (shouldLoad) {
        this.props.loadOwnedPropertyTypes(nextProps.entitySet.get('id'), nextProps.propertyTypeIds);
      }
    }
  }

  // TODO: figure out how to implement this
  // shouldComponentUpdate(nextProps, nextState) {
  // }

  getOrganizationOptions() {
    const { writableOrganizations } = this.props;

    const options = [];
    writableOrganizations.forEach((organization) => {
      if (!organization.isEmpty()) {
        options.push({
          value: organization.get('id'),
          label: organization.get('title')
        });
      }
    });

    return options;
  }

  setEditingPermissions = () => {
    this.setState({ editingPermissions: true });
  };

  updateEntitySetTitle = (title) => {
    if (title && title.length) {
      this.props.updateMetadata(this.props.entitySet.get('id'), { title });
    }
  }

  updateEntitySetDescription = (description) => {
    if (description) this.props.updateMetadata(this.props.entitySet.get('id'), { description });
  }

  updateEntitySetContacts = (contacts) => {
    if (contacts) this.props.updateMetadata(this.props.entitySet.get('id'), { contacts: [contacts] });
  }

  updateEntitySetOrganization = (organizationId) => {
    if (organizationId) this.props.updateMetadata(this.props.entitySet.get('id'), { organizationId });
    this.setState({ editingOrganization: false })
  }

  onOrganizationChange = (option) => {
    const newOrganizationId = (option) ? option.value : null;
    this.setState({ newOrganizationId });
  };

  renderTitle = (title, isOwner) => {
    return (<InlineEditableControl
        type="text"
        size="xlarge"
        placeholder="Entity set title..."
        value={title}
        viewOnly={!isOwner}
        onChange={this.updateEntitySetTitle} />);
  }

  renderDescription = (description, isOwner) => {
    return (<InlineEditableControl
        type="textarea"
        size="small"
        placeholder="Entity set description..."
        value={description}
        viewOnly={!isOwner}
        onChange={this.updateEntitySetDescription} />);
  }

  renderEntitySetContacts = (contacts, isOwner) => {
    return (<InlineEditableControl
        type="text"
        size="small"
        placeholder="Entity set owner contacts..."
        value={contacts}
        viewOnly={!isOwner}
        onChange={this.updateEntitySetContacts} />);
  }

  renderOrganization = (organizationId, isOwner) => {
    const { editingOrganization, newOrganizationId } = this.state;
    const { organization } = this.props;

    const organizationTitle = organization.get('title');

    const defaultContent = organizationTitle
      ? <div>{organizationTitle}</div>
      : <div className={styles.italic}>Cannot load organization</div>;

    return (
      <StyledOrganizationContainer>
        {
          isOwner && editingOrganization ? (
            <StyledFlexContainer>
              <SelectWrapper>
                <Select
                    value={newOrganizationId}
                    options={this.getOrganizationOptions()}
                    onChange={this.onOrganizationChange} />
              </SelectWrapper>
              <SaveButton
                  disabled={!newOrganizationId}
                  onClick={() => this.updateEntitySetOrganization(newOrganizationId)}>
                Save
              </SaveButton>
              <CancelButton onClick={() => this.setState({ editingOrganization: false, newOrganizationId: null })}>
                Cancel
              </CancelButton>
            </StyledFlexContainer>
          ) : defaultContent
        }
        {
          isOwner && !editingOrganization ? (
            <EditIcon className="icon" onClick={() => this.setState({ editingOrganization: true })}>
              <FontAwesome name="pencil" />
            </EditIcon>
          ) : null
        }
      </StyledOrganizationContainer>
    );
  }

  renderHeaderContent = () => {

    const { entitySet, entitySetPermissions } = this.props;

    if (!entitySet || entitySet.isEmpty()) {
      return null;
    }

    const contactValue = (entitySet.get('contacts').size > 0) ? entitySet.get('contacts').join(', ') : 'none';

    return (
      <StyledFlexContainerStacked>
        <TitleControlsContainer>
          <div>
            <Page.Title>{this.renderTitle(entitySet.get('title'), entitySetPermissions.OWNER)}</Page.Title>
            <div className={styles.descriptionTitle}>About this data</div>
            {this.renderDescription(entitySet.get('description'), entitySetPermissions.OWNER)}
            <span className={styles.contacts}>
              {this.renderEntitySetContacts(contactValue, entitySetPermissions.OWNER)}
            </span>
            <div className={`${styles.descriptionTitle} ${styles.organizationSection}`}>Organization</div>
            {this.renderOrganization(entitySet.get('organizationId'), entitySetPermissions.OWNER)}
          </div>

          <ControlsContainer>

            <ActionDropdown entitySetId={entitySet.get('id')} className={classnames(styles.actionDropdown)} />
            {
              entitySetPermissions.OWNER &&
              <Button bsStyle="info" onClick={this.setEditingPermissions} className={styles.managePermissions}>
                Manage Permissions
              </Button>
            }
          </ControlsContainer>
        </TitleControlsContainer>
        {
          entitySetPermissions.OWNER &&
          <EntitySetPermissionsRequestList
              entitySetId={entitySet.get('id')}
              propertyTypeIds={this.props.propertyTypeIds}
              customSettings={this.props.entitySetPropertyMetadata} />
        }
      </StyledFlexContainerStacked>
    );
  };

  updateModalView = (newViewTitle, newViewAclKey, updateType) => {
    this.setState({
      permissionsModalTitle: newViewTitle,
      permissionsModalAclKey: newViewAclKey,
      permissionsUpdateType: updateType
    });
  }

  getPermissionsModalTitle = (title, updateType) => {
    switch (updateType) {
      case UpdateTypes.ES_ONLY:
        return `${title} (dataset only)`;
      case UpdateTypes.ALL:
        return `${title} (dataset and all owned properties)`;
      case UpdateTypes.NON_PII:
        return `${title} (dataset and all non-pii properties)`;
      default:
        return `${title} (dataset only)`;
    }
  }

  getPermissionsManagementOptions = () => {

    if (!this.props.entitySetPermissions.OWNER) {
      return null;
    }

    const propertyTypeOptions = [];
    this.props.ownedPropertyTypes.forEach((propertyType) => {

      const propertyTypeId = propertyType.get('id');
      const aclKey = [this.props.entitySet.get('id'), propertyTypeId];
      const title = this.props.entitySetPropertyMetadata
        .getIn([propertyTypeId, 'title'], propertyType.get('title'));

      propertyTypeOptions.push(
        <MenuItem
            eventKey={propertyTypeId}
            key={propertyTypeId}
            onClick={() => {
              this.updateModalView(title, aclKey);
            }}>
          {title}
        </MenuItem>
      );
    });

    const esTitle = this.props.entitySet.get('title');
    const esOnlyTitle = this.getPermissionsModalTitle(esTitle, UpdateTypes.ES_ONLY);
    const esAllTitle = this.getPermissionsModalTitle(esTitle, UpdateTypes.ALL);
    const esNonPiiTitle = this.getPermissionsModalTitle(esTitle, UpdateTypes.NON_PII);

    return (
      <SplitButton bsStyle="default" title={this.state.permissionsModalTitle} id="permissions-select">
        <MenuItem header>Dataset</MenuItem>
        <MenuItem
            onClick={() => {
              this.updateModalView(esOnlyTitle, [this.props.entitySet.get('id')], UpdateTypes.ES_ONLY);
            }}
            eventKey={esOnlyTitle}>
          {esOnlyTitle}
        </MenuItem>
        <MenuItem
            onClick={() => {
              this.updateModalView(esAllTitle, [this.props.entitySet.get('id')], UpdateTypes.ALL);
            }}
            eventKey={esAllTitle}>
          {esAllTitle}
        </MenuItem>
        <MenuItem
            onClick={() => {
              this.updateModalView(esNonPiiTitle, [this.props.entitySet.get('id')], UpdateTypes.NON_PII);
            }}
            eventKey={esNonPiiTitle}>
          {esNonPiiTitle}
        </MenuItem>
        <MenuItem divider />
        <MenuItem header>Property Types</MenuItem>
        {propertyTypeOptions}
      </SplitButton>
    );
  }

  renderPermissionsSummaryText = () => {
    return (
      <div className={styles.permissionsSummaryTextWrapper}>
        <Link
            to={`/entitysets/${this.props.params.id}/allpermissions`}
            className={styles.permissionsSummaryText}>
          See a complete overview of assigned permissions for this dataset
        </Link>
      </div>
    );
  }

  renderPermissionsPanel = () => {

    if (!this.props.entitySet || this.props.entitySet.isEmpty()) {
      return null;
    }

    const aclKey = this.state.permissionsModalAclKey;
    let panel = null;
    if (aclKey.length === 1) {
      const aclKeysToUpdate = [aclKey];
      if (this.state.permissionsUpdateType === UpdateTypes.ALL) {
        this.props.ownedPropertyTypes.forEach((propertyType) => {
          aclKeysToUpdate.push([this.props.entitySet.get('id'), propertyType.get('id')]);
        });
      }
      else if (this.state.permissionsUpdateType === UpdateTypes.NON_PII) {
        this.props.ownedPropertyTypes
          .filter(propertyType => propertyType.get('pii') === false)
          .forEach((propertyType) => {
            aclKeysToUpdate.push([this.props.entitySet.get('id'), propertyType.get('id')]);
          });
      }
      panel = (
        <PermissionsPanel
            entitySetId={aclKey[0]}
            aclKeysToUpdate={aclKeysToUpdate}
            allSelected={this.state.permissionsShouldUpdateAll} />
      );
    }
    else if (aclKey.length === 2) {
      panel = <PermissionsPanel entitySetId={aclKey[0]} propertyTypeId={aclKey[1]} aclKeysToUpdate={[aclKey]} />;
    }
    return (
      <Modal
          show={this.state.editingPermissions}
          onHide={this.closePermissionsPanel}>
        <Modal.Header closeButton>
          <Modal.Title>Manage permissions for {this.getPermissionsManagementOptions()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {panel}
          {this.renderPermissionsSummaryText()}
        </Modal.Body>
      </Modal>
    );
  };

  renderSearchEntitySet = () => {

    if (!this.props.entitySet || this.props.entitySet.isEmpty()) {
      return null;
    }

    return (
      <div className={styles.buttonWrapper}>
        <Link className={styles.buttonLink} to={`/search/${this.props.entitySet.get('id')}`}>
          <Button bsStyle="primary" className={styles.center}>
            <FontAwesome name="search" />
            <span className={styles.buttonText}>Search this entity set</span>
          </Button>
        </Link>
      </div>
    );
  }

  renderAddDataForm = () => {

    if (!this.props.entitySet || this.props.entitySet.isEmpty() || !this.props.entitySetPermissions.WRITE) {
      return null;
    }

    return (
      <Modal
          show={this.state.addingData}
          onHide={this.closeAddDataModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new row of data to this entity set</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddDataForm
              entitySetId={this.props.entitySet.get('id')}
              primaryKey={this.props.entityType.get('key')}
              propertyTypes={this.props.ownedPropertyTypes}
              entitySetPropertyMetadata={this.props.entitySetPropertyMetadata} />
        </Modal.Body>
      </Modal>
    );
  }

  deleteEntitySet = () => {

    if (!this.props.entitySet || this.props.entitySet.isEmpty()) {
      return;
    }

    EntityDataModelApi.deleteEntitySet(this.props.entitySet.get('id'))
    .then(() => {
      this.props.router.push(`/${PageConsts.HOME}`);
    }).catch(() => {
      this.setState({
        confirmingDelete: false,
        deleteError: true
      });
    });
  }

  setConfirmingDelete = () => {
    this.setState({ confirmingDelete: true });
  }

  cancelDelete = () => {
    this.setState({ confirmingDelete: false });
  }

  openAddDataModal = () => {
    this.setState({ addingData: true });
  }

  closeAddDataModal = () => {
    this.setState({ addingData: false });
  }

  openIntegrationDetailsModal = () => {
    this.setState({ isIntegrationDetailsOpen: true });
  }

  closeIntegrationDetailsModal = () => {
    this.setState({ isIntegrationDetailsOpen: false });
  }

  renderAddDataButton = () => {

    if (!this.props.entitySet || this.props.entitySet.isEmpty() || !this.props.entitySetPermissions.WRITE) {
      return null;
    }

    return (
      <div className={styles.buttonWrapper}>
        <Button
            bsStyle="success"
            className={styles.center}
            onClick={this.openAddDataModal}>
          <FontAwesome name="plus" size="lg" />
          <span className={styles.buttonText}>Add Data</span>
        </Button>
      </div>
    );
  }

  renderIntegrationDetailsLink = () => {

    if (!this.props.entitySet || this.props.entitySet.isEmpty() || !this.props.entitySetPermissions.WRITE) {
      return null;
    }

    return (
      <div className={styles.buttonWrapper}>
        <Link
            className={`${styles.center} ${styles.link}`}
            onClick={this.openIntegrationDetailsModal}>
          <span className={styles.buttonText}>View Integration Details</span>
        </Link>
      </div>
    );
  }

  renderIntegrationDetailsModal = () => {
    return (
      <IntegrationDetailsModal
          isOpen={this.state.isIntegrationDetailsOpen}
          onClose={this.closeIntegrationDetailsModal}
          entitySet={this.props.entitySet}
          entityType={this.props.entityType}
          propertyTypes={this.props.propertyTypes} />
    );
  }

  renderDeleteEntitySet = () => {

    if (!this.props.entitySet || this.props.entitySet.isEmpty() || !this.props.entitySetPermissions.OWNER) {
      return null;
    }

    const error = (this.state.deleteError) ? <div className={styles.error}>Unable to delete entity set</div> : null;
    return (
      <div className={styles.buttonWrapper}>
        <Button
            bsStyle="danger"
            className={styles.center}
            onClick={this.setConfirmingDelete}>
          <FontAwesome name="times" size="lg" />
          <span className={styles.buttonText}>Delete this entity set</span>
        </Button>
        {error}
      </div>
    );
  }

  renderConfirmDeleteModal = () => {

    if (!this.props.entitySet || this.props.entitySet.isEmpty()) {
      return null;
    }

    return (
      <Modal
          show={this.state.confirmingDelete}
          onHide={this.cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete {this.props.entitySet.get('title')}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.centerWrapper}>
            <Button onClick={this.deleteEntitySet} bsStyle="danger">Confirm</Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  closePermissionsPanel = () => {
    this.setState({ editingPermissions: false });
  };

  getDocumentTitle = () => {
    return (this.props.entitySet) ? this.props.entitySet.get('title') : PageConsts.DEFAULT_DOCUMENT_TITLE;
  }

  getDataHeader = () => {
    const size = this.props.size;
    const sizeLabel = (size !== null && size !== undefined) ? `(${size} entities)` : null;
    return (
      <h2 className={styles.propertyTypeTitle}>
        Data in Entity Set
        <span className={styles.numEntitiesLabel}>{sizeLabel}</span>
      </h2>
    );
  }

  render() {
    return (
      <div>
        <Page.Header>
          <AsyncContent {...this.props.asyncState} content={this.renderHeaderContent} />
        </Page.Header>
        <Page.Body>
          {this.renderAddDataButton()}
          {this.getDataHeader()}
          <AsyncContent
              {...this.props.asyncState}
              content={() => {
                // TODO: Remove when removing denormalization
                const propertyTypeIds = this.props.entityType.get('properties', Immutable.List());
                return (
                  <PropertyTypeList
                      entitySetId={this.props.entitySet.get('id')}
                      propertyTypeIds={propertyTypeIds}
                      className="propertyTypeStyleDefault"
                      isOwner={this.props.entitySetPermissions.OWNER}
                      updateCustomSettings={this.props.updateEntitySetPropertyMetadata} />
                );
              }} />
          {this.renderAddDataForm()}
          {this.renderPermissionsPanel()}
          {this.renderSearchEntitySet()}
          {this.renderDeleteEntitySet()}
          {this.renderConfirmDeleteModal()}
          {this.renderIntegrationDetailsLink()}
          {this.renderIntegrationDetailsModal()}
        </Page.Body>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {


  const permissions = state.get('permissions');
  const entitySetDetail = state.get('entitySetDetail');

  const entitySetId = ownProps.params.id;
  const entitySet = state.getIn(['edm', 'entitySets', entitySetId], Immutable.Map());

  let entitySetPermissions;
  if (!entitySet.isEmpty()) {
    entitySetPermissions = getPermissions(permissions, [entitySet.get('id')]);
  }
  else {
    entitySetPermissions = DEFAULT_PERMISSIONS;
  }

  const organization = state.getIn(['organizations', 'organizations', entitySet.get('organizationId')], Immutable.Map());
  const writableOrganizations = state.getIn(['organizations', 'writableOrganizations'], Immutable.List());

  const entityTypeId = entitySet.get('entityTypeId');
  const entityType = state.getIn(['edm', 'entityTypes', entityTypeId], Immutable.Map());
  const propertyTypeIds = entityType.get('properties', Immutable.List());
  let ownedPropertyTypes = Immutable.List();
  let propertyTypes = Immutable.List();
  if (!propertyTypeIds.isEmpty()) {
    propertyTypeIds.forEach((propertyTypeId) => {
      const pt = state.getIn(['edm', 'propertyTypes', propertyTypeId], Immutable.Map());
      propertyTypes = propertyTypes.push(pt);
      if (getPermissions(permissions, [entitySetId, propertyTypeId]).OWNER) {
        ownedPropertyTypes = ownedPropertyTypes.push(pt);
      }
    });
  }
  const size = entitySetDetail.get('size');

  const entitySetPropertyMetadata = state.getIn(['edm', 'entitySetPropertyMetadata', entitySetId], Immutable.Map());

  return {
    asyncState: entitySetDetail.get('asyncState').toJS(),
    entitySet,
    entitySetId,
    entitySetPermissions,
    entityType,
    propertyTypes,
    ownedPropertyTypes,
    propertyTypeIds,
    entitySetPropertyMetadata,
    size,
    organization,
    writableOrganizations
  };
}

function mapDispatchToProps(dispatch) {

  return {
    resetPermissions: () => {
      dispatch(psActionFactories.resetPermissions());
    },
    updateMetadata: (entitySetId, metadataUpdate) => {
      dispatch(edmActionFactories.updateEntitySetMetadataRequest(entitySetId, metadataUpdate));
    },
    loadOwnedPropertyTypes: (entitySetId, propertyTypeIds) => {
      const accessChecks = [];
      propertyTypeIds.forEach((propertyTypeId) => {
        accessChecks.push({
          aclKey: [entitySetId, propertyTypeId],
          permissions: [PERMISSIONS.OWNER]
        });
      });
      dispatch(PermissionsActionFactory.checkAuthorizationRequest(accessChecks));
    },
    subscribeToEntitySetAclKeyRequest: (aclKey) => {
      dispatch(NeuronActionFactory.subscribeToAclKeyRequest(aclKey));
    },
    unsubscribeFromEntitySetAclKeyRequest: (aclKey) => {
      dispatch(NeuronActionFactory.unsubscribeFromAclKeyRequest(aclKey));
    },
    loadEntitySetPropertyMetadata: (entitySetId) => {
      dispatch(edmActionFactories.getAllEntitySetPropertyMetadataRequest(entitySetId));
    },
    updateEntitySetPropertyMetadata: (entitySetId, propertyTypeId, metadataUpdate) => {
      dispatch(edmActionFactories.updateEntitySetPropertyMetadataRequest(entitySetId, propertyTypeId, metadataUpdate));
    },
    fetchOrganization: (organizationId) => dispatch(OrganizationsActionFactory.fetchOrganizationRequest(organizationId)),
    fetchWritableOrganizations: () => dispatch(OrganizationsActionFactory.fetchWritableOrganizations())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetDetailComponent);
