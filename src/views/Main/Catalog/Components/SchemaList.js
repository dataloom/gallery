import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { Promise } from 'bluebird';
import Utils from '../../../../utils/Utils';
import { Schema } from './Schema';
import StringConsts from '../../../../utils/Consts/StringConsts';
import styles from '../styles.module.css';

export class SchemaList extends React.Component {

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

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

  renderCreateNewSchemaButton = () => {
    if (!this.context.isAdmin) return null;
    const className = (this.state.newSchema) ? styles.hidden : styles.genericButton;
    return (
      <button
        onClick={this.newSchema}
        className={className}
      >Create a new schema
      </button>
    );
  }

  renderCreateNewSchemaInput = () => {
    if (!this.context.isAdmin) return null;
    const { newSchema, newSchemaNamespace, newSchemaName, createSchemaError } = this.state;
    const className = (newSchema) ? StringConsts.EMPTY : styles.hidden;
    return (
      <div className={className}>
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
        <div className={this.errorClass[createSchemaError]}>Unable to create schema.</div>
      </div>
    );
  }

  render() {
    const { schemas, allPropNamespaces, allEntityTypeNamespaces, loadSchemasError } = this.state;
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
          {this.renderCreateNewSchemaButton()}
          {this.renderCreateNewSchemaInput()}
        </div>
        <div className={this.errorClass[loadSchemasError]}>Unable to load schemas.</div>
        {schemaList}
      </div>
    );
  }
}

export default SchemaList;
