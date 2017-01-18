import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { Property } from './Property';
import StringConsts from '../../utils/Consts/StringConsts';
import PermissionsConsts from '../../utils/Consts/PermissionConsts';
import { NameNamespaceAutosuggest } from '../namespaceautosuggest/NameNamespaceAutosuggest';
import Utils from '../../utils/Utils';
import styles from './propertylist.module.css';

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
        action: PermissionsConsts.ADD
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
        action: PermissionsConsts.ADD
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

  addPropertyToEntityType = (namespace, name) => {
    EntityDataModelApi.addPropertyTypesToEntityType(
      Utils.getFqnObj(this.props.entityTypeNamespace, this.props.entityTypeName),
      [Utils.getFqnObj(namespace, name)]
    ).then(() => {
      this.updateFqns();
    }).catch(() => {
      this.updateError(PermissionsConsts.ADD);
    });
  }

  deleteProp = () => {
    EntityDataModelApi.removePropertyTypesFromEntityType(
      Utils.getFqnObj(this.props.entityTypeNamespace, this.props.entityTypeName),
      [this.state.propertyToDelete]
    ).then(() => {
      this.setState({
        verifyingDelete: false,
        propertyToDelete: undefined,
        error: {
          display: styles.hidden,
          action: PermissionsConsts.REMOVE
        }
      });
      return this.props.updateFn();
    }).catch(() => {
      this.updateError(PermissionsConsts.REMOVE);
    });
  }

  cancelDelete = () => {
    this.setState({
      verifyingDelete: false,
      propertyToDelete: undefined
    });
  }

  verifyDelete = (property) => {
    this.setState({
      verifyingDelete: true,
      propertyToDelete: property
    });
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
        addProperty={this.addPropertyToEntityType}
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
              <th className={styles.tableCell}>Property Type Title</th>
              <th className={styles.tableCell}>Property Type Name</th>
              <th className={styles.tableCell}>Property Type Namespace</th>
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
