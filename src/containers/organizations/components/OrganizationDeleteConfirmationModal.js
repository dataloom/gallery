import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

const OrganizationDeleteConfirmationModal = ({
  isConfirmingDeletion,
  handleCancelDelete,
  handleConfirmDelete
}) => (
  <Modal show={isConfirmingDeletion} onHide={handleCancelDelete}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm Organization Deletion</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Are you sure you want to delete this organization?
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={handleCancelDelete}>Cancel</Button>
      <Button onClick={handleConfirmDelete} bsStyle="primary">Delete Organization</Button>
    </Modal.Footer>
  </Modal>
);

OrganizationDeleteConfirmationModal.propTypes = {
  isConfirmingDeletion: PropTypes.bool.isRequired,
  handleCancelDelete: PropTypes.func.isRequired,
  handleConfirmDelete: PropTypes.func.isRequired
}

export default OrganizationDeleteConfirmationModal;
