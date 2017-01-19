import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { PropertyType } from './PropertyType';
import Utils from '../../../../utils/Utils';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import StringConsts from '../../../../utils/Consts/StringConsts';
import { NewEdmObjectInput } from './NewEdmObjectInput';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
import styles from '../styles.module.css';

export class PropertyTypeList extends React.Component {
  static propTypes = {
    propertyTypes: PropTypes.array,
    name: PropTypes.string,
    namespace: PropTypes.string,
    updateSchemaFn: PropTypes.func,
    propertyTypePage: PropTypes.bool
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
      loadTypesError: false
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
    return (this.props.propertyTypePage) ? this.updateFn() : this.keyPropertyTypes();
  }

  updateFn = () => {
    EntityDataModelApi.getAllPropertyTypes()
    .then((propertyTypes) => {
      this.setState({
        propertyTypes: Utils.addKeysToArray(propertyTypes),
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
    const title = this.state.newPropTitle;
    EntityDataModelApi.createPropertyType({ name, namespace, datatype, title })
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
    return (this.props.propertyTypePage) ? styles.edmContainer : StringConsts.EMPTY;
  }

  renderNewPropertyTypeInputLine = () => {
    if (!this.context.isAdmin) return null;
    return (
      <NewEdmObjectInput
        createSuccess={this.updateFn}
        edmType={EdmConsts.PROPERTY_TYPE_TITLE}
      />
    );
  }

  render() {
    const { propertyTypePage, updateSchemaFn, name, namespace } = this.props;
    const { propertyTypes, addError, deleteError } = this.state;
    const propArray = (propertyTypePage) ? propertyTypes : this.keyPropertyTypes();
    const propertyTypeList = propArray.map((prop) => {
      return (<PropertyType
        key={prop.key}
        propertyType={prop}
        propertyTypePage={propertyTypePage}
        error={this.updateDeleteError}
        updateFn={updateSchemaFn}
        schemaName={name}
        schemaNamespace={namespace}
      />);
    });

    return (
      <div className={this.shouldDisplayContainer()}>
        {this.renderNewPropertyTypeInputLine()}
        <div className={this.showErrorMsgClass[this.state.loadTypesError]}>Unable to load property types.</div>
        {propertyTypeList}
        <div className={this.showErrorMsgClass[addError]}>Unable to add property type.</div>
        <div className={this.showErrorMsgClass[deleteError]}>Unable to delete property type.</div>
      </div>
    );
  }
}

export default PropertyTypeList;
