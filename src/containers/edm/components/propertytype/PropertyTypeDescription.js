import React from 'react';
import { PropertyTypePropType } from '../../EdmModel';
import ExpandableText from '../../../../components/utils/ExpandableText';


const MAX_DESCRIPTION_LENGTH = 300;

export default class PropertyTypeDescription extends React.Component {
  static propTypes = {
    propertyType: PropertyTypePropType
  };

  render() {
    const { propertyType } = this.props;
    let content;

    if (propertyType) {
      if (propertyType.description) {
        content = (<ExpandableText text={propertyType.description} maxLength={MAX_DESCRIPTION_LENGTH} />);
      } else {
        content = (<em>No description</em>);
      }
    }

    return (<div className="propertyTypeDescription">{content}</div>);
  }
}