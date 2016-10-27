import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
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
    id: PropTypes.number,
    allPropNames: PropTypes.object,
    allPropNamespaces: PropTypes.object
  }

  constructor() {
    super();
    this.state = {
      newPropertyRow: false,
      error: false
    };
  }

  addRowClassName = {
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

  render() {
    const { properties, primaryKey, entityTypeName, entityTypeNamespace, updateFn, id } = this.props;
    const propArray = (properties !== null && properties.length > 0) ?
      this.keyProperties() : [];
    const propertyList = propArray.map((prop) => {
      const pKey = (primaryKey[0].name === prop.name && primaryKey[0].namespace === prop.namespace);
      return (
        <Property
          key={prop.key}
          property={prop}
          primaryKey={pKey}
          entityTypeName={entityTypeName}
          entityTypeNamespace={entityTypeNamespace}
          updateFn={updateFn}
        />
    );
    });
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th />
              <th className={styles.tableCell}>Name</th>
              <th className={styles.tableCell}>Namespace</th>
            </tr>
            {propertyList}
            <NameNamespaceAutosuggest
              className={this.addRowClassName[this.state.newPropertyRow]}
              names={this.props.allPropNames}
              namespaces={this.props.allPropNamespaces}
              addProperty={this.addPropertyToEntityType}
            />
          </tbody>
        </table>
        <Button onClick={this.newProperty} className={this.addRowClassName[!this.state.newPropertyRow]}>+</Button>
        <div className={this.showErrorMsgClass[this.state.error]}>Unable to add property.</div>
      </div>
    );
  }
}

export default PropertyList;
