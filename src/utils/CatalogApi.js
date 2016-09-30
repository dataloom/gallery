import FileSaver from 'file-saver';
import axios from 'axios';
import Consts from './AppConsts';

export default class CatalogApi {

  static getCatalogSchemaData() {
    return axios.get(Consts.SCHEMA_BASE_PATH).then(response => response.data);
  }

  static getCatalogEntityTypeData() {
    return axios.get(Consts.ENTITY_TYPES_BASE_PATH).then(response => response.data);
  }

  static getCatalogEntitySetData() {
    return axios.get(Consts.ENTITY_SETS_BASE_PATH).then(response => response.data);
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
    return axios(this.getDownloadRequestBody(entityTypeFqns, Consts.PUT, datatype, Consts.SCHEMA_DATA_URL)
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
    return axios(this.getDownloadRequestBody(data, Consts.PUT, datatype, Consts.ENTITY_TYPE_DATA_URL)
      ).then((resp) => {
        this.saveFile(resp.data, datatype, success);
      }).catch(() => {
        err(datatype);
      });
  }

  static downloadEntitySet(name, typename, datatype, err, success) {
    const url = Consts.ENTITY_SET_DATA_BASE_URL
      .concat('/')
      .concat(name).concat('/')
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
