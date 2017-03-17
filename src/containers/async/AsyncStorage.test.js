import { Map } from 'immutable';
import { expect } from 'chai';
import '../../../config/chai/chai.config';

import {
  isReference,
  isValue,
  dereference,
  resolveReference,
  createEmptyValue,
  isEmptyValue,
  createCompleteValue,
  isCompleteValue,
  createLoadingValue,
  isLoadingValue,
  createErrorValue,
  isErrorValue,
  smartDereference,
  createReference,
  STATE
} from './AsyncStorage';

describe('AsyncStorage', function() {
  const reference = {
    namespace: 'abc',
    id: '123'
  };
  let asyncContent;

  beforeEach(function() {
    asyncContent = Map();
  });


  describe('isReference', function() {
    it('should return true for reference', function() {
      expect(isReference(reference)).to.be.true;
    });

    it('should return false for non-reference', function() {
      expect(isReference({})).to.be.false;
    });

    it('should return false for null', function() {
      expect(isReference(null)).to.be.false;
    });
  });


  describe('isValue', function() {
    it('should return true for value', function () {
      const value = createEmptyValue();
      expect(isValue(value)).to.be.true;
    });

    it('should return false for non-reference', function() {
      expect(isValue({})).to.be.false;
    });

    it('should return false for null', function() {
      expect(isValue(null)).to.be.false;
    });

    it('should return false for undefined value', function() {
      expect(isValue({
        state: STATE.EMPTY_REFERENCE
      })).to.be.false;
    });

    it('should return false for state not in STATE', function() {
      expect(isValue({
        state: Symbol('hi'),
        value: 5
      })).to.be.false;
    });
  });


  describe('isEmptyValue', function() {
    it('should return true for error value', function() {
      const value = createEmptyValue();
      expect(isEmptyValue(value)).to.be.true;
    });

    it('should return false for error value', function() {
      const value = createErrorValue('error');
      expect(isEmptyValue(value)).to.be.false;
    });
  });


  describe('isLoadingValue', function() {
    it('should return true for error value', function() {
      const value = createLoadingValue();
      expect(isLoadingValue(value)).to.be.true;
    });

    it('should return false for error value', function() {
      const value = createErrorValue('error');
      expect(isLoadingValue(value)).to.be.false;
    });
  });


  describe('isCompleteValue', function() {
    it('should return true for error value', function() {
      const value = createCompleteValue(5);
      expect(isCompleteValue(value)).to.be.true;
    });

    it('should return false for error value', function() {
      const value = createErrorValue('error');
      expect(isCompleteValue(value)).to.be.false;
    });
  });


  describe('isErrorValue', function() {
    it('should return true for error value', function() {
      const value = createErrorValue('error');
      expect(isErrorValue(value)).to.be.true;
    });

    it('should return false for error value', function() {
      const value = createCompleteValue('');
      expect(isErrorValue(value)).to.be.false;
    });
  });

  describe('resolveReference', function() {
    it('should resolve value', function () {
      const expectedValue = createCompleteValue(6);
      asyncContent = resolveReference(asyncContent, reference, expectedValue);

      const dereferenced = dereference(asyncContent, reference);
      expect(dereferenced).to.deep.equal(expectedValue);
    });
  });


  describe('dereference', function() {
    it('should return empty reference', function() {
      const dereferenced = dereference(asyncContent, reference);
      expect(dereferenced).to.deep.equal(createEmptyValue());
    });

    it('should return complete reference', function() {
      const value = createEmptyValue();
      asyncContent = asyncContent.setIn([reference.namespace, reference.id], value);

      const dereferenced = dereference(asyncContent, reference);
      expect(dereferenced).to.deep.equal(value);
    });
  });


  describe.only('smartDereference', function() {
    it('should ignore non-reference objects', function() {
      const value = 5;
      expect(smartDereference(asyncContent, value)).to.equal(value);
    });

    it('should resolve references', function() {
      const value = createCompleteValue(5);
      asyncContent = resolveReference(asyncContent, reference, value);
      expect(smartDereference(asyncContent, reference)).to.equal(value);
    });

    it('should resolve array of references', function() {
      const value1 = createCompleteValue(5);
      const value2 = createCompleteValue(7);
      const reference2 = createReference('name', '123');

      asyncContent = resolveReference(asyncContent, reference, value1);
      asyncContent = resolveReference(asyncContent, reference2, value2);

      const expectedValue = [value1, value2];
      expect(smartDereference(asyncContent, [reference, reference2])).to.deep.equal(expectedValue);
    });

    it('should ignore non-references in array of references', function() {
      const value1 = createCompleteValue(5);
      const value2 = 'hi';

      asyncContent = resolveReference(asyncContent, reference, value1);

      const expectedValue = [value1, value2];
      expect(smartDereference(asyncContent, [reference, value2])).to.deep.equal(expectedValue);
    });

    it('should resolve plain object values', function() {
      const value = createCompleteValue(5);
      asyncContent = resolveReference(asyncContent, reference, value);

      const props = {
        value: reference
      };
      const expectedProps = {
        value
      };

      expect(smartDereference(asyncContent, props)).to.deep.equal(expectedProps);
    });

    it('should ignore values in plain objects', function() {
      const value1 = createCompleteValue(5);
      const value2 = 'hello';

      asyncContent = resolveReference(asyncContent, reference, value1);

      const props = {
        value1: reference,
        value2
      };
      const expectedProps = {
        value1,
        value2
      };

      expect(smartDereference(asyncContent, props)).to.deep.equal(expectedProps);
    });
  });
});
