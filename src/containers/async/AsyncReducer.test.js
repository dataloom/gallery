import reducer from './AsyncReducer';
import * as actionFactory from './AsyncActionFactory';

describe('AsyncReducer', function() {
  const INITIAL_STATE = reducer(undefined, {type: 'none'});

  it('should update references', function() {
    const reference = {
      namespace: 'test',
      id: '123'
    };
    const value = 'hello';
    const action = actionFactory.updateAsyncReference(reference, value);

    const newState = reducer(INITIAL_STATE, action);
    expect(newState).to.have.deep.property([reference.namespace, reference.id], value);
  });
});
