import React, { PropTypes } from 'react';
import { Promise } from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import Utils from '../../../../utils/Utils';
import { EntityType } from './EntityType';
import StringConsts from '../../../../utils/Consts/StringConsts';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
import styles from '../styles.module.css';

export class EntityTypeList extends React.Component {

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      entityTypes: [],
      newEntityType: false,
      loadTypesError: false,
      createTypeError: false,
      allPropNamespaces: {},
      newEntityTypeName: '',
      newEntityTypeNamespace: '',
      newPKeyName: '',
      newPKeyNamespace: '',
      newPKeysAdded: []
    };
  }

  componentDidMount() {
    this.updateFn();
  }

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  newEntityType = () => {
    this.setState({ newEntityType: true });
  }

  newEntityTypeSuccess = () => {
    EntityDataModelApi.getAllEntityTypes()
      .then((entityTypes) => {
        this.setState({
          entityTypes: Utils.addKeysToArray(entityTypes),
          newEntityType: false,
          newEntityTypeName: '',
          newEntityTypeNamespace: '',
          newPKeyName: '',
          newPKeyNamespace: '',
          newPKeysAdded: [],
          loadTypesError: false,
          createTypeError: false
        });
      }).catch(() => {
        this.setState({ loadTypesError: true });
      });
  }

  createNewEntityType = () => {
    const { newEntityTypeName, newEntityTypeNamespace, newPKeysAdded } = this.state;
    const name = newEntityTypeName;
    const namespace = newEntityTypeNamespace;
    EntityDataModelApi.createEntityType({
      namespace,
      name,
      properties: newPKeysAdded,
      key: newPKeysAdded
    }).then(() => {
      this.newEntityTypeSuccess();
    }).catch(() => {
      this.setState({ createTypeError: true });
    });
  }

  updateFn = () => {
    Promise.join(
      EntityDataModelApi.getAllEntityTypes(),
      EntityDataModelApi.getAllPropertyTypes(),
      (entityTypes, propertyTypes) => {
        const allPropNamespaces = {};
        propertyTypes.forEach((prop) => {
          if (allPropNamespaces[prop.namespace] === undefined) {
            allPropNamespaces[prop.namespace] = [prop.name];
          }
          else {
            allPropNamespaces[prop.namespace].push(prop.name);
          }
        });
        this.setState({
          entityTypes: Utils.addKeysToArray(entityTypes),
          allPropNamespaces,
          loadTypesError: false
        });
      }
    ).catch(() => {
      this.setState({ loadTypesError: true });
    });
  }

  addPKeyToList = () => {
    const newPKey = {
      namespace: this.state.newPKeyNamespace,
      name: this.state.newPKeyName
    };
    const newPKeysAdded = this.state.newPKeysAdded;
    newPKeysAdded.push(newPKey);
    this.setState({
      newPKeysAdded,
      newPKeyName: StringConsts.EMPTY,
      newPKeyNamespace: StringConsts.EMPTY
    });
  }

  removePKeyFromList = (pKeyToDelete) => {
    const newPKeysAdded = this.state.newPKeysAdded.filter((pKey) => {
      return (pKey.name !== pKeyToDelete.name || pKey.namespace !== pKeyToDelete.namespace);
    });
    this.setState({ newPKeysAdded });
  }

  handleNameChange = (e) => {
    this.setState({ newEntityTypeName: e.target.value });
  }

  handleNamespaceChange = (e) => {
    this.setState({ newEntityTypeNamespace: e.target.value });
  }

  handlePKeyNameChange = (newValue) => {
    this.setState({ newPKeyName: newValue });
  }

  handlePKeyNamespaceChange = (newValue) => {
    this.setState({ newPKeyNamespace: newValue });
  }

  renderCreateEntityTypeButton = () => {
    if (!this.context.isAdmin) return null;
    const className = (this.state.newEntityType) ? styles.hidden : styles.genericButton;
    return (
      <button onClick={this.newEntityType} className={className}>Create a new entity type</button>
    );
  }

  renderCreateEntityTypeInput = () => {
    if (!this.context.isAdmin) return null;
    const {
      allPropNamespaces,
      newEntityType,
      newEntityTypeNamespace,
      newEntityTypeName,
      createTypeError,
      newPKeysAdded
    } = this.state;

    const pKeysAdded = newPKeysAdded.map((pKey) => {
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
    const className = (newEntityType) ? StringConsts.EMPTY : styles.hidden;
    return (
      <div className={className}>
        <div>Entity Type Namespace:</div>
        <div className={styles.spacerMini} />
        <input
          value={newEntityTypeNamespace}
          onChange={this.handleNamespaceChange}
          className={styles.inputBox}
          type="text"
          placeholder="namespace"
        />
        <div className={styles.spacerSmall} />
        <div>Entity Type Name:</div>
        <div className={styles.spacerMini} />
        <input
          value={newEntityTypeName}
          onChange={this.handleNameChange}
          className={styles.inputBox}
          type="text"
          placeholder="name"
        />
        <div className={styles.spacerSmall} />
        <div>Primary Key:</div>
        <div className={styles.spacerMini} />
        <table>
          <tbody>
            <tr>
              <th />
              <th className={styles.tableCell}>Name</th>
              <th className={styles.tableCell}>Namespace</th>
            </tr>
            {pKeysAdded}
            <NameNamespaceAutosuggest
              namespaces={allPropNamespaces}
              usedProperties={newPKeysAdded}
              addProperty={this.addPKeyToList}
              onNameChange={this.handlePKeyNameChange}
              onNamespaceChange={this.handlePKeyNamespaceChange}
              initialName={this.state.newPKeyName}
              initialNamespace={this.state.newPKeyNamespace}
            />
          </tbody>
        </table>
        <div className={styles.spacerSmall} />
        <button className={styles.genericButton} onClick={this.createNewEntityType}>Create</button>
        <div className={this.errorClass[createTypeError]}>Unable to create entity type.</div>
      </div>
    );
  }

  render() {
    const { entityTypes, allPropNamespaces, loadTypesError } = this.state;

    const entityTypeList = entityTypes.map((entityType) => {
      return (<EntityType
        key={entityType.key}
        name={entityType.name}
        namespace={entityType.namespace}
        properties={entityType.properties}
        primaryKey={entityType.primaryKey}
        updateFn={this.updateFn}
        allPropNamespaces={allPropNamespaces}
      />);
    });

    return (
      <div>
        <div className={styles.edmContainer}>
          {this.renderCreateEntityTypeButton()}
          {this.renderCreateEntityTypeInput()}
        </div>
        <div className={this.errorClass[loadTypesError]}>Unable to load entity types.</div>
        {entityTypeList}
      </div>
    );
  }
}

export default EntityTypeList;
