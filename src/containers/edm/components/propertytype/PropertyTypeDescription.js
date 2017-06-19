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
    propertyType: PropTypes.instanceOf(Immutable.Map).isRequired
  };

  render() {

    let description = (<em>No description</em>);
    if (this.props.propertyType && !this.props.propertyType.isEmpty()) {
      description = (
        <ExpandableText text={this.props.propertyType.get('description')} maxLength={MAX_DESCRIPTION_LENGTH} />
      );
    }

    return (
      <div className="propertyTypeDescription">{description}</div>
    );
  }
}
