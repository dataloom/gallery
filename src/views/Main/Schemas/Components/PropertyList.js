import React, { PropTypes } from 'react';
import { Property } from './Property';
import StringConsts from '../../../../utils/Consts/StringConsts';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import ActionConsts from '../../../../utils/Consts/ActionConsts';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
import Utils from '../../../../utils/Utils';
import styles from '../styles.module.css';

export class PropertyList extends React.Component {
  static propTypes = {
    properties: PropTypes.array,
    primaryKey: PropTypes.array,
    entityTypeName: PropTypes.string,
    entityTypeNamespace: PropTypes.string,
    updateFn: PropTypes.func,
    allPropNamespaces: PropTypes.object,
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
    this.props.updateFn();
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
    const propIdList = this.props.allPropNamespaces[namespace].filter((propObj) => {
      return (propObj.name === name);
    });
    if (propIdList.length !== 1) {
      this.updateError();
      return;
    }
    const propId = propIdList[0].id;
    this.props.updateFn([propId], ActionConsts.ADD, EdmConsts.PROPERTY_TYPE);
    this.updateFqns();
  }

  deleteProp = (optionalProperty) => {
    const property = (optionalProperty === undefined) ? this.state.propertyToDelete : optionalProperty;
    this.props.updateFn([property.id], ActionConsts.REMOVE, EdmConsts.PROPERTY_TYPE);
    this.setState({
      verifyingDelete: false,
      propertyToDelete: undefined
    });
  }

  cancelDelete = () => {
    this.setState({
      verifyingDelete: false,
      propertyToDelete: undefined
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

  renderVerifyDeletePropertyBox = () => {
    const { verifyingDelete, propertyToDelete } = this.state;
    if (verifyingDelete) {
      const prop = `${propertyToDelete.namespace}.${propertyToDelete.name}`;
      const entityType = `${this.props.entityTypeNamespace}.${this.props.entityTypeName}`;
      return (
        <div className={styles.verifyDeleteContainer}>
          <div className={styles.verifyDeleteText}>
            Are you sure you want to delete property type {prop} and all associated data from entity type {entityType}?
          </div>
          <div className={styles.buttonContainer}>
            <button onClick={this.deleteProp} className={styles.simpleButton}>Delete</button>
            <button onClick={this.cancelDelete} className={styles.simpleButton}>Cancel</button>
          </div>
        </div>
      );
    }
    return null;
  }

  isPrimaryKey = (prop) => {
    if (this.props.primaryKey === undefined) return false;
    let primaryKey = false;
    this.props.primaryKey.forEach((pKey) => {
      if (pKey.name === prop.name && pKey.namespace === prop.namespace) primaryKey = true;
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
    const { properties, allPropNamespaces } = this.props;
    const className = (this.state.newPropertyRow) ? StringConsts.EMPTY : styles.hidden;
    return (
      <NameNamespaceAutosuggest
        className={className}
        namespaces={allPropNamespaces}
        usedProperties={properties}
        addProperty={this.addProperty}
      />
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
          verifyDeleteFn={this.verifyDelete}
        />
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
        {this.renderVerifyDeletePropertyBox()}
      </div>
    );
  }
}

export default PropertyList;
