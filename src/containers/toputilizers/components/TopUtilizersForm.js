import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';

import Page from '../../../components/page/Page.js';
import ContentContainer from '../../../components/applayout/ContentContainer';
import ContentSection from '../../../components/applayout/ContentSection';
import TopUtilizersSelectionRowContainer from '../containers/TopUtilizersSelectionRowContainer';
import styles from '../styles.module.css';

const renderAddNew = (associations) => {
  return (
    <ContentSection>Add search parameter</ContentSection>
  );
};

const TopUtilizersForm = ({ isReadyForNext }) => {

  return (
    <ContentContainer>
      <TopUtilizersSelectionRowContainer />
      {isReadyForNext ? renderAddNew() : null}
    </ContentContainer>
  );
};

TopUtilizersForm.propTypes = {
  associatoins: PropTypes.array.isRequired,
  onAssociationSelect: PropTypes.func.isRequired,
  onArrowSelect: PropTypes.func.isRequired,
  onEntitySelect: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isReadyForNext: PropTypes.bool.isRequired
};

export default TopUtilizersForm;
