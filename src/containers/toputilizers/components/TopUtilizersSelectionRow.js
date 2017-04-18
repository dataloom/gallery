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

const getEntityOptions = (selectedAssociation, selectedArrow) => {
  if (!selectedAssociation) return [];
  if (selectedArrow === 'source') {
    return selectedAssociation.get('sourceVals').map((entity) => {
      return { value: entity.get('id'), label: entity.get('title') };
    });
  }
  else if (selectedArrow === 'dest') {
    return selectedAssociation.get('destVals').map((entity) => {
      return { value: entity.get('id'), label: entity.get('title') };
    });
  }

  // TODO: handle case for bi-directional arrows
};

const TopUtilizersSelectionRow = ({
  selectAssociation,
  selectArrow,
  selectEntity,
  associations,
  selectedAssociation,
  selectedArrow,
  selectedEntities
}) => {

  const associationOptions = getAssociationOptions(associations).toJS();
  const arrowOptions = [
    { value: 'source', label: 'source'},
    { value: 'dest', label: 'dest'}
  ];
  const entityOptions = getEntityOptions(selectedAssociation, selectedArrow);

  return (
    <ContentSection>
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
    </ContentSection>
  );
};

TopUtilizersSelectionRow.propTypes = {
  selectAssociation: PropTypes.func.isRequired,
  selectArrow: PropTypes.func.isRequired,
  selectEntity: PropTypes.func.isRequired
}

export default TopUtilizersSelectionRow;

//
// <Select
//     className={styles.propertyTypeSelect}
//     options={this.getPropertyTypeOptions()}
//     value={this.state.editingPropertyType}
//     onChange={this.onPropertyTypeLinkChange} />
// </td>
// <td>
// <Select
//     className={styles.entitySetsSelect}
//     options={this.getEntitySetsOptions()}
//     value={this.state.editingEntitySets}
//     onChange={this.onEntitySetsLinkChange}
//     multi />
//
//     <Select
//         options={addPropOptions}
//         value={this.state.addPropValue}
//         onChange={this.addPropertyType} />
