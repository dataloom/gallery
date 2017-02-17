import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import classnames from 'classnames';

import * as actionFactories from './EntitySetDetailActionFactories';
import * as edmActionFactories from '../edm/EdmActionFactories';
import * as PermissionsActionFactory from '../permissions/PermissionsActionFactory';
import EntitySetPermissionsRequestList from '../permissions/components/EntitySetPermissionsRequestList';
import { PermissionsPropType, getPermissions, DEFAULT_PERMISSIONS } from '../permissions/PermissionsStorage';
import { getEdmObject } from '../edm/EdmStorage';
import PropertyTypeList from '../edm/components/PropertyTypeList';
import { PermissionsPanel } from '../../views/Main/Schemas/Components/PermissionsPanel';
import ActionDropdown from '../edm/components/ActionDropdown';
import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import { EntitySetPropType } from '../edm/EdmModel';
import Page from '../../components/page/Page';
import styles from './entitysetdetail.module.css';

class EntitySetDetailComponent extends React.Component {
  static propTypes = {
    asyncState: AsyncStatePropType.isRequired,

    // Async content
    entitySet: EntitySetPropType,
    entitySetPermissions: PermissionsPropType.isRequired,

    // Loading
    loadEntitySet: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      editingPermissions: false
    };
  }

  setEditingPermissions = () => {
    this.setState({ editingPermissions: true });
  };

  renderHeaderContent = () => {
    const { entitySet, entitySetPermissions } = this.props;

    return (
      <div className={styles.headerContent}>
        <div>
          <Page.Title>{entitySet.title}</Page.Title>
          <div className={styles.descriptionTitle}>About this data</div>
          {entitySet.description}
        </div>

        <div className={styles.controls}>
          <ActionDropdown entitySetId={entitySet.id} className={classnames(styles.actionDropdown, styles.control)} />

          {
            entitySetPermissions.OWNER &&
            <Button bsStyle="info" onClick={this.setEditingPermissions} className={styles.managePermissions}>
              Manage Permissions
            </Button>
          }
        </div>

        {
          entitySetPermissions.OWNER &&
          <EntitySetPermissionsRequestList
              entitySetId={entitySet.id}
              propertyTypeIds={entitySet.entityType.properties.map((p) => {
                return p.id;
              })} />
        }
      </div>
    );
  };

  renderPermissionsPanel = () => {
    if (!this.props.entitySet) return null;
    return (
      <Modal
          show={this.state.editingPermissions}
          onHide={this.closePermissionsPanel}>
        <Modal.Header closeButton>
          <Modal.Title>Manage permissions for entity set: {this.props.entitySet.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PermissionsPanel entitySetId={this.props.entitySet.id} />
        </Modal.Body>
      </Modal>
    );
  };

  renderSearchEntitySet = () => {
    if (!this.props.entitySet) return null;
    return (
      <div className={styles.buttonWrapper}>
        <Button bsStyle="primary" className={styles.center}>
          <Link className={styles.buttonLink} to={`/search/${this.props.entitySet.id}`}>
            Search this entity set
          </Link>
        </Button>
      </div>
    );
  }

  closePermissionsPanel = () => {
    this.setState({ editingPermissions: false });
  };

  render() {
    return (
      <Page>
        <Page.Header>
          <AsyncContent {...this.props.asyncState} content={this.renderHeaderContent}/>
        </Page.Header>
        <Page.Body>
          <h2 className={styles.propertyTypeTitle}>Data in Entity Set</h2>
          <AsyncContent {...this.props.asyncState} content={() => {
            // TODO: Remove when removing denormalization
            const propertyTypeIds = this.props.entitySet.entityType.properties.map(property => property.id);

            return (
              <PropertyTypeList
                  entitySetId={this.props.entitySet.id}
                  propertyTypeIds={propertyTypeIds}
                  className="propertyTypeStyleDefault" />
            );
          }} />
          {this.renderPermissionsPanel()}
          {this.renderSearchEntitySet()}

        </Page.Body>
      </Page>
    );
  }

  componentDidMount() {
    this.props.loadEntitySet();
  }
}

function mapStateToProps(state) {
  const entitySetDetail = state.get('entitySetDetail'),
    normalizedData = state.get('normalizedData'),
    permissions = state.get('permissions');

  let entitySet;
  let entitySetPermissions;
  const reference = entitySetDetail.get('entitySetReference');
  if (reference) {
    entitySet = getEdmObject(normalizedData.toJS(), reference.toJS());
    entitySetPermissions = getPermissions(permissions, [entitySet.id])
  } else {
    entitySetPermissions = DEFAULT_PERMISSIONS;
  }

  return {
    asyncState: entitySetDetail.get('asyncState').toJS(),
    entitySet,
    entitySetPermissions
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
          'include': ['EntitySet', 'EntityType', 'PropertyTypeInEntitySet']
        }]
      ));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetDetailComponent);
