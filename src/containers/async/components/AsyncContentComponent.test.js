import React, { PropTypes } from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import '../../../../config/chai/chai.config';

import {
  AsyncContentComponent,
  mapStateToProps
} from './AsyncContentComponent';
import DefaultAsyncErrorComponent from './DefaultAsyncErrorComponent';
import LoadingSpinner from './LoadingSpinner';
import {
  createReference,
  createEmptyValue,
  createCompleteValue,
  createLoadingValue,
  createErrorValue,
  resolveReference
} from '../AsyncStorage';


class TestComponent extends React.Component {
  static propTypes = {
    foo: PropTypes.string.isRequired,
    fiz: PropTypes.string,
    children: PropTypes.node
  };
  static defaultProps = {
    fiz: 'bar',
    children: null
  };

  render() {
    const { foo, fiz, children } = this.props;

    return (
      <div>
        <strong>{foo}</strong>
        <em>{fiz}</em>
        {children}
      </div>
    );
  }
}


describe('AsyncContentComponent', function() {
  it('should display loading on loading', function() {
    const wrapper = shallow(
      <AsyncContentComponent
          base={TestComponent}
          baseProps={{
            foo: createLoadingValue()
          }} />);

    expect(wrapper).to.contain(<LoadingSpinner />);
  });

  it('should display loading if any prop is loading', function() {
    const wrapper = shallow(
      <AsyncContentComponent
          base={TestComponent}
          baseProps={{
            foo: createLoadingValue(),
            fiz: createCompleteValue('hi')
           }} />);

    expect(wrapper).to.contain(<LoadingSpinner />);
  });

  it('should render component on complete', function() {
    const value = 'the string';
    const wrapper = shallow(
      <AsyncContentComponent
          base={TestComponent}
          baseProps={{
            foo: createCompleteValue(value)
          }} />);

    expect(wrapper).to.contain(<TestComponent foo={value} />);
  });

  it('should render multiple complete properties', function() {
    const foo = 'foo';
    const fiz = 'fiz';
    const wrapper = shallow(
      <AsyncContentComponent
          base={TestComponent}
          baseProps={{
            foo: createCompleteValue(foo),
            fiz: createCompleteValue(fiz)
          }} />);

    expect(wrapper).to.contain(<TestComponent foo={foo} fiz={fiz} />);
  });

  it('should render error', function() {
    const errorMessage = 'Error!';
    const wrapper = shallow(
      <AsyncContentComponent
          base={TestComponent}
          baseProps={{
            foo: createErrorValue(errorMessage)
          }} />);

    expect(wrapper).to.contain(<DefaultAsyncErrorComponent error={errorMessage} />);
  });

  it('error should supercede loading', function() {
    const errorMessage = 'Error!';
    const wrapper = shallow(
      <AsyncContentComponent
          base={TestComponent}
          baseProps={{
            foo: createErrorValue(errorMessage),
            fiz: createLoadingValue()
          }} />);

    expect(wrapper).to.contain(<DefaultAsyncErrorComponent error={errorMessage} />);
  });

  it('error should supercede complete', function() {
    const errorMessage = 'Error!';
    const wrapper = shallow(
      <AsyncContentComponent
          base={TestComponent}
          baseProps={{
            foo: createErrorValue(errorMessage),
            fiz: createCompleteValue('hi')
          }} />);

    expect(wrapper).to.contain(<DefaultAsyncErrorComponent error={errorMessage} />);
  });

  it('loading should supercede complete', function() {
    const wrapper = shallow(
      <AsyncContentComponent
          base={TestComponent}
          baseProps={{
            foo: createLoadingValue(),
            fiz: createCompleteValue('hi')
          }} />);

    expect(wrapper).to.contain(<LoadingSpinner />);
  });

  it('empty should render as loading', function() {
    const wrapper = shallow(
      <AsyncContentComponent
          base={TestComponent}
          baseProps={{
            foo: createEmptyValue()
          }} />);

    expect(wrapper).to.contain(<LoadingSpinner />);
  });
});

describe('mapStateToProps', function() {
  it('should replace references with values', function() {
    const reference = createReference('abc','123');
    const value = createCompleteValue(5);
    let async = Map();
    async = resolveReference(async, reference, value);

    const state = Map({
      async
    });

    const mappedProps = mapStateToProps(state, {
      baseProps: {
        foo: reference
      }
    });

    expect(mappedProps).to.have.deep.property('baseProps.foo').equal(value);
  });
});
