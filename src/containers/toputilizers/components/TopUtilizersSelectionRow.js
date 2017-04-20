import React, { PropTypes } from 'react';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';

import styles from '../styles.module.css';

const getOptions = (data) => {
  if (!data) return [];
  return data.map((item) => {
    return { value: item.id, label: item.title };
  });
};

const isDisabled = (selectedAssociation, selectedArrow) => {
  if (!selectedAssociation || !selectedArrow) {
    return true;
  }
  return false;
};

const TopUtilizersSelectionRow = ({
  selectAssociation,
  selectArrow,
  selectEntity,
  associations,
  entityTypes,
  selectedAssociation,
  selectedArrow,
  selectedEntities,
  entityOptions
}) => {

  const associationOptions = getOptions(associations);
  const entityTypeOptions = getOptions(entityTypes);
  const arrowOptions = [
    { value: true, label: <FontAwesome className={styles.arrowIcon} name="arrow-right" />},
    { value: false, label: <FontAwesome className={styles.arrowIcon} name="arrow-left" />}
  ];

  return (
    <div className={styles.rowWrapper}>
      <Select
          className={styles.associationSelect}
          options={associationOptions}
          value={selectedAssociation}
          onChange={selectAssociation}
          placeholder="Association"
          clearable={false} />
      <Select
          className={styles.arrowSelect}
          options={arrowOptions}
          value={selectedArrow}
          onChange={selectArrow}
          placeholder="Ownership"
          clearable={false} />
      <Select
          className={styles.entitySelect}
          options={entityTypeOptions}
          value={selectedEntities}
          onChange={selectEntity}
          placeholder="Entities"
          disabled={isDisabled(selectedAssociation, selectedArrow)}
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
