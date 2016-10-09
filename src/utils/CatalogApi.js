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

  static saveFile(entityData, name, datatype, success) {

    let contentType = 'application/json';
    let data = entityData;

    if (datatype === Consts.JSON) {
      contentType = 'text/csv';
      data = JSON.stringify(entityData);
    }

    const blob = new Blob([data], { contentType });
    FileSaver.saveAs(blob, name.concat(
      (datatype === Consts.JSON) ? '.json' : '.csv'
    ));
    success(datatype);
  }

  static downloadSchema(data, name, datatype, success) {
    this.saveFile(data, name, datatype, success);
  }

  static downloadEntityType(namespace, name, datatype, err, success) {
    const data = JSON.stringify({
      namespace,
      name
    });
    const url = EnvironmentService.getDatastoreUrl().concat(Consts.ENTITY_TYPE_DATA_URL);
    return axios(this.getDownloadRequestBody(data, Consts.PUT, datatype, url)
      ).then((resp) => {
        this.saveFile(resp.data, name, datatype, success);
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
        this.saveFile(resp.data, name, datatype, success);
      }).catch(() => {
        err(datatype);
      });
  }
}
