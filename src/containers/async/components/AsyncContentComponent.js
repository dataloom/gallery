import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import toPairs from 'lodash/toPairs';
import fromPairs from 'lodash/fromPairs';
import values from 'lodash/values';

import LoadingSpinner from './LoadingSpinner';
import DefaultAsyncErrorComponent from './DefaultAsyncErrorComponent';

import {
  dereference,
  isReference,
  isValue,
  isEmptyValue,
  isLoadingValue,
  isErrorValue,
  referenceOrValuePropType
} from '../AsyncStorage';

import type {
  AsyncValue
} from '../AsyncStorage';


export class AsyncContentComponent extends React.Component {
  static propTypes = {
    base: PropTypes.instanceOf(React.Component).isRequired,
    baseChildren: PropTypes.arrayOf(PropTypes.element),
    baseProps: PropTypes.object,
    // State Components
    errorComponent: PropTypes.func
  };

  static defaultProps = {
    baseProps: {},
    baseChildren: [],
    errorComponent: DefaultAsyncErrorComponent
  };

  renderEmpty() {
    return this.renderLoading();
  }

  renderLoading() {
    return (<LoadingSpinner />);
  }

  renderError(error :AsyncValue) {
    const { errorComponent } = this.props;
    return React.createElement(errorComponent, {
      error: error.value
    });
  }

  renderComplete() {
    const { base, baseProps, baseChildren } = this.props;

    const asyncProps = fromPairs(toPairs(baseProps)
      .filter((value) => {
        return !isValue(value);
      })
      .map(([name, prop]) => {
        return [name, prop.value];
      }));

    const props = Object.assign({}, baseProps, asyncProps);
    return React.createElement(base, props, baseChildren);
  }

  render() {
    const { baseProps } = this.props;
    const asyncValues = values(baseProps).filter(isValue);

    if (asyncValues.some(isErrorValue)) {
      const error = asyncValues.find(isErrorValue);
      return this.renderError(error);

    } else if (asyncValues.some(isLoadingValue)) {
      return this.renderLoading();

    } else if (asyncValues.some(isEmptyValue)) {
      return this.renderEmpty();

    } else {
      return this.renderComplete();
    }
  }
}

function dereferenceProps(asyncContent, props) {
  if (props === null) {
    return {};
  }
  const dereferencedPairs = toPairs(props).filter(([_, prop]) => {
    return isReference(prop);
  }).map(([name, reference]) => {
    return [name, dereference(asyncContent, reference)];
  });
  return fromPairs(dereferencedPairs);
}

export function mapStateToProps(state, ownProps) {
  const { baseProps } = ownProps;
  const asyncValues = dereferenceProps(state.get('async'), baseProps);
  const dereferencedBaseProps = Object.assign({}, baseProps, asyncValues);

  return {
    baseProps: dereferencedBaseProps
  };
}

export const SmartAsyncContentComponent = connect(mapStateToProps)(AsyncContentComponent);


export function createAsyncComponent(baseComponent, errorComponent = DefaultAsyncErrorComponent) {
  const propTypes = baseComponent.propTypes.map(referenceOrValuePropType);

  return class extends React.Component {
    static propTypes = propTypes;
    static defaultProps = baseComponent.defaultProps;

    render() {
      const { children } = this.props;
      return (
        <SmartAsyncContentComponent
            base={baseComponent}
            baseChildren={children}
            errorComponent={errorComponent} />);
    }
  };
}
