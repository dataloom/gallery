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
  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  constructor() {
    super();
    this.state = {
      propertyTypes: [],
      addError: false,
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
    this.updateFn();
  }

  updateFn = () => {
    EntityDataModelApi.getAllPropertyTypes()
    .then((propertyTypes) => {
      this.setState({
        propertyTypes,
        addError: false
      });
    }).catch(() => {
      this.setState({ loadTypesError: true });
    });
  }

  updateAddError = () => {
    this.setState({
      addError: true
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
    const { propertyTypes, addError } = this.state;
    const propArray = propertyTypes;
    const propertyTypeList = propArray.map((prop) => {
      return (<PropertyType
        key={prop.id}
        propertyType={prop}
      />);
    });

    return (
      <div className={styles.edmContainer}>
        {this.renderNewPropertyTypeInputLine()}
        <div className={this.showErrorMsgClass[this.state.loadTypesError]}>Unable to load property types.</div>
        {propertyTypeList}
        <div className={this.showErrorMsgClass[addError]}>Unable to add property type.</div>
      </div>
    );
  }
}

export default PropertyTypeList;
