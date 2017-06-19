/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';

import EntitySet from './EntitySet';
import styles from './entityset.module.css';

export default class EntitySetList extends React.Component {

  static propTypes = {
    entitySets: PropTypes.instanceOf(Immutable.Map).isRequired
  };

  render() {

    if (this.props.entitySets.isEmpty()) {
      return (
        <div className={styles.empty}>
          No entity sets found
        </div>
      );
    }

    const content = [];
    this.props.entitySets.forEach((entitySet :Map) => {
      if (!entitySet.isEmpty()) {
        content.push(
          <EntitySet key={entitySet.get('id')} entitySet={entitySet} />
        );
      }
    });

    return (
      <div>
        {content}
      </div>
    );
  }
}
