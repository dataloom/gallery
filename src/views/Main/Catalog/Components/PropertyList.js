import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { Property } from './Property';
import Consts from '../../../../utils/AppConsts';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
import styles from '../styles.module.css';

export class PropertyList extends React.Component {
  static propTypes = {
    properties: PropTypes.array,
    primaryKey: PropTypes.array,
    entityTypeName: PropTypes.string,
    entityTypeNamespace: PropTypes.string,
    updateFn: PropTypes.func,
    allPropNames: PropTypes.object,
    allPropNamespaces: PropTypes.object,
    editingPermissions: PropTypes.bool,
    entitySetName: PropTypes.string,
    isOwner: PropTypes.bool
  }

  constructor() {
    super();
    this.state = {
      newPropertyRow: false,
      error: {
        display: styles.hidden,
        action: Consts.ADD
      },
      verifyingDelete: false,
      propertyToDelete: undefined
    };
  }

  shouldShow = {
    true: Consts.EMPTY,
    false: styles.hidden
  }

  shouldShow = {
    true: Consts.EMPTY,
    false: styles.hidden
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
        action: Consts.ADD
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
      {
        namespace: this.props.entityTypeNamespace,
        name: this.props.entityTypeName
      },
      [{ namespace, name }]
    ).then(() => {
      this.updateFqns();
    }).catch(() => {
      this.updateError(Consts.ADD);
    });
  }

  newPropertyRowClass = () => {
    return (!this.state.newPropertyRow && !this.props.entitySetName) ? styles.addButton : styles.hidden;
  }

  deleteProp = () => {
    EntityDataModelApi.removePropertyTypesFromEntityType(
      {
        namespace: this.props.entityTypeNamespace,
        name: this.props.entityTypeName
      },
      [{
        namespace: this.state.propertyToDelete.namespace,
        name: this.state.propertyToDelete.name
      }]
    ).then(() => {
      this.setState({
        verifyingDelete: false,
        propertyToDelete: undefined,
        error: {
          display: styles.hidden,
          action: Consts.REMOVE
        }
      });
      return this.props.updateFn();
    }).catch(() => {
      this.updateError(Consts.REMOVE);
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
    if (this.state.verifyingDelete) {
      const prop = `${this.state.propertyToDelete.namespace}.${this.state.propertyToDelete.name}`;
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

  render() {
    const {
      properties,
      primaryKey,
      entitySetName,
      editingPermissions,
      isOwner
    } = this.props;
    const propArray = (properties !== null && properties.length > 0) ?
      this.keyProperties() : [];
    const propertyList = propArray.map((prop) => {
      const pKey = (primaryKey && primaryKey[0].name === prop.name && primaryKey[0].namespace === prop.namespace);
      return (
        <Property
          key={prop.key}
          property={prop}
          primaryKey={pKey}
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
            </tr>
            {propertyList}
            <NameNamespaceAutosuggest
              className={this.shouldShow[this.state.newPropertyRow]}
              names={this.props.allPropNames}
              namespaces={this.props.allPropNamespaces}
              addProperty={this.addPropertyToEntityType}
            />
          </tbody>
        </table>
        <button onClick={this.newProperty} className={this.newPropertyRowClass()}>+</button>
        <div className={this.state.error.display}>Unable to {this.state.error.action} property.</div>
        {this.renderVerifyDeletePropertyBox()}
      </div>
    );
  }
}

export default PropertyList;
