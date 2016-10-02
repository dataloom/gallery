import FileSaver from 'file-saver';
import axios from 'axios';
import Consts from './AppConsts';
import EnvironmentService from './EnvironmentService';

export default class CatalogApi {

  static getCatalogSchemaData() {
    const url = EnvironmentService.getDatastoreUrl().concat(Consts.SCHEMAS);
    return axios.get(url).then(response => response.data);
  }

  static getCatalogEntityTypeData() {
    const url = EnvironmentService.getDatastoreUrl().concat(Consts.ENTITY_TYPE);
    return axios.get(url).then(response => response.data);
  }

  static getCatalogEntitySetData() {
    const url = EnvironmentService.getDatastoreUrl().concat(Consts.ENTITY_SET);
    return axios.get(url).then(response => response.data);
  }

  static getDownloadRequestBody(data, method, datatype, url) {
    const type = (datatype === Consts.JSON) ? 'application/json' : 'text/csv';
    const req = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (method === Consts.PUT) {
      req.data = data;
    }
    if (datatype === Consts.CSV) {
      req.headers.Accept = type;
    }
    return req;
  }

  static saveFile(entityData, datatype, success) {
    const type = (datatype === Consts.JSON) ? 'application/json' : 'text/csv';
    const dataString = JSON.stringify(entityData);
    const blob = new Blob([dataString], { type });
    FileSaver.saveAs(blob, name.concat(
      (datatype === Consts.JSON) ? '.json' : '.csv'
    ));
    success(datatype);
  }

  static downloadSchema(name, datatype, entityTypeFqns, err, success) {
    const url = EnvironmentService.getDatastoreUrl().concat(Consts.SCHEMA_DATA_URL);
    return axios(this.getDownloadRequestBody(entityTypeFqns, Consts.PUT, datatype, url)
      ).then((resp) => {
        this.saveFile(resp.data, datatype, success);
      }).catch(() => {
        err(datatype);
      });
  }

  static downloadEntityType(namespace, name, datatype, err, success) {
    const data = JSON.stringify({
      namespace,
      name
    });
    const url = EnvironmentService.getDatastoreUrl().concat(Consts.ENTITY_TYPE_DATA_URL);
    return axios(this.getDownloadRequestBody(data, Consts.PUT, datatype, url)
      ).then((resp) => {
        this.saveFile(resp.data, datatype, success);
      }).catch(() => {
        err(datatype);
      });
  }

  static downloadEntitySet(name, typename, datatype, err, success) {
    const url = EnvironmentService.getDatastoreUrl().concat(Consts.ENTITY_SET_DATA_BASE_URL)
      .concat('/')
      .concat(name)
      .concat('/')
      .concat(typename)
      .concat(Consts.ENTITYDATA);
    return axios(this.getDownloadRequestBody(null, Consts.GET, datatype, url)
      ).then((resp) => {
        this.saveFile(resp.data, datatype, success);
      }).catch(() => {
        err(datatype);
      });
  }
}
