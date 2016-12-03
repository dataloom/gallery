import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { Property } from './Property';
import StringConsts from '../../../../utils/Consts/StringConsts';
import PermissionsConsts from '../../../../utils/Consts/PermissionsConsts';
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

  shouldShow = {
    true: StringConsts.EMPTY,
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

  newPropertyRowClass = () => {
    return (!this.state.newPropertyRow && !this.props.entitySetName) ? styles.addButton : styles.hidden;
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

  render() {
    const {
      properties,
      primaryKey,
      entitySetName,
      editingPermissions,
      isOwner,
      allPropNamespaces
    } = this.props;
    const { newPropertyRow, error } = this.state;
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
              className={this.shouldShow[newPropertyRow]}
              namespaces={allPropNamespaces}
              usedProperties={properties}
              addProperty={this.addPropertyToEntityType}
            />
          </tbody>
        </table>
        <button onClick={this.newProperty} className={this.newPropertyRowClass()}>+</button>
        <div className={error.display}>Unable to {error.action} property.</div>
        {this.renderVerifyDeletePropertyBox()}
      </div>
    );
  }
}

export default PropertyList;
