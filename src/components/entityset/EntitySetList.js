import React, { PropTypes } from 'react';

import { EntitySetSummary } from './EntitySet';
import styles from '../../containers/catalog/catalog.module.css';

export class EntitySetList extends React.Component {
  static propTypes = {
    entitySets: PropTypes.array.isRequired
  };

  render() {
    const entitySetList = this.props.entitySets.map((entitySet) => {
      return (
        <EntitySetSummary
          key={entitySet.key}
          entitySet={entitySet}
        />
      );
    });

    return (
      <div className={styles.entitySetList}>
        {entitySetList}
      </div>
    );
  }
}

export default EntitySetList;
