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
    updateFn: PropTypes.func
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
    const name = document.getElementById('nameField').value;
    const namespace = document.getElementById('namespaceField').value;
    const fqnSet = [{ name, namespace }];
    CatalogApi.addPropertyToEntityType(
      this.props.entityTypeName,
      this.props.entityTypeNamespace,
      fqnSet,
      this.updateFqns,
      this.updateError
    );
  }

  render() {
    const propArray = (this.props.properties !== null && this.props.properties.length > 0) ?
      this.keyProperties() : [];
    const pKeyJson = this.props.primaryKey;
    const propertyList = propArray.map((prop) => {
      const primaryKey = (pKeyJson[0].name === prop.name && pKeyJson[0].namespace === prop.namespace);
      return (
        <Property
          key={prop.key}
          property={prop}
          primaryKey={primaryKey}
          entityTypeName={this.props.entityTypeName}
          entityTypeNamespace={this.props.entityTypeNamespace}
          updateFn={this.props.updateFn}
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
              <td><input type="text" id="nameField" placeholder="name" className={'tableCell'} /></td>
              <td><input type="text" id="namespaceField" placeholder="namespace" className={'tableCell'} /></td>
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
