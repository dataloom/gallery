import React, { PropTypes } from 'react';
import { Collapse, Button } from 'react-bootstrap';
import styles from './entitysetdetail.module.css';

const IntegrationDetails = ({isOpen, handleClick}) => {
  return (
    <div className={styles.integrationDetailsWrapper}>
      <div className={styles.integrationDetailsHeader}>
        Integration Details
      </div>
      <Button block onClick={handleClick}>Integration Details</Button>
      <Collapse onClick={handleClick} in={isOpen}>
        <div>
          DETAILS!
        </div>
      </Collapse>
    </div>
  )
};

IntegrationDetails.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default IntegrationDetails;
