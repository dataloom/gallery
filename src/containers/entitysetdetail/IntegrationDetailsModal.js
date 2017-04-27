import React, { PropTypes } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import styles from './entitysetdetail.module.css';

const IntegrationDetailsModal = ({ isOpen, onClose, entitySet }) => {
  const getKeyListItems = () => {
    const keys = entitySet.entityType.key;
    const properties = entitySet.entityType.properties;

    return keys.map((key) => {
      let name;
      let namespace;
      properties.forEach((property) => {
        if (property.id === key) {
          name = property.type.name;
          namespace = property.type.namespace;
        }
      });
      return (<li key={key}>{namespace}.{name}</li>);
    });
  };

  const getEntityDetails = () => {
    if (entitySet) {
      return (
        <div>
          <h5>Entity Details</h5>
          <ul className={styles.list}>
            <li><b>Entity Set Name: </b>{entitySet.name}</li>
            <li><b>Entity Set Type: </b>{entitySet.entityType.type.namespace}.{entitySet.entityType.type.name}</li>
            <li><b>Primary Key(s): </b>
              <ul>
              {getKeyListItems()}
              </ul>
            </li>
          </ul>
        </div>
      );
    }
  };

  const getPropertyListItems = () => {
    const { properties } = entitySet.entityType;
    return properties.map((property) => (
      <li key={property.id}><b>{property.title}: </b>{property.type.namespace}.{property.type.name}</li>
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
  entitySet: PropTypes.object
};

export default IntegrationDetailsModal;
