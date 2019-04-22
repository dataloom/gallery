import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal, Button } from 'react-bootstrap';

import StyledInput from '../../../components/controls/StyledInput';

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;

  div {
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: 600;
  }

  span {
    font-size: 14px;
    margin-bottom: 10px;
  }
`;

const CONFIRMATION_TEXT_TARGET = 'delete';

export default class OrganizationDeleteConfirmationModal extends React.Component {

  static propTypes = {
    isConfirmingDeletion: PropTypes.bool.isRequired,
    handleCancelDelete: PropTypes.func.isRequired,
    handleConfirmDelete: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      confirmationText: ''
    };
  }

  render() {
    const {
      isConfirmingDeletion,
      handleCancelDelete,
      handleConfirmDelete
    } = this.props;

    const { confirmationText } = this.state;

    return (
      <Modal show={isConfirmingDeletion} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Organization Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BodyWrapper>
            <div>Are you sure you want to delete this organization?</div>
            <span>To confirm, type the confirmation text into the box below and then click the Delete Organization button.</span>
            <span>Confirmation text: <b>{`${CONFIRMATION_TEXT_TARGET}`}</b></span>
            <StyledInput
                placeholder={CONFIRMATION_TEXT_TARGET}
                value={confirmationText}
                onChange={({ target }) => this.setState({ confirmationText: target.value })} />
          </BodyWrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
              disabled={confirmationText !== CONFIRMATION_TEXT_TARGET}
              onClick={handleConfirmDelete}
              bsStyle="primary">
            Delete Organization
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
