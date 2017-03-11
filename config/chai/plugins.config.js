/*
 * Hack to get chai plugins working. How it works:
 * karma-chai is regestered as 'chai' in karma.config.js under 'frameworks'
 * karma-chai is run before any tests, and adds expect, should, and assert to the global window object
 * Anything in test/ is run before src/ because of the files order
 * This file adds chaiImmutable to the global `chai` instance, which adds the plugin to the global `expect`
 * Importing chai (or expect) either here or in tests will prevent the plugins from being applied.
 */

import chai from 'chai';
import chaiImmutable from 'chai-immutable';
import chaiEnzyme from 'chai-enzyme';
// import chaiSinon from 'chai-sinon';

chai.use(chaiImmutable);
chai.use(chaiEnzyme());
// chai.use(chaiSinon);