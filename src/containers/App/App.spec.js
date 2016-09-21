import React from 'react';
import { shallow } from 'enzyme';
import { describe, beforeEach, it, expect } from 'karma';

import App from './App';

describe('<App />', () => {
  let wrapper;
  const history = {};
  beforeEach(() => {
    wrapper =
      shallow(<App history={history} />);
  });

  it('has a Router component', () => {
    expect(length(wrapper.find('Router'))).toBe(1);
  });

  it('passes a history prop', () => {
    const props = wrapper.find('Router').props();

    expect(props.history).toBeDefined();
  });

});
