import React, { PropTypes } from 'react';
import { Collapse } from 'react-bootstrap';
import styles from './entitysetdetail.module.css';

const IntegrationDetails = ({handleIntegrationClick}) => {
  return (
    <Collapse onClick={handleIntegrationClick} in={isIntegrationDetailsOpen}>
      <div>
        DETAILS!
      </div>
    </Collapse>
  )
};

IntegrationDetails.propTypes = {
  handleIntegrationClick: PropTypes.func.isRequired,
  isIntegrationDetailsOpen: PropTypes.bool.isRequired
};

export default IntegrationDetails;
