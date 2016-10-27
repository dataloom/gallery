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
    allPropNamespaces: PropTypes.object
  }

  constructor() {
    super();
    this.state = {
      propertyTypes: [],
      newPropertyRow: false,
      addError: false,
      deleteError: false,
      newPropName: '',
      newPropNamespace: '',
      newPropDatatype: '',
      newPropMultiplicity: ''
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
    EntityDataModelApi.getAllPropertyTypes()
      .then((propertyTypes) => {
        this.setState({
          propertyTypes: Utils.addKeysToArray(propertyTypes),
          newPropertyRow: false,
          newPropName: '',
          newPropNamespace: '',
          newPropMultiplicity: '',
          newPropDatatype: ''
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

  handleNameChange = (e) => {
    this.setState({ newPropName: e.target.value });
  }

  handleNamespaceChange = (e) => {
    this.setState({ newPropNamespace: e.target.value });
  }

  handleDatatypeChange = (newValue) => {
    this.setState({ newPropDatatype: newValue });
  }

  handleMultiplicityChange = (e) => {
    this.setState({ newPropMultiplicity: e.target.value });
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
                value={this.state.newPropName}
                onChange={this.handleNameChange}
                placeholder="name"
                className={styles.tableCell}
              /></td>
              <td><input
                type="text"
                value={this.state.newPropNamespace}
                onChange={this.handleNamespaceChange}
                placeholder="namespace"
                className={styles.tableCell}
              /></td>
              <td><EdmDatatypeAutosuggest onChangeFn={this.handleDatatypeChange} /></td>
              <td><input
                type="text"
                value={this.state.newPropMultiplicity}
                onChange={this.handleMultiplicityChange}
                placeholder="multiplicity"
                className={styles.tableCell}
              /></td>
              <td><Button onClick={this.createNewPropertyType}>Save</Button></td>
            </tr>
            <NameNamespaceAutosuggest
              className={this.shouldShow[this.state.newPropertyRow && !this.props.navBar]}
              namespaces={this.props.allPropNamespaces}
              addProperty={this.addPropertyToSchema}
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
