import React, { PropTypes } from 'react';
import Select from 'react-select';

import styles from '../styles.module.css';

const getAssociationOptions = (associations) => {
  if (!associations) return [];
  return associations.map((assoc) => {
    return { value: assoc.id, label: assoc.title };
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
    { value: true, label: 'source'},
    { value: false, label: 'dest'}
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
          options={associationOptions}
          value={selectedEntities}
          onChange={selectEntity}
          multi />
    </div>
  );
};

TopUtilizersSelectionRow.propTypes = {
  selectAssociation: PropTypes.func.isRequired,
  selectArrow: PropTypes.func.isRequired,
  selectEntity: PropTypes.func.isRequired,
  associations: PropTypes.object.isRequired,
  selectedAssociation: PropTypes.object,
  selectedArrow: PropTypes.object,
  selectedEntities: PropTypes.array
};

export default TopUtilizersSelectionRow;
