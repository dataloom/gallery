/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';

import ExpandableText from '../../../../components/utils/ExpandableText';

const MAX_DATATYPE_LENGTH = 50;

export default class PropertyTypeDatatype extends React.Component {

  static propTypes = {
    propertyType: PropTypes.instanceOf(Immutable.Map).isRequired
  };

  render() {

    let datatype = (<em>No datatype</em>);
    if (this.props.propertyType && !this.props.propertyType.isEmpty()) {
      datatype = (
        <ExpandableText text={this.props.propertyType.get('datatype')} maxLength={MAX_DATATYPE_LENGTH} />
      );
    }

    return (
      <div className="propertyTypeDatatype">{datatype}</div>
    );
  }
}
