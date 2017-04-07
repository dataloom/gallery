import React, { PropTypes } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import styles from './entitysetdetail.module.css';

const IntegrationDetailsModal = ({isOpen, onClose}) => {
  return (
    <Modal
        show={isOpen}
        onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Integration Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Tada!
      </Modal.Body>
    </Modal>
  );
};

IntegrationDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default IntegrationDetailsModal;
