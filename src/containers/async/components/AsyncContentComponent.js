import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import mapValues from 'lodash/mapValues';
import flatMapDeep from 'lodash/flatMapDeep';

import LoadingSpinner from './LoadingSpinner';
import DefaultAsyncErrorComponent from './DefaultAsyncErrorComponent';

import {
  smartDereference,
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

    const props = mapValues(baseProps, (prop) => {
      return isValue(prop) ? prop.value : prop;
    });

    return React.createElement(base, props, baseChildren);
  }

  render() {
    const { baseProps } = this.props;
    const asyncValues = flatMapDeep(baseProps).filter(isValue);

    if (asyncValues.some(isErrorValue)) {
      const error = asyncValues.find(isErrorValue);
      return this.renderError(error);
    }
    else if (asyncValues.some(isLoadingValue)) {
      return this.renderLoading();
    }
    else if (asyncValues.some(isEmptyValue)) {
      return this.renderEmpty();
    }

    return this.renderComplete();
  }
}

export function mapStateToProps(state, ownProps) {
  const { baseProps } = ownProps;
  const asyncContent = state.get('async');

  const dereferencedBaseProps = mapValues(baseProps, (value) => {
    return smartDereference(asyncContent, value);
  });

  return {
    baseProps: dereferencedBaseProps
  };
}

export const SmartAsyncContentComponent = connect(mapStateToProps)(AsyncContentComponent);

export function createAsyncComponent(baseComponent, errorComponent = DefaultAsyncErrorComponent) {
  const propTypes = mapValues(baseComponent.propTypes, (propType, name) => {
    if (name === 'children') {
      return propType;
    }

    if (propType === PropTypes.array || propType === PropTypes.array.isRequired) {
      let newPropType = PropTypes.arrayOf(PropTypes.any);

      if (propType === PropTypes.array.isRequired) {
        newPropType = newPropType.isRequired;
      }
      return newPropType;
    }

    return referenceOrValuePropType(propType);
  });

  return class extends React.Component {
    static propTypes = propTypes;
    static defaultProps = baseComponent.defaultProps;

    render() {
      const { children } = this.props;
      const baseProps = Object.assign({}, this.props);
      delete baseProps.children;

      return (
        <SmartAsyncContentComponent
            base={baseComponent}
            baseProps={baseProps}
            baseChildren={children}
            errorComponent={errorComponent} />);
    }
  };
}
