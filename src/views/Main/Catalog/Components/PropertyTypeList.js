import React, { PropTypes } from 'react';
import Select from 'react-select';
import { EntityDataModelApi } from 'loom-data';
import { PropertyType } from './PropertyType';
import Utils from '../../../../utils/Utils';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import StringConsts from '../../../../utils/Consts/StringConsts';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
import styles from '../styles.module.css';

export class PropertyTypeList extends React.Component {
  static propTypes = {
    propertyTypes: PropTypes.array,
    name: PropTypes.string,
    namespace: PropTypes.string,
    updateSchemaFn: PropTypes.func,
    navBar: PropTypes.bool,
    allPropNamespaces: PropTypes.object
  }

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  constructor() {
    super();
    this.state = {
      propertyTypes: [],
      newPropertyRow: false,
      addError: false,
      deleteError: false,
      loadTypesError: false,
      newPropName: '',
      newPropNamespace: '',
      newPropDatatype: '',
      newPropMultiplicity: ''
    };
  }

  shouldShow = {
    true: StringConsts.EMPTY,
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
    EntityDataModelApi.getAllPropertyTypes()
    .then((propertyTypes) => {
      this.setState({
        propertyTypes: Utils.addKeysToArray(propertyTypes),
        newPropertyRow: false,
        newPropName: '',
        newPropNamespace: '',
        newPropMultiplicity: '',
        newPropDatatype: '',
        addError: false,
        deleteError: false
      });
    }).catch(() => {
      this.setState({ loadTypesError: true });
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
    const name = this.state.newPropName;
    const namespace = this.state.newPropNamespace;
    const datatype = this.state.newPropDatatype;
    const multiplicity = this.state.newPropMultiplicity;
    EntityDataModelApi.createPropertyType({ name, namespace, datatype, multiplicity })
    .then(() => {
      this.updateFn();
    }).catch(() => {
      this.updateAddError();
    });
  }

  successfullyAddedProperty = () => {
    this.setState({
      newPropertyRow: false,
      addError: false,
      deleteError: false
    });
    this.props.updateSchemaFn();
  }

  addPropertyToSchema = (namespace, name) => {
    EntityDataModelApi.addPropertyTypesToSchema(
      Utils.getFqnObj(this.props.namespace, this.props.name),
      [Utils.getFqnObj(namespace, name)]
    ).then(() => {
      this.successfullyAddedProperty();
    }).catch(() => {
      this.updateAddError();
    });
  }

  shouldDisplayContainer = () => {
    return (this.props.navBar) ? styles.edmContainer : StringConsts.EMPTY;
  }

  handleNameChange = (e) => {
    this.setState({ newPropName: e.target.value });
  }

  handleNamespaceChange = (e) => {
    this.setState({ newPropNamespace: e.target.value });
  }

  handleDatatypeChange = (e) => {
    const newPropDatatype = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.setState({ newPropDatatype });
  }

  handleMultiplicityChange = (e) => {
    this.setState({ newPropMultiplicity: e.target.value });
  }

  renderNewPropertyTypeInputLine = () => {
    const { newPropertyRow, newPropName, newPropNamespace, newPropMultiplicity } = this.state;
    if (!this.context.isAdmin) return null;
    return (
      <tr className={this.shouldShow[newPropertyRow && this.props.navBar]}>
        <td><input
          type="text"
          value={newPropName}
          onChange={this.handleNameChange}
          placeholder="name"
          className={styles.tableCell}
        /></td>
        <td><input
          type="text"
          value={newPropNamespace}
          onChange={this.handleNamespaceChange}
          placeholder="namespace"
          className={styles.tableCell}
        /></td>
        <td>
          <Select
            value={this.state.newPropDatatype}
            onChange={this.handleDatatypeChange}
            options={EdmConsts.EDM_PRIMITIVE_TYPES}
            placeholder="datatype"
          />
        </td>
        <td><input
          type="text"
          value={newPropMultiplicity}
          onChange={this.handleMultiplicityChange}
          placeholder="multiplicity"
          className={styles.tableCell}
        /></td>
        <td><button className={styles.genericButton} onClick={this.createNewPropertyType}>Save</button></td>
      </tr>
    );
  }

  renderNewPropertyButton = () => {
    if (!this.context.isAdmin) return null;
    const className = (this.state.newPropertyRow) ? styles.hidden : styles.addButton;
    const val = (
      <button onClick={this.newProperty} className={className}>+</button>
    );
    return val;
  }

  render() {
    const { navBar, updateSchemaFn, name, namespace, allPropNamespaces } = this.props;
    const { propertyTypes, newPropertyRow, addError, deleteError } = this.state;
    const propArray = (navBar) ? propertyTypes : this.keyPropertyTypes();
    const propertyTypeList = propArray.map((prop) => {
      return (<PropertyType
        key={prop.key}
        propertyType={prop}
        navBar={navBar}
        error={this.updateDeleteError}
        updateFn={updateSchemaFn}
        schemaName={name}
        schemaNamespace={namespace}
      />);
    });
    return (
      <div className={this.shouldDisplayContainer()}>
        <div className={this.showErrorMsgClass[this.state.loadTypesError]}>Unable to load property types.</div>
        <table>
          <tbody>
            <tr>
              <th className={this.shouldShow[!navBar]} />
              <th className={styles.tableCell}>Property Type Name</th>
              <th className={styles.tableCell}>Property Type Namespace</th>
              <th className={styles.tableCell}>Property Type Datatype</th>
              <th className={styles.tableCell}>Property Type Multiplicity</th>
            </tr>
            {propertyTypeList}
            {this.renderNewPropertyTypeInputLine()}
            <NameNamespaceAutosuggest
              className={this.shouldShow[newPropertyRow && !navBar && this.context.isAdmin]}
              namespaces={allPropNamespaces}
              usedProperties={propertyTypes}
              addProperty={this.addPropertyToSchema}
            />
          </tbody>
        </table>
        {this.renderNewPropertyButton()}
        <div className={this.showErrorMsgClass[addError]}>Unable to add property type.</div>
        <div className={this.showErrorMsgClass[deleteError]}>Unable to delete property type.</div>
      </div>
    );
  }
}

export default PropertyTypeList;
