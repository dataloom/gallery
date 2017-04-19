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
    <div className={styles.pageWrapper}>
      <ContentContainer>
        <form className={styles.formWrapper} onSubmit={onSubmit}>
          <div className={styles.labelsRow}>
            Select search parameters
          </div>
          <div className={styles.rowsWrapper}>
            {getChildren(rowData)}
          </div>
          <div className={styles.addLink}>
            <a href="#" className={styles.addLink} onClick={handleClick}>
              <FontAwesome className={styles.plusIcon} name="plus" />Add search parameter
            </a>
          </div>
        </form>
      </ContentContainer>
      <div className={styles.buttonWrapper}>
        <Button type="submit" className={styles.submitButton}>Find top utilizers</Button>
      </div>
    </div>
  );
};

TopUtilizersForm.propTypes = {
  handleClick: PropTypes.func.isRequired,
  rowData: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default TopUtilizersForm;
