import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import { Alert } from 'react-bootstrap';

export const ASYNC_STATUS = Object.freeze({
  PENDING: Symbol('pending'),
  LOADING: Symbol('loading'),
  SUCCESS: Symbol('success'),
  ERROR: Symbol('error')
});

export const AsyncStatePropType = PropTypes.shape({
  status: PropTypes.oneOf(Object.values(ASYNC_STATUS)).isRequired,
  errorMessage: PropTypes.string
});


export default class AsyncContent extends React.Component {
  static propTypes = {
    // State
    status: PropTypes.oneOf(Object.values(ASYNC_STATUS)),
    errorMessage: PropTypes.string,
    // Other stuff
    pendingContent: PropTypes.node
  };

  renderPending() {
    if (this.props.pendingContent) {
      return this.props.pendingContent;
    } else {
      return this.renderLoading();
    }
  }

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
    switch (this.props.status) {
      case ASYNC_STATUS.LOADING:
        return this.renderLoading();
      case ASYNC_STATUS.ERROR:
        return this.renderError();
      case ASYNC_STATUS.SUCCESS:
        return this.renderContent();
      default:
        return this.renderPending();
    }
  }
}
