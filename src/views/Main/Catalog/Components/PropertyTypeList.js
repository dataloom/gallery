import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { PropertyType } from './PropertyType';
import CatalogApi from '../../../../utils/CatalogApi';
import Utils from '../../../../utils/Utils';

export class PropertyTypeList extends React.Component {
  static propTypes = {
    propertyTypes: PropTypes.array,
    name: PropTypes.string,
    namespace: PropTypes.string,
    updateFn: PropTypes.func,
    navBar: PropTypes.bool,
    id: PropTypes.number
  }

  constructor() {
    super();
    this.state = {
      propertyTypes: [],
      newPropertyRow: false,
      error: false
    };
  }

  componentDidMount() {
    return (this.props.navBar) ? this.updateFn() : this.keyPropertyTypes();
  }

  addRowClassName = {
    false: 'hidden',
    true: 'showAddRow'
  }

  showErrorMsgClass = {
    true: 'errorMsg',
    false: 'hidden'
  }

  updateFn = () => {
    const id = this.props.id;
    document.getElementById('pName'.concat(id)).value = '';
    document.getElementById('pNamespace'.concat(id)).value = '';
    document.getElementById('pDatatype'.concat(id)).value = '';
    document.getElementById('pMultiplicity'.concat(id)).value = '';
    CatalogApi.getCatalogPropertyTypeData()
      .then((propertyTypes) => {
        this.setState({
          propertyTypes: Utils.addKeysToArray(propertyTypes),
          newPropertyRow: false
        });
      });
  }

  keyPropertyTypes() {
    const propertyTypes = this.props.propertyTypes.map((type) => {
      const newType = type;
      newType.key = this.props.propertyTypes.indexOf(type);
      return newType;
    });
    this.setState({ propertyTypes });
  }

  newProperty = () => {
    this.setState({ newPropertyRow: true });
  }

  updateError = () => {
    this.setState({ error: true });
  }

  addProperty = () => {
    return (this.props.navBar) ? this.createNewPropertyType() : this.addPropertyToSchema();
  }

  createNewPropertyType = () => {
    const id = this.props.id;
    const name = document.getElementById('pName'.concat(id)).value;
    const namespace = document.getElementById('pNamespace'.concat(id)).value;
    const datatype = document.getElementById('pDatatype'.concat(id)).value;
    const multiplicity = document.getElementById('pMultiplicity'.concat(id)).value;
    CatalogApi.createNewPropertyType(
      name,
      namespace,
      datatype,
      multiplicity,
      this.updateFn,
      this.updateError
    );
  }

  addPropertyToSchema = () => {
    const name = document.getElementById('pName'.concat(this.props.id)).value;
    const namespace = document.getElementById('pNamespace'.concat(this.props.id)).value;
    const fqnSet = [{ name, namespace }];
    CatalogApi.addPropertyToSchema(
      this.props.name,
      this.props.namespace,
      fqnSet,
      this.props.updateFn,
      this.updateError
    );
  }

  shouldDisplayContainer = () => {
    return (this.props.navBar) ? 'edmContainer' : '';
  }

  shouldShowExtraCells = () => {
    return (this.props.navBar) ? 'tableCell' : 'hidden';
  }

  shouldAddExtraCell = () => {
    return (this.props.navBar) ? 'hidden' : '';
  }

  render() {
    const propArray = this.state.propertyTypes;
    const propertyTypeList = propArray.map(prop =>
      <PropertyType key={prop.key} propertyType={prop} navBar={this.props.navBar} />
    );
    const id = this.props.id;
    return (
      <div className={this.shouldDisplayContainer()}>
        <table>
          <tbody>
            <tr>
              <th className={this.shouldAddExtraCell()} />
              <th className={'tableCell'}>Name</th>
              <th className={'tableCell'}>Namespace</th>
              <th className={'tableCell'}>Datatype</th>
              <th className={'tableCell'}>Multiplicity</th>
            </tr>
            {propertyTypeList}
            <tr className={this.addRowClassName[this.state.newPropertyRow]}>
              <td className={this.shouldAddExtraCell()} />
              <td><input
                type="text"
                id={'pName'.concat(id)}
                placeholder="name"
                className={'tableCell'}
              /></td>
              <td><input
                type="text"
                id={'pNamespace'.concat(id)}
                placeholder="namespace"
                className={'tableCell'}
              /></td>
              <td><input
                type="text"
                id={'pDatatype'.concat(id)}
                placeholder="datatype"
                className={this.shouldShowExtraCells()}
              /></td>
              <td><input
                type="text"
                id={'pMultiplicity'.concat(id)}
                placeholder="multiplicity"
                className={this.shouldShowExtraCells()}
              /></td>
              <td><Button onClick={this.addProperty}>Save</Button></td>
            </tr>
          </tbody>
        </table>
        <Button onClick={this.newProperty} className={this.addRowClassName[!this.state.newPropertyRow]}>+</Button>
        <div className={this.showErrorMsgClass[this.state.error]}>Unable to add property type.</div>
      </div>
    );
  }
}

export default PropertyTypeList;
