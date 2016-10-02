import Consts from './AppConsts';

export default class EnvironmentService {
  static addresses = {
    'http://localhost:9000': 'LOCALHOST',
    'http://demo.loom.digital': 'DEMO',
    'http://loom.digital': 'PRODUCTION'
  };

  static environments = {
    LOCALHOST: 'http://localhost:8095',
    DEMO: 'http://demo.loom.digital',
    PRODUCTION: 'http://loom.digital'
  }

  static getEnvironment() {
    const windowUrl = window.location.origin;
    const env = this.addresses[windowUrl];
    const envUrl = this.environments[env];

    if (env !== undefined) {
      return envUrl;
    }
    throw new Error('environment not found for '.concat(windowUrl));
  }

  static getDatastoreUrl() {
    return this.getEnvironment().concat(Consts.DATASTORE_CATALOG_URL);
  }
}
