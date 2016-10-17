import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { EntityDataModelApi } from 'loom-data';
import { PropertyType } from './PropertyType';
import Utils from '../../../../utils/Utils';
import Consts from '../../../../utils/AppConsts';
import styles from '../styles.module.css';

export class PropertyTypeList extends React.Component {
  static propTypes = {
    propertyTypes: PropTypes.array,
    name: PropTypes.string,
    namespace: PropTypes.string,
    updateSchemaFn: PropTypes.func,
    navBar: PropTypes.bool,
    id: PropTypes.number
  }

  constructor() {
    super();
    this.state = {
      propertyTypes: [],
      newPropertyRow: false,
      addError: false,
      deleteError: false
    };
  }

  addRowClassName = {
    true: Consts.EMPTY,
    false: Consts.HIDDEN
  }

  showErrorMsgClass = {
    true: Consts.ERROR,
    false: Consts.HIDDEN
  }

  componentDidMount() {
    return (this.props.navBar) ? this.updateFn() : this.keyPropertyTypes();
  }

  updateFn = () => {
    const id = this.props.id;
    document.getElementById('pName'.concat(id)).value = Consts.EMPTY;
    document.getElementById('pNamespace'.concat(id)).value = Consts.EMPTY;
    document.getElementById('pDatatype'.concat(id)).value = Consts.EMPTY;
    document.getElementById('pMultiplicity'.concat(id)).value = Consts.EMPTY;
    EntityDataModelApi.getPropertyTypes()
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
    return propertyTypes;
  }

  newProperty = () => {
    this.setState({ newPropertyRow: true });
  }

  updateAddError = () => {
    this.setState({
      addError: true,
      deleteError: false
    });
  }

  updateDeleteError = () => {
    this.setState({
      deleteError: true,
      addError: false
    });
  }

  addProperty = () => (this.props.navBar ? this.createNewPropertyType() : this.addPropertyToSchema());

  createNewPropertyType = () => {
    const id = this.props.id;
    const name = document.getElementById('pName'.concat(id)).value;
    const namespace = document.getElementById('pNamespace'.concat(id)).value;
    const datatype = document.getElementById('pDatatype'.concat(id)).value;
    const multiplicity = document.getElementById('pMultiplicity'.concat(id)).value;
    EntityDataModelApi.createPropertyType({ name, namespace, datatype, multiplicity })
    .then(() => this.updateFn())
    .catch(() => this.updateAddError());
  }

  successfullyAddedProperty = () => {
    this.setState({ newPropertyRow: false });
    this.props.updateSchemaFn();
  }

  addPropertyToSchema = () => {
    const name = document.getElementById('pName'.concat(this.props.id)).value;
    const namespace = document.getElementById('pNamespace'.concat(this.props.id)).value;
    EntityDataModelApi.addPropertyTypesToSchema(
      {
        namespace: this.props.namespace,
        name: this.props.name
      },
      [{ namespace, name }]
    ).then(() => this.successfullyAddedProperty())
    .catch(() => this.updateAddError());
  }

  shouldDisplayContainer = () => (this.props.navBar ? 'edmContainer' : Consts.EMPTY);

  shouldAddExtraCell = () => (this.props.navBar ? Consts.HIDDEN : Consts.EMPTY);

  shouldAddExtraFieldOptions = () => (this.props.navBar ? Consts.EMPTY : Consts.HIDDEN);

  render() {
    const propArray = (this.props.navBar) ? this.state.propertyTypes : this.keyPropertyTypes();
    const propertyTypeList = propArray.map(prop =>
      <PropertyType
        key={prop.key}
        propertyType={prop}
        navBar={this.props.navBar}
        error={this.updateDeleteError}
        updateFn={this.props.updateSchemaFn}
        schemaName={this.props.name}
        schemaNamespace={this.props.namespace}
      />
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
              <td className={this.shouldAddExtraFieldOptions()}><input
                type="text"
                id={'pDatatype'.concat(id)}
                placeholder="datatype"
                className={'tableCell'}
              /></td>
              <td className={this.shouldAddExtraFieldOptions()}><input
                type="text"
                id={'pMultiplicity'.concat(id)}
                placeholder="multiplicity"
                className={'tableCell'}
              /></td>
              <td><Button onClick={this.addProperty}>Save</Button></td>
            </tr>
          </tbody>
        </table>
        <Button onClick={this.newProperty} className={this.addRowClassName[!this.state.newPropertyRow]}>+</Button>
        <div className={this.showErrorMsgClass[this.state.addError]}>Unable to add property type.</div>
        <div className={this.showErrorMsgClass[this.state.deleteError]}>Unable to delete property type.</div>
      </div>
    );
  }
}

export default PropertyTypeList;
