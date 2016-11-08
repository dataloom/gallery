import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import Utils from '../../../../utils/Utils';
import { EntitySet } from './EntitySet';
import styles from '../styles.module.css';

export class EntitySetList extends React.Component {
  static propTypes = {
    entitySets: PropTypes.array
  }

  constructor(props, context) {
    super(props, context);
    this.state = { entitySets: [] };
  }

  componentDidMount() {
    EntityDataModelApi.getAllEntitySets()
      .then((entitySets) => {
        this.setState({ entitySets: Utils.addKeysToArray(entitySets) });
      });
  }

  render() {
    const entitySetList = this.state.entitySets.map((entitySet) => {
      return (<EntitySet
        key={entitySet.key}
        name={entitySet.name}
        title={entitySet.title}
        type={entitySet.type}
      />);
    });
    return (
      <div>
        <div className={styles.spacerBig} />
        {entitySetList}
      </div>
    );
  }
}

export default EntitySetList;
