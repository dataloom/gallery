/*
 * @flow
 */

import React from 'react';

import classnames from 'classnames';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
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

import * as NeuronActionFactory from '../../core/neuron/NeuronActionFactory';
import * as edmActionFactories from '../edm/EdmActionFactories';
import * as PermissionsActionFactory from '../permissions/PermissionsActionFactory';
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
    propertyTypes: PropTypes.instanceOf(Immutable.List).isRequired,
    propertyTypeIds: PropTypes.instanceOf(Immutable.List).isRequired,
    ownedPropertyTypes: PropTypes.instanceOf(Immutable.List).isRequired,
    entitySetPropertyMetadata: PropTypes.instanceOf(Immutable.Map).isRequired,
    subscribeToEntitySetAclKeyRequest: PropTypes.func.isRequired,
    unsubscribeFromEntitySetAclKeyRequest: PropTypes.func.isRequired,
    loadEntitySetPropertyMetadata: PropTypes.func.isRequired,
    updateEntitySetPropertyMetadata: PropTypes.func.isRequired,
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
      modalTitle = this.loadESPermissionsTitle(entitySetTitle, false);
    }

    this.state = {
      editingPermissions: false,
      confirmingDelete: false,
      addingData: false,
      deleteError: false,
      isIntegrationDetailsOpen: false,
      permissionsModalTitle: modalTitle,
      permissionsModalAclKey: modalAclKey,
      permissionsShouldUpdateAll: false
    };
  }

  componentDidMount() {

    this.props.resetPermissions();
    // this.props.loadEntitySet();

    this.props.subscribeToEntitySetAclKeyRequest([this.props.entitySetId]);
    this.props.loadEntitySetPropertyMetadata(this.props.entitySetId);

  }

  componentWillUnmount() {

    this.props.unsubscribeFromEntitySetAclKeyRequest([this.props.entitySetId]);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entitySet) {
      if (!this.props.entitySet || this.props.entitySet.get('id') !== nextProps.entitySet.get('id')) {
        this.setState({
          permissionsModalTitle: this.loadESPermissionsTitle(nextProps.entitySet.get('title'), false),
          permissionsModalAclKey: [nextProps.entitySet.get('id')]
        });
      }

      let shouldLoad = false;
      // TODO: consider another way of doing this to avoid forEach() and includes()
      nextProps.propertyTypeIds.forEach((propertyTypeId :string) => {
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
  // shouldComponentUpdate(nextProps :Object, nextState :Object) {
  // }

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

  updateModalView = (newViewTitle, newViewAclKey, shouldUpdateAll) => {
    this.setState({
      permissionsModalTitle: newViewTitle,
      permissionsModalAclKey: newViewAclKey,
      permissionsShouldUpdateAll: shouldUpdateAll
    });
  }

  // TODO - why is "shouldUpdatePropertyTypes" necessary...?
  loadESPermissionsTitle = (title, shouldUpdatePropertyTypes) => {
    return (shouldUpdatePropertyTypes) ? `${title} (dataset and all owned properties)` : `${title} (dataset only)`;
  }

  getPermissionsManagementOptions = () => {

    if (!this.props.entitySetPermissions.OWNER) {
      return null;
    }

    const propertyTypeOptions = [];
    this.props.ownedPropertyTypes.forEach((propertyType :Map) => {

      const propertyTypeId :string = propertyType.get('id');
      const aclKey :string[] = [this.props.entitySet.get('id'), propertyTypeId];
      const title :string = this.props.entitySetPropertyMetadata
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

    const esAllTitle = this.loadESPermissionsTitle(this.props.entitySet.get('title'), true);
    const esOnlyTitle = this.loadESPermissionsTitle(this.props.entitySet.get('title'), false);

    return (
      <SplitButton bsStyle="default" title={this.state.permissionsModalTitle} id="permissions-select">
        <MenuItem header>Dataset</MenuItem>
        <MenuItem
            onClick={() => {
              this.updateModalView(esOnlyTitle, [this.props.entitySet.get('id')]);
            }}
            eventKey={esOnlyTitle}>
          {esOnlyTitle}
        </MenuItem>
        <MenuItem
            onClick={() => {
              this.updateModalView(esAllTitle, [this.props.entitySet.get('id')], true);
            }}
            eventKey={esAllTitle}>
          {esAllTitle}
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
      if (this.state.permissionsShouldUpdateAll) {
        this.props.ownedPropertyTypes.forEach((propertyType :Map) => {
          aclKeysToUpdate.push([this.props.entitySet.get('id'), propertyType.get('id')]);
        });
      }
      panel = <PermissionsPanel entitySetId={aclKey[0]} aclKeysToUpdate={aclKeysToUpdate} />;
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

function mapStateToProps(state :Map, ownProps :Object) {


  const permissions = state.get('permissions');
  const entitySetDetail = state.get('entitySetDetail');

  const entitySetId :string = ownProps.params.id;
  const entitySet :Map = state.getIn(['edm', 'entitySets', entitySetId], Immutable.Map());

  let entitySetPermissions;
  if (!entitySet.isEmpty()) {
    entitySetPermissions = getPermissions(permissions, [entitySet.get('id')]);
  }
  else {
    entitySetPermissions = DEFAULT_PERMISSIONS;
  }

  const entityTypeId :string = entitySet.get('entityTypeId');
  const entityType :Map = state.getIn(['edm', 'entityTypes', entityTypeId], Immutable.Map());
  const propertyTypeIds :List = entityType.get('properties', Immutable.List());
  let ownedPropertyTypes :List = Immutable.List();
  let propertyTypes :List = Immutable.List();
  if (!propertyTypeIds.isEmpty()) {
    propertyTypeIds.forEach((propertyTypeId :string) => {
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
    size
  };
}

function mapDispatchToProps(dispatch, ownProps) {

  return {
    resetPermissions: () => {
      dispatch(psActionFactories.resetPermissions());
    },
    updateMetadata: (entitySetId, metadataUpdate) => {
      dispatch(edmActionFactories.updateEntitySetMetadataRequest(entitySetId, metadataUpdate));
    },
    loadOwnedPropertyTypes: (entitySetId :string, propertyTypeIds :List<string>) => {
      const accessChecks :Object[] = [];
      propertyTypeIds.forEach((propertyTypeId :string) => {
        accessChecks.push({
          aclKey: [entitySetId, propertyTypeId],
          permissions: [PERMISSIONS.OWNER]
        });
      });
      dispatch(PermissionsActionFactory.checkAuthorizationRequest(accessChecks));
    },
    subscribeToEntitySetAclKeyRequest: (aclKey :UUID[]) => {
      dispatch(NeuronActionFactory.subscribeToAclKeyRequest(aclKey));
    },
    unsubscribeFromEntitySetAclKeyRequest: (aclKey :UUID[]) => {
      dispatch(NeuronActionFactory.unsubscribeFromAclKeyRequest(aclKey));
    },
    loadEntitySetPropertyMetadata: (entitySetId) => {
      dispatch(edmActionFactories.getAllEntitySetPropertyMetadataRequest(entitySetId));
    },
    updateEntitySetPropertyMetadata: (entitySetId, propertyTypeId, metadataUpdate) => {
      dispatch(edmActionFactories.updateEntitySetPropertyMetadataRequest(entitySetId, propertyTypeId, metadataUpdate));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetDetailComponent);
