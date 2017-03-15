import { fromJS } from 'immutable';
import { expect } from 'chai';
import '../../../config/chai/chai.config';

import {
  isReference,
  isValue,
  dereference,
  resolveReference,
  createCompleteValue,
  createEmptyValue,
  STATE
} from './AsyncStorage';

describe('AsyncStorage', function() {
  const reference = {
    namespace: 'abc',
    id: '123'
  };

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
      const value = {
        state: STATE.EMPTY_REFERENCE,
        value: null
      };

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

  describe('resolveReference', function() {

    it('should resolve value', function () {
      const expectedValue = createCompleteValue(6);
      let asyncContent = fromJS({});
      asyncContent = resolveReference(asyncContent, reference, expectedValue);

      const dereferenced = dereference(asyncContent, reference);
      expect(dereferenced).to.deep.equal(expectedValue);
    });
  });

  describe('dereference', function() {

    it('should return empty reference', function() {
      const asyncContent = fromJS({});

      const dereferenced = dereference(asyncContent, reference);
      expect(dereferenced).to.deep.equal(createEmptyValue());
    });

    it('should return complete reference', function() {
      const value = createEmptyValue(5);
      let asyncContent = fromJS({});
      asyncContent = asyncContent.setIn([reference.namespace, reference.id], value);

      const dereferenced = dereference(asyncContent, reference);
      expect(dereferenced).to.deep.equal(value);
    });
  });
});
