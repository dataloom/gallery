import React, { PropTypes } from 'react';
import CatalogApi from '../../../../utils/CatalogApi';
import Utils from '../../../../utils/Utils';
import { EntityType } from './EntityType';

export class EntityTypeList extends React.Component {
  static propTypes = {
    schemas: PropTypes.array
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      entityTypes: []
    };
  }

  componentDidMount() {
    CatalogApi.getCatalogEntityTypeData()
      .then((entityTypes) => {
        this.setState({ entityTypes: Utils.addKeysToArray(entityTypes) });
      });
  }

  render() {
    const entityTypeList = this.state.entityTypes.map(entityType =>
      <EntityType
        key={entityType.key}
        name={entityType.name}
        namespace={entityType.namespace}
        properties={entityType.properties}
        primaryKey={entityType.primaryKey}
      />
    );
    return (<div>{entityTypeList}</div>);
  }
}

export default EntityTypeList;
