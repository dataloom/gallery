import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';

import Page from '../../../components/page/Page.js';
import ContentContainer from '../../../components/applayout/ContentContainer';
import ContentSection from '../../../components/applayout/ContentSection';
import TopUtilizersSelectionRowContainer from '../containers/TopUtilizersSelectionRowContainer';
import styles from '../styles.module.css';

const getChildren = (rowData) => {
  console.log('rowData:', rowData);
  return rowData.map((row) => {
    return <TopUtilizersSelectionRowContainer id={row.id} />
  });
};

const TopUtilizersForm = ({ handleClick, rowData }) => {

  return (
    <ContentContainer>
      <div className={styles.formWrapper}>
        {getChildren(rowData)}
      </div>
      <ContentSection><a href="#" onClick={handleClick}>Add search parameter</a></ContentSection>
    </ContentContainer>
  );
};

TopUtilizersForm.propTypes = {
  associations: PropTypes.array.isRequired,
  onAssociationSelect: PropTypes.func.isRequired,
  onArrowSelect: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isReadyForNext: PropTypes.bool.isRequired
};

export default TopUtilizersForm;
