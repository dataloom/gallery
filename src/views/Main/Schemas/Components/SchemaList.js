import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { Promise } from 'bluebird';
import { Schema } from './Schema';
import { NewEdmObjectInput } from '../../../../components/edminput/NewEdmObjectInput';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import styles from '../styles.module.css';

export class SchemaList extends React.Component {

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      schemas: [],
      loadSchemasError: false,
      allPropNamespaces: {},
      allEntityTypeNamespaces: {},
      propFqnsToId: {},
      entityTypeFqnsToId: {}
    };
  }

  componentDidMount() {
    this.updateFn();
  }

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  newSchemaSuccess = () => {
    EntityDataModelApi.getAllSchemas()
    .then((schemas) => {
      this.setState({
        schemas,
        loadSchemasError: false
      });
    }).catch(() => {
      this.setState({ loadSchemasError: true });
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
        const propFqnsToId = {};
        const entityTypeFqnsToId = {};
        if (propertyTypes.length > 0) {
          propertyTypes.forEach((prop) => {
            propFqnsToId[`${prop.type.namespace}.${prop.type.name}`] = prop.id;
            if (allPropNamespaces[prop.type.namespace] === undefined) {
              allPropNamespaces[prop.type.namespace] = [prop.type.name];
            }
            else {
              allPropNamespaces[prop.type.namespace].push(prop.type.name);
            }
          });
        }
        if (entityTypes.length > 0) {
          entityTypes.forEach((entityType) => {
            entityTypeFqnsToId[`${entityType.type.namespace}.${entityType.type.name}`] = entityType.id;
            if (allEntityTypeNamespaces[entityType.type.namespace] === undefined) {
              allEntityTypeNamespaces[entityType.type.namespace] = [entityType.type.name];
            }
            else {
              allEntityTypeNamespaces[entityType.type.namespace].push(entityType.type.name);
            }
          });
        }

        this.setState({
          schemas,
          allPropNamespaces,
          allEntityTypeNamespaces,
          propFqnsToId,
          entityTypeFqnsToId,
          loadSchemasError: false
        });
      }).catch(() => {
        this.setState({ loadSchemasError: true });
      });
  }

  renderCreateNewSchema = () => {
    if (!this.context.isAdmin) return null;
    return <NewEdmObjectInput createSuccess={this.newSchemaSuccess} edmType={EdmConsts.SCHEMA_TITLE} />;
  }

  render() {
    const {
      schemas,
      allPropNamespaces,
      allEntityTypeNamespaces,
      loadSchemasError,
      propFqnsToId,
      entityTypeFqnsToId
    } = this.state;
    const schemaList = schemas.map((schema) => {
      return (<Schema
        key={`${schema.fqn.namespace}.${schema.fqn.name}`}
        name={schema.fqn.name}
        namespace={schema.fqn.namespace}
        propertyTypes={schema.propertyTypes}
        entityTypeFqns={schema.entityTypes}
        jsonContents={schema}
        updateFn={this.updateFn}
        allPropNamespaces={allPropNamespaces}
        allEntityTypeNamespaces={allEntityTypeNamespaces}
        propFqnsToId={propFqnsToId}
        entityTypeFqnsToId={entityTypeFqnsToId}
      />);
    });
    return (
      <div>
        <div className={styles.edmContainer}>
          {this.renderCreateNewSchema()}
        </div>
        <div className={this.errorClass[loadSchemasError]}>Unable to load schemas.</div>
        {schemaList}
      </div>
    );
  }
}

export default SchemaList;
