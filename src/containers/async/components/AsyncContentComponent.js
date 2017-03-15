import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import LoadingSpinner from './LoadingSpinner';
import { AsyncReferencePropType, STATUS, dereference } from '../AsyncStorage';

class AsyncContentComponent extends React.Component {
  static propTypes = {
    reference: AsyncReferencePropType.isRequired,
    render: PropTypes.func.isRequired,
    // Status renderers
    referenceEmptyContent: PropTypes.node,
    reference404Content: PropTypes.node,
    reference403Content: PropTypes.node,
    // Literally anything
    resolvedReference: PropTypes.any
  };

  renderLoading() {
    return (<LoadingSpinner/>);
  }

  render() {
    const {
      resolvedReference,
      render,
      referenceEmptyContent,
      reference404Content,
      reference403Content
    } = this.props;

    switch (resolvedReference) {
      case STATUS.EMPTY_REFERENCE:
        return referenceEmptyContent ? referenceEmptyContent : this.renderLoading();
      case STATUS.LOADING:
        return this.renderLoading();
      case STATUS.ACCESS_DENIED:
        return reference403Content ? reference403Content : render(resolvedReference);
      case STATUS.NOT_FOUND:
        return reference404Content ? reference404Content : render(resolvedReference);
      default:
        return render(resolvedReference);
    }
  }
}

function mapStateToProps(state, ownProps) {
  const asyncContent = state.get('async'),
    { reference } = ownProps;

  return {
    resolvedReference: dereference(asyncContent, reference)
  }
}

export default connect(mapStateToProps)(AsyncContentComponent);