import React, { PropTypes } from 'react';
import Select from 'react-select';

import {
  FormControl,
  FormGroup,
  ControlLabel,
  Button
} from 'react-bootstrap';

import {
  EntityDataModelApi,
  DataModels,
  SearchApi,
  Types
} from 'loom-data';

import StringConsts from '../../../../utils/Consts/StringConsts';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import DeleteButton from '../../../../components/buttons/DeleteButton';
import styles from '../styles.module.css';

import {
  NameNamespaceAutosuggest
} from './NameNamespaceAutosuggest';

const NAME_FIELD = 'name';
const NAMESPACE_FIELD = 'namespace';
const TITLE_FIELD = 'title';
const DESCRIPTION_FIELD = 'description';

const INITIAL_STATE = {
  [NAME_FIELD]: StringConsts.EMPTY,
  [NAMESPACE_FIELD]: StringConsts.EMPTY,
  [TITLE_FIELD]: StringConsts.EMPTY,
  [DESCRIPTION_FIELD]: StringConsts.EMPTY,
  propertyTypes: [],
  pKeys: [],
  typeName: StringConsts.EMPTY,
  typeNamespace: StringConsts.EMPTY,
  datatype: StringConsts.EMPTY,
  pii: false,
  error: false,
  phonetic: false
};

const STRING = 'String';
const { SecurableTypes } = Types;

export class NewEdmObjectInput extends React.Component {

