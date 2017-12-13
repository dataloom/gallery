import { RequestsApi } from 'lattice';
import { expect } from 'chai';
import '../../../config/chai/chai.config';
import { fromJS } from 'immutable';

import testEpic from '../../../test/testEpic';
import EdmEpic from './EdmEpic';
import * as EdmActionFactory from './EdmActionFactories';
import * as AsyncActionFactory from '../async/AsyncActionFactory';


describe('EdmEpic', function() {
  describe('referenceEpic', function() {
    it ('should emit both edmReference and updateAsyncReferenc', function(done) {
      // const namespace = 'the_namespace';
      // const id = 'abc';
      // const value = {
      //   hello: 'world'
      // };
      // const normalizedData = fromJS({
      //   [namespace]: {
      //     [id]: value
      //   }
      // });
      // const action = EdmActionFactory.updateNormalizedData(normalizedData);
      //
      // const edmReference = {
      //   id,
      //   collection: namespace
      // };
      // const asyncReference = {
      //   namespace,
      //   id
      // };
      //
      // testEpic(EdmEpic, 2, action, (actions) => {
      //   expect(actions).to.deep.contain(EdmActionFactory.edmObjectResolve(edmReference));
      //   expect(actions).to.deep.contain(AsyncActionFactory.updateAsyncReference(asyncReference, value));
      //   done();
      // });
    });

  });
});
