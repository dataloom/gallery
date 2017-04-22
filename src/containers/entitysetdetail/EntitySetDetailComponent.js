import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Button, Modal, SplitButton, MenuItem } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import styled from 'styled-components';
import FontAwesome from 'react-fontawesome';
import classnames from 'classnames';
import { EntityDataModelApi } from 'loom-data';
import IntegrationDetailsModal from './IntegrationDetailsModal';

import * as actionFactories from './EntitySetDetailActionFactories';
import * as edmActionFactories from '../edm/EdmActionFactories';
import * as PermissionsActionFactory from '../permissions/PermissionsActionFactory';
import * as psActionFactories from '../permissionssummary/PermissionsSummaryActionFactory';
import EntitySetPermissionsRequestList from '../permissions/components/EntitySetPermissionsRequestList';
import { PermissionsPropType, getPermissions, DEFAULT_PERMISSIONS, PERMISSIONS } from '../permissions/PermissionsStorage';
import { getEdmObject } from '../edm/EdmStorage';
import PropertyTypeList from '../edm/components/PropertyTypeList';
import PermissionsPanel from '../../views/Main/Schemas/Components/PermissionsPanel';
import AddDataForm from '../entitysetforms/AddDataForm';
import ActionDropdown from '../edm/components/ActionDropdown';
import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import { EntitySetPropType } from '../edm/EdmModel';
import Page from '../../components/page/Page';
import PageConsts from '../../utils/Consts/PageConsts';
import styles from './entitysetdetail.module.css';

import InlineEditableControl from '../../components/controls/InlineEditableControl';
import StyledFlexContainer from '../../components/flex/StyledFlexContainer';
import StyledFlexContainerStacked from '../../components/flex/StyledFlexContainerStacked';

const TitleControlsContainer = styled(StyledFlexContainer)`
  justify-content: space-between;
`;

const ControlsContainer = styled(StyledFlexContainerStacked)`
  align-items: flex-end;
  flex: 1 0 auto;
`;

const permissionOptions = {
  Discover: 'Discover',
  Link: 'Link',
  Read: 'Read',
  Write: 'Write',
  Owner: 'Owner'
};

