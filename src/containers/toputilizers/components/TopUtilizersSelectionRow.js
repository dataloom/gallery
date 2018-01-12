import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import Immutable from 'immutable';

import styles from '../styles.module.css';

const getEdgeValue = (associationTypeId, neighborTypeId, src) => {
  return (src ? [associationTypeId, neighborTypeId] : [associationTypeId, neighborTypeId]).join('|');
};

const getNeighborTypeOptions = (neighborTypes) => {
  return neighborTypes.map((neighborType) => {
    const assocId = neighborType.getIn(['associationEntityType', 'id']);
    const assocTitle = neighborType.getIn(['associationEntityType', 'title']);
    const neighborId = neighborType.getIn(['neighborEntityType', 'id']);
    const neighborTitle = neighborType.getIn(['neighborEntityType', 'title']);
    const src = neighborType.get('src');

    const label = (src ? [assocTitle, neighborTitle] : [neighborTitle, assocTitle]).join(' ');
    return {
      value: getEdgeValue(assocId, neighborId, src),
      label,
      assocId,
      assocTitle,
      neighborId,
      neighborTitle,
      src
    };
  }).toJS();
};

const TopUtilizersSelectionRow = ({
  entitySetTitle,
  neighborTypes,
  updateEdgeTypes,
  selectedEdges
}) => {

  const neighborTypeOptions = getNeighborTypeOptions(neighborTypes);

  const selectedEdgeValues = selectedEdges.map((edge) => {
    const assocId = edge.get('associationTypeId', '');
    const neighborId = edge.get('neighborTypeIds', Immutable.List()).get(0);
    const src = edge.get('utilizerIsSrc');
    return getEdgeValue(assocId, neighborId, src);
  }).toJS();

  const optionRenderer = (option) => {
    const entitySet = <span className={styles.entitySetOptionWrapper}>{entitySetTitle}</span>;
    const neighbor = <span className={styles.optionType}>{option.neighborTitle}</span>;
    return (
      <span>
        { option.src ? entitySet : neighbor }
        <FontAwesome name="arrow-right" />
        <span className={styles.optionType}>{option.assocTitle}</span>
        <FontAwesome name="arrow-right" />
        { option.src ? neighbor : entitySet }
      </span>
    );
  };

  return (
    <div className={styles.rowWrapper}>
      <Select
          className={styles.neighborTypeSelect}
          options={neighborTypeOptions}
          optionRenderer={optionRenderer}
          value={selectedEdgeValues}
          onChange={updateEdgeTypes}
          closeOnSelect={false}
          placeholder="Neighbors"
          clearable={false}
          multi />
    </div>
  );
};

TopUtilizersSelectionRow.propTypes = {
  entitySetTitle: PropTypes.string.isRequired,
  neighborTypes: PropTypes.instanceOf(Immutable.List).isRequired,
  updateEdgeTypes: PropTypes.func.isRequired,
  selectedEdges: PropTypes.instanceOf(Immutable.List).isRequired
};

export default TopUtilizersSelectionRow;
