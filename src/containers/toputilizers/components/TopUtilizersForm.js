import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';

import ContentContainer from '../../../components/applayout/ContentContainer';
import TopUtilizersSelectionRowContainer from '../containers/TopUtilizersSelectionRowContainer';
import styles from '../styles.module.css';

const getChildren = (rowData) => {
  return rowData.map((row) => {
    return <TopUtilizersSelectionRowContainer id={row.id} />;
  });
};

const TopUtilizersForm = ({ handleClick, rowData, onSubmit, entitySetId }) => {

  return (
    <ContentContainer>
      <form className={styles.formWrapper} onSubmit={onSubmit}>
        <div className={styles.labelsRow}>
          <span className={styles.associationLabel}>Association</span>
          <span className={styles.directionLabel}>Direction</span>
          <span className={styles.entitiesLabel}>Entities</span>
        </div>
        <div className={styles.rowsWrapper}>
          {getChildren(rowData)}
        </div>
        <div className={styles.addLink}>
          <a href="#" className={styles.addLink} onClick={handleClick}>
            <FontAwesome className={styles.plusIcon} name="plus" size="2x" />Add search parameter
          </a>
        </div>
        <Button type="submit" className={styles.submitButton}>Find top utilizers</Button>
      </form>
    </ContentContainer>
  );
};

TopUtilizersForm.propTypes = {
  handleClick: PropTypes.func.isRequired,
  rowData: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default TopUtilizersForm;