class EntitySetDetailComponent extends React.Component {
  static propTypes = {
    asyncState: AsyncStatePropType.isRequired,
    router: PropTypes.object.isRequired,

    // Async content
    entitySet: EntitySetPropType,
    entitySetPermissions: PermissionsPropType.isRequired,
    allPropertyTypeIds: PropTypes.array.isRequired,
    ownedPropertyTypeIds: PropTypes.object.isRequired,

    // Loading
    loadEntitySet: PropTypes.func.isRequired,
    updateMetadata: PropTypes.func.isRequired,
    resetPermissions: PropTypes.func.isRequired,
    loadOwnedPropertyTypes: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      editingPermissions: false,
      confirmingDelete: false,
      addingData: false,
      deleteError: false,
      isIntegrationDetailsOpen: false,
      permissionsModalTitle: '',
      permissionsModalAclKey: [],
      permissionsShouldUpdateAll: true
    };
  }

  componentDidMount() {
    this.props.resetPermissions();
    this.props.loadEntitySet();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entitySet) {
      if (!this.props.entitySet || this.props.entitySet.id !== nextProps.entitySet.id) {
        this.setState({
          permissionsModalTitle: this.loadESPermissionsTitle(nextProps.entitySet.title, true),
          permissionsModalAclKey: [nextProps.entitySet.id]
        });
      }
      let shouldLoad = false;
      nextProps.allPropertyTypeIds.forEach((id) => {
        if (!this.props.allPropertyTypeIds.includes(id)) {
          shouldLoad = true;
        }
      });
      if (shouldLoad) {
        this.props.loadOwnedPropertyTypes(nextProps.entitySet.id, nextProps.allPropertyTypeIds);
      }
    }
  }

  setEditingPermissions = () => {
    this.setState({ editingPermissions: true });
  };

  updateEntitySetTitle = (title) => {
    if (title && title.length) {
      this.props.updateMetadata(this.props.entitySet.id, { title });
    }
  }

  updateEntitySetDescription = (description) => {
    if (description) this.props.updateMetadata(this.props.entitySet.id, { description });
  }

  updateEntitySetContacts = (contacts) => {
    if (contacts) this.props.updateMetadata(this.props.entitySet.id, { contacts: [contacts] });
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

    const contactValue = (entitySet.contacts.length > 0) ? entitySet.contacts.join(', ') : 'none';

    return (
      <StyledFlexContainerStacked>
        <TitleControlsContainer>
          <div>
            <Page.Title>{this.renderTitle(entitySet.title, entitySetPermissions.OWNER)}</Page.Title>
            <div className={styles.descriptionTitle}>About this data</div>
            {this.renderDescription(entitySet.description, entitySetPermissions.OWNER)}
            <span className={styles.contacts}>{this.renderEntitySetContacts(contactValue, entitySetPermissions.OWNER)}</span>
          </div>

          <ControlsContainer>

            <ActionDropdown entitySetId={entitySet.id} className={classnames(styles.actionDropdown)} />
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
              entitySetId={entitySet.id}
              propertyTypeIds={this.props.allPropertyTypeIds} />
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

  loadESPermissionsTitle = (title, shouldUpdatePropertyTypes) => {
    return (shouldUpdatePropertyTypes) ? `${title} (dataset and all owned properties)` : `${title} (dataset only)`;
  }

  getPermissionsManagementOptions = () => {
    if (!this.props.entitySetPermissions.OWNER) return null;
    const propertyTypeOptions = Object.keys(this.props.ownedPropertyTypeIds).map((id) => {
      const aclKey = [this.props.entitySet.id, id];
      return (
        <MenuItem
            eventKey={id}
            key={id}
            onClick={() => {
              this.updateModalView(this.props.ownedPropertyTypeIds[id], aclKey);
            }}>
          {this.props.ownedPropertyTypeIds[id]}
        </MenuItem>
      );
    });
    const esAllTitle = this.loadESPermissionsTitle(this.props.entitySet.title, true);
    const esOnlyTitle = this.loadESPermissionsTitle(this.props.entitySet.title, false);

    return (
      <SplitButton bsStyle="default" title={this.state.permissionsModalTitle} id="permissions-select">
        <MenuItem header>Dataset</MenuItem>
        <MenuItem
            onClick={() => {
              this.updateModalView(esAllTitle, [this.props.entitySet.id], true);
            }}
            eventKey={esAllTitle}>
          {esAllTitle}
        </MenuItem>
        <MenuItem
            onClick={() => {
              this.updateModalView(esOnlyTitle, [this.props.entitySet.id]);
            }}
            eventKey={esOnlyTitle}>
          {esOnlyTitle}
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
    if (!this.props.entitySet) return null;
    const aclKey = this.state.permissionsModalAclKey;
    let panel = null;
    if (aclKey.length === 1) {
      const aclKeysToUpdate = [aclKey];
      if (this.state.permissionsShouldUpdateAll) {
        Object.keys(this.props.ownedPropertyTypeIds).forEach((id) => {
          aclKeysToUpdate.push([this.props.entitySet.id, id]);
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
    if (!this.props.entitySet) return null;
    return (
      <div className={styles.buttonWrapper}>
        <Link className={styles.buttonLink} to={`/search/${this.props.entitySet.id}`}>
          <Button bsStyle="primary" className={styles.center}>
            <FontAwesome name="search" />
            <span className={styles.buttonText}>Search this entity set</span>
          </Button>
        </Link>
      </div>
    );
  }

  renderAddDataForm = () => {
    if (!this.props.entitySet || !this.props.entitySetPermissions.WRITE) return null;
    return (
      <Modal
          show={this.state.addingData}
          onHide={this.closeAddDataModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new row of data to this entity set</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddDataForm
              entitySetId={this.props.entitySet.id}
              primaryKey={this.props.entitySet.entityType.key}
              propertyTypes={this.props.entitySet.entityType.properties} />
        </Modal.Body>
      </Modal>
    );
  }

  deleteEntitySet = () => {
    if (!this.props.entitySet) return;
    EntityDataModelApi.deleteEntitySet(this.props.entitySet.id)
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
    if (!this.props.entitySet || !this.props.entitySetPermissions.WRITE) return null;
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
          entitySet={this.props.entitySet} />
    );
  }

  renderDeleteEntitySet = () => {
    if (!this.props.entitySet || !this.props.entitySetPermissions.OWNER) return null;
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
    if (!this.props.entitySet) return null;
    return (
      <Modal
          show={this.state.confirmingDelete}
          onHide={this.cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete {this.props.entitySet.title}?</Modal.Title>
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
    return (this.props.entitySet) ? this.props.entitySet.title : PageConsts.DEFAULT_DOCUMENT_TITLE;
  }

  render() {
    return (
      <DocumentTitle title={this.getDocumentTitle()}>
        <Page className={styles.page}>
          <Page.Header>
            <AsyncContent {...this.props.asyncState} content={this.renderHeaderContent} />
          </Page.Header>
          <Page.Body>
            {this.renderAddDataButton()}
            <h2 className={styles.propertyTypeTitle}>Data in Entity Set</h2>
            <AsyncContent
                {...this.props.asyncState}
                content={() => {
                  // TODO: Remove when removing denormalization
                  const propertyTypeIds = this.props.entitySet.entityType.properties.map((property) => {
                    return property.id;
                  });
                  return (
                    <PropertyTypeList
                        entitySetId={this.props.entitySet.id}
                        propertyTypeIds={propertyTypeIds}
                        className="propertyTypeStyleDefault" />
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
        </Page>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const entitySetDetail = state.get('entitySetDetail');
  const normalizedData = state.get('normalizedData');
  const permissions = state.get('permissions');

  let entitySet;
  let entitySetPermissions;
  const allPropertyTypeIds = [];
  const ownedPropertyTypeIds = {};
  const reference = entitySetDetail.get('entitySetReference');
  if (reference) {
    entitySet = getEdmObject(normalizedData.toJS(), reference.toJS());
    entitySetPermissions = getPermissions(permissions, [entitySet.id]);
    entitySet.entityType.properties.forEach((propertyType) => {
      allPropertyTypeIds.push(propertyType.id);
      if (getPermissions(permissions, [entitySet.id, propertyType.id]).OWNER) {
        ownedPropertyTypeIds[propertyType.id] = propertyType.title;
      }
    });
  }
  else {
    entitySetPermissions = DEFAULT_PERMISSIONS;
  }

  return {
    asyncState: entitySetDetail.get('asyncState').toJS(),
    entitySet,
    entitySetPermissions,
    allPropertyTypeIds,
    ownedPropertyTypeIds
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const id = ownProps.params.id;

  return {
    loadEntitySet: () => {
      dispatch(actionFactories.entitySetDetailRequest(id));
      dispatch(PermissionsActionFactory.getEntitySetsAuthorizations([id]));
      // TODO: Move filter creation in helper function in EdmApi
      dispatch(edmActionFactories.filteredEdmRequest(
        [{
          type: 'EntitySet',
          id,
          include: ['EntitySet', 'EntityType', 'PropertyTypeInEntitySet']
        }]
      ));
    },
    resetPermissions: () => {
      dispatch(psActionFactories.resetPermissions());
    },
    updateMetadata: (entitySetId, metadataUpdate) => {
      dispatch(edmActionFactories.updateEntitySetMetadataRequest(entitySetId, metadataUpdate));
    },
    loadOwnedPropertyTypes: (entitySetId, propertyTypeIds) => {
      const accessChecks = propertyTypeIds.map((id) => {
        return {
          aclKey: [entitySetId, id],
          permissions: [PERMISSIONS.OWNER]
        };
      });
      dispatch(PermissionsActionFactory.checkAuthorizationRequest(accessChecks));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetDetailComponent);
