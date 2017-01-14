import React, { PropTypes } from 'react';
import classnames from 'classnames';

import { EntitySetSummary } from './EntitySet';
import { EntitySetPropType } from './EntitySetStorage';
import styles from '../../containers/catalog/catalog.module.css';

const baseEntitySetListPropTypes = {
  entitySets: PropTypes.arrayOf(EntitySetPropType).isRequired,
  className: PropTypes.string
};

export class EntitySetList extends React.Component {
  static propTypes = baseEntitySetListPropTypes;

  render() {
    const entitySetList = this.props.entitySets.map((entitySet) => {
      return (
        <EntitySetSummary
          key={entitySet.id}
          entitySet={entitySet}
        />
      );
    });

    return (
      <div className={classnames(styles.entitySetList, this.props.className)}>
        {entitySetList}
      </div>
    );
  }
}
