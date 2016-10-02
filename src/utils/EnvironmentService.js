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
    return this.addresses[windowUrl];
  }

  static getEnvironmentUrl() {
    const envUrl = this.environments[this.getEnvironment()];
    if (envUrl !== undefined) {
      return envUrl;
    }
    throw new Error('environment not found for '.concat(windowUrl));
  }

  static getDatastoreUrl() {
    if (this.getEnvironment() === 'LOCALHOST') {
      return this.getEnvironmentUrl().concat(Consts.DATASTORE_CATALOG_URL);
    }
    return this.getEnvironmentUrl().concat(Consts.DATASTORE).concat(Consts.DATASTORE_CATALOG_URL)
  }
}
