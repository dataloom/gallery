import React, { PropTypes } from 'react';
import { Button, Modal } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { EntityDataModelApi } from 'lattice';
import { Schema } from './Schema';
import { NewEdmObjectInput } from './NewEdmObjectInput';
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
      isModalOpen: false,
      associationTypes: []
    };
  }

  componentDidMount() {
    this.updateFn();
    EntityDataModelApi.getAllAssociationEntityTypes().then((associationTypesFull) => {
      const associationTypes = associationTypesFull.map((associationType) => {
        return associationType.entityType;
      });
      this.setState({ associationTypes });
    });
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
        loadSchemasError: false,
        isModalOpen: false
      });
    }).catch(() => {
      this.setState({ loadSchemasError: true });
    });
  }

  onCreateSchema = () => {
    this.setState({ isModalOpen: true });
  }

  closeModal = () => {
    this.setState({ isModalOpen: false });
  }

  updateFn = () => {
    EntityDataModelApi.getAllSchemas()
    .then((schemas) => {
      this.setState({ schemas });
    }).catch(() => {
      this.setState({ loadSchemasError: true });
    });
  }

  renderCreateSchemaModal = () => {
    return (
      <Modal show={this.state.isModalOpen} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create a schema</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewEdmObjectInput
              createSuccess={this.newSchemaSuccess}
              edmType={EdmConsts.SCHEMA_TITLE} />
        </Modal.Body>
      </Modal>
    );
  }

  renderCreateSchemaButton = () => {
    return (
      <div className={styles.createEdmObjectButtonWrapper}>
        <Button bsStyle="primary" className={styles.control} onClick={this.onCreateSchema}>
          <FontAwesome name="plus-circle" size="lg" /> Schema
        </Button>
      </div>
    );
  }

  render() {
    const { schemas, loadSchemasError, associationTypes } = this.state;

    const schemaList = schemas.map((schema) => {
      return (<Schema
          key={`${schema.fqn.namespace}.${schema.fqn.name}`}
          schema={schema}
          updateFn={this.updateFn}
          associationTypes={associationTypes} />);
    });
    return (
      <div>
        {this.renderCreateSchemaButton()}
        {this.renderCreateSchemaModal()}
        <div className={this.errorClass[loadSchemasError]}>Unable to load schemas.</div>
        {schemaList}
      </div>
    );
  }
}

export default SchemaList;
