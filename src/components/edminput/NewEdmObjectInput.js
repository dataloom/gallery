import React, { PropTypes } from 'react';
import { EntityDataModelApi, DataModels } from 'loom-data';
import { NameNamespaceAutosuggest } from '../namespaceautosuggest/NameNamespaceAutosuggest';
import StringConsts from '../../utils/Consts/StringConsts';
import EdmConsts from '../../utils/Consts/EdmConsts';
import styles from '../../views/Main/Schemas/styles.module.css';

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
  editing: false,
  error: false
};

export class NewEdmObjectInput extends React.Component {

  static propTypes = {
    createSuccess: PropTypes.func,
    namespaces: PropTypes.object,
    fqnToId: PropTypes.object,
    edmType: PropTypes.string
  }

  constructor() {
    super();
    this.state = INITIAL_STATE;
  }

  addPKeyToList = () => {
    const newPKeyId = this.props.fqnToId[`${this.state.typeNamespace}.${this.state.typeName}`];
    if (newPKeyId === undefined) return;
    const newPKey = {
      namespace: this.state.typeNamespace,
      name: this.state.typeName,
      id: newPKeyId
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
      return (pKey.name !== pKeyToDelete.name || pKey.namespace !== pKeyToDelete.namespace);
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

  handleTitleChange = (newValue) => {
    this.setState({ title: newValue });
  }

  handleDescriptionChange = (newValue) => {
    this.setState({ description: newValue });
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
    const { FullyQualifiedName, EntityTypeBuilder } = DataModels;
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
      default:
        return Promise.resolve();
    }
  }

  renderButton = () => {
    const className = (this.state.editing) ? styles.hidden : styles.genericButton;
    return (
      <button
        onClick={this.setEditing}
        className={className}
      >Create a new {this.props.edmType.toLowerCase()}
      </button>
    );
  }

  renderPKeysAdded = () => {
    if (this.props.edmType !== EdmConsts.ENTITY_TYPE_TITLE) return null;
    return this.state.pKeysAdded.map((pKey) => {
      return (
        <tr key={`${pKey.namespace}.${pKey.name}`}>
          <td>
            <button
              className={styles.deleteButton}
              onClick={() => {
                this.removePKeyFromList(pKey);
              }}
            >-</button>
          </td>
          <td className={styles.tableCell}>{pKey.name}</td>
          <td className={styles.tableCell}>{pKey.namespace}</td>
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
          className={styles.inputBox}
        />
        <div className={styles.spacerSmall} />
      </div>
    );
  }

  renderInputFieldsForEdmType = () => {
    switch (this.props.edmType) {
      case EdmConsts.ENTITY_SET_TITLE:
        return (
          <div>
            {this.renderInputField('Name', NAME_FIELD)}
            {this.renderInputField('Title', TITLE_FIELD)}
          </div>
        );
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
      default:
        return null;
    }
  }

  renderInputAutosuggest = () => {
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
              initialNamespace={typeNamespace}
            />
          </tbody>
        </table>
      </div>
    );
  }

  renderInput = () => {
    const inputClassName = (this.state.editing) ? StringConsts.EMPTY : styles.hidden;
    return (
      <div className={inputClassName}>
        {this.renderInputFieldsForEdmType()}
        {this.renderInputAutosuggest()}
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
