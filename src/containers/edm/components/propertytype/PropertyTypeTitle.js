/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';

export default class PropertyTypeTitle extends React.Component {

  static propTypes = {
    propertyType: PropTypes.instanceOf(Immutable.Map).isRequired
  };

  render() {

    let title = null; // legacy, consider just returning null
    if (this.props.propertyType && !this.props.propertyType.isEmpty()) {
      title = this.props.propertyType.get('title');
    }

    return (
      <div className="propertyTypeTitle">{title}</div>
    );
  }
}
