/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';

export default class PropertyTypeTitle extends React.Component {

  static propTypes = {
    propertyType: PropTypes.instanceOf(Immutable.Map).isRequired,
    customSettings: PropTypes.instanceOf(Immutable.Map).isRequired
  };

  render() {
    const { customSettings, propertyType } = this.props;

    let title = null; // legacy, consider just returning null
    if (customSettings && !customSettings.isEmpty()) {
      title = customSettings.get('title');
    }
    else if (propertyType && !propertyType.isEmpty()) {
      title = propertyType.get('title');
    }

    return (
      <div className="propertyTypeTitle">{title}</div>
    );
  }
}
