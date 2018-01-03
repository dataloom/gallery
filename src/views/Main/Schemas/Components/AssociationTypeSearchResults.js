import React, { PropTypes } from 'react';
import Promise from 'bluebird';
import { EntityDataModelApi } from 'lattice';
import { AssociationType } from './AssociationType';
import styles from '../styles.module.css';

export default class AssociationTypeSearchResults extends React.Component {

  static propTypes = {
    results: PropTypes.array,
    onUpdate: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      loadTypesError: false,
      idToPropertyTypes: {},
      idToEntityTypes: {}
    };
  }

  componentDidMount() {
    this.loadEntityTypesAndPropertyTypesForAssociationTypes();
  }

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  loadEntityTypesAndPropertyTypesForAssociationTypes = () => {

    const propertyTypeIds = new Set();
    const entityTypeIds = new Set();

    this.props.results.forEach((associationType) => {
      associationType.entityType.properties.forEach((propertyTypeId) => {
        propertyTypeIds.add(propertyTypeId);
      });
      associationType.src.forEach((srcId) => {
        entityTypeIds.add(srcId);
      });
      associationType.dst.forEach((dstId) => {
        entityTypeIds.add(dstId);
      });
    });

    Promise
      .map(propertyTypeIds, (propertyTypeId) => {
        return EntityDataModelApi.getPropertyType(propertyTypeId);
      })
      .then((propertyTypes) => {
        const idToPropertyTypes = {};
        propertyTypes.forEach((propertyType) => {
          if (propertyType) {
            idToPropertyTypes[propertyType.id] = propertyType;
          }
        });
        Promise.map(entityTypeIds, (entityTypeId) => {
          return EntityDataModelApi.getEntityType(entityTypeId);
        })
        .then((entityTypes) => {
          const idToEntityTypes = {};
          entityTypes.forEach((entityType) => {
            if (entityType) {
              idToEntityTypes[entityType.id] = entityType;
            }
          });
          this.setState({ idToPropertyTypes, idToEntityTypes });
        });
      })
      .catch((e) => {
        // TODO - handle error
        console.error(e);
      });
  }

  render() {

    const idToPropertyTypes = this.state.idToPropertyTypes;
    const idToEntityTypes = this.state.idToEntityTypes;

    if (Object.keys(idToPropertyTypes).length <= 0) {
      return null;
    }

    const associationTypeList = this.props.results.map((associationType) => {
      return (<AssociationType
          key={associationType.entityType.id}
          associationType={associationType}
          updateFn={this.props.onUpdate}
          idToPropertyTypes={idToPropertyTypes}
          idToEntityTypes={idToEntityTypes} />);
    });

    return (
      <div>
        {associationTypeList}
      </div>
    );
  }
}
