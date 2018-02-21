import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';


export default class PropertyTypeDefaultShow extends React.Component {

  static propTypes = {
    propertyType: PropTypes.instanceOf(Immutable.Map).isRequired,
    customSettings: PropTypes.instanceOf(Immutable.Map).isRequired,
    updateDefaultShow: PropTypes.func.isRequired
  };

  checkboxClicked = (e) => {
    this.props.updateDefaultShow(e.target.checked);
  }

  render() {
    const defaultShowValue = this.props.customSettings.get('defaultShow', true);
    const defaultShow = (
      <input
          id={`${this.props.propertyType.id}-defaultshow`}
          type="checkbox"
          defaultChecked={defaultShowValue}
          onChange={this.checkboxClicked} />
      );

    return (
      <div className="propertyTypeDefaultShow">{defaultShow}</div>
    );
  }
}
