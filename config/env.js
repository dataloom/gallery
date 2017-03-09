/*
 * @flow
 */

function ifElse(condition) {
  return (isTrue, isFalse) => {
    return condition ? isTrue : isFalse;
  };
}

const BUILD :string = process.env.BUILD || 'development';

const isDev :boolean = BUILD === 'development';
const isProd :boolean = BUILD === 'production';

const ifDev :Function = ifElse(isDev);
const ifProd :Function = ifElse(isProd);

const testProfile :string = process.env.TEST || 'default';

export {
  isDev,
  isProd,
  ifDev,
  ifProd,
  testProfile
};
