import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import ContentContainer from '../../../components/applayout/ContentContainer';
import TopUtilizersSelectionRowContainer from '../containers/TopUtilizersSelectionRowContainer';
import styles from '../styles.module.css';

const TopUtilizersForm = ({ onSubmit, entitySet }) => {
  const entitySetTitle = entitySet.title || '';

  return (
    <ContentContainer>
      <form className={styles.formWrapper} onSubmit={onSubmit}>
        <div className={styles.labelsRow}>
          Select search parameters
        </div>
        <div className={styles.rowsWrapper}>
          <TopUtilizersSelectionRowContainer entitySetTitle={entitySetTitle} />
        </div>
        <div className={styles.buttonWrapper}>
          <Button type="submit" className={styles.submitButton}>Find top utilizers</Button>
        </div>
      </form>
    </ContentContainer>
  );
};

TopUtilizersForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  entitySet: PropTypes.object.isRequired
};

export default TopUtilizersForm;
