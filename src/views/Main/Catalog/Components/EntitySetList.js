import React, { PropTypes } from 'react';
import CatalogApi from '../../../../utils/CatalogApi';
import Utils from '../../../../utils/Utils';
import { EntitySet } from './EntitySet';

export class EntitySetList extends React.Component {
  static propTypes = {
    entitySets: PropTypes.array
  }

  constructor(props, context) {
    super(props, context);
    this.state = { entitySets: [] };
  }

  componentDidMount() {
    CatalogApi.getCatalogEntitySetData()
      .then((entitySets) => {
        this.setState({ entitySets: Utils.addKeysToArray(entitySets) });
      });
  }

  render() {
    const entitySetList = this.state.entitySets.map(entitySet => (
      <EntitySet
        key={entitySet.key}
        name={entitySet.name}
        title={entitySet.title}
        typename={entitySet.typename}
      />
    ));
    return (<div>{entitySetList}</div>);
  }
}

export default EntitySetList;
