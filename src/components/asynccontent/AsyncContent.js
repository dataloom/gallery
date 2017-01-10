import  React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import { Alert } from 'react-bootstrap';

export default class AsyncContent extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string
  };

  renderLoading() {
    return (
      <div>
        <h2>Loading</h2>
        <FontAwesome name="spinner" size="5x" spin />
      </div>
    );
  }

  renderError() {
    return (
      <Alert bsStyle="danger">
        <h4>Error</h4>
        {this.props.errorMessage}
      </Alert>
    );
  }

  renderContent() {
    return this.props.children;
  }

  render() {
    if (this.props.isLoading) {
      return this.renderLoading();
    } else if (this.props.errorMessage) {
      return this.renderError();
    } else {
      return this.renderContent();
    }
  }
}