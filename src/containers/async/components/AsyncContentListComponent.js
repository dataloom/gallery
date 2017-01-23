import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import LoadingSpinner from './LoadingSpinner';
import { AsyncReferencePropType } from '../AsyncStorage';

export const RENDER_STRATEGY = Object.freeze({
  ALL: Symbol('all')
  // TODO: ANY
});

class AsyncContentListComponent extends React.Component {
  static propTypes = {
    references: PropTypes.arrayOf(AsyncReferencePropType).isRequired,
    render: PropTypes.func.isRequired,
    renderStrategy: PropTypes.oneOf([RENDER_STRATEGY.ALL]),
    // Literally anything
    resolvedReferences: PropTypes.array
  };

  renderContent() {
    const { content } = this.props;
    if (typeof content === 'function') {
      return content();
    } else {
      return content;
    }
  }

  render() {

  }
}

function mapStateToProps(state, ownProps) {
  const asyncContent = state.get('async'),
    { references } = ownProps;


}


export default connect(mapStateToProps)(AsyncContentListComponent);