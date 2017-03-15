import React, { PropTypes } from 'react';
import { Button, ButtonGroup, ButtonToolbar, Modal } from 'react-bootstrap';
import { EntityDataModelApi, SearchApi } from 'loom-data';
import { Property } from './Property';
import StringConsts from '../../../../utils/Consts/StringConsts';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import ActionConsts from '../../../../utils/Consts/ActionConsts';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
import styles from '../styles.module.css';

export class PropertyList extends React.Component {
  static propTypes = {
    properties: PropTypes.array,
    primaryKey: PropTypes.array,
    entityTypeName: PropTypes.string,
    entityTypeNamespace: PropTypes.string,
    updateFn: PropTypes.func,
    editingPermissions: PropTypes.bool,
    entitySetName: PropTypes.string,
    isOwner: PropTypes.bool
  }

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {
      newPropertyRow: false,
      error: {
        display: styles.hidden,
        action: ActionConsts.ADD
      },
      verifyingDelete: false,
      propertyToDelete: undefined
    };
  }

  keyProperties() {
    const properties = this.props.properties.map((prop) => {
      const newProp = prop;
      newProp.key = this.props.properties.indexOf(prop);
      return newProp;
    });
    return properties;
  }

  newProperty = () => {
    this.setState({ newPropertyRow: true });
  }

  updateFqns = () => {
    this.setState({
      newPropertyRow: false,
      error: {
        display: styles.hidden,
        action: ActionConsts.ADD
      }
    });
  }

  updateError = (action) => {
    this.setState({
      error: {
        display: styles.errorMsg,
        action
      },
      verifyingDelete: false
    });
  }

  addProperty = (namespace, name) => {
    EntityDataModelApi.getPropertyTypeId({ namespace, name })
    .then((id) => {
      this.props.updateFn([id], ActionConsts.ADD, EdmConsts.PROPERTY_TYPE);
      this.updateFqns();
    }).catch(() => {
      this.updateError();
    });
  }

  verifyDelete = (property) => {
    if (this.props.entityTypeNamespace !== undefined && this.props.entityTypeName !== undefined) {
      this.setState({
        verifyingDelete: true,
        propertyToDelete: property
      });
    }
    else {
      this.deleteProp(property);
    }
  }

  confirmDelete = () => {
    this.deleteProp(this.state.propertyToDelete);
  }

  cancelDelete = () => {
    this.setState({
      verifyingDelete: false,
      propertyToDelete: undefined
    });
  }

  deleteProp = (property) => {
    this.props.updateFn([property.id], ActionConsts.REMOVE, EdmConsts.PROPERTY_TYPE);
    this.setState({
      verifyingDelete: false,
      propertyToDelete: undefined
    });
  }

  closeModal = () => {
    this.setState({ verifyingDelete: false });
  }

  renderVerifyDeleteModal = () => {
    const { verifyingDelete, propertyToDelete } = this.state;
    if (!propertyToDelete) return null;
    const prop = `${propertyToDelete.namespace}.${propertyToDelete.name}`;
    const entityType = `${this.props.entityTypeNamespace}.${this.props.entityTypeName}`;
    return (
      <Modal show={verifyingDelete} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Verify Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            Are you sure you want to delete property type {prop} and all associated data from entity type {entityType}?
          </div>
          <div className={styles.buttonContainer}>
            <ButtonGroup >
              <Button onClick={this.confirmDelete} bsStyle="danger">Delete</Button>
              <Button onClick={this.cancelDelete} bsStyle="default">Cancel</Button>
            </ButtonGroup>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  isPrimaryKey = (prop) => {
    if (this.props.primaryKey === undefined) return false;
    let primaryKey = false;
    this.props.primaryKey.forEach((pKeyId) => {
      if (pKeyId === prop.id) primaryKey = true;
    });
    return primaryKey;
  }

  renderNewRowButton = () => {
    if (!this.context.isAdmin) return null;
    const className = (!this.state.newPropertyRow && !this.props.entitySetName) ? styles.addButton : styles.hidden;
    return (
      <button onClick={this.newProperty} className={className}>+</button>
    );
  }

  renderNewRowInput = () => {
    if (!this.context.isAdmin) return null;
    const properties = this.props.properties.map((property) => {
      return property.id;
    });
    const className = (this.state.newPropertyRow) ? StringConsts.EMPTY : styles.hidden;
    return (
      <NameNamespaceAutosuggest
          searchFn={SearchApi.searchPropertyTypesByFQN}
          className={className}
          usedProperties={properties}
          addProperty={this.addProperty} />
    );
  }

  render() {
    const { properties, entitySetName, editingPermissions, isOwner } = this.props;
    const propArray = (properties !== null && properties.length > 0) ?
      this.keyProperties() : [];
    const propertyList = propArray.map((prop) => {
      return (
        <Property
            key={prop.key}
            property={prop}
            primaryKey={this.isPrimaryKey(prop)}
            editingPermissions={editingPermissions}
            entitySetName={entitySetName}
            isOwner={isOwner}
            verifyDeleteFn={this.verifyDelete} />
      );
    });
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th />
              <th className={styles.tableCell}>Property Type Name</th>
              <th className={styles.tableCell}>Property Type Namespace</th>
              <th className={styles.tableCell}>Property Type Title</th>
            </tr>
            {propertyList}
            {this.renderNewRowInput()}
          </tbody>
        </table>
        {this.renderNewRowButton()}
        <div className={this.state.error.display}>Unable to {this.state.error.action} property.</div>
        {this.renderVerifyDeleteModal()}
      </div>
    );
  }
}

export default PropertyList;
