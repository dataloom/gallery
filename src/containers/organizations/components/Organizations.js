/*
 * @flow
 */

import React from 'react';

import styles from '../styles/orgs.module.css';

export default class Organizations extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired
  }

  render() {
    return (
      <div className={styles.organizationsWrapper}>
        { React.Children.toArray(this.props.children) }
      </div>
    );
  }
}
