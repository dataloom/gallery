import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { InputField } from './InputField';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
import StringConsts from '../../../../utils/Consts/StringConsts';
import styles from '../styles.module.css';

const NAME_FIELD = 'name';
const NAMESPACE_FIELD = 'namespace';

const INITIAL_STATE = {
  [NAME_FIELD]: StringConsts.EMPTY,
  [NAMESPACE_FIELD]: StringConsts.EMPTY,
  pKeysAdded: [],
  typeName: StringConsts.EMPTY,
  typeNamespace: StringConsts.EMPTY,
  editing: false,
  error: false
};

export class NewEntityType extends React.Component {

  static propTypes = {
    createSuccess: PropTypes.func,
    namespaces: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  addPKeyToList = () => {
    const newPKey = {
      namespace: this.state.typeNamespace,
      name: this.state.typeName
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

  handleInputChange = (newState) => {
    this.setState(newState);
  }

  handleTypeNamespaceChange = (newValue) => {
    this.setState({ typeNamespace: newValue });
  }

  handleTypeNameChange = (newValue) => {
    this.setState({ typeName: newValue });
  }

  setEditing = () => {
    this.setState({ editing: true });
  }

  createNewEntityType = () => {
    EntityDataModelApi.createEntityType({
      namespace: this.state[NAMESPACE_FIELD],
      name: this.state[NAME_FIELD],
      properties: this.state.pKeysAdded,
      key: this.state.pKeysAdded
    }).then(() => {
      this.props.createSuccess();
      this.setState(INITIAL_STATE);
    }).catch(() => {
      this.setState({ error: true });
    });
  }

  renderButton = () => {
    const className = (this.state.editing) ? styles.hidden : styles.genericButton;
    return (
      <button
        onClick={this.setEditing}
        className={className}
      >Create a new entity type
      </button>
    );
  }

  renderPKeysAdded = () => {
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

  renderInput = () => {
    const className = (this.state.editing) ? StringConsts.EMPTY : styles.hidden;
    return (
      <div className={className}>
        <InputField
          title="Entity Type Namespace:"
          name={NAMESPACE_FIELD}
          value={this.state[NAMESPACE_FIELD]}
          updateFn={this.handleInputChange}
        />
        <InputField
          title="Entity Type Name:"
          name={NAME_FIELD}
          value={this.state[NAME_FIELD]}
          updateFn={this.handleInputChange}
        />
        <div>Primary Key:</div>
        <table>
          <tbody>
            <tr>
              <th />
              <th className={styles.tableCell}>Name</th>
              <th className={styles.tableCell}>Namespace</th>
            </tr>
            {this.renderPKeysAdded()}
            <NameNamespaceAutosuggest
              namespaces={this.props.namespaces}
              usedProperties={this.state.pKeysAdded}
              addProperty={this.addPKeyToList}
              onNameChange={this.handleTypeNameChange}
              onNamespaceChange={this.handleTypeNamespaceChange}
              initialName={this.state.typeName}
              initialNamespace={this.state.typeNamespace}
            />
          </tbody>
        </table>
        <button className={styles.genericButton} onClick={this.createNewEntityType}>Create</button>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderButton()}
        {this.renderInput()}
        <div className={this.errorClass[this.state.error]}>Unable to create entity type.</div>
        <div className={styles.spacerBig} />
      </div>
    );
  }
}

export default NewEntityType;
