import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import { Alert } from 'react-bootstrap';

import LoadingSpinner from './LoadingSpinner';

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
    pendingContent: PropTypes.node,
    content: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node
    ]).isRequired
  };

  renderPending() {
    console.log('renderPending, status:', this.props.status);
    if (this.props.pendingContent) {
      return this.props.pendingContent;
    } else {
      return this.renderLoading();
    }
  }

  renderLoading() {
    console.log('renderLoading', this.props.status);

    return (
      <LoadingSpinner />
    );
  }

  renderError() {
    console.log('renderError', this.props.status);

    return (
      <Alert bsStyle="danger">
        <h4>Error</h4>
        {this.props.errorMessage}
      </Alert>
    );
  }

  renderContent() {
    console.log('renderContent', this.props.status);

    const { content } = this.props;
    if (typeof content === 'function') {
      return content();
    } else {
      return content;
    }
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
