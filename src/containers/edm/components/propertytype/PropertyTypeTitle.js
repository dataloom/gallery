import React from 'react';

import PropTypes from 'prop-types';
import { Map } from 'immutable';

import InlineEditableControl from '../../../../components/controls/InlineEditableControl';


export default class PropertyTypeTitle extends React.Component {

  static propTypes = {
    propertyType: PropTypes.instanceOf(Map).isRequired,
    customSettings: PropTypes.instanceOf(Map).isRequired,
    isOwner: PropTypes.bool,
    updateTitle: PropTypes.func
  };

  shouldComponentUpdate(nextProps) {

    const shouldUpdate = (
      nextProps.isOwner !== this.props.isOwner
      || nextProps.customSettings.get('title') !== this.props.customSettings.get('title')
      || !nextProps.propertyType.equals(this.props.propertyType)
    );

    return shouldUpdate;
  }

  render() {
    const { customSettings, propertyType, isOwner, updateTitle } = this.props;

    let title = null; // legacy, consider just returning null
    let defaultTitle = 'Property type title...';

    if (propertyType && !propertyType.isEmpty()) {
      title = propertyType.get('title');
      defaultTitle = propertyType.get('title');
    }

    if (customSettings && !customSettings.isEmpty()) {
      title = customSettings.get('title');
    }

    return (
      <div className="propertyTypeTitle">
        <InlineEditableControl
            type="text"
            size="medium_small"
            placeholder={defaultTitle}
            value={title}
            viewOnly={!isOwner}
            onChange={updateTitle} />
      </div>
    );
  }
}
