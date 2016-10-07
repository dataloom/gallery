import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { PropertyType } from './PropertyType';
import CatalogApi from '../../../../utils/CatalogApi';

export class PropertyTypeList extends React.Component {
  static propTypes = {
    propertyTypes: PropTypes.array,
    name: PropTypes.string,
    namespace: PropTypes.string,
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
    false: 'hidden',
    true: 'showAddRow'
  }

  showErrorMsgClass = {
    true: 'errorMsg',
    false: 'hidden'
  }

  keyPropertyTypes() {
    const propertyTypes = this.props.propertyTypes.map((type) => {
      const newType = type;
      newType.key = this.props.propertyTypes.indexOf(type);
      return newType;
    });
    return propertyTypes;
  }

  newProperty = () => {
    this.setState({ newPropertyRow: true });
  }

  updateError = () => {
    this.setState({ error: true });
  }

  addPropertyToSchema = () => {
    const name = document.getElementById('propNameField').value;
    const namespace = document.getElementById('propNamespaceField').value;
    const fqnSet = [{ name, namespace }];
    CatalogApi.addPropertyToSchema(
      this.props.name,
      this.props.namespace,
      fqnSet,
      this.props.updateFn,
      this.updateError
    );
  }

  render() {
    const propArray = this.keyPropertyTypes();
    const propertyTypeList = propArray.map(prop =>
      <PropertyType key={prop.key} propertyType={prop} />
    );
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th />
              <th className={'tableCell'}>Name</th>
              <th className={'tableCell'}>Namespace</th>
              <th className={'tableCell'}>Datatype</th>
              <th className={'tableCell'}>Multiplicity</th>
            </tr>
            {propertyTypeList}
            <tr className={this.addRowClassName[this.state.newPropertyRow]}>
              <td />
              <td><input type="text" id="propNameField" placeholder="name" className={'tableCell'} /></td>
              <td><input type="text" id="propNamespaceField" placeholder="namespace" className={'tableCell'} /></td>
              <td><Button onClick={this.addPropertyToSchema}>Save</Button></td>
            </tr>
          </tbody>
        </table>
        <Button onClick={this.newProperty} className={this.addRowClassName[!this.state.newPropertyRow]}>+</Button>
        <div className={this.showErrorMsgClass[this.state.error]}>Unable to add entity type.</div>
      </div>
    );
  }
}

export default PropertyTypeList;
