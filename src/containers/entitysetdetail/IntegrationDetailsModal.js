import React, { PropTypes } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import styles from './entitysetdetail.module.css';

const IntegrationDetailsModal = ({ isOpen, onClose, entitySet }) => {
  const getKeyListItems = (keys) => {
    return keys.map((key) => (
      <li><b>Key: </b>{key}</li>
    ));
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
            {getKeyListItems(entitySet.entityType.key)}
          </ul>
        </div>
      );
    }
  };

  const getPropertyDetails = () => {
    return (
      <div>
        <h5>Property Details</h5>
        <ul className={styles.list}>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </div>
    );
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
