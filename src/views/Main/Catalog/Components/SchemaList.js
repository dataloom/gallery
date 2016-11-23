import React from 'react';
import { EntityDataModelApi } from 'loom-data';
import { Promise } from 'bluebird';
import Utils from '../../../../utils/Utils';
import { Schema } from './Schema';
import StringConsts from '../../../../utils/Consts/StringConsts';
import styles from '../styles.module.css';

export class SchemaList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      schemas: [],
      newSchema: false,
      createSchemaError: false,
      loadSchemasError: false,
      allPropNamespaces: {},
      allEntityTypeNamespaces: {},
      newSchemaName: '',
      newSchemaNamespace: ''
    };
  }

  componentDidMount() {
    this.updateFn();
  }

  showNewSchema = {
    true: StringConsts.EMPTY,
    false: styles.hidden
  }

  showNewSchemaButton = {
    true: styles.genericButton,
    false: styles.hidden
  }

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  newSchema = () => {
    this.setState({ newSchema: true });
  }

  newSchemaSuccess = () => {
    EntityDataModelApi.getAllSchemas()
    .then((schemas) => {
      this.setState({
        schemas: Utils.addKeysToArray(schemas),
        newSchema: false,
        newSchemaName: '',
        newSchemaNamespace: '',
        loadSchemasError: false
      });
    }).catch(() => {
      this.setState({ loadSchemasError: true });
    });
  }

  createNewSchema = () => {
    const name = this.state.newSchemaName;
    const namespace = this.state.newSchemaNamespace;
    EntityDataModelApi.createSchema({ namespace, name })
    .then(() => {
      this.newSchemaSuccess();
    }).catch(() => {
      this.setState({ createSchemaError: true });
    });
  }

  updateFn = () => {
    Promise.join(
      EntityDataModelApi.getAllSchemas(),
      EntityDataModelApi.getAllPropertyTypes(),
      EntityDataModelApi.getAllEntityTypes(),
      (schemas, propertyTypes, entityTypes) => {
        const allPropNamespaces = {};
        const allEntityTypeNamespaces = {};
        propertyTypes.forEach((prop) => {
          if (allPropNamespaces[prop.namespace] === undefined) {
            allPropNamespaces[prop.namespace] = [prop.name];
          }
          else {
            allPropNamespaces[prop.namespace].push(prop.name);
          }
        });
        entityTypes.forEach((entityType) => {
          if (allEntityTypeNamespaces[entityType.namespace] === undefined) {
            allEntityTypeNamespaces[entityType.namespace] = [entityType.name];
          }
          else {
            allEntityTypeNamespaces[entityType.namespace].push(entityType.name);
          }
        });

        this.setState({
          schemas: Utils.addKeysToArray(schemas),
          allPropNamespaces,
          allEntityTypeNamespaces,
          loadSchemasError: false
        });
      }).catch(() => {
        this.setState({ loadSchemasError: true });
      });
  }

  handleNameChange = (e) => {
    this.setState({ newSchemaName: e.target.value });
  }

  handleNamespaceChange = (e) => {
    this.setState({ newSchemaNamespace: e.target.value });
  }

  render() {
    const {
      schemas,
      allPropNamespaces,
      allEntityTypeNamespaces,
      newSchema,
      newSchemaNamespace,
      newSchemaName,
      createSchemaError,
      loadSchemasError
    } = this.state;
    const schemaList = schemas.map((schema) => {
      return (<Schema
        key={schema.key}
        name={schema.name}
        namespace={schema.namespace}
        propertyTypes={schema.propertyTypes}
        entityTypeFqns={schema.entityTypeFqns}
        jsonContents={schema}
        updateFn={this.updateFn}
        allPropNamespaces={allPropNamespaces}
        allEntityTypeNamespaces={allEntityTypeNamespaces}
      />);
    });
    return (
      <div>
        <div className={styles.edmContainer}>
          <button
            onClick={this.newSchema}
            className={this.showNewSchemaButton[!newSchema]}
          >Create a new schema
          </button>
          <div className={this.showNewSchema[newSchema]}>
            <div>Schema Namespace:</div>
            <div className={styles.spacerMini} />
            <input
              className={styles.inputBox}
              type="text"
              placeholder="namespace"
              value={newSchemaNamespace}
              onChange={this.handleNamespaceChange}
            />
            <div className={styles.spacerSmall} />
            <div>Schema Name:</div>
            <div className={styles.spacerMini} />
            <input
              className={styles.inputBox}
              type="text"
              placeholder="name"
              value={newSchemaName}
              onChange={this.handleNameChange}
            />
            <div className={styles.spacerSmall} />
            <button className={styles.genericButton} onClick={this.createNewSchema}>Create</button>
          </div>

          <div className={this.errorClass[createSchemaError]}>Unable to create schema.</div>
        </div>
        <div className={this.errorClass[loadSchemasError]}>Unable to load schemas.</div>
        {schemaList}
      </div>
    );
  }
}

export default SchemaList;
