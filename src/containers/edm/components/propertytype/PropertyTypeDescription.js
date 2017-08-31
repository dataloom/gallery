/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';

import ExpandableText from '../../../../components/utils/ExpandableText';

const MAX_DESCRIPTION_LENGTH = 300;

export default class PropertyTypeDescription extends React.Component {

  static propTypes = {
    propertyType: PropTypes.instanceOf(Immutable.Map).isRequired,
    customSettings: PropTypes.instanceOf(Immutable.Map).isRequired
  };

  render() {
    const { customSettings, propertyType } = this.props;

    let descriptionText;

    if (customSettings && !customSettings.isEmpty()) {
      descriptionText = customSettings.get('description');
    }
    else if (propertyType && !propertyType.isEmpty()) {
      descriptionText = propertyType.get('description');
    }

    const description = (descriptionText) ?
      <ExpandableText text={descriptionText} maxLength={MAX_DESCRIPTION_LENGTH} /> : <em>No description</em>;

    return (
      <div className="propertyTypeDescription">{description}</div>
    );
  }
}
