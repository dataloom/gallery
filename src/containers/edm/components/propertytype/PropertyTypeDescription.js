import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';

import InlineEditableControl from '../../../../components/controls/InlineEditableControl';

export default class PropertyTypeDescription extends React.Component {

  static propTypes = {
    propertyType: PropTypes.instanceOf(Immutable.Map).isRequired,
    customSettings: PropTypes.instanceOf(Immutable.Map).isRequired,
    isOwner: PropTypes.bool,
    updateDescription: PropTypes.func
  };

  render() {
    const { customSettings, propertyType, isOwner, updateDescription } = this.props;

    let descriptionText = 'No description';
    let defaultDescriptionText = 'Property type description...';

    if (propertyType && !propertyType.isEmpty()) {
      descriptionText = propertyType.get('description');
      defaultDescriptionText = propertyType.get('description');
    }

    if (customSettings && !customSettings.isEmpty()) {
      descriptionText = customSettings.get('description');
    }

    return (
      <div className="propertyTypeDescription">
        <InlineEditableControl
            type="text"
            size="medium_small"
            placeholder={defaultDescriptionText}
            value={descriptionText}
            viewOnly={!isOwner}
            onChange={updateDescription} />
      </div>
    );
  }
}
