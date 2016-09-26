import React, { PropTypes } from 'react';
import CatalogApi from '../../../../utils/CatalogApi';
import Utils from '../../../../utils/Utils';
import { EntitySet } from './EntitySet';

export class EntitySetList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    entitySets: React.PropTypes.array
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      entitySets: [
        { key: '11', name: 'name1', title: 'title1', typename: 'typename1' },
        { key: '22', name: 'name2', title: 'title2', typename: 'typename2' }
      ]
    };
  }

  componentDidMount() {
    CatalogApi.getCatalogEntitySetData()
      .then((entitySets) => {
        this.setState({ entitySets: Utils.addKeysToArray(entitySets) });
      });
  }

  render() {
    const entitySetList = this.state.entitySets.map((entitySet) => {
      return (
        <EntitySet
          key={entitySet.key}
          name={entitySet.name}
          title={entitySet.title}
          typename={entitySet.typename}
        />
      );
    });
    return (<div>{entitySetList}</div>);
  }
}

export default EntitySetList;
