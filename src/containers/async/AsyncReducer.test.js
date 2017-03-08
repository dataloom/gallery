import { expect } from 'chai';
import reducer from './AsyncReducer';
import * as actionFactory from './AsyncActionFactory';

describe('AsyncReducer', function() {
  const INITIAL_STATE = reducer();
  it('should update references', function() {
    const reference = {
      namespace: 'test',
      id: '123'
    };
    const value = 'hello';
    const action = actionFactory.updateAsyncReference(reference, value);

  });
});