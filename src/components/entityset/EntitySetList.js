import React, { PropTypes } from 'react';

import isEmpty from 'lodash/isEmpty';

import EntitySet from './EntitySet';
import { EntitySetPropType } from '../../containers/edm/EdmModel';
import styles from './entityset.module.css';

export default class EntitySetList extends React.Component {
  static propTypes = {
    entitySets: PropTypes.arrayOf(EntitySetPropType).isRequired,
    className: PropTypes.string
  };

  render() {
    const { entitySets } = this.props;

    let content;
    if (isEmpty(entitySets)) {
      content = (
        <div className={styles.empty}>
          No entity sets found
        </div>
      );
    } else {
      content = entitySets.map((entitySet) => {
        return (
          <EntitySet
            key={entitySet.id}
            entitySet={entitySet}
          />
        );
      });
    }

    return (
      <div className={this.props.className}>
        {content}
      </div>
    );
  }
}
