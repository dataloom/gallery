import React from 'react';
import { Promise } from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import Utils from '../../../../utils/Utils';
import { EntityType } from './EntityType';
import Consts from '../../../../utils/AppConsts';
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
    true: Consts.EMPTY,
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
    const name = this.state.newEntityTypeName;
    const namespace = this.state.newEntityTypeNamespace;
    const pKey = [{
      name: this.state.newPKeyName,
      namespace: this.state.newPKeyNamespace
    }];
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
    const entityTypeList = this.state.entityTypes.map((entityType) => {
      return (<EntityType
        key={entityType.key}
        name={entityType.name}
        namespace={entityType.namespace}
        properties={entityType.properties}
        primaryKey={entityType.primaryKey}
        updateFn={this.updateFn}
        allPropNamespaces={this.state.allPropNamespaces}
      />);
    });
    return (
      <div>
        <div className={styles.edmContainer}>
          <button
            onClick={this.newEntityType}
            className={this.showNewEntityTypeButton[!this.state.newEntityType]}
          >Create a new entity type
          </button>
          <div className={this.showNewEntityType[this.state.newEntityType]}>
            <div>Entity Type Namespace:</div>
            <div className={styles.spacerMini} />
            <input
              value={this.state.newEntityTypeNamespace}
              onChange={this.handleNamespaceChange}
              className={styles.inputBox}
              type="text"
              placeholder="namespace"
            />
            <div className={styles.spacerSmall} />
            <div>Entity Type Name:</div>
            <div className={styles.spacerMini} />
            <input
              value={this.state.newEntityTypeName}
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
                  namespaces={this.state.allPropNamespaces}
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
          <div className={this.errorClass[this.state.createTypeError]}>Unable to create entity type.</div>
        </div>
        <div className={this.errorClass[this.state.loadTypesError]}>Unable to load entity types.</div>
        {entityTypeList}
      </div>
    );
  }
}

export default EntityTypeList;
