import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { EntityDataModelApi } from 'loom-data';
import { PropertyType } from './PropertyType';
import Utils from '../../../../utils/Utils';
import Consts from '../../../../utils/AppConsts';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
import { EdmDatatypeAutosuggest } from './EdmDatatypeAutosuggest';
import styles from '../styles.module.css';

export class PropertyTypeList extends React.Component {
  static propTypes = {
    propertyTypes: PropTypes.array,
    name: PropTypes.string,
    namespace: PropTypes.string,
    updateSchemaFn: PropTypes.func,
    navBar: PropTypes.bool,
    id: PropTypes.number,
    allPropNamespaces: PropTypes.object
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

  shouldShow = {
    true: Consts.EMPTY,
    false: styles.hidden
  }

  showErrorMsgClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  componentDidMount() {
    return (this.props.navBar) ? this.updateFn() : this.keyPropertyTypes();
  }

  updateFn = () => {
    const id = this.props.id;
    document.getElementById(`pName${id}`).value = Consts.EMPTY;
    document.getElementById(`pNamespace${id}`).value = Consts.EMPTY;
    document.getElementById(`pDatatype${id}`).value = Consts.EMPTY;
    document.getElementById(`pMultiplicity${id}`).value = Consts.EMPTY;
    EntityDataModelApi.getAllPropertyTypes()
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

  createNewPropertyType = () => {
    const id = this.props.id;
    const name = document.getElementById(`pName${id}`).value;
    const namespace = document.getElementById(`pNamespace${id}`).value;
    const datatype = document.getElementById(`pDatatype${id}`).firstChild.firstChild.value;
    const multiplicity = document.getElementById(`pMultiplicity${id}`).value;
    EntityDataModelApi.createPropertyType({ name, namespace, datatype, multiplicity })
    .then(() => {
      this.updateFn();
    }).catch(() => {
      this.updateAddError();
    });
  }

  successfullyAddedProperty = () => {
    this.setState({ newPropertyRow: false });
    this.props.updateSchemaFn();
  }

  addPropertyToSchema = (namespace, name) => {
    EntityDataModelApi.addPropertyTypesToSchema(
      {
        namespace: this.props.namespace,
        name: this.props.name
      },
      [{ namespace, name }]
    ).then(() => {
      this.successfullyAddedProperty();
    }).catch(() => {
      this.updateAddError();
    });
  }

  shouldDisplayContainer = () => {
    return (this.props.navBar) ? styles.edmContainer : Consts.EMPTY;
  }

  render() {
    const propArray = (this.props.navBar) ? this.state.propertyTypes : this.keyPropertyTypes();
    const propertyTypeList = propArray.map((prop) => {
      return (<PropertyType
        key={prop.key}
        propertyType={prop}
        navBar={this.props.navBar}
        error={this.updateDeleteError}
        updateFn={this.props.updateSchemaFn}
        schemaName={this.props.name}
        schemaNamespace={this.props.namespace}
      />);
    });
    const id = this.props.id;
    return (
      <div className={this.shouldDisplayContainer()}>
        <table>
          <tbody>
            <tr>
              <th className={this.shouldShow[!this.props.navBar]} />
              <th className={styles.tableCell}>Name</th>
              <th className={styles.tableCell}>Namespace</th>
              <th className={styles.tableCell}>Datatype</th>
              <th className={styles.tableCell}>Multiplicity</th>
            </tr>
            {propertyTypeList}
            <tr className={this.shouldShow[this.state.newPropertyRow && this.props.navBar]}>
              <td><input
                type="text"
                id={`pName${id}`}
                placeholder="name"
                className={styles.tableCell}
              /></td>
              <td><input
                type="text"
                id={`pNamespace${id}`}
                placeholder="namespace"
                className={styles.tableCell}
              /></td>
              <td id={`pDatatype${id}`}><EdmDatatypeAutosuggest /></td>
              <td><input
                type="text"
                id={`pMultiplicity${id}`}
                placeholder="multiplicity"
                className={styles.tableCell}
              /></td>
              <td><Button onClick={this.createNewPropertyType}>Save</Button></td>
            </tr>
            <NameNamespaceAutosuggest
              className={this.shouldShow[this.state.newPropertyRow && !this.props.navBar]}
              id={id}
              namespaces={this.props.allPropNamespaces}
              addProperty={this.addPropertyToSchema}
              type={Consts.PROPERTY_TYPE}
            />
          </tbody>
        </table>
        <Button onClick={this.newProperty} className={this.shouldShow[!this.state.newPropertyRow]}>+</Button>
        <div className={this.showErrorMsgClass[this.state.addError]}>Unable to add property type.</div>
        <div className={this.showErrorMsgClass[this.state.deleteError]}>Unable to delete property type.</div>
      </div>
    );
  }
}

export default PropertyTypeList;
