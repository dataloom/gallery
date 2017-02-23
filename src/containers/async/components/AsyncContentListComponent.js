import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import LoadingSpinner from './LoadingSpinner';
import { AsyncReferencePropType, STATUS, resolveReference } from '../AsyncStorage';

export const RENDER_STRATEGY = Object.freeze({
  ALL: Symbol('all')
  // TODO: ANY
});

class AsyncContentListComponent extends React.Component {
  static propTypes = {
    references: PropTypes.arrayOf(AsyncReferencePropType),
    render: PropTypes.func.isRequired,
    renderStrategy: PropTypes.oneOf([RENDER_STRATEGY.ALL]),
    // Literally anything
    resolvedReferences: PropTypes.arrayOf(PropTypes.any)
  };

  renderLoading() {
    return (<LoadingSpinner/>);
  }

  shouldRender() {
    const { references, resolvedReferences } = this.props;
    // TODO: Implement Any render strategy
    if (!references || !resolvedReferences) return false;
    return resolvedReferences.every(reference => {
      return !(reference === STATUS.EMPTY_REFERENCE) && !(reference === STATUS.LOADING);
    })
  }

  render() {
    const {
      resolvedReferences,
      render
    } = this.props;

    if (this.shouldRender()) {
      return render(resolvedReferences);
    } else {
      return this.renderLoading();
    }
  }
}

function mapStateToProps(state, ownProps) {
  const asyncContent = state.get('async'),
    { references } = ownProps;
  if (references) {
    return {
      resolvedReferences: references.map(reference => resolveReference(asyncContent, reference))
    }
  }
  return {};
}

export default connect(mapStateToProps)(AsyncContentListComponent);
