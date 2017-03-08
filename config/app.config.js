/*
 * @flow
 */

import PACKAGE from '../package.json';

const BANNER = `
${PACKAGE.name} - v${PACKAGE.version}
${PACKAGE.description}
${PACKAGE.homepage}

Copyright (c) 2014-2016, Kryptnostic, Inc. All rights reserved.
`;

const APP_INDEX_HTML = 'index.html';
const APP_JS = 'app.js';
const APP_CSS = 'app.css';

export default {
  BANNER,
  APP_INDEX_HTML,
  APP_JS,
  APP_CSS
};
