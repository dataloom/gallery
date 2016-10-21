import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { EntityDataModelApi } from 'loom-data';
import { Property } from './Property';
import Consts from '../../../../utils/AppConsts';
import styles from '../styles.module.css';

export class PropertyList extends React.Component {
  static propTypes = {
    properties: PropTypes.array,
    primaryKey: PropTypes.array,
    entityTypeName: PropTypes.string,
    entityTypeNamespace: PropTypes.string,
    updateFn: PropTypes.func,
    id: PropTypes.number,
    allowEdit: PropTypes.bool,
    editingPermissions: PropTypes.bool,
    schemaName: PropTypes.string,
    schemaNamespace: PropTypes.string
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
    document.getElementById('propertyName'.concat(this.props.id)).value = Consts.EMPTY;
    document.getElementById('propertyNamespace'.concat(this.props.id)).value = Consts.EMPTY;
    this.setState({ newPropertyRow: false });
    this.props.updateFn();
  }

  updateError = () => {
    this.setState({ error: true });
  }

  addPropertyToEntityType = () => {
    const name = document.getElementById('propertyName'.concat(this.props.id)).value;
    const namespace = document.getElementById('propertyNamespace'.concat(this.props.id)).value;
    EntityDataModelApi.addPropertyTypesToEntityType(
      {
        namespace: this.props.entityTypeNamespace,
        name: this.props.entityTypeName
      },
      [{ namespace, name }]
    ).then(() => this.updateFqns())
    .catch(() => this.updateError());
  }

  render() {
    const {
      properties,
      primaryKey,
      entityTypeName,
      entityTypeNamespace,
      updateFn,
      id,
      editingPermissions,
      schemaName,
      schemaNamespace
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
          schemaName={schemaName}
          schemaNamespace={schemaNamespace}
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
            <tr className={this.addRowClassName[this.state.newPropertyRow]}>
              <td />
              <td><input
                type="text"
                id={'propertyName'.concat(id)}
                placeholder="name"
                className={styles.tableCell}
              /></td>
              <td><input
                type="text"
                id={'propertyNamespace'.concat(id)}
                placeholder="namespace"
                className={styles.tableCell}
              /></td>
              <td><Button onClick={this.addPropertyToEntityType}>Save</Button></td>
            </tr>
          </tbody>
        </table>
        <Button
          onClick={this.newProperty}
          className={this.shouldShow[this.props.allowEdit && !this.state.newPropertyRow]}
        >+</Button>
        <div className={this.showErrorMsgClass[this.state.error]}>Unable to add property.</div>
      </div>
    );
  }
}

export default PropertyList;
