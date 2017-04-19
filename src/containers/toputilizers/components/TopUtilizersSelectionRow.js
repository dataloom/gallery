import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import Select from 'react-select';

import Page from '../../../components/page/Page.js';
import ContentSection from '../../../components/applayout/ContentSection';
import styles from '../styles.module.css';

const getAssociationOptions = (associations) => {
  if (!associations) return [];
  return associations.map((assoc) => {
    return { value: assoc.get('id'), label: assoc.get('title') };
  });
};

const TopUtilizersSelectionRow = ({
  selectAssociation,
  selectArrow,
  selectEntity,
  associations,
  selectedAssociation,
  selectedArrow,
  selectedEntities,
  entityOptions
}) => {

  const associationOptions = getAssociationOptions(associations).toJS();
  const arrowOptions = [
    { value: 'source', label: 'source'},
    { value: 'dest', label: 'dest'}
  ];

  return (
    <div className={styles.rowWrapper}>
      <Select
          className={styles.associationSelect}
          options={associationOptions}
          value={selectedAssociation}
          onChange={selectAssociation} />
      <Select
          className={styles.arrowSelect}
          options={arrowOptions}
          value={selectedArrow}
          onChange={selectArrow} />
      <Select
          className={styles.entitySelect}
          options={entityOptions}
          value={selectedEntities}
          onChange={selectEntity}
          multi />
    </div>
  );
};

TopUtilizersSelectionRow.propTypes = {
  selectAssociation: PropTypes.func.isRequired,
  selectArrow: PropTypes.func.isRequired,
  selectEntity: PropTypes.func.isRequired
};

export default TopUtilizersSelectionRow;
