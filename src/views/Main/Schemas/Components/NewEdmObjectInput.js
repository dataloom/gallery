import React, { PropTypes } from 'react';
import Select from 'react-select';
import { EntityDataModelApi, DataModels } from 'loom-data';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
import StringConsts from '../../../../utils/Consts/StringConsts';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import styles from '../styles.module.css';

const NAME_FIELD = 'name';
const NAMESPACE_FIELD = 'namespace';
const TITLE_FIELD = 'title';
const DESCRIPTION_FIELD = 'description';

const INITIAL_STATE = {
  [NAME_FIELD]: StringConsts.EMPTY,
  [NAMESPACE_FIELD]: StringConsts.EMPTY,
  [TITLE_FIELD]: StringConsts.EMPTY,
  [DESCRIPTION_FIELD]: StringConsts.EMPTY,
  pKeysAdded: [],
  typeName: StringConsts.EMPTY,
  typeNamespace: StringConsts.EMPTY,
  datatype: StringConsts.EMPTY,
  pii: false,
  editing: false,
  error: false
};

export class NewEdmObjectInput extends React.Component {

  static propTypes = {
    createSuccess: PropTypes.func,
    namespaces: PropTypes.object,
    edmType: PropTypes.string
  }

  constructor() {
    super();
    this.state = INITIAL_STATE;
  }

  addPKeyToList = () => {
    const newPKeyIdList = this.props.namespaces[this.state.typeNamespace].filter((propObj) => {
      return (propObj.name === this.state.typeName);
    });
    if (newPKeyIdList.length !== 1) {
      return;
    }
    const newPKey = {
      type: {
        namespace: this.state.typeNamespace,
        name: this.state.typeName
      },
      id: newPKeyIdList[0].id
    };
    const pKeysAdded = this.state.pKeysAdded;
    pKeysAdded.push(newPKey);
    this.setState({
      pKeysAdded,
      typeNamespace: StringConsts.EMPTY,
      typeName: StringConsts.EMPTY
    });
  }

  removePKeyFromList = (pKeyToDelete) => {
    const pKeysAdded = this.state.pKeysAdded.filter((pKey) => {
      return (pKey.id !== pKeyToDelete.id);
    });
    this.setState({ pKeysAdded });
  }

  handleInputChange = (e) => {

    const fieldName = e.target.name;
    this.setState({
      [fieldName]: e.target.value
    });
  }

  handleTypeNamespaceChange = (newValue) => {
    this.setState({ typeNamespace: newValue });
  }

  handleTypeNameChange = (newValue) => {
    this.setState({ typeName: newValue });
  }

  handleDatatypeChange = (e) => {
    const newValue = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.setState({ datatype: newValue });
  }

  setEditing = () => {
    this.setState({ editing: true });
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
      case EdmConsts.ENTITY_SET_TITLE:
        return EntityDataModelApi.createEntitySets([{
          name: this.state[NAME_FIELD],
          title: this.state[TITLE_FIELD],
          type: {
            name: this.state.typeName,
            namespace: this.state.typeNamespace
          }
        }]);
      case EdmConsts.ENTITY_TYPE_TITLE: {
        const pKeys = this.state.pKeysAdded.map((pKey) => {
          return pKey.id;
        });
        const entityType = new EntityTypeBuilder()
          .setType(fqn)
          .setTitle(this.state[TITLE_FIELD])
          .setDescription(this.state[DESCRIPTION_FIELD])
          .setPropertyTypes(pKeys)
          .setKey(pKeys)
          .setSchemas([])
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
        return EntityDataModelApi.createPropertyType(propertyType);
      }
      default:
        return Promise.resolve();
    }
  }

  renderButton = () => {
    const className = (this.state.editing) ? styles.hidden : styles.genericButton;
    return (
      <button
          onClick={this.setEditing}
          className={className}>Create a new {this.props.edmType.toLowerCase()}
      </button>
    );
  }

  renderPKeysAdded = () => {
    if (this.props.edmType !== EdmConsts.ENTITY_TYPE_TITLE) return null;
    return this.state.pKeysAdded.map((pKey) => {
      return (
        <tr key={`${pKey.type.namespace}.${pKey.type.name}`}>
          <td>
            <button
                className={styles.deleteButton}
                onClick={() => {
                  this.removePKeyFromList(pKey);
                }}>-</button>
          </td>
          <td className={styles.tableCell}>{pKey.type.name}</td>
          <td className={styles.tableCell}>{pKey.type.namespace}</td>
        </tr>
      );
    });
  }

  renderInputField = (fieldType, fieldName) => {
    return (
      <div>
        <div>{`${this.props.edmType} ${fieldType}`}</div>
        <div className={styles.spacerMini} />
        <input
            type="text"
            value={this.state[fieldName]}
            name={fieldName}
            placeholder={fieldName}
            onChange={this.handleInputChange}
            className={styles.inputBox} />
        <div className={styles.spacerSmall} />
      </div>
    );
  }

  renderInputFieldsForEdmType = () => {
    switch (this.props.edmType) {
      case EdmConsts.SCHEMA_TITLE:
      case EdmConsts.ENTITY_SET_TITLE:
        return (
          <div>
            {this.renderInputField('Name', NAME_FIELD)}
            {this.renderInputField('Namespace', NAMESPACE_FIELD)}
          </div>
        );
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
    const { edmType, namespaces } = this.props;
    const { pKeysAdded, typeName, typeNamespace } = this.state;
    if (edmType !== EdmConsts.ENTITY_TYPE_TITLE && edmType !== EdmConsts.ENTITY_SET_TITLE) return null;
    const pKeyClassName = (edmType === EdmConsts.ENTITY_TYPE_TITLE) ? StringConsts.EMPTY : styles.hidden;
    return (
      <div>
        <div className={pKeyClassName}>Primary Key:</div>
        <table>
          <tbody>
            <tr className={pKeyClassName}>
              <th />
              <th className={styles.tableCell}>Name</th>
              <th className={styles.tableCell}>Namespace</th>
            </tr>
            {this.renderPKeysAdded()}
            <NameNamespaceAutosuggest
                namespaces={namespaces}
                usedProperties={pKeysAdded}
                noSaveButton={(edmType === EdmConsts.ENTITY_SET_TITLE)}
                addProperty={this.addPKeyToList}
                onNameChange={this.handleTypeNameChange}
                onNamespaceChange={this.handleTypeNamespaceChange}
                initialName={typeName}
                initialNamespace={typeNamespace} />
          </tbody>
        </table>
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
            placeholder="datatype" />
        <div className={styles.spacerSmall} />
      </div>
    );
  }

  renderInput = () => {
    const inputClassName = (this.state.editing) ? StringConsts.EMPTY : styles.hidden;
    return (
      <div className={inputClassName}>
        {this.renderInputFieldsForEdmType()}
        {this.renderInputFqnAutosuggest()}
        {this.renderInputDatatypeAutosuggest()}
        <button className={styles.genericButton} onClick={this.createNewEdmObject}>Create</button>
      </div>
    );
  }

  render() {
    const errorClassName = (this.state.error) ? styles.errorMsg : styles.hidden;
    return (
      <div>
        {this.renderButton()}
        {this.renderInput()}
        <div className={errorClassName}>Unable to create {this.props.edmType.toLowerCase()}.</div>
        <div className={styles.spacerBig} />
      </div>
    );
  }
}

export default NewEdmObjectInput;
