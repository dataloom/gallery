import React from 'react';
import { Promise } from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import Utils from '../../../../utils/Utils';
import { EntityType } from './EntityType';
import StringConsts from '../../../../utils/Consts/StringConsts';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
import styles from '../styles.module.css';

export class EntityTypeList extends React.Component {
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
      newPKeyNamespace: ''
    };
  }

  componentDidMount() {
    this.updateFn();
  }

  showNewEntityTypeButton = {
    true: styles.genericButton,
    false: styles.hidden
  }

  showNewEntityType = {
    true: StringConsts.EMPTY,
    false: styles.hidden
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
          loadTypesError: false,
          createTypeError: false
        });
      }).catch(() => {
        this.setState({ loadTypesError: true });
      });
  }

  createNewEntityType = () => {
    const { newEntityTypeName, newEntityTypeNamespace, newPKeyName, newPKeyNamespace } = this.state;
    const name = newEntityTypeName;
    const namespace = newEntityTypeNamespace;
    const pKey = [Utils.getFqnObj(newPKeyNamespace, newPKeyName)];
    EntityDataModelApi.createEntityType({ namespace, name, properties: pKey, key: pKey })
    .then(() => {
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

  render() {
    const {
      entityTypes,
      allPropNamespaces,
      newEntityType,
      newEntityTypeNamespace,
      newEntityTypeName,
      createTypeError,
      loadTypesError
    } = this.state;
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
          <button
            onClick={this.newEntityType}
            className={this.showNewEntityTypeButton[!newEntityType]}
          >Create a new entity type
          </button>
          <div className={this.showNewEntityType[newEntityType]}>
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
                <NameNamespaceAutosuggest
                  namespaces={allPropNamespaces}
                  usedProperties={[]}
                  addProperty={this.createNewEntityType}
                  saveOption={false}
                  onNameChange={this.handlePKeyNameChange}
                  onNamespaceChange={this.handlePKeyNamespaceChange}
                />
              </tbody>
            </table>
            <div className={styles.spacerSmall} />
            <button className={styles.genericButton} onClick={this.createNewEntityType}>Create</button>
          </div>
          <div className={this.errorClass[createTypeError]}>Unable to create entity type.</div>
        </div>
        <div className={this.errorClass[loadTypesError]}>Unable to load entity types.</div>
        {entityTypeList}
      </div>
    );
  }
}

export default EntityTypeList;
