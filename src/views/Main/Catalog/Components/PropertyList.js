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
      error: false
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

  showErrorMsgClass = {
    true: styles.errorMsg,
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
    this.setState({ newPropertyRow: false });
    this.props.updateFn();
  }

  updateError = () => {
    this.setState({ error: true });
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
      this.updateError();
    });
  }

  newPropertyRowClass = () => {
    return (!this.state.newPropertyRow && !this.props.entitySetName) ? styles.addButton : styles.hidden;
  }

  render() {
    const {
      properties,
      primaryKey,
      entityTypeName,
      entityTypeNamespace,
      updateFn,
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
          entityTypeName={entityTypeName}
          entityTypeNamespace={entityTypeNamespace}
          updateFn={updateFn}
          editingPermissions={editingPermissions}
          entitySetName={entitySetName}
          isOwner={isOwner}
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
        <div className={this.showErrorMsgClass[this.state.error]}>Unable to add property.</div>
      </div>
    );
  }
}

export default PropertyList;
