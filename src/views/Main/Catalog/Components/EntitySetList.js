import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
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
    EntityDataModelApi.getEntitySets()
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
        type={entitySet.type}
      />
    ));
    return (<div>{entitySetList}</div>);
  }
}

export default EntitySetList;
