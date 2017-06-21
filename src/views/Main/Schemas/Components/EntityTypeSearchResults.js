import React, { PropTypes } from 'react';
import Promise from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import { EntityType } from './EntityType';
import styles from '../styles.module.css';

export default class EntityTypeSearchResults extends React.Component {

  static propTypes = {
    results: PropTypes.array,
    onUpdate: PropTypes.func
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      loadTypesError: false,
      idToPropertyTypes: {}
    };
  }

  componentDidMount() {
    this.loadPropertyTypesForEntityTypes();
  }

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  loadPropertyTypesForEntityTypes = () => {

    const propertyTypeIds = new Set();

    this.props.results.forEach((entityType) => {
      entityType.properties.forEach((propertyTypeId) => {
        propertyTypeIds.add(propertyTypeId);
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
        this.setState({ idToPropertyTypes });
      })
      .catch((e) => {
        // TODO - handle error
        console.error(e);
      });
  }

  render() {

    const idToPropertyTypes = this.state.idToPropertyTypes;

    if (Object.keys(idToPropertyTypes).length <= 0) {
      return null;
    }

    const entityTypeList = this.props.results.map((entityType) => {
      return (<EntityType
          key={entityType.id}
          entityType={entityType}
          updateFn={this.props.onUpdate}
          idToPropertyTypes={idToPropertyTypes} />);
    });

    return (
      <div>
        {entityTypeList}
      </div>
    );
  }
}
