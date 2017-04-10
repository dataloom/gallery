import React, { PropTypes } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import styles from './entitysetdetail.module.css';

const IntegrationDetailsModal = ({ isOpen, onClose, entitySet }) => {
  const getKeyListItems = () => {
    const keys = entitySet.entityType.key;
    const properties = entitySet.entityType.properties;
    const namespace = entitySet.entityType.type.namespace;
    let title;

    return keys.map((key) => {
      properties.forEach((property) => {
        if (property.id === key) {
          title = property.title;
        }
      });
      return (<li><b>Key: </b>{namespace}.{title}</li>);
    });
  };

  const getEntityDetails = () => {
    console.log('entitySet:', entitySet);
    if (entitySet) {
      return (
        <div>
          <h5>Entity Details</h5>
          <ul className={styles.list}>
            <li><b>Entity Set Name: </b>{entitySet.name}</li>
            <li><b>Entity Set Type: </b>{entitySet.entityType.type.name}</li>
            {getKeyListItems()}
          </ul>
        </div>
      );
    }
  };

  const getPropertyListItems = () => {
    const { properties } = entitySet.entityType;
    console.log('properties:', properties);
    return properties.map((property) => (
      <li><b>namespace.propertyName: </b>{property.type.namespace}.{property.type.name}</li>
    ));
  };

  const getPropertyDetails = () => {
    if (entitySet) {
      return (
        <div>
          <h5>Property Details</h5>
          <ul className={styles.list}>
            {getPropertyListItems()}
          </ul>
        </div>
      );
    }
  };

  return (
    <Modal
        show={isOpen}
        onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Integration Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {getEntityDetails()}
        {getPropertyDetails()}
      </Modal.Body>
    </Modal>
  );
};

IntegrationDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  entitySet: PropTypes.object.isRequired
};

export default IntegrationDetailsModal;
