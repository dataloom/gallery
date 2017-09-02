import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import Immutable from 'immutable';

import styles from '../styles.module.css';

const getOptions = (data) => {
  if (data.size === 0) return [];
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
  arrowDirections,
  removeRow,
  showDelete
}) => {

  const associationOptions = getOptions(associations);
  const entityTypeOptions = getOptions(entityTypes);
  const arrowOptions = [];
  if (arrowDirections.includes(true)) {
    arrowOptions.push({ value: true, label: <FontAwesome className={styles.arrowIcon} name="arrow-right" /> });
  }
  if (arrowDirections.includes(false)) {
    arrowOptions.push({ value: false, label: <FontAwesome className={styles.arrowIcon} name="arrow-left" /> });
  }

  let deleteButton;
  if (showDelete) {
    deleteButton = (
      <button
          type="button"
          className={styles.hiddenButton}
          onClick={removeRow}>
        <FontAwesome name="times" size="2x" />
      </button>
    );
  }

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
      <div className={styles.deleteButtonContainer}>{deleteButton}</div>

    </div>
  );
};

TopUtilizersSelectionRow.propTypes = {
  selectAssociation: PropTypes.func.isRequired,
  selectArrow: PropTypes.func.isRequired,
  selectEntity: PropTypes.func.isRequired,
  associations: PropTypes.array.isRequired,
  entityTypes: PropTypes.array.isRequired,
  selectedAssociation: PropTypes.object,
  selectedArrow: PropTypes.object,
  selectedEntities: PropTypes.array,
  arrowDirections: PropTypes.array.isRequired,
  removeRow: PropTypes.func.isRequired,
  showDelete: PropTypes.bool.isRequired
};

export default TopUtilizersSelectionRow;
