import React from 'react';

import PropTypes from 'prop-types';
import { Map } from 'immutable';

function getIsChecked(value) {
  // force the value to be a boolean
  if (value !== true && value !== false) {
    return true;
  }
  return value;
}

export default class PropertyTypeDefaultShow extends React.Component {

  static propTypes = {
    propertyType: PropTypes.instanceOf(Map).isRequired,
    customSettings: PropTypes.instanceOf(Map).isRequired,
    updateDefaultShow: PropTypes.func.isRequired
  };

  constructor(props) {

    super(props);

    // we have to manage "isChecked" locally here because there's no reducer set up to handle the request to update
    // the EntitySet property metadata
    this.state = {
      isChecked: getIsChecked(props.customSettings.get('defaultShow'))
    };
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.customSettings.get('defaultShow') !== nextProps.customSettings.get('defaultShow')) {
      this.setState({
        isChecked: getIsChecked(nextProps.customSettings.get('defaultShow'))
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {

    if (this.state.isChecked === nextState.isChecked) {
      return false;
    }

    return true;
  }

  checkboxClicked = (e) => {

    this.setState({
      isChecked: e.target.checked
    });
    this.props.updateDefaultShow(e.target.checked);
  }

  render() {

    return (
      <div className="propertyTypeDefaultShow">
        <input
            id={`${this.props.propertyType.get('id')}-defaultshow`}
            type="checkbox"
            checked={this.state.isChecked}
            onChange={this.checkboxClicked} />
      </div>
    );
  }
}
