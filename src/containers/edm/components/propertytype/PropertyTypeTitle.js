import React from 'react';
import { PropertyTypePropType } from '../../EdmModel';

/* Title */
export default class PropertyTypeTitle extends React.Component {
  static propTypes = {
    propertyType: PropertyTypePropType
  };

  render() {
    const { propertyType } = this.props;
    const content = propertyType === null ? null : propertyType.title;

    return (
      <div className="propertyTypeTitle">{content}</div>
    );
  }
}