  static propTypes = {
    createSuccess: PropTypes.func,
    edmType: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  addPropertyTypeToList = () => {
    const type = {
      namespace: this.state.typeNamespace,
      name: this.state.typeName
    };
    EntityDataModelApi.getPropertyTypeId(type)
    .then((id) => {
      const newPropertyType = { type, id };
      const propertyTypes = this.state.propertyTypes;
      propertyTypes.push(newPropertyType);
      this.setState({
        propertyTypes,
        typeNamespace: StringConsts.EMPTY,
        typeName: StringConsts.EMPTY
      });
    });
  }

  removePropertyTypeFromList = (propertyTypeToDelete) => {
    const propertyTypes = this.state.propertyTypes.filter((propertyType) => {
      return propertyType.id !== propertyTypeToDelete.id;
    });
    const pKeys = this.state.pKeys.filter((pKey) => {
      return pKey !== propertyTypeToDelete.id;
    });
    this.setState({ propertyTypes, pKeys });
  }

  handleInputChange = (e) => {

    const fieldName = e.target.name;
    this.setState({
      [fieldName]: e.target.value
    });
  }

  handleFQNChange = (newValue) => {
    this.setState({
      typeNamespace: newValue.namespace,
      typeName: newValue.name
    });
  }

  handleDatatypeChange = (e) => {
    const datatype = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    const phonetic = (datatype === STRING) ? this.state.phonetic : false;
    this.setState({ datatype, phonetic });
  }

  createNewEdmObject = () => {
    this.createNewObjectForEdmType()
    .then(() => {
      this.props.createSuccess();
      this.setState(INITIAL_STATE);
    }).catch(() => {
      this.setState({ error: true });
    });
  }

  createNewObjectForEdmType = () => {
    const { FullyQualifiedName, EntityTypeBuilder, PropertyTypeBuilder } = DataModels;
    const fqn = new FullyQualifiedName({
      namespace: this.state[NAMESPACE_FIELD],
      name: this.state[NAME_FIELD]
    });

    switch (this.props.edmType) {
      case EdmConsts.SCHEMA_TITLE: {
        return EntityDataModelApi.createEmptySchema(fqn);
      }
      case EdmConsts.ENTITY_TYPE_TITLE: {
        const propertyTypes = this.state.propertyTypes.map((propertyType) => {
          return propertyType.id;
        });
        const entityType = new EntityTypeBuilder()
          .setType(fqn)
          .setTitle(this.state[TITLE_FIELD])
          .setDescription(this.state[DESCRIPTION_FIELD])
          .setPropertyTypes(propertyTypes)
          .setKey(this.state.pKeys)
          .setCategory(SecurableTypes.EntityType)
          .build();
        return EntityDataModelApi.createEntityType(entityType);
      }
      case EdmConsts.PROPERTY_TYPE_TITLE: {
        const propertyType = new PropertyTypeBuilder()
          .setType(fqn)
          .setTitle(this.state[TITLE_FIELD])
          .setDescription(this.state[DESCRIPTION_FIELD])
          .setDataType(this.state.datatype)
          .build();
        propertyType.piiField = this.state.pii;
        propertyType.analyzer = (this.state.datatype === STRING && this.state.phonetic) ?
          EdmConsts.ANALYZERS.metaphone : EdmConsts.ANALYZERS.standard;
        return EntityDataModelApi.createPropertyType(propertyType);
      }
      default:
        return Promise.resolve();
    }
  }

  toggleCheckbox = (propertyTypeId) => {
    const checked = !this.state.pKeys.includes(propertyTypeId);
    const pKeys = this.state.pKeys.filter((id) => {
      return id !== propertyTypeId;
    });
    if (checked) pKeys.push(propertyTypeId);
    this.setState({ pKeys });
  }

  renderPrimaryKeyCheckbox = (propertyType) => {
    return (
      <input
          type="checkbox"
          checked={this.state.pKeys.includes(propertyType.id)}
          onClick={() => {
            this.toggleCheckbox(propertyType.id);
          }} />
    );
  }

  renderPropertyTypesAdded = () => {
    if (this.props.edmType !== EdmConsts.ENTITY_TYPE_TITLE) return null;
    return this.state.propertyTypes.map((propertyType) => {
      return (
        <tr key={`${propertyType.type.namespace}.${propertyType.type.name}`}>
          <td>
            <DeleteButton
                onClick={() => {
                  this.removePropertyTypeFromList(propertyType);
                }} />
          </td>
          <td className={styles.newEdmCell}>{propertyType.type.name}</td>
          <td className={styles.newEdmCell}>{propertyType.type.namespace}</td>
          <td className={styles.newEdmCell}>{this.renderPrimaryKeyCheckbox(propertyType)}</td>
        </tr>
      );
    });
  }

  renderInputField = (fieldType, fieldName) => {
    return (
      <FormGroup>
        <ControlLabel>{`${this.props.edmType} ${fieldType}`}</ControlLabel>
        <FormControl
            type="text"
            value={this.state[fieldName]}
            name={fieldName}
            placeholder={fieldName}
            onChange={this.handleInputChange} />
        <div className={styles.spacerSmall} />
      </FormGroup>
    );
  }

  renderInputFieldsForEdmType = () => {
    switch (this.props.edmType) {
      case EdmConsts.SCHEMA_TITLE:
      case EdmConsts.ENTITY_TYPE_TITLE:
        return (
          <div>
            {this.renderInputField('Title', TITLE_FIELD)}
            {this.renderInputField('Namespace', NAMESPACE_FIELD)}
            {this.renderInputField('Name', NAME_FIELD)}
            {this.renderInputField('Description', DESCRIPTION_FIELD)}
          </div>
        );
      case EdmConsts.PROPERTY_TYPE_TITLE:
        return (
          <div>
            {this.renderInputField('Title', TITLE_FIELD)}
            {this.renderInputField('Namespace', NAMESPACE_FIELD)}
            {this.renderInputField('Name', NAME_FIELD)}
            {this.renderInputField('Description', DESCRIPTION_FIELD)}
            {this.renderPiiDropdown()}
          </div>
        );
      default:
        return null;
    }
  }

  renderPiiDropdown = () => {
    const options = [
      { value: true, label: 'True' },
      { value: false, label: 'False' }
    ];
    return (
      <div>
        <div>PII</div>
        <div className={styles.spacerMini} />
        <Select
            value={this.state.pii}
            onChange={this.handlePiiChange}
            options={options}
            className={styles.piiSelect} />
        <div className={styles.spacerSmall} />
      </div>
    );
  }

  handlePiiChange = (e) => {
    const newValue = (e) ? e.value : false;
    this.setState({ pii: newValue });
  }

  renderInputFqnAutosuggest = () => {
    const { edmType } = this.props;
    const { propertyTypes, typeName, typeNamespace } = this.state;
    if (edmType !== EdmConsts.ENTITY_TYPE_TITLE) return null;
    const propertyTypeClassName = (edmType === EdmConsts.ENTITY_TYPE_TITLE) ? StringConsts.EMPTY : styles.hidden;
    const usedProperties = propertyTypes.map((propertyType) => {
      return propertyType.id;
    });
    return (
      <div>
        <div className={propertyTypeClassName}>Property Types:</div>
        <table>
          <tbody>
            <tr className={propertyTypeClassName}>
              <th />
              <th className={styles.newEdmCell}>Name</th>
              <th className={styles.newEdmCell}>Namespace</th>
              <th className={styles.newEdmCell}>Primary Key</th>
            </tr>
            {this.renderPropertyTypesAdded()}
            <NameNamespaceAutosuggest
                searchFn={SearchApi.searchPropertyTypesByFQN}
                usedProperties={usedProperties}
                addProperty={this.addPropertyTypeToList}
                onFQNChange={this.handleFQNChange}
                initialName={typeName}
                initialNamespace={typeNamespace} />
          </tbody>
        </table>
      </div>
    );
  }

  handlePhoneticChange = (e) => {
    this.setState({ phonetic: e.target.checked });
  }

  renderAllowPhonetic = () => {
    if (this.state.datatype !== STRING) return null;
    return (
      <div>
        <label htmlFor="phonetic" className={styles.label}>Allow phonetic searches: </label>
        <input type="checkbox" id="phonetic" onChange={this.handlePhoneticChange} />
        <div className={styles.spacerSmall} />
      </div>
    );
  }

  renderInputDatatypeAutosuggest = () => {
    if (this.props.edmType !== EdmConsts.PROPERTY_TYPE_TITLE) return null;
    return (
      <div>
        <div>Datatype:</div>
        <Select
            value={this.state.datatype}
            onChange={this.handleDatatypeChange}
            options={EdmConsts.EDM_PRIMITIVE_TYPES}
            placeholder="datatype"
            className={styles.datatypeSelect} />
        <div className={styles.spacerSmall} />
        {this.renderAllowPhonetic()}
      </div>
    );
  }

  renderInput = () => {
    return (
      <div>
        {this.renderInputFieldsForEdmType()}
        {this.renderInputFqnAutosuggest()}
        {this.renderInputDatatypeAutosuggest()}
        <Button bsStyle="primary" onClick={this.createNewEdmObject}>Create</Button>
      </div>
    );
  }

  render() {
    const errorClassName = (this.state.error) ? styles.errorMsg : styles.hidden;
    return (
      <div>
        <form
            onSubmit={(e) => {
              e.preventDefault();
            }} >
          {this.renderInput()}
        </form>
        <div className={errorClassName}>Unable to create {this.props.edmType.toLowerCase()}.</div>
      </div>
    );
  }
}

export default NewEdmObjectInput;
