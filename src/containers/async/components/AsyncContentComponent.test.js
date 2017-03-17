import React, { PropTypes } from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Map } from 'immutable';

import '../../../../config/chai/chai.config';

import {
  AsyncContentComponent,
  mapStateToProps,
  createAsyncComponent
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


describe('createAsyncComponent', function() {
  it('should map propTypes', function() {
    const asyncComponent = createAsyncComponent(TestComponent);

    expect(asyncComponent).to.have.deep.property('propTypes.foo');
    expect(asyncComponent).to.have.deep.property('propTypes.fiz');
    expect(asyncComponent).to.have.deep.property('propTypes.children');
  });

  it('should not make "children" propType async', function() {
    const asyncComponent = createAsyncComponent(TestComponent);

    expect(asyncComponent).to.have.deep.property('propTypes.children')
      .equal(TestComponent.propTypes.children);
  });

  it('should map defaultProps', function() {
    const asyncComponent = createAsyncComponent(TestComponent);
    expect(asyncComponent).to.have.property('defaultProps')
      .equal(TestComponent.defaultProps);
  });

  it('should include baseProperties', function() {
    const AsyncComponent = createAsyncComponent(TestComponent);
    const foo = 'foo';
    const expectedProps = Object.assign({}, TestComponent.defaultProps, { foo });
    delete expectedProps.children;
    const wrapper = shallow(<AsyncComponent foo={foo} />);

    expect(wrapper).to.have.prop('baseProps')
      .deep.equal(expectedProps);
  });

  it('should include base', function() {
    const AsyncComponent = createAsyncComponent(TestComponent);
    const wrapper = shallow(<AsyncComponent />);

    expect(wrapper).to.have.prop('base').equal(TestComponent);
  });

  it('should allow children', function() {
    const AsyncComponent = createAsyncComponent(TestComponent);
    const children = (<span>hello</span>);
    const wrapper = shallow(<AsyncComponent>{children}</AsyncComponent>);

    expect(wrapper).to.have.prop('baseChildren').equal(children);
  });

  it('should allow custom error component', function() {
    const errorComponent = () => {};
    const AsyncComponent = createAsyncComponent(TestComponent, errorComponent);
    const wrapper = shallow(<AsyncComponent foo="hi" />);

    expect(wrapper).to.have.prop('errorComponent').equal(errorComponent);
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
