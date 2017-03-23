import { expect } from 'chai';
import '../../../config/chai/chai.config';

import reducer from './AsyncReducer';
import * as actionFactory from './AsyncActionFactory';
import { createCompleteValue } from './AsyncStorage';

describe('AsyncReducer', function() {
  const INITIAL_STATE = reducer(undefined, { type: 'none' });

  it('should complete reference on updateAsyncReference', function() {
    const reference = {
      namespace: 'test',
      id: '123'
    };
    const value = 'hello';
    const action = actionFactory.updateAsyncReference(reference, value);

    const newState = reducer(INITIAL_STATE, action);
    expect(newState).to.have.deep.property([reference.namespace, reference.id])
      .deep.equals(createCompleteValue(value));
  });

  it('should resolve reference', function() {
    const reference = {
      namespace: 'test',
      id: '123'
    };
    const value = createCompleteValue('hello');
    const action = actionFactory.resolveAsyncReference(reference, value);

    const newState = reducer(INITIAL_STATE, action);
    expect(newState).to.have.deep.property([reference.namespace, reference.id])
      .deep.equals(value);
  });
});
