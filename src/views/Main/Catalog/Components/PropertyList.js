import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Property } from './Property';
import CatalogApi from '../../../../utils/CatalogApi';

export class PropertyList extends React.Component {
  static propTypes = {
    properties: PropTypes.array,
    primaryKey: PropTypes.array,
    entityTypeName: PropTypes.string,
    entityTypeNamespace: PropTypes.string,
    updateFn: PropTypes.func,
    id: PropTypes.number
  }

  constructor() {
    super();
    this.state = {
      newPropertyRow: false,
      error: false
    };
  }

  addRowClassName = {
    true: 'showAddRow',
    false: 'hidden'
  }

  showErrorMsgClass = {
    true: 'errorMsg',
    false: 'hidden'
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

  addPropertyToEntityType = () => {
    const name = document.getElementById('propertyName'.concat(this.props.id)).value;
    const namespace = document.getElementById('propertyNamespace'.concat(this.props.id)).value;
    const fqnSet = [{ name, namespace }];
    CatalogApi.addPropertyToEntityType(
      this.props.entityTypeNamespace,
      this.props.entityTypeName,
      fqnSet,
      this.updateFqns,
      this.updateError
    );
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
              <th className={'tableCell'}>Name</th>
              <th className={'tableCell'}>Namespace</th>
            </tr>
            {propertyList}
            <tr className={this.addRowClassName[this.state.newPropertyRow]}>
              <td />
              <td><input
                type="text"
                id={'propertyName'.concat(id)}
                placeholder="name"
                className={'tableCell'}
              /></td>
              <td><input
                type="text"
                id={'propertyNamespace'.concat(id)}
                placeholder="namespace"
                className={'tableCell'}
              /></td>
              <td><Button onClick={this.addPropertyToEntityType}>Save</Button></td>
            </tr>
          </tbody>
        </table>
        <Button onClick={this.newProperty} className={this.addRowClassName[!this.state.newPropertyRow]}>+</Button>
        <div className={this.showErrorMsgClass[this.state.error]}>Unable to add property.</div>
      </div>
    );
  }
}

export default PropertyList;
