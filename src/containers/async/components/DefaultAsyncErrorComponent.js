import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';


export default class DefaultAsyncErrorComponent extends React.Component {
  static propTypes = {
    error: PropTypes.string.isRequired
  };

  render() {
    const { error } = this.props;
    return (
      <span>
        <FontAwesome name="times-circle-o" />
        { error }
      </span>);
  }
}
